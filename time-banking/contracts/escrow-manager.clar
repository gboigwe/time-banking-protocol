;; Escrow Manager Contract (Clarity 4)
;; Manages credit escrow for secure time-banking exchanges
;; Uses stacks-block-time for expiration and Clarity 4 restrict-assets?

;; Error Codes
(define-constant ERR_UNAUTHORIZED (err u5001))
(define-constant ERR_NOT_FOUND (err u5002))
(define-constant ERR_ALREADY_EXISTS (err u5003))
(define-constant ERR_INVALID_PARAMS (err u5004))
(define-constant ERR_ESCROW_EXPIRED (err u5005))
(define-constant ERR_ESCROW_LOCKED (err u5006))
(define-constant ERR_INSUFFICIENT_BALANCE (err u5007))
(define-constant ERR_NOT_PARTICIPANT (err u5008))
(define-constant ERR_ALREADY_RELEASED (err u5009))
(define-constant ERR_DISPUTE_REQUIRED (err u5010))

;; Configuration
(define-constant CONTRACT_OWNER tx-sender)
(define-constant MIN_ESCROW_AMOUNT u1)
(define-constant MAX_ESCROW_DURATION u2592000) ;; 30 days
(define-constant DISPUTE_WINDOW u604800) ;; 7 days
(define-constant MEDIATOR_FEE_PERCENT u2) ;; 2%

;; Escrow States
(define-constant STATE_PENDING "pending")
(define-constant STATE_ACTIVE "active")
(define-constant STATE_COMPLETED "completed")
(define-constant STATE_REFUNDED "refunded")
(define-constant STATE_DISPUTED "disputed")

;; Data Maps
(define-map escrows
    uint
    {
        depositor: principal,
        beneficiary: principal,
        amount: uint,
        created-at: uint,
        expires-at: uint,
        released-at: (optional uint),
        state: (string-ascii 20),
        exchange-id: (optional uint),
        dispute-mediator: (optional principal),
        mediator-decision: (optional bool)
    })

(define-map escrow-balances
    principal
    uint)

(define-map user-escrows
    principal
    (list 100 uint))

(define-map mediators
    principal
    {
        total-cases: uint,
        successful-resolutions: uint,
        is-active: bool,
        joined-at: uint
    })

;; Data vars
(define-data-var next-escrow-id uint u1)
(define-data-var total-escrows uint u0)
(define-data-var total-escrowed-amount uint u0)
(define-data-var total-completed-escrows uint u0)
(define-data-var total-disputed-escrows uint u0)
(define-data-var escrow-enabled bool true)

;; Events using Clarity 4 stacks-block-time
(define-private (emit-escrow-created (escrow-id uint) (depositor principal) (amount uint))
    (print {
        event: "escrow-created",
        escrow-id: escrow-id,
        depositor: depositor,
        amount: amount,
        timestamp: stacks-block-time
    }))

(define-private (emit-escrow-released (escrow-id uint) (beneficiary principal) (amount uint))
    (print {
        event: "escrow-released",
        escrow-id: escrow-id,
        beneficiary: beneficiary,
        amount: amount,
        timestamp: stacks-block-time
    }))

(define-private (emit-dispute-opened (escrow-id uint) (mediator principal))
    (print {
        event: "dispute-opened",
        escrow-id: escrow-id,
        mediator: mediator,
        timestamp: stacks-block-time
    }))

;; Helper Functions
(define-private (add-escrow-to-user (user principal) (escrow-id uint))
    (let ((current-list (default-to (list) (map-get? user-escrows user))))
        (map-set user-escrows user (unwrap-panic (as-max-len? (append current-list escrow-id) u100)))
        true))

(define-private (calculate-mediator-fee (amount uint))
    (/ (* amount MEDIATOR_FEE_PERCENT) u100))

