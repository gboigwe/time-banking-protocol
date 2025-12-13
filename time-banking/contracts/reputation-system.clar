;; Reputation System Contract (Clarity 4)
;; Advanced reputation calculation and badge management
;; Uses stacks-block-time for time-weighted reputation scoring

;; Error Codes
(define-constant ERR_UNAUTHORIZED (err u4001))
(define-constant ERR_NOT_FOUND (err u4002))
(define-constant ERR_INVALID_PARAMS (err u4003))
(define-constant ERR_INSUFFICIENT_REPUTATION (err u4004))
(define-constant ERR_ALREADY_ENDORSED (err u4005))
(define-constant ERR_SELF_ENDORSE (err u4006))
(define-constant ERR_BADGE_EXISTS (err u4007))

;; Configuration
(define-constant CONTRACT_OWNER tx-sender)
(define-constant BASE_REPUTATION_SCORE u100)
(define-constant COMPLETION_BONUS u10)
(define-constant RATING_MULTIPLIER u5)
(define-constant ENDORSEMENT_VALUE u3)
(define-constant MAX_ENDORSEMENTS_PER_USER u50)
(define-constant DECAY_PERIOD u2592000) ;; 30 days in seconds

;; Badge Tiers
(define-constant BADGE_BRONZE "bronze")
(define-constant BADGE_SILVER "silver")
(define-constant BADGE_GOLD "gold")
(define-constant BADGE_PLATINUM "platinum")

;; Reputation Tiers
(define-constant TIER_NEWCOMER u0)
(define-constant TIER_CONTRIBUTOR u250)
(define-constant TIER_TRUSTED u500)
(define-constant TIER_EXPERT u1000)
(define-constant TIER_MASTER u2500)

;; Data Maps
(define-map reputation-scores
    principal
    {
        base-score: uint,
        completion-bonus: uint,
        rating-score: uint,
        endorsement-score: uint,
        total-score: uint,
        last-updated: uint,
        tier: uint
    })

(define-map user-endorsements
    {endorser: principal, endorsed: principal}
    {
        category: (string-ascii 20),
        comment: (string-ascii 100),
        endorsed-at: uint,
        value: uint
    })

(define-map endorsement-count principal uint)

(define-map skill-badges
    {user: principal, skill-category: (string-ascii 20)}
    {
        badge-tier: (string-ascii 20),
        earned-at: uint,
        services-completed: uint,
        average-rating: uint
    })

(define-map reputation-history
    {user: principal, timestamp: uint}
    {
        score: uint,
        action: (string-ascii 50),
        change: int
    })

;; Data vars
(define-data-var total-endorsements uint u0)
(define-data-var total-badges-awarded uint u0)
(define-data-var reputation-enabled bool true)

;; Traits
(define-trait time-bank-core-trait
    ((update-reputation (principal int) (response bool uint))))

;; Events using Clarity 4 stacks-block-time
(define-private (emit-reputation-updated (user principal) (new-score uint) (change int))
    (print {
        event: "reputation-updated",
        user: user,
        new-score: new-score,
        change: change,
        timestamp: stacks-block-time
    }))

(define-private (emit-endorsement-given (endorser principal) (endorsed principal) (category (string-ascii 20)))
    (print {
        event: "endorsement-given",
        endorser: endorser,
        endorsed: endorsed,
        category: category,
        timestamp: stacks-block-time
    }))

(define-private (emit-badge-awarded (user principal) (category (string-ascii 20)) (tier (string-ascii 20)))
    (print {
        event: "badge-awarded",
        user: user,
        category: category,
        tier: tier,
        timestamp: stacks-block-time
    }))

;; Helper Functions
(define-private (calculate-total-score (base uint) (completion uint) (rating uint) (endorsement uint))
    (+ base (+ completion (+ rating endorsement))))

