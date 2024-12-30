;; Time Banking Protocol - Core Contract
;; Controls the main functionality of the time banking system

;; Constants and Error Codes
(define-constant CONTRACT_OWNER tx-sender)
(define-constant ERR_UNAUTHORIZED (err u1001))
(define-constant ERR_INVALID_TIME (err u1002))
(define-constant ERR_INSUFFICIENT_BALANCE (err u1003))
(define-constant ERR_SKILL_NOT_VERIFIED (err u1004))
(define-constant ERR_INVALID_PARAMS (err u1005))
(define-constant ERR_ALREADY_VERIFIED (err u1006))
(define-constant ERR_NOT_FOUND (err u1007))
(define-constant ERR_ALREADY_COMPLETED (err u1008))
(define-constant ERR_SELF_EXCHANGE (err u1009))

;; Data Structures
(define-map users
    principal
    {
        joined-at: uint,
        total-hours-given: uint,
        total-hours-received: uint,
        reputation-score: uint,
        is-active: bool
    })

(define-map skills
    (string-ascii 64)
    {
        category: (string-ascii 32),
        min-reputation: uint,
        verification-required: bool
    })

(define-map user-skills
    {user: principal, skill: (string-ascii 64)}
    {
        verified: bool,
        verified-by: (optional principal),
        verified-at: (optional uint),
        rating: uint
    })

(define-map time-exchanges
    uint
    {
        provider: principal,
        receiver: principal,
        skill: (string-ascii 64),
        hours: uint,
        status: (string-ascii 16),  ;; "pending", "active", "completed", "cancelled"
        created-at: uint,
        completed-at: (optional uint)
    })

;; Variables
(define-data-var exchange-nonce uint u0)
(define-data-var min-exchange-duration uint u1) ;; Minimum 1 hour
(define-data-var max-exchange-duration uint u8) ;; Maximum 8 hours

;; Event Map for persistent logging
(define-map event-log 
    uint 
    {
        event-type: (string-ascii 32),
        data: (string-ascii 256),
        block: uint
    })

(define-data-var event-nonce uint u0)

;; Event Logging - Fixed to be persistent and type-safe
(define-private (log-event (event-type (string-ascii 32)) (data (string-ascii 256)))
    (let ((event-id (+ (var-get event-nonce) u1)))
        (var-set event-nonce event-id)
        (map-set event-log event-id {
            event-type: event-type,
            data: data,
            block: block-height
        })))

;; Administrative Functions
(define-public (set-min-exchange-duration (hours uint))
    (begin
        (asserts! (is-eq tx-sender CONTRACT_OWNER) ERR_UNAUTHORIZED)
        (asserts! (>= hours u1) ERR_INVALID_PARAMS)
        (var-set min-exchange-duration hours)
        (log-event "config-update" "min-exchange-duration-updated")
        (ok true)))

(define-public (set-max-exchange-duration (hours uint))
    (begin
        (asserts! (is-eq tx-sender CONTRACT_OWNER) ERR_UNAUTHORIZED)
        (asserts! (>= hours (var-get min-exchange-duration)) ERR_INVALID_PARAMS)
        (var-set max-exchange-duration hours)
        (log-event "config-update" "max-exchange-duration-updated")
        (ok true)))

;; User Management
(define-public (register-user)
    (begin
        (asserts! (is-none (map-get? users tx-sender)) ERR_ALREADY_VERIFIED)
        (map-set users tx-sender {
            joined-at: block-height,
            total-hours-given: u0,
            total-hours-received: u0,
            reputation-score: u0,
            is-active: true
        })
        (log-event "user-action" "user-registered")
        (ok true)))

;; String Validation Functions
(define-private (is-valid-string (input (string-ascii 64)))
    (and
        (>= (len input) u1)
        (<= (len input) u64)))

(define-private (is-valid-category (input (string-ascii 32)))
    (and
        (>= (len input) u1)
        (<= (len input) u32)))

;; Skill Management
(define-public (register-skill (skill-name (string-ascii 64)) (category (string-ascii 32)))
    (begin
        (asserts! (is-eq tx-sender CONTRACT_OWNER) ERR_UNAUTHORIZED)
        (asserts! (is-none (map-get? skills skill-name)) ERR_ALREADY_VERIFIED)
        (asserts! (is-valid-string skill-name) ERR_INVALID_PARAMS)
        (asserts! (is-valid-category category) ERR_INVALID_PARAMS)
        (map-set skills skill-name {
            category: category,
            min-reputation: u0,
            verification-required: true
        })
        (log-event "skill-action" "skill-registered")
        (ok true)))