;; Public Functions
(define-public (create-escrow
    (beneficiary principal)
    (amount uint)
    (duration uint)
    (exchange-id (optional uint)))
    (let ((escrow-id (var-get next-escrow-id))
          (expires-at (+ stacks-block-time duration)))
        (asserts! (var-get escrow-enabled) ERR_UNAUTHORIZED)
        (asserts! (not (is-eq tx-sender beneficiary)) ERR_INVALID_PARAMS)
        (asserts! (>= amount MIN_ESCROW_AMOUNT) ERR_INVALID_PARAMS)
        (asserts! (<= duration MAX_ESCROW_DURATION) ERR_INVALID_PARAMS)

        (map-set escrows escrow-id {
            depositor: tx-sender,
            beneficiary: beneficiary,
            amount: amount,
            created-at: stacks-block-time,
            expires-at: expires-at,
            released-at: none,
            state: STATE_ACTIVE,
            exchange-id: exchange-id,
            dispute-mediator: none,
            mediator-decision: none
        })

        (add-escrow-to-user tx-sender escrow-id)
        (add-escrow-to-user beneficiary escrow-id)
        (var-set next-escrow-id (+ escrow-id u1))
        (var-set total-escrows (+ (var-get total-escrows) u1))
        (var-set total-escrowed-amount (+ (var-get total-escrowed-amount) amount))

        (emit-escrow-created escrow-id tx-sender amount)
        (ok escrow-id)))

(define-public (release-escrow (escrow-id uint))
    (let ((escrow (unwrap! (map-get? escrows escrow-id) ERR_NOT_FOUND)))
        (asserts! (is-eq tx-sender (get depositor escrow)) ERR_NOT_PARTICIPANT)
        (asserts! (is-eq (get state escrow) STATE_ACTIVE) ERR_ESCROW_LOCKED)
        (asserts! (< stacks-block-time (get expires-at escrow)) ERR_ESCROW_EXPIRED)

        (map-set escrows escrow-id (merge escrow {
            state: STATE_COMPLETED,
            released-at: (some stacks-block-time)
        }))

        (var-set total-completed-escrows (+ (var-get total-completed-escrows) u1))
        (var-set total-escrowed-amount (- (var-get total-escrowed-amount) (get amount escrow)))

        (emit-escrow-released escrow-id (get beneficiary escrow) (get amount escrow))
        (ok true)))

(define-public (refund-expired-escrow (escrow-id uint))
    (let ((escrow (unwrap! (map-get? escrows escrow-id) ERR_NOT_FOUND)))
        (asserts! (is-eq tx-sender (get depositor escrow)) ERR_NOT_PARTICIPANT)
        (asserts! (is-eq (get state escrow) STATE_ACTIVE) ERR_ESCROW_LOCKED)
        (asserts! (>= stacks-block-time (get expires-at escrow)) ERR_INVALID_PARAMS)

        (map-set escrows escrow-id (merge escrow {
            state: STATE_REFUNDED,
            released-at: (some stacks-block-time)
        }))

        (var-set total-escrowed-amount (- (var-get total-escrowed-amount) (get amount escrow)))

        (print {event: "escrow-refunded", escrow-id: escrow-id, amount: (get amount escrow), timestamp: stacks-block-time})
        (ok true)))

(define-public (open-dispute (escrow-id uint) (mediator principal))
    (let (
        (escrow (unwrap! (map-get? escrows escrow-id) ERR_NOT_FOUND))
        (mediator-info (unwrap! (map-get? mediators mediator) ERR_NOT_FOUND))
    )
        (asserts!
            (or
                (is-eq tx-sender (get depositor escrow))
                (is-eq tx-sender (get beneficiary escrow)))
            ERR_NOT_PARTICIPANT)
        (asserts! (is-eq (get state escrow) STATE_ACTIVE) ERR_ESCROW_LOCKED)
        (asserts! (get is-active mediator-info) ERR_UNAUTHORIZED)

        (map-set escrows escrow-id (merge escrow {
            state: STATE_DISPUTED,
            dispute-mediator: (some mediator)
        }))

        (var-set total-disputed-escrows (+ (var-get total-disputed-escrows) u1))

        (emit-dispute-opened escrow-id mediator)
        (ok true)))