(define-private (get-tier-from-score (score uint))
    (if (>= score TIER_MASTER)
        TIER_MASTER
        (if (>= score TIER_EXPERT)
            TIER_EXPERT
            (if (>= score TIER_TRUSTED)
                TIER_TRUSTED
                (if (>= score TIER_CONTRIBUTOR)
                    TIER_CONTRIBUTOR
                    TIER_NEWCOMER)))))

(define-private (apply-time-decay (score uint) (last-update uint))
    (let (
        (time-elapsed (- stacks-block-time last-update))
        (decay-periods (/ time-elapsed DECAY_PERIOD))
        (decay-amount (* decay-periods u5))
    )
        (if (> decay-amount score)
            u0
            (- score decay-amount))))

;; Public Functions
(define-public (initialize-reputation (user principal))
    (begin
        (asserts! (var-get reputation-enabled) ERR_UNAUTHORIZED)
        (asserts! (is-none (map-get? reputation-scores user)) ERR_BADGE_EXISTS)

        (map-set reputation-scores user {
            base-score: BASE_REPUTATION_SCORE,
            completion-bonus: u0,
            rating-score: u0,
            endorsement-score: u0,
            total-score: BASE_REPUTATION_SCORE,
            last-updated: stacks-block-time,
            tier: TIER_NEWCOMER
        })

        (emit-reputation-updated user BASE_REPUTATION_SCORE 0)
        (ok true)))

(define-public (record-exchange-completion
    (user principal)
    (rating uint)
    (core-contract <time-bank-core-trait>))
    (let (
        (rep-data (unwrap! (map-get? reputation-scores user) ERR_NOT_FOUND))
        (rating-bonus (* rating RATING_MULTIPLIER))
        (new-completion-bonus (+ (get completion-bonus rep-data) COMPLETION_BONUS))
        (new-rating-score (+ (get rating-score rep-data) rating-bonus))
        (new-total (calculate-total-score
            (get base-score rep-data)
            new-completion-bonus
            new-rating-score
            (get endorsement-score rep-data)))
        (new-tier (get-tier-from-score new-total))
        (score-change (to-int (- new-total (get total-score rep-data))))
    )
        (asserts! (var-get reputation-enabled) ERR_UNAUTHORIZED)
        (asserts! (<= rating u5) ERR_INVALID_PARAMS)

        (map-set reputation-scores user {
            base-score: (get base-score rep-data),
            completion-bonus: new-completion-bonus,
            rating-score: new-rating-score,
            endorsement-score: (get endorsement-score rep-data),
            total-score: new-total,
            last-updated: stacks-block-time,
            tier: new-tier
        })

        (try! (contract-call? core-contract update-reputation user score-change))

        (map-set reputation-history {user: user, timestamp: stacks-block-time} {
            score: new-total,
            action: "exchange-completion",
            change: score-change
        })

        (emit-reputation-updated user new-total score-change)
        (ok new-total)))

(define-public (endorse-user
    (endorsed principal)
    (category (string-ascii 20))
    (comment (string-ascii 100)))
    (let (
        (rep-data (unwrap! (map-get? reputation-scores endorsed) ERR_NOT_FOUND))
        (endorser-count (default-to u0 (map-get? endorsement-count endorsed)))
    )
        (asserts! (var-get reputation-enabled) ERR_UNAUTHORIZED)
        (asserts! (not (is-eq tx-sender endorsed)) ERR_SELF_ENDORSE)
        (asserts! (is-none (map-get? user-endorsements {endorser: tx-sender, endorsed: endorsed})) ERR_ALREADY_ENDORSED)
        (asserts! (< endorser-count MAX_ENDORSEMENTS_PER_USER) ERR_INVALID_PARAMS)

        (map-set user-endorsements {endorser: tx-sender, endorsed: endorsed} {
            category: category,
            comment: comment,
            endorsed-at: stacks-block-time,
            value: ENDORSEMENT_VALUE
        })

        (map-set endorsement-count endorsed (+ endorser-count u1))

        (let (
            (new-endorsement-score (+ (get endorsement-score rep-data) ENDORSEMENT_VALUE))
            (new-total (calculate-total-score
                (get base-score rep-data)
                (get completion-bonus rep-data)
                (get rating-score rep-data)
                new-endorsement-score))
            (new-tier (get-tier-from-score new-total))
        )
            (map-set reputation-scores endorsed (merge rep-data {
                endorsement-score: new-endorsement-score,
                total-score: new-total,
                tier: new-tier,
                last-updated: stacks-block-time
            }))

            (var-set total-endorsements (+ (var-get total-endorsements) u1))
            (emit-endorsement-given tx-sender endorsed category)
            (ok true))))

