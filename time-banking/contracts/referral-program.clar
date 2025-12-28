;; Referral Program Contract (Clarity 4)
;; Viral growth through referrals
;; Uses stacks-block-time for tracking

;; constants
(define-constant CONTRACT_OWNER tx-sender)
(define-constant ERR_UNAUTHORIZED (err u8001))
(define-constant ERR_NOT_FOUND (err u8002))
(define-constant ERR_SELF_REFERRAL (err u8003))
(define-constant ERR_CODE_EXISTS (err u8004))

(define-constant REFERRER_REWARD u10)
(define-constant REFEREE_REWARD u5)

;; data vars
(define-data-var total-referrals uint u0)

;; data maps
(define-map referral-codes
    (string-ascii 20)
    principal)

(define-map user-referrals
    principal
    {
        referrer: (optional principal),
        referral-code: (string-ascii 20),
        total-referrals: uint,
        total-rewards: uint,
        created-at: uint
    })

;; public functions
(define-public (generate-code (code (string-ascii 20)))
    (begin
        (asserts! (is-none (map-get? referral-codes code)) ERR_CODE_EXISTS)
        (map-set referral-codes code tx-sender)
        (map-set user-referrals tx-sender {
            referrer: none,
            referral-code: code,
            total-referrals: u0,
            total-rewards: u0,
            created-at: stacks-block-time
        })
        (ok code)))

(define-public (use-code (code (string-ascii 20)))
    (let ((referrer (unwrap! (map-get? referral-codes code) ERR_NOT_FOUND)))
        (asserts! (not (is-eq referrer tx-sender)) ERR_SELF_REFERRAL)
        (let ((referrer-data (unwrap! (map-get? user-referrals referrer) ERR_NOT_FOUND)))
            (map-set user-referrals referrer (merge referrer-data {
                total-referrals: (+ (get total-referrals referrer-data) u1),
                total-rewards: (+ (get total-rewards referrer-data) REFERRER_REWARD)
            }))
            (map-set user-referrals tx-sender {
                referrer: (some referrer),
                referral-code: code,
                total-referrals: u0,
                total-rewards: REFEREE_REWARD,
                created-at: stacks-block-time
            })
            (var-set total-referrals (+ (var-get total-referrals) u1))
            (ok true))))

;; read only functions
(define-read-only (get-user-data (user principal))
    (ok (map-get? user-referrals user)))

(define-read-only (get-code-owner (code (string-ascii 20)))
    (ok (map-get? referral-codes code)))

(define-read-only (get-total-referrals)
    (ok (var-get total-referrals)))
