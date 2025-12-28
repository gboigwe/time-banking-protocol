;; Skill Matching Engine (Clarity 4)
;; Demand/supply tracking and matching
;; Uses stacks-block-time for match proposals

;; constants
(define-constant CONTRACT_OWNER tx-sender)
(define-constant ERR_UNAUTHORIZED (err u7001))
(define-constant ERR_NOT_FOUND (err u7002))

;; data vars
(define-data-var match-counter uint u0)

;; data maps
(define-map skill-demand
    { requester: principal, skill-id: uint }
    {
        hours-needed: uint,
        max-rate: uint,
        created-at: uint,
        is-active: bool
    })

(define-map skill-supply
    { provider: principal, skill-id: uint }
    {
        hours-available: uint,
        min-rate: uint,
        created-at: uint,
        is-active: bool
    })

(define-map match-proposals
    uint
    {
        requester: principal,
        provider: principal,
        skill-id: uint,
        hours: uint,
        rate: uint,
        created-at: uint,
        accepted: bool
    })

;; public functions
(define-public (create-demand
    (skill-id uint)
    (hours-needed uint)
    (max-rate uint))
    (begin
        (map-set skill-demand { requester: tx-sender, skill-id: skill-id } {
            hours-needed: hours-needed,
            max-rate: max-rate,
            created-at: stacks-block-time,
            is-active: true
        })
        (ok true)))

(define-public (create-supply
    (skill-id uint)
    (hours-available uint)
    (min-rate uint))
    (begin
        (map-set skill-supply { provider: tx-sender, skill-id: skill-id } {
            hours-available: hours-available,
            min-rate: min-rate,
            created-at: stacks-block-time,
            is-active: true
        })
        (ok true)))

(define-public (propose-match
    (requester principal)
    (provider principal)
    (skill-id uint)
    (hours uint)
    (rate uint))
    (let ((match-id (+ (var-get match-counter) u1)))
        (map-set match-proposals match-id {
            requester: requester,
            provider: provider,
            skill-id: skill-id,
            hours: hours,
            rate: rate,
            created-at: stacks-block-time,
            accepted: false
        })
        (var-set match-counter match-id)
        (ok match-id)))

(define-public (accept-match (match-id uint))
    (let ((proposal (unwrap! (map-get? match-proposals match-id) ERR_NOT_FOUND)))
        (asserts! (is-eq tx-sender (get requester proposal)) ERR_UNAUTHORIZED)
        (map-set match-proposals match-id (merge proposal { accepted: true }))
        (ok true)))

;; read only functions
(define-read-only (get-demand (requester principal) (skill-id uint))
    (ok (map-get? skill-demand { requester: requester, skill-id: skill-id })))

(define-read-only (get-supply (provider principal) (skill-id uint))
    (ok (map-get? skill-supply { provider: provider, skill-id: skill-id })))

(define-read-only (get-match-proposal (match-id uint))
    (ok (map-get? match-proposals match-id)))
