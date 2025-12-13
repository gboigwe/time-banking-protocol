;; Rewards Distributor Contract (Clarity 4)
;; Manages reward distribution for active participants
;; Uses stacks-block-time for reward periods and claims

;; Error Codes
(define-constant ERR_UNAUTHORIZED (err u7001))
(define-constant ERR_NOT_FOUND (err u7002))
(define-constant ERR_INVALID_PARAMS (err u7003))
(define-constant ERR_ALREADY_CLAIMED (err u7004))
(define-constant ERR_REWARD_PERIOD_ACTIVE (err u7005))
(define-constant ERR_INSUFFICIENT_POOL (err u7006))
(define-constant ERR_NOT_ELIGIBLE (err u7007))

;; Configuration
(define-constant CONTRACT_OWNER tx-sender)
(define-constant REWARD_PERIOD u2592000) ;; 30 days
(define-constant MIN_ACTIVITY_SCORE u10)
(define-constant BASE_REWARD_AMOUNT u50)
(define-constant BONUS_MULTIPLIER u2)

;; Reward Tiers
(define-constant TIER_BRONZE u100)
(define-constant TIER_SILVER u250)
(define-constant TIER_GOLD u500)
(define-constant TIER_PLATINUM u1000)

;; Data Maps
(define-map reward-periods
    uint
    {
        period-id: uint,
        start-time: uint,
        end-time: uint,
        total-pool: uint,
        distributed-amount: uint,
        total-participants: uint,
        is-finalized: bool
    })

(define-map user-rewards
    {user: principal, period-id: uint}
    {
        activity-score: uint,
        reward-tier: uint,
        calculated-reward: uint,
        claimed: bool,
        claimed-at: (optional uint)
    })

(define-map user-lifetime-rewards
    principal
    {
        total-claimed: uint,
        total-periods: uint,
        highest-tier: uint,
        last-claim: uint
    })

(define-map reward-pool-contributions
    {contributor: principal, period-id: uint}
    uint)

;; Data vars
(define-data-var current-period-id uint u1)
(define-data-var total-reward-pool uint u0)
(define-data-var total-distributed uint u0)
(define-data-var rewards-enabled bool true)

;; Events using Clarity 4 stacks-block-time
(define-private (emit-period-started (period-id uint))
    (print {
        event: "reward-period-started",
        period-id: period-id,
        timestamp: stacks-block-time
    }))

(define-private (emit-reward-claimed (user principal) (period-id uint) (amount uint))
    (print {
        event: "reward-claimed",
        user: user,
        period-id: period-id,
        amount: amount,
        timestamp: stacks-block-time
    }))

(define-private (emit-pool-contribution (contributor principal) (amount uint))
    (print {
        event: "pool-contribution",
        contributor: contributor,
        amount: amount,
        timestamp: stacks-block-time
    }))

;; Helper Functions
(define-private (calculate-tier-from-score (score uint))
    (if (>= score TIER_PLATINUM)
        TIER_PLATINUM
        (if (>= score TIER_GOLD)
            TIER_GOLD
            (if (>= score TIER_SILVER)
                TIER_SILVER
                TIER_BRONZE))))

(define-private (calculate-reward (activity-score uint) (tier uint))
    (let ((base-amount BASE_REWARD_AMOUNT)
          (tier-multiplier (if (is-eq tier TIER_PLATINUM)
              u4
              (if (is-eq tier TIER_GOLD)
                  u3
                  (if (is-eq tier TIER_SILVER)
                      u2
                      u1)))))
        (* (* base-amount tier-multiplier) (/ activity-score u10))))

;; Public Functions
(define-public (start-new-period)
    (let (
        (period-id (var-get current-period-id))
        (start-time stacks-block-time)
        (end-time (+ stacks-block-time REWARD_PERIOD))
    )
        (asserts! (is-eq tx-sender CONTRACT_OWNER) ERR_UNAUTHORIZED)
        (asserts! (var-get rewards-enabled) ERR_UNAUTHORIZED)

        (map-set reward-periods period-id {
            period-id: period-id,
            start-time: start-time,
            end-time: end-time,
            total-pool: (var-get total-reward-pool),
            distributed-amount: u0,
            total-participants: u0,
            is-finalized: false
        })

        (var-set current-period-id (+ period-id u1))
        (emit-period-started period-id)
        (ok period-id)))

(define-public (register-activity (user principal) (activity-score uint) (period-id uint))
    (let (
        (period (unwrap! (map-get? reward-periods period-id) ERR_NOT_FOUND))
        (tier (calculate-tier-from-score activity-score))
        (reward-amount (calculate-reward activity-score tier))
    )
        (asserts! (var-get rewards-enabled) ERR_UNAUTHORIZED)
        (asserts! (not (get is-finalized period)) ERR_REWARD_PERIOD_ACTIVE)
        (asserts! (>= activity-score MIN_ACTIVITY_SCORE) ERR_NOT_ELIGIBLE)
        (asserts! (< stacks-block-time (get end-time period)) ERR_REWARD_PERIOD_ACTIVE)

        (map-set user-rewards {user: user, period-id: period-id} {
            activity-score: activity-score,
            reward-tier: tier,
            calculated-reward: reward-amount,
            claimed: false,
            claimed-at: none
        })

        (map-set reward-periods period-id (merge period {
            total-participants: (+ (get total-participants period) u1)
        }))

        (print {
            event: "activity-registered",
            user: user,
            period-id: period-id,
            score: activity-score,
            tier: tier,
            timestamp: stacks-block-time
        })
        (ok reward-amount)))

