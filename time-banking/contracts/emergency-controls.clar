;; Emergency Controls Contract (Clarity 4)
;; Circuit breaker and pause mechanisms
;; Uses stacks-block-time for timelocks

;; constants
(define-constant CONTRACT_OWNER tx-sender)
(define-constant ERR_UNAUTHORIZED (err u9001))
(define-constant ERR_NOT_FOUND (err u9002))
(define-constant ERR_ALREADY_PAUSED (err u9003))
(define-constant ERR_NOT_PAUSED (err u9004))

(define-constant TIMELOCK_DURATION u86400)

;; data vars
(define-data-var global-pause bool false)
(define-data-var emergency-mode bool false)

;; data maps
(define-map admins principal bool)

(define-map contract-pauses
    principal
    {
        is-paused: bool,
        paused-at: (optional uint),
        paused-by: (optional principal)
    })

(define-map timelocked-operations
    uint
    {
        operation-type: (string-ascii 50),
        proposer: principal,
        execute-after: uint,
        executed: bool
    })

(define-data-var operation-counter uint u0)

;; public functions
(define-public (add-admin (new-admin principal))
    (begin
        (asserts! (is-eq tx-sender CONTRACT_OWNER) ERR_UNAUTHORIZED)
        (map-set admins new-admin true)
        (ok true)))

(define-public (toggle-global-pause)
    (begin
        (asserts! (or (is-eq tx-sender CONTRACT_OWNER) (default-to false (map-get? admins tx-sender))) ERR_UNAUTHORIZED)
        (var-set global-pause (not (var-get global-pause)))
        (ok (var-get global-pause))))

(define-public (pause-contract (contract principal))
    (begin
        (asserts! (default-to false (map-get? admins tx-sender)) ERR_UNAUTHORIZED)
        (map-set contract-pauses contract {
            is-paused: true,
            paused-at: (some stacks-block-time),
            paused-by: (some tx-sender)
        })
        (ok true)))

(define-public (unpause-contract (contract principal))
    (begin
        (asserts! (default-to false (map-get? admins tx-sender)) ERR_UNAUTHORIZED)
        (let ((pause-data (unwrap! (map-get? contract-pauses contract) ERR_NOT_FOUND)))
            (map-set contract-pauses contract (merge pause-data { is-paused: false })))
        (ok true)))

(define-public (propose-operation (operation-type (string-ascii 50)))
    (let ((operation-id (+ (var-get operation-counter) u1)))
        (asserts! (default-to false (map-get? admins tx-sender)) ERR_UNAUTHORIZED)
        (map-set timelocked-operations operation-id {
            operation-type: operation-type,
            proposer: tx-sender,
            execute-after: (+ stacks-block-time TIMELOCK_DURATION),
            executed: false
        })
        (var-set operation-counter operation-id)
        (ok operation-id)))

;; read only functions
(define-read-only (is-globally-paused)
    (ok (var-get global-pause)))

(define-read-only (is-contract-paused (contract principal))
    (match (map-get? contract-pauses contract)
        data (ok (get is-paused data))
        (ok false)))

(define-read-only (is-admin (user principal))
    (ok (or (is-eq user CONTRACT_OWNER) (default-to false (map-get? admins user)))))
