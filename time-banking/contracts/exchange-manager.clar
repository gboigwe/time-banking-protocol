;; Exchange Manager Contract (Clarity 4)
;; Manages time-skill exchange requests, agreements, and completions
;; Uses stacks-block-time for scheduling and deadlines

;; Error Codes
(define-constant ERR_UNAUTHORIZED (err u3001))
(define-constant ERR_NOT_FOUND (err u3002))
(define-constant ERR_ALREADY_EXISTS (err u3003))
(define-constant ERR_INVALID_PARAMS (err u3004))
(define-constant ERR_EXCHANGE_EXPIRED (err u3005))
(define-constant ERR_EXCHANGE_ACTIVE (err u3006))
(define-constant ERR_INSUFFICIENT_CREDITS (err u3007))
(define-constant ERR_SKILL_NOT_VERIFIED (err u3008))
(define-constant ERR_NOT_PARTICIPANT (err u3009))

;; Configuration
(define-constant CONTRACT_OWNER tx-sender)
(define-constant MIN_EXCHANGE_DURATION u3600) ;; 1 hour in seconds
(define-constant MAX_EXCHANGE_DURATION u864000) ;; 10 days in seconds

;; Exchange Status
(define-constant STATUS_PENDING "pending")
(define-constant STATUS_ACCEPTED "accepted")
(define-constant STATUS_IN_PROGRESS "in-progress")
(define-constant STATUS_COMPLETED "completed")
(define-constant STATUS_CANCELLED "cancelled")

;; Data Maps
(define-map exchanges
    uint
    {
        requester: principal,
        provider: principal,
        skill-id: uint,
        hours-requested: uint,
        hourly-rate: uint,
        total-credits: uint,
        description: (string-ascii 200),
        created-at: uint,
        scheduled-start: uint,
        scheduled-end: uint,
        actual-start: (optional uint),
        actual-end: (optional uint),
        status: (string-ascii 20),
        requester-confirmed: bool,
        provider-confirmed: bool
    })

(define-map user-exchanges principal (list 100 uint))

(define-map exchange-reviews
    uint
    {
        requester-rating: (optional uint),
        provider-rating: (optional uint),
        requester-comment: (optional (string-ascii 200)),
        provider-comment: (optional (string-ascii 200)),
        reviewed-at: (optional uint)
    })

;; Data vars
(define-data-var next-exchange-id uint u1)
(define-data-var total-exchanges uint u0)
(define-data-var total-completed-exchanges uint u0)
(define-data-var total-credits-exchanged uint u0)
(define-data-var exchanges-enabled bool true)

;; Traits for contract integration
(define-trait time-bank-core-trait
    ((get-balance (principal) (response uint uint))
     (transfer-credits (principal uint) (response bool uint))
     (update-user-stats (principal principal uint) (response bool uint))))

(define-trait skill-registry-trait
    ((is-skill-verified (principal uint) (response bool uint))
     (get-skill-hourly-rate (principal uint) (response uint uint))
     (increment-service-count (principal uint) (response bool uint))))

;; Events using Clarity 4 stacks-block-time
(define-private (emit-exchange-created (exchange-id uint) (requester principal) (provider principal))
    (print {
        event: "exchange-created",
        exchange-id: exchange-id,
        requester: requester,
        provider: provider,
        timestamp: stacks-block-time
    }))

(define-private (emit-exchange-completed (exchange-id uint) (credits uint))
    (print {
        event: "exchange-completed",
        exchange-id: exchange-id,
        credits: credits,
        timestamp: stacks-block-time
    }))

;; Helper Functions
(define-private (is-valid-time-range (start uint) (end uint))
    (let ((duration (- end start)))
        (and (>= start stacks-block-time) (> end start)
            (>= duration MIN_EXCHANGE_DURATION)
            (<= duration MAX_EXCHANGE_DURATION))))

(define-private (add-exchange-to-user (user principal) (exchange-id uint))
    (let ((current-list (default-to (list) (map-get? user-exchanges user))))
        (map-set user-exchanges user (unwrap-panic (as-max-len? (append current-list exchange-id) u100)))
        true))

