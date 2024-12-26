;; Time Banking Protocol Smart Contract
;; Handles time-skill trading and verification

;; Error constants
(define-constant ERR_UNAUTHORIZED (err u1001))
(define-constant ERR_INVALID_TIME (err u1002))
(define-constant ERR_INSUFFICIENT_BALANCE (err u1003))
(define-constant ERR_SKILL_NOT_VERIFIED (err u1004))

;; Data maps
(define-map user-balances principal uint)
(define-map skill-verification {user: principal, skill: (string-ascii 64)} bool)
(define-map time-commitments 
    {provider: principal, receiver: principal, skill: (string-ascii 64)}
    {time-units: uint, completed: bool})

;; Public functions
(define-public (register-skill (skill (string-ascii 64)))
    (begin
        (map-set skill-verification {user: tx-sender, skill: skill} false)
        (ok true)))

(define-public (verify-skill (user principal) (skill (string-ascii 64)))
    (let ((is-verifier (is-skill-verifier tx-sender)))
        (if is-verifier
            (begin
                (map-set skill-verification {user: user, skill: skill} true)
                (ok true))
            ERR_UNAUTHORIZED)))

(define-public (commit-time (receiver principal) (skill (string-ascii 64)) (time-units uint))
    (let ((skill-verified (default-to false (map-get? skill-verification {user: tx-sender, skill: skill}))))
        (if skill-verified
            (begin
                (map-set time-commitments 
                    {provider: tx-sender, receiver: receiver, skill: skill}
                    {time-units: time-units, completed: false})
                (ok true))
            ERR_SKILL_NOT_VERIFIED)))

(define-public (complete-time-exchange (provider principal) (skill (string-ascii 64)))
    (let ((commitment (map-get? time-commitments {provider: provider, receiver: tx-sender, skill: skill})))
        (match commitment
            commitment-data
            (begin
                (map-set time-commitments 
                    {provider: provider, receiver: tx-sender, skill: skill}
                    (merge commitment-data {completed: true}))
                (credit-time-units provider (get time-units commitment-data))
                (ok true))
            ERR_INVALID_TIME)))

;; Read-only functions
(define-read-only (get-skill-verification (user principal) (skill (string-ascii 64)))
    (default-to false (map-get? skill-verification {user: user, skill: skill})))

(define-read-only (get-time-balance (user principal))
    (default-to u0 (map-get? user-balances user)))

;; Private functions
(define-private (credit-time-units (user principal) (units uint))
    (let ((current-balance (get-time-balance user)))
        (map-set user-balances user (+ current-balance units))
        (ok true)))

(define-private (is-skill-verifier (user principal))
    (is-eq user (var-get contract-owner))
)