(define-public (verify-user-skill (user principal) (skill-name (string-ascii 64)))
    (begin
        (asserts! (is-eq tx-sender CONTRACT_OWNER) ERR_UNAUTHORIZED)
        (asserts! (is-some (map-get? skills skill-name)) ERR_NOT_FOUND)
        (asserts! (is-some (map-get? users user)) ERR_NOT_FOUND)
        (map-set user-skills {user: user, skill: skill-name} 
            {
                verified: true,
                verified-by: (some tx-sender),
                verified-at: (some block-height),
                rating: u0
            })
        (log-event "skill-action" "skill-verified")
        (ok true)))

;; Exchange Functions
(define-public (create-exchange (skill (string-ascii 64)) (hours uint) (receiver principal))
    (begin
        (asserts! (is-valid-string skill) ERR_INVALID_PARAMS)
        (let ((exchange-id (+ (var-get exchange-nonce) u1)))
        (asserts! (is-some (map-get? users tx-sender)) ERR_UNAUTHORIZED)
        (asserts! (is-some (map-get? users receiver)) ERR_NOT_FOUND)
        (asserts! (not (is-eq tx-sender receiver)) ERR_SELF_EXCHANGE)
        (asserts! (and (>= hours (var-get min-exchange-duration)) 
                      (<= hours (var-get max-exchange-duration))) 
                 ERR_INVALID_PARAMS)
        (asserts! (is-some (map-get? user-skills 
            {user: tx-sender, skill: skill})) ERR_SKILL_NOT_VERIFIED)
        (map-set time-exchanges exchange-id {
            provider: tx-sender,
            receiver: receiver,
            skill: skill,
            hours: hours,
            status: "pending",
            created-at: block-height,
            completed-at: none
        })
        (var-set exchange-nonce exchange-id)
        (log-event "exchange-action" "exchange-created")
        (ok exchange-id))))

(define-public (accept-exchange (exchange-id uint))
    (let ((exchange (unwrap! (map-get? time-exchanges exchange-id) ERR_NOT_FOUND)))
        (asserts! (is-eq (get receiver exchange) tx-sender) ERR_UNAUTHORIZED)
        (asserts! (is-eq (get status exchange) "pending") ERR_ALREADY_COMPLETED)
        (map-set time-exchanges exchange-id 
            (merge exchange {status: "active"}))
        (log-event "exchange-action" "exchange-accepted")
        (ok true)))

(define-public (complete-exchange (exchange-id uint))
    (let ((exchange (unwrap! (map-get? time-exchanges exchange-id) ERR_NOT_FOUND)))
        (asserts! (is-eq (get receiver exchange) tx-sender) ERR_UNAUTHORIZED)
        (asserts! (is-eq (get status exchange) "active") ERR_ALREADY_COMPLETED)
        (try! (update-user-stats 
            (get provider exchange) 
            (get receiver exchange) 
            (get hours exchange)))
        (map-set time-exchanges exchange-id 
            (merge exchange {
                status: "completed",
                completed-at: (some block-height)
            }))
        (log-event "exchange-action" "exchange-completed")
        (ok true)))

(define-public (cancel-exchange (exchange-id uint))
    (let ((exchange (unwrap! (map-get? time-exchanges exchange-id) ERR_NOT_FOUND)))
        (asserts! (or (is-eq (get provider exchange) tx-sender)
                     (is-eq (get receiver exchange) tx-sender)) 
                 ERR_UNAUTHORIZED)
        (asserts! (or (is-eq (get status exchange) "pending")
                     (is-eq (get status exchange) "active"))
                 ERR_ALREADY_COMPLETED)
        (map-set time-exchanges exchange-id 
            (merge exchange {
                status: "cancelled",
                completed-at: (some block-height)
            }))
        (log-event "exchange-action" "exchange-cancelled")
        (ok true)))

;; Helper Functions
(define-private (update-user-stats (provider principal) (receiver principal) (hours uint))
    (let ((provider-data (unwrap! (map-get? users provider) ERR_NOT_FOUND))
          (receiver-data (unwrap! (map-get? users receiver) ERR_NOT_FOUND)))
        (map-set users provider 
            (merge provider-data {
                total-hours-given: (+ (get total-hours-given provider-data) hours)
            }))
        (map-set users receiver 
            (merge receiver-data {
                total-hours-received: (+ (get total-hours-received receiver-data) hours)
            }))
        (ok true)))

;; Read-Only Functions
(define-read-only (get-user-info (user principal))
    (map-get? users user))

(define-read-only (get-skill-info (skill-name (string-ascii 64)))
    (map-get? skills skill-name))

(define-read-only (get-exchange (exchange-id uint))
    (map-get? time-exchanges exchange-id))

(define-read-only (get-contract-owner)
    (ok CONTRACT_OWNER))

(define-read-only (get-event (event-id uint))
    (map-get? event-log event-id))