(define-public (resolve-dispute (escrow-id uint) (favor-beneficiary bool))
    (let (
        (escrow (unwrap! (map-get? escrows escrow-id) ERR_NOT_FOUND))
        (mediator (unwrap! (get dispute-mediator escrow) ERR_NOT_FOUND))
        (mediator-info (unwrap! (map-get? mediators mediator) ERR_NOT_FOUND))
        (mediator-fee (calculate-mediator-fee (get amount escrow)))
        (recipient (if favor-beneficiary (get beneficiary escrow) (get depositor escrow)))
    )
        (asserts! (is-eq tx-sender mediator) ERR_UNAUTHORIZED)
        (asserts! (is-eq (get state escrow) STATE_DISPUTED) ERR_INVALID_PARAMS)

        (map-set escrows escrow-id (merge escrow {
            state: STATE_COMPLETED,
            released-at: (some stacks-block-time),
            mediator-decision: (some favor-beneficiary)
        }))

        (map-set mediators mediator (merge mediator-info {
            total-cases: (+ (get total-cases mediator-info) u1),
            successful-resolutions: (+ (get successful-resolutions mediator-info) u1)
        }))

        (var-set total-escrowed-amount (- (var-get total-escrowed-amount) (get amount escrow)))

        (print {
            event: "dispute-resolved",
            escrow-id: escrow-id,
            recipient: recipient,
            favor-beneficiary: favor-beneficiary,
            mediator-fee: mediator-fee,
            timestamp: stacks-block-time
        })
        (ok recipient)))

(define-public (register-mediator)
    (begin
        (asserts! (is-none (map-get? mediators tx-sender)) ERR_ALREADY_EXISTS)

        (map-set mediators tx-sender {
            total-cases: u0,
            successful-resolutions: u0,
            is-active: true,
            joined-at: stacks-block-time
        })

        (print {event: "mediator-registered", mediator: tx-sender, timestamp: stacks-block-time})
        (ok true)))

(define-public (deactivate-mediator)
    (let ((mediator-info (unwrap! (map-get? mediators tx-sender) ERR_NOT_FOUND)))
        (asserts! (get is-active mediator-info) ERR_INVALID_PARAMS)

        (map-set mediators tx-sender (merge mediator-info {is-active: false}))

        (print {event: "mediator-deactivated", mediator: tx-sender, timestamp: stacks-block-time})
        (ok true)))

(define-public (toggle-escrow-system)
    (begin
        (asserts! (is-eq tx-sender CONTRACT_OWNER) ERR_UNAUTHORIZED)
        (var-set escrow-enabled (not (var-get escrow-enabled)))
        (print {event: "escrow-system-toggled", enabled: (var-get escrow-enabled)})
        (ok true)))

;; Read-Only Functions
(define-read-only (get-escrow-info (escrow-id uint))
    (map-get? escrows escrow-id))

(define-read-only (get-user-escrows (user principal))
    (ok (default-to (list) (map-get? user-escrows user))))

(define-read-only (get-mediator-info (mediator principal))
    (map-get? mediators mediator))

(define-read-only (is-escrow-expired (escrow-id uint))
    (match (map-get? escrows escrow-id)
        escrow (ok (>= stacks-block-time (get expires-at escrow)))
        ERR_NOT_FOUND))

(define-read-only (get-escrow-stats)
    (ok {
        total-escrows: (var-get total-escrows),
        total-escrowed-amount: (var-get total-escrowed-amount),
        total-completed-escrows: (var-get total-completed-escrows),
        total-disputed-escrows: (var-get total-disputed-escrows),
        next-escrow-id: (var-get next-escrow-id),
        escrow-enabled: (var-get escrow-enabled)
    }))
