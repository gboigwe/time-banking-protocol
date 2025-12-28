;; Multi-Signature Wallet (Clarity 4)
;; M-of-N signature requirements
;; Uses stacks-block-time for timelocks

;; constants
(define-constant CONTRACT_OWNER tx-sender)
(define-constant ERR_UNAUTHORIZED (err u10001))
(define-constant ERR_NOT_FOUND (err u10002))
(define-constant ERR_ALREADY_SIGNED (err u10003))
(define-constant ERR_INSUFFICIENT_SIGNATURES (err u10004))

(define-constant DEFAULT_TIMELOCK u86400)

;; data vars
(define-data-var proposal-counter uint u0)
(define-data-var signer-count uint u0)
(define-data-var signature-threshold uint u2)

;; data maps
(define-map signers principal bool)

(define-map proposals
    uint
    {
        proposer: principal,
        amount: (optional uint),
        recipient: (optional principal),
        signatures-required: uint,
        signatures-count: uint,
        created-at: uint,
        execute-after: uint,
        executed: bool
    })

(define-map proposal-signatures
    { proposal-id: uint, signer: principal }
    uint)

;; public functions
(define-public (add-signer (new-signer principal))
    (begin
        (asserts! (is-eq tx-sender CONTRACT_OWNER) ERR_UNAUTHORIZED)
        (map-set signers new-signer true)
        (var-set signer-count (+ (var-get signer-count) u1))
        (ok true)))

(define-public (create-proposal
    (recipient principal)
    (amount uint))
    (let ((proposal-id (+ (var-get proposal-counter) u1)))
        (asserts! (default-to false (map-get? signers tx-sender)) ERR_UNAUTHORIZED)
        (map-set proposals proposal-id {
            proposer: tx-sender,
            amount: (some amount),
            recipient: (some recipient),
            signatures-required: (var-get signature-threshold),
            signatures-count: u1,
            created-at: stacks-block-time,
            execute-after: (+ stacks-block-time DEFAULT_TIMELOCK),
            executed: false
        })
        (map-set proposal-signatures { proposal-id: proposal-id, signer: tx-sender } u1)
        (var-set proposal-counter proposal-id)
        (ok proposal-id)))

(define-public (sign-proposal (proposal-id uint))
    (let ((proposal (unwrap! (map-get? proposals proposal-id) ERR_NOT_FOUND)))
        (asserts! (default-to false (map-get? signers tx-sender)) ERR_UNAUTHORIZED)
        (asserts! (is-none (map-get? proposal-signatures { proposal-id: proposal-id, signer: tx-sender })) ERR_ALREADY_SIGNED)
        (map-set proposal-signatures { proposal-id: proposal-id, signer: tx-sender } u1)
        (let ((new-signature-count (+ (get signatures-count proposal) u1)))
            (map-set proposals proposal-id (merge proposal {
                signatures-count: new-signature-count
            }))
            (ok new-signature-count))))

(define-public (execute-proposal (proposal-id uint))
    (let ((proposal (unwrap! (map-get? proposals proposal-id) ERR_NOT_FOUND)))
        (asserts! (>= (get signatures-count proposal) (get signatures-required proposal)) ERR_INSUFFICIENT_SIGNATURES)
        (asserts! (>= stacks-block-time (get execute-after proposal)) ERR_UNAUTHORIZED)
        (asserts! (not (get executed proposal)) ERR_UNAUTHORIZED)
        (map-set proposals proposal-id (merge proposal { executed: true }))
        (ok true)))

;; read only functions
(define-read-only (get-proposal (proposal-id uint))
    (ok (map-get? proposals proposal-id)))

(define-read-only (is-signer (user principal))
    (ok (default-to false (map-get? signers user))))

(define-read-only (has-signed (proposal-id uint) (signer principal))
    (ok (is-some (map-get? proposal-signatures { proposal-id: proposal-id, signer: signer }))))