;; Public Functions
(define-public (create-exchange-request
    (provider principal)
    (skill-id uint)
    (hours-requested uint)
    (description (string-ascii 200))
    (scheduled-start uint)
    (scheduled-end uint)
    (core-contract <time-bank-core-trait>)
    (skill-contract <skill-registry-trait>))
    (let (
        (exchange-id (var-get next-exchange-id))
        (is-verified (unwrap! (contract-call? skill-contract is-skill-verified provider skill-id) ERR_NOT_FOUND))
        (hourly-rate (unwrap! (contract-call? skill-contract get-skill-hourly-rate provider skill-id) ERR_NOT_FOUND))
        (total-credits (* hours-requested hourly-rate))
        (requester-balance (unwrap! (contract-call? core-contract get-balance tx-sender) ERR_NOT_FOUND))
    )
        (asserts! (var-get exchanges-enabled) ERR_UNAUTHORIZED)
        (asserts! (not (is-eq tx-sender provider)) ERR_INVALID_PARAMS)
        (asserts! is-verified ERR_SKILL_NOT_VERIFIED)
        (asserts! (> hours-requested u0) ERR_INVALID_PARAMS)
        (asserts! (is-valid-time-range scheduled-start scheduled-end) ERR_INVALID_PARAMS)
        (asserts! (>= requester-balance total-credits) ERR_INSUFFICIENT_CREDITS)

        (map-set exchanges exchange-id {
            requester: tx-sender,
            provider: provider,
            skill-id: skill-id,
            hours-requested: hours-requested,
            hourly-rate: hourly-rate,
            total-credits: total-credits,
            description: description,
            created-at: stacks-block-time,
            scheduled-start: scheduled-start,
            scheduled-end: scheduled-end,
            actual-start: none,
            actual-end: none,
            status: STATUS_PENDING,
            requester-confirmed: false,
            provider-confirmed: false
        })

        (add-exchange-to-user tx-sender exchange-id)
        (add-exchange-to-user provider exchange-id)
        (var-set next-exchange-id (+ exchange-id u1))
        (var-set total-exchanges (+ (var-get total-exchanges) u1))

        (emit-exchange-created exchange-id tx-sender provider)
        (ok exchange-id)))

(define-public (accept-exchange (exchange-id uint))
    (let ((exchange (unwrap! (map-get? exchanges exchange-id) ERR_NOT_FOUND)))
        (asserts! (is-eq tx-sender (get provider exchange)) ERR_NOT_PARTICIPANT)
        (asserts! (is-eq (get status exchange) STATUS_PENDING) ERR_EXCHANGE_ACTIVE)
        (asserts! (< stacks-block-time (get scheduled-start exchange)) ERR_EXCHANGE_EXPIRED)

        (map-set exchanges exchange-id (merge exchange {status: STATUS_ACCEPTED}))
        (print {event: "exchange-accepted", exchange-id: exchange-id, timestamp: stacks-block-time})
        (ok true)))

(define-public (start-exchange (exchange-id uint))
    (let ((exchange (unwrap! (map-get? exchanges exchange-id) ERR_NOT_FOUND)))
        (asserts! (is-eq tx-sender (get provider exchange)) ERR_NOT_PARTICIPANT)
        (asserts! (is-eq (get status exchange) STATUS_ACCEPTED) ERR_INVALID_PARAMS)
        (asserts! (>= stacks-block-time (get scheduled-start exchange)) ERR_INVALID_PARAMS)

        (map-set exchanges exchange-id (merge exchange {
            status: STATUS_IN_PROGRESS,
            actual-start: (some stacks-block-time)
        }))
        (print {event: "exchange-started", exchange-id: exchange-id, timestamp: stacks-block-time})
        (ok true)))