(define-public (award-skill-badge
    (user principal)
    (skill-category (string-ascii 20))
    (services-completed uint)
    (average-rating uint))
    (let (
        (badge-tier (if (>= services-completed u50)
            BADGE_PLATINUM
            (if (>= services-completed u25)
                BADGE_GOLD
                (if (>= services-completed u10)
                    BADGE_SILVER
                    BADGE_BRONZE))))
    )
        (asserts! (var-get reputation-enabled) ERR_UNAUTHORIZED)
        (asserts! (> services-completed u0) ERR_INVALID_PARAMS)
        (asserts! (<= average-rating u5) ERR_INVALID_PARAMS)

        (map-set skill-badges {user: user, skill-category: skill-category} {
            badge-tier: badge-tier,
            earned-at: stacks-block-time,
            services-completed: services-completed,
            average-rating: average-rating
        })

        (var-set total-badges-awarded (+ (var-get total-badges-awarded) u1))
        (emit-badge-awarded user skill-category badge-tier)
        (ok badge-tier)))

(define-public (apply-reputation-decay (user principal))
    (let (
        (rep-data (unwrap! (map-get? reputation-scores user) ERR_NOT_FOUND))
        (decayed-score (apply-time-decay (get total-score rep-data) (get last-updated rep-data)))
        (new-tier (get-tier-from-score decayed-score))
    )
        (asserts! (> (- stacks-block-time (get last-updated rep-data)) DECAY_PERIOD) ERR_INVALID_PARAMS)

        (map-set reputation-scores user (merge rep-data {
            total-score: decayed-score,
            tier: new-tier,
            last-updated: stacks-block-time
        }))

        (print {event: "reputation-decay-applied", user: user, new-score: decayed-score, timestamp: stacks-block-time})
        (ok decayed-score)))

(define-public (toggle-reputation-system)
    (begin
        (asserts! (is-eq tx-sender CONTRACT_OWNER) ERR_UNAUTHORIZED)
        (var-set reputation-enabled (not (var-get reputation-enabled)))
        (print {event: "reputation-system-toggled", enabled: (var-get reputation-enabled)})
        (ok true)))

;; Read-Only Functions
(define-read-only (get-reputation-score (user principal))
    (map-get? reputation-scores user))

(define-read-only (get-endorsement (endorser principal) (endorsed principal))
    (map-get? user-endorsements {endorser: endorser, endorsed: endorsed}))

(define-read-only (get-endorsement-count (user principal))
    (ok (default-to u0 (map-get? endorsement-count user))))

(define-read-only (get-skill-badge (user principal) (category (string-ascii 20)))
    (map-get? skill-badges {user: user, skill-category: category}))

(define-read-only (get-reputation-tier (user principal))
    (match (map-get? reputation-scores user)
        rep-data (ok (get tier rep-data))
        ERR_NOT_FOUND))

(define-read-only (get-total-reputation (user principal))
    (match (map-get? reputation-scores user)
        rep-data (ok (get total-score rep-data))
        (ok u0)))

(define-read-only (get-reputation-stats)
    (ok {
        total-endorsements: (var-get total-endorsements),
        total-badges-awarded: (var-get total-badges-awarded),
        reputation-enabled: (var-get reputation-enabled),
        base-reputation-score: BASE_REPUTATION_SCORE,
        completion-bonus: COMPLETION_BONUS,
        endorsement-value: ENDORSEMENT_VALUE
    }))
