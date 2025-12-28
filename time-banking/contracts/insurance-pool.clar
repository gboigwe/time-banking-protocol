;; Insurance Pool Contract (Clarity 4)
;; Collective insurance for exchange failures
;; Uses stacks-block-time for claim filing and processing

;; constants
(define-constant CONTRACT_OWNER tx-sender)
(define-constant ERR_UNAUTHORIZED (err u5001))
(define-constant ERR_NOT_FOUND (err u5002))
(define-constant ERR_INSUFFICIENT_BALANCE (err u5003))
(define-constant ERR_INVALID_AMOUNT (err u5004))

(define-constant STATUS_PENDING u1)
(define-constant STATUS_APPROVED u2)
(define-constant STATUS_DENIED u3)
(define-constant STATUS_PAID u4)

;; data vars
(define-data-var total-pool-balance uint u0)
(define-data-var claim-counter uint u0)

;; data maps
(define-map contributors
    principal
    {
        total-contributed: uint,
        coverage-amount: uint,
        is-active: bool,
        joined-at: uint
    })

(define-map claims
    uint
    {
        claimant: principal,
        exchange-id: uint,
        amount: uint,
        status: uint,
        filed-at: uint,
        reviewed-at: (optional uint)
    })

(define-map underwriters principal bool)

;; public functions
(define-public (contribute-to-pool (amount uint))
    (begin
        (asserts! (> amount u0) ERR_INVALID_AMOUNT)
        (let ((contributor-data (default-to
            { total-contributed: u0, coverage-amount: u0, is-active: false, joined-at: stacks-block-time }
            (map-get? contributors tx-sender))))
            (map-set contributors tx-sender (merge contributor-data {
                total-contributed: (+ (get total-contributed contributor-data) amount),
                is-active: true
            }))
            (var-set total-pool-balance (+ (var-get total-pool-balance) amount)))
        (ok true)))

(define-public (file-claim (exchange-id uint) (amount uint))
    (let ((claim-id (+ (var-get claim-counter) u1)))
        (asserts! (is-some (map-get? contributors tx-sender)) ERR_UNAUTHORIZED)
        (map-set claims claim-id {
            claimant: tx-sender,
            exchange-id: exchange-id,
            amount: amount,
            status: STATUS_PENDING,
            filed-at: stacks-block-time,
            reviewed-at: none
        })
        (var-set claim-counter claim-id)
        (ok claim-id)))

(define-public (review-claim (claim-id uint) (approved bool))
    (let ((claim (unwrap! (map-get? claims claim-id) ERR_NOT_FOUND)))
        (asserts! (default-to false (map-get? underwriters tx-sender)) ERR_UNAUTHORIZED)
        (map-set claims claim-id (merge claim {
            status: (if approved STATUS_APPROVED STATUS_DENIED),
            reviewed-at: (some stacks-block-time)
        }))
        (ok true)))

(define-public (pay-claim (claim-id uint))
    (let ((claim (unwrap! (map-get? claims claim-id) ERR_NOT_FOUND)))
        (asserts! (is-eq (get status claim) STATUS_APPROVED) ERR_UNAUTHORIZED)
        (asserts! (>= (var-get total-pool-balance) (get amount claim)) ERR_INSUFFICIENT_BALANCE)
        (map-set claims claim-id (merge claim { status: STATUS_PAID }))
        (var-set total-pool-balance (- (var-get total-pool-balance) (get amount claim)))
        (ok true)))

(define-public (register-underwriter)
    (begin
        (asserts! (is-eq tx-sender CONTRACT_OWNER) ERR_UNAUTHORIZED)
        (map-set underwriters tx-sender true)
        (ok true)))

;; read only functions
(define-read-only (get-contributor-info (contributor principal))
    (ok (map-get? contributors contributor)))

(define-read-only (get-claim-info (claim-id uint))
    (ok (map-get? claims claim-id)))

(define-read-only (get-pool-balance)
    (ok (var-get total-pool-balance)))