(define-public (claim-reward (period-id uint))
    (let (
        (period (unwrap! (map-get? reward-periods period-id) ERR_NOT_FOUND))
        (user-reward (unwrap! (map-get? user-rewards {user: tx-sender, period-id: period-id}) ERR_NOT_FOUND))
        (lifetime-rewards (default-to
            {total-claimed: u0, total-periods: u0, highest-tier: u0, last-claim: u0}
            (map-get? user-lifetime-rewards tx-sender)))
    )
        (asserts! (get is-finalized period) ERR_REWARD_PERIOD_ACTIVE)
        (asserts! (not (get claimed user-reward)) ERR_ALREADY_CLAIMED)
        (asserts! (<= (get calculated-reward user-reward) (var-get total-reward-pool)) ERR_INSUFFICIENT_POOL)

        (map-set user-rewards {user: tx-sender, period-id: period-id}
            (merge user-reward {
                claimed: true,
                claimed-at: (some stacks-block-time)
            }))

        (map-set user-lifetime-rewards tx-sender {
            total-claimed: (+ (get total-claimed lifetime-rewards) (get calculated-reward user-reward)),
            total-periods: (+ (get total-periods lifetime-rewards) u1),
            highest-tier: (if (> (get reward-tier user-reward) (get highest-tier lifetime-rewards))
                (get reward-tier user-reward)
                (get highest-tier lifetime-rewards)),
            last-claim: stacks-block-time
        })

        (map-set reward-periods period-id (merge period {
            distributed-amount: (+ (get distributed-amount period) (get calculated-reward user-reward))
        }))

        (var-set total-reward-pool (- (var-get total-reward-pool) (get calculated-reward user-reward)))
        (var-set total-distributed (+ (var-get total-distributed) (get calculated-reward user-reward)))

        (emit-reward-claimed tx-sender period-id (get calculated-reward user-reward))
        (ok (get calculated-reward user-reward))))

(define-public (finalize-period (period-id uint))
    (let ((period (unwrap! (map-get? reward-periods period-id) ERR_NOT_FOUND)))
        (asserts! (is-eq tx-sender CONTRACT_OWNER) ERR_UNAUTHORIZED)
        (asserts! (not (get is-finalized period)) ERR_REWARD_PERIOD_ACTIVE)
        (asserts! (>= stacks-block-time (get end-time period)) ERR_REWARD_PERIOD_ACTIVE)

        (map-set reward-periods period-id (merge period {is-finalized: true}))

        (print {
            event: "period-finalized",
            period-id: period-id,
            total-participants: (get total-participants period),
            total-pool: (get total-pool period),
            timestamp: stacks-block-time
        })
        (ok true)))

(define-public (contribute-to-pool (amount uint))
    (let ((period-id (- (var-get current-period-id) u1)))
        (asserts! (var-get rewards-enabled) ERR_UNAUTHORIZED)
        (asserts! (> amount u0) ERR_INVALID_PARAMS)

        (map-set reward-pool-contributions {contributor: tx-sender, period-id: period-id}
            (+ (default-to u0 (map-get? reward-pool-contributions {contributor: tx-sender, period-id: period-id})) amount))

        (var-set total-reward-pool (+ (var-get total-reward-pool) amount))

        (emit-pool-contribution tx-sender amount)
        (ok true)))

(define-public (toggle-rewards-system)
    (begin
        (asserts! (is-eq tx-sender CONTRACT_OWNER) ERR_UNAUTHORIZED)
        (var-set rewards-enabled (not (var-get rewards-enabled)))
        (print {event: "rewards-system-toggled", enabled: (var-get rewards-enabled)})
        (ok true)))

;; Read-Only Functions
(define-read-only (get-period-info (period-id uint))
    (map-get? reward-periods period-id))

(define-read-only (get-user-reward (user principal) (period-id uint))
    (map-get? user-rewards {user: user, period-id: period-id}))

(define-read-only (get-lifetime-rewards (user principal))
    (map-get? user-lifetime-rewards user))

(define-read-only (get-pool-contribution (contributor principal) (period-id uint))
    (ok (default-to u0 (map-get? reward-pool-contributions {contributor: contributor, period-id: period-id}))))

(define-read-only (is-eligible-for-rewards (user principal) (period-id uint))
    (match (map-get? user-rewards {user: user, period-id: period-id})
        reward (ok (and
            (not (get claimed reward))
            (>= (get activity-score reward) MIN_ACTIVITY_SCORE)))
        (ok false)))

(define-read-only (get-rewards-stats)
    (ok {
        current-period-id: (var-get current-period-id),
        total-reward-pool: (var-get total-reward-pool),
        total-distributed: (var-get total-distributed),
        rewards-enabled: (var-get rewards-enabled),
        reward-period: REWARD_PERIOD,
        min-activity-score: MIN_ACTIVITY_SCORE,
        base-reward-amount: BASE_REWARD_AMOUNT
    }))
