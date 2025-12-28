;; Dispute Arbitration Contract (Clarity 4)
;; Decentralized dispute resolution for failed exchanges
;; Uses stacks-block-time for voting deadlines and evidence submission

;; constants
(define-constant CONTRACT_OWNER tx-sender)
(define-constant ERR_UNAUTHORIZED (err u4001))
(define-constant ERR_NOT_FOUND (err u4002))
(define-constant ERR_INVALID_STATUS (err u4003))
(define-constant ERR_ALREADY_VOTED (err u4004))
(define-constant ERR_DEADLINE_PASSED (err u4005))
(define-constant ERR_DEADLINE_NOT_PASSED (err u4006))

(define-constant STATUS_PENDING u1)
(define-constant STATUS_VOTING u2)
(define-constant STATUS_RESOLVED u3)
(define-constant STATUS_EXECUTED u4)

(define-constant OUTCOME_FAVOR_PROVIDER u1)
(define-constant OUTCOME_FAVOR_RECEIVER u2)
(define-constant OUTCOME_SPLIT u3)

(define-constant EVIDENCE_PERIOD u604800)
(define-constant VOTING_PERIOD u259200)
(define-constant MIN_ARBITRATORS u3)

;; data vars
(define-data-var dispute-counter uint u0)
(define-data-var arbitrator-counter uint u0)

;; data maps
(define-map arbitrators
    principal
    {
        reputation-score: uint,
        total-cases: uint,
        is-active: bool,
        joined-at: uint
    })

(define-map disputes
    uint
    {
        exchange-id: uint,
        provider: principal,
        receiver: principal,
        status: uint,
        outcome: (optional uint),
        created-at: uint,
        evidence-deadline: uint,
        voting-deadline: uint,
        votes-provider: uint,
        votes-receiver: uint,
        votes-split: uint
    })

(define-map votes
    { dispute-id: uint, arbitrator: principal }
    {
        vote: uint,
        voted-at: uint
    })

(define-map dispute-arbitrators
    { dispute-id: uint, arbitrator: principal }
    bool)

;; public functions
(define-public (register-arbitrator)
    (begin
        (asserts! (is-none (map-get? arbitrators tx-sender)) ERR_INVALID_STATUS)
        (map-set arbitrators tx-sender {
            reputation-score: u0,
            total-cases: u0,
            is-active: true,
            joined-at: stacks-block-time
        })
        (var-set arbitrator-counter (+ (var-get arbitrator-counter) u1))
        (ok true)))

(define-public (create-dispute
    (exchange-id uint)
    (provider principal)
    (receiver principal))
    (let ((dispute-id (+ (var-get dispute-counter) u1)))
        (asserts! (or (is-eq tx-sender provider) (is-eq tx-sender receiver)) ERR_UNAUTHORIZED)
        (map-set disputes dispute-id {
            exchange-id: exchange-id,
            provider: provider,
            receiver: receiver,
            status: STATUS_PENDING,
            outcome: none,
            created-at: stacks-block-time,
            evidence-deadline: (+ stacks-block-time EVIDENCE_PERIOD),
            voting-deadline: (+ stacks-block-time (+ EVIDENCE_PERIOD VOTING_PERIOD)),
            votes-provider: u0,
            votes-receiver: u0,
            votes-split: u0
        })
        (var-set dispute-counter dispute-id)
        (ok dispute-id)))

(define-public (assign-to-dispute (dispute-id uint))
    (let ((arb-data (unwrap! (map-get? arbitrators tx-sender) ERR_UNAUTHORIZED)))
        (asserts! (get is-active arb-data) ERR_UNAUTHORIZED)
        (asserts! (is-none (map-get? dispute-arbitrators { dispute-id: dispute-id, arbitrator: tx-sender })) ERR_ALREADY_VOTED)
        (map-set dispute-arbitrators { dispute-id: dispute-id, arbitrator: tx-sender } true)
        (ok true)))

(define-public (cast-vote (dispute-id uint) (vote uint))
    (let ((dispute (unwrap! (map-get? disputes dispute-id) ERR_NOT_FOUND)))
        (asserts! (default-to false (map-get? dispute-arbitrators { dispute-id: dispute-id, arbitrator: tx-sender })) ERR_UNAUTHORIZED)
        (asserts! (is-none (map-get? votes { dispute-id: dispute-id, arbitrator: tx-sender })) ERR_ALREADY_VOTED)
        (asserts! (and (>= stacks-block-time (get evidence-deadline dispute)) (< stacks-block-time (get voting-deadline dispute))) ERR_DEADLINE_PASSED)
        (map-set votes { dispute-id: dispute-id, arbitrator: tx-sender } {
            vote: vote,
            voted-at: stacks-block-time
        })
        (map-set disputes dispute-id (merge dispute {
            status: STATUS_VOTING,
            votes-provider: (if (is-eq vote OUTCOME_FAVOR_PROVIDER) (+ (get votes-provider dispute) u1) (get votes-provider dispute)),
            votes-receiver: (if (is-eq vote OUTCOME_FAVOR_RECEIVER) (+ (get votes-receiver dispute) u1) (get votes-receiver dispute)),
            votes-split: (if (is-eq vote OUTCOME_SPLIT) (+ (get votes-split dispute) u1) (get votes-split dispute))
        }))
        (ok true)))

(define-public (resolve-dispute (dispute-id uint))
    (let ((dispute (unwrap! (map-get? disputes dispute-id) ERR_NOT_FOUND)))
        (asserts! (>= stacks-block-time (get voting-deadline dispute)) ERR_DEADLINE_NOT_PASSED)
        (asserts! (is-eq (get status dispute) STATUS_VOTING) ERR_INVALID_STATUS)
        (let ((outcome (determine-outcome
                (get votes-provider dispute)
                (get votes-receiver dispute)
                (get votes-split dispute))))
            (map-set disputes dispute-id (merge dispute {
                status: STATUS_RESOLVED,
                outcome: (some outcome)
            }))
            (ok outcome))))

;; read only functions
(define-read-only (get-dispute (dispute-id uint))
    (ok (map-get? disputes dispute-id)))

(define-read-only (get-arbitrator-info (arbitrator principal))
    (ok (map-get? arbitrators arbitrator)))

(define-read-only (get-vote (dispute-id uint) (arbitrator principal))
    (ok (map-get? votes { dispute-id: dispute-id, arbitrator: arbitrator })))

;; private functions
(define-private (determine-outcome (votes-provider uint) (votes-receiver uint) (votes-split uint))
    (if (and (> votes-provider votes-receiver) (> votes-provider votes-split))
        OUTCOME_FAVOR_PROVIDER
        (if (and (> votes-receiver votes-provider) (> votes-receiver votes-split))
            OUTCOME_FAVOR_RECEIVER
            OUTCOME_SPLIT)))