(define-public (complete-exchange
    (exchange-id uint)
    (core-contract <time-bank-core-trait>)
    (skill-contract <skill-registry-trait>))
    (let (
        (exchange (unwrap! (map-get? exchanges exchange-id) ERR_NOT_FOUND))
        (is-requester (is-eq tx-sender (get requester exchange)))
        (is-provider (is-eq tx-sender (get provider exchange)))
    )
        (asserts! (or is-requester is-provider) ERR_NOT_PARTICIPANT)
        (asserts! (is-eq (get status exchange) STATUS_IN_PROGRESS) ERR_INVALID_PARAMS)

        (if is-provider
            (map-set exchanges exchange-id (merge exchange {provider-confirmed: true}))
            (map-set exchanges exchange-id (merge exchange {requester-confirmed: true})))

        (let ((updated-exchange (unwrap-panic (map-get? exchanges exchange-id))))
            (if (and (get provider-confirmed updated-exchange) (get requester-confirmed updated-exchange))
                (begin
                    (try! (contract-call? core-contract transfer-credits (get provider exchange) (get total-credits exchange)))
                    (try! (contract-call? core-contract update-user-stats (get provider exchange) (get requester exchange) (get hours-requested exchange)))
                    (try! (contract-call? skill-contract increment-service-count (get provider exchange) (get skill-id exchange)))

                    (map-set exchanges exchange-id (merge updated-exchange {
                        status: STATUS_COMPLETED,
                        actual-end: (some stacks-block-time)
                    }))

                    (var-set total-completed-exchanges (+ (var-get total-completed-exchanges) u1))
                    (var-set total-credits-exchanged (+ (var-get total-credits-exchanged) (get total-credits exchange)))

                    (emit-exchange-completed exchange-id (get total-credits exchange))
                    (ok true))
                (ok false)))))

(define-public (cancel-exchange (exchange-id uint))
    (let ((exchange (unwrap! (map-get? exchanges exchange-id) ERR_NOT_FOUND)))
        (asserts! (or (is-eq tx-sender (get requester exchange)) (is-eq tx-sender (get provider exchange))) ERR_NOT_PARTICIPANT)
        (asserts! (or (is-eq (get status exchange) STATUS_PENDING) (is-eq (get status exchange) STATUS_ACCEPTED)) ERR_EXCHANGE_ACTIVE)

        (map-set exchanges exchange-id (merge exchange {status: STATUS_CANCELLED}))
        (print {event: "exchange-cancelled", exchange-id: exchange-id, timestamp: stacks-block-time})
        (ok true)))

(define-public (submit-review (exchange-id uint) (rating uint) (comment (string-ascii 200)))
    (let (
        (exchange (unwrap! (map-get? exchanges exchange-id) ERR_NOT_FOUND))
        (review (default-to
            {requester-rating: none, provider-rating: none, requester-comment: none, provider-comment: none, reviewed-at: none}
            (map-get? exchange-reviews exchange-id)))
        (is-requester (is-eq tx-sender (get requester exchange)))
    )
        (asserts! (is-eq (get status exchange) STATUS_COMPLETED) ERR_INVALID_PARAMS)
        (asserts! (or is-requester (is-eq tx-sender (get provider exchange))) ERR_NOT_PARTICIPANT)
        (asserts! (<= rating u5) ERR_INVALID_PARAMS)

        (if is-requester
            (map-set exchange-reviews exchange-id (merge review {
                provider-rating: (some rating),
                provider-comment: (some comment),
                reviewed-at: (some stacks-block-time)
            }))
            (map-set exchange-reviews exchange-id (merge review {
                requester-rating: (some rating),
                requester-comment: (some comment),
                reviewed-at: (some stacks-block-time)
            })))

        (print {event: "review-submitted", exchange-id: exchange-id, rating: rating, timestamp: stacks-block-time})
        (ok true)))

(define-public (toggle-exchanges)
    (begin
        (asserts! (is-eq tx-sender CONTRACT_OWNER) ERR_UNAUTHORIZED)
        (var-set exchanges-enabled (not (var-get exchanges-enabled)))
        (print {event: "exchanges-toggled", enabled: (var-get exchanges-enabled)})
        (ok true)))

;; Read-Only Functions
(define-read-only (get-exchange-info (exchange-id uint))
    (map-get? exchanges exchange-id))

(define-read-only (get-user-exchanges (user principal))
    (ok (default-to (list) (map-get? user-exchanges user))))

(define-read-only (get-exchange-review (exchange-id uint))
    (map-get? exchange-reviews exchange-id))

(define-read-only (is-exchange-expired (exchange-id uint))
    (match (map-get? exchanges exchange-id)
        exchange (ok (> stacks-block-time (get scheduled-end exchange)))
        ERR_NOT_FOUND))

(define-read-only (get-exchange-stats)
    (ok {
        total-exchanges: (var-get total-exchanges),
        total-completed-exchanges: (var-get total-completed-exchanges),
        total-credits-exchanged: (var-get total-credits-exchanged),
        next-exchange-id: (var-get next-exchange-id),
        exchanges-enabled: (var-get exchanges-enabled)
    }))
