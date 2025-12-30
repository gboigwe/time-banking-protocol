;; Time Banking Protocol - Core Contract (Clarity 4)
;; Manages user registration, time credit balances, and core banking functionality
;; Refactored to use Clarity 4 features: stacks-block-time, improved type safety

;; Constants and Error Codes
(define-constant CONTRACT_OWNER tx-sender)
(define-constant ERR_UNAUTHORIZED (err u1001))
(define-constant ERR_INVALID_TIME (err u1002))
(define-constant ERR_INSUFFICIENT_BALANCE (err u1003))
(define-constant ERR_INVALID_PARAMS (err u1005))
(define-constant ERR_ALREADY_REGISTERED (err u1006))
(define-constant ERR_NOT_FOUND (err u1007))
(define-constant ERR_INSUFFICIENT_CREDITS (err u1010))
(define-constant ERR_SELF_TRANSFER (err u1011))
(define-constant ERR_USER_INACTIVE (err u1012))

;; Configuration Constants
(define-constant INITIAL_CREDITS u10) ;; New users get 10 hours of credits to start
(define-constant MAX_MINT_AMOUNT u1000) ;; Maximum credits that can be minted at once
(define-constant MIN_CREDIT_AMOUNT u1) ;; Minimum credit transfer amount

;; Data Structures using Clarity 4 best practices
(define-map users
    principal
    {
        joined-at: uint,              ;; Uses stacks-block-time
        total-hours-given: uint,
        total-hours-received: uint,
        reputation-score: uint,
        is-active: bool,
        last-activity: uint           ;; Track last activity time
    })

;; Time Credit Balances - Core of the time banking economy
(define-map time-balances
    principal
    uint) ;; Available time credits in hours

;; Variables
(define-data-var total-users uint u0)
(define-data-var total-credits-circulating uint u0)
(define-data-var min-transfer-amount uint u1)
(define-data-var protocol-paused bool false)

;; Events using native print for Clarity 4
(define-private (emit-user-registered (user principal) (credits uint))
    (print {
        event: "user-registered",
        user: user,
        initial-credits: credits,
        timestamp: stacks-block-time
    }))

(define-private (emit-credits-transferred (from principal) (to principal) (amount uint))
    (print {
        event: "credits-transferred",
        from: from,
        to: to,
        amount: amount,
        timestamp: stacks-block-time
    }))

(define-private (emit-credits-minted (recipient principal) (amount uint))
    (print {
        event: "credits-minted",
        recipient: recipient,
        amount: amount,
        timestamp: stacks-block-time
    }))

(define-private (emit-user-deactivated (user principal))
    (print {
        event: "user-deactivated",
        user: user,
        timestamp: stacks-block-time
    }))

;; Credit Management Functions
(define-read-only (get-balance (user principal))
    (default-to u0 (map-get? time-balances user)))

(define-private (add-credits-internal (user principal) (amount uint))
    (let ((current-balance (get-balance user)))
        (map-set time-balances user (+ current-balance amount))
        (var-set total-credits-circulating (+ (var-get total-credits-circulating) amount))
        true))

(define-private (deduct-credits-internal (user principal) (amount uint))
    (let ((current-balance (get-balance user)))
        (asserts! (>= current-balance amount) ERR_INSUFFICIENT_CREDITS)
        (map-set time-balances user (- current-balance amount))
        (var-set total-credits-circulating (- (var-get total-credits-circulating) amount))
        (ok true)))

;; Public function to transfer credits between users
(define-public (transfer-credits (to principal) (amount uint))
    (begin
        (asserts! (not (var-get protocol-paused)) ERR_UNAUTHORIZED)
        (asserts! (not (is-eq tx-sender to)) ERR_SELF_TRANSFER)
        (asserts! (>= amount (var-get min-transfer-amount)) ERR_INVALID_PARAMS)
        (asserts! (is-some (map-get? users tx-sender)) ERR_NOT_FOUND)
        (asserts! (is-some (map-get? users to)) ERR_NOT_FOUND)

        ;; Check both users are active
        (asserts! (get is-active (unwrap! (map-get? users tx-sender) ERR_NOT_FOUND)) ERR_USER_INACTIVE)
        (asserts! (get is-active (unwrap! (map-get? users to) ERR_NOT_FOUND)) ERR_USER_INACTIVE)

        ;; Perform the transfer
        (try! (deduct-credits-internal tx-sender amount))
        (add-credits-internal to amount)

        ;; Update activity timestamps
        (try! (update-last-activity tx-sender))
        (try! (update-last-activity to))

        (emit-credits-transferred tx-sender to amount)
        (ok true)))

;; Bulk Operations

;; Bulk transfer credits to multiple recipients (up to 10 transfers per transaction)
(define-private (transfer-single (recipient-data {to: principal, amount: uint}))
    (let (
        (to (get to recipient-data))
        (amount (get amount recipient-data))
    )
        ;; Validate recipient exists and is active
        (asserts! (is-some (map-get? users to)) ERR_NOT_FOUND)
        (asserts! (get is-active (unwrap! (map-get? users to) ERR_NOT_FOUND)) ERR_USER_INACTIVE)
        (asserts! (not (is-eq tx-sender to)) ERR_SELF_TRANSFER)
        (asserts! (>= amount (var-get min-transfer-amount)) ERR_INVALID_PARAMS)

        ;; Perform the transfer
        (try! (deduct-credits-internal tx-sender amount))
        (add-credits-internal to amount)

        ;; Update activity timestamps
        (try! (update-last-activity to))

        ;; Return transfer details
        (ok {
            recipient: to,
            amount: amount,
            timestamp: stacks-block-time
        })
    )
)

(define-public (bulk-transfer-credits (transfers (list 10 {to: principal, amount: uint})))
    (let (
        (total-amount u0)
        (transfer-count (len transfers))
    )
        (asserts! (not (var-get protocol-paused)) ERR_UNAUTHORIZED)
        (asserts! (> transfer-count u0) ERR_INVALID_PARAMS)
        (asserts! (is-some (map-get? users tx-sender)) ERR_NOT_FOUND)
        (asserts! (get is-active (unwrap! (map-get? users tx-sender) ERR_NOT_FOUND)) ERR_USER_INACTIVE)

        ;; Calculate total amount needed
        (let ((calculated-total (fold calculate-total-amount transfers u0)))
            (asserts! (>= (get-balance tx-sender) calculated-total) ERR_INSUFFICIENT_BALANCE)

            ;; Process all transfers - each will validate individually
            (let ((results (map transfer-single transfers)))
                ;; Update sender's activity timestamp once for all transfers
                (try! (update-last-activity tx-sender))

                (print {
                    event: "bulk-credits-transferred",
                    sender: tx-sender,
                    total-transfers: transfer-count,
                    total-amount: calculated-total,
                    timestamp: stacks-block-time
                })

                (ok {
                    total-transfers: transfer-count,
                    total-amount: calculated-total,
                    results: results
                })
            )
        )
    )
)

;; Helper function to calculate total amount from transfer list
(define-private (calculate-total-amount (transfer {to: principal, amount: uint}) (acc uint))
    (+ acc (get amount transfer))
)

;; Bulk credit distribution for rewards/referrals (admin only)
(define-public (bulk-distribute-credits (distributions (list 20 {recipient: principal, amount: uint})))
    (begin
        (asserts! (is-eq tx-sender CONTRACT_OWNER) ERR_UNAUTHORIZED)
        (asserts! (not (var-get protocol-paused)) ERR_UNAUTHORIZED)
        (asserts! (> (len distributions) u0) ERR_INVALID_PARAMS)

        ;; Process distributions
        (let ((results (map distribute-single distributions)))
            (print {
                event: "bulk-credits-distributed",
                distributor: tx-sender,
                total-distributions: (len distributions),
                timestamp: stacks-block-time
            })
            (ok results)
        )
    )
)

(define-private (distribute-single (distribution {recipient: principal, amount: uint}))
    (let (
        (recipient (get recipient distribution))
        (amount (get amount distribution))
    )
        ;; Validate recipient exists
        (asserts! (is-some (map-get? users recipient)) ERR_NOT_FOUND)
        (asserts! (> amount u0) ERR_INVALID_PARAMS)
        (asserts! (<= amount MAX_MINT_AMOUNT) ERR_INVALID_PARAMS)

        ;; Add credits to recipient
        (add-credits-internal recipient amount)

        ;; Update activity
        (try! (update-last-activity recipient))

        (emit-credits-minted recipient amount)

        ;; Return distribution details
        (ok {
            recipient: recipient,
            amount: amount,
            timestamp: stacks-block-time
        })
    )
)

;; Update user's last activity timestamp
(define-private (update-last-activity (user principal))
    (let ((user-data (unwrap! (map-get? users user) ERR_NOT_FOUND)))
        (map-set users user (merge user-data {
            last-activity: stacks-block-time
        }))
        (ok true)))

;; Administrative Functions
(define-public (set-min-transfer-amount (amount uint))
    (begin
        (asserts! (is-eq tx-sender CONTRACT_OWNER) ERR_UNAUTHORIZED)
        (asserts! (>= amount MIN_CREDIT_AMOUNT) ERR_INVALID_PARAMS)
        (var-set min-transfer-amount amount)
        (print {event: "config-updated", parameter: "min-transfer-amount", value: amount})
        (ok true)))

(define-public (toggle-protocol-pause)
    (begin
        (asserts! (is-eq tx-sender CONTRACT_OWNER) ERR_UNAUTHORIZED)
        (var-set protocol-paused (not (var-get protocol-paused)))
        (print {event: "protocol-pause-toggled", paused: (var-get protocol-paused)})
        (ok true)))

;; Emergency credit functions (admin only)
(define-public (mint-credits (user principal) (amount uint))
    (begin
        (asserts! (is-eq tx-sender CONTRACT_OWNER) ERR_UNAUTHORIZED)
        (asserts! (not (var-get protocol-paused)) ERR_UNAUTHORIZED)
        (asserts! (is-some (map-get? users user)) ERR_NOT_FOUND)
        (asserts! (and (> amount u0) (<= amount MAX_MINT_AMOUNT)) ERR_INVALID_PARAMS)

        (add-credits-internal user amount)
        (emit-credits-minted user amount)
        (ok true)))

(define-public (burn-credits (user principal) (amount uint))
    (begin
        (asserts! (is-eq tx-sender CONTRACT_OWNER) ERR_UNAUTHORIZED)
        (asserts! (is-some (map-get? users user)) ERR_NOT_FOUND)
        (asserts! (> amount u0) ERR_INVALID_PARAMS)

        (try! (deduct-credits-internal user amount))
        (print {event: "credits-burned", user: user, amount: amount})
        (ok true)))

;; User Management
(define-public (register-user)
    (begin
        (asserts! (not (var-get protocol-paused)) ERR_UNAUTHORIZED)
        (asserts! (is-none (map-get? users tx-sender)) ERR_ALREADY_REGISTERED)

        ;; Create user profile with stacks-block-time
        (map-set users tx-sender {
            joined-at: stacks-block-time,
            total-hours-given: u0,
            total-hours-received: u0,
            reputation-score: u0,
            is-active: true,
            last-activity: stacks-block-time
        })

        ;; Give new users initial credits to participate in the economy
        (add-credits-internal tx-sender INITIAL_CREDITS)

        ;; Increment total users
        (var-set total-users (+ (var-get total-users) u1))

        (emit-user-registered tx-sender INITIAL_CREDITS)
        (ok true)))

(define-public (deactivate-user)
    (let ((user-data (unwrap! (map-get? users tx-sender) ERR_NOT_FOUND)))
        (asserts! (get is-active user-data) ERR_USER_INACTIVE)

        (map-set users tx-sender (merge user-data {
            is-active: false,
            last-activity: stacks-block-time
        }))

        (emit-user-deactivated tx-sender)
        (ok true)))

(define-public (reactivate-user)
    (let ((user-data (unwrap! (map-get? users tx-sender) ERR_NOT_FOUND)))
        (asserts! (not (get is-active user-data)) ERR_ALREADY_REGISTERED)

        (map-set users tx-sender (merge user-data {
            is-active: true,
            last-activity: stacks-block-time
        }))

        (print {event: "user-reactivated", user: tx-sender, timestamp: stacks-block-time})
        (ok true)))

;; Update user statistics (called by exchange contracts)
(define-public (update-user-stats (provider principal) (receiver principal) (hours uint))
    (let (
        (provider-data (unwrap! (map-get? users provider) ERR_NOT_FOUND))
        (receiver-data (unwrap! (map-get? users receiver) ERR_NOT_FOUND))
    )
        (map-set users provider (merge provider-data {
            total-hours-given: (+ (get total-hours-given provider-data) hours),
            last-activity: stacks-block-time
        }))
        (map-set users receiver (merge receiver-data {
            total-hours-received: (+ (get total-hours-received receiver-data) hours),
            last-activity: stacks-block-time
        }))
        (ok true)))

(define-public (update-reputation (user principal) (score-delta int))
    (let ((user-data (unwrap! (map-get? users user) ERR_NOT_FOUND)))
        (let ((current-score (to-int (get reputation-score user-data)))
              (new-score-int (+ current-score score-delta)))
            (asserts! (>= new-score-int 0) ERR_INVALID_PARAMS)
            (map-set users user (merge user-data {
                reputation-score: (to-uint new-score-int)
            }))
            (ok true))))

;; Read-Only Functions
(define-read-only (get-user-info (user principal))
    (map-get? users user))

(define-read-only (get-user-balance (user principal))
    (ok (get-balance user)))

(define-read-only (get-contract-owner)
    (ok CONTRACT_OWNER))

(define-read-only (is-user-active (user principal))
    (match (map-get? users user)
        user-data (ok (get is-active user-data))
        (ok false)))

(define-read-only (can-afford-service (user principal) (hours uint))
    (ok (>= (get-balance user) hours)))

(define-read-only (get-protocol-stats)
    (ok {
        total-users: (var-get total-users),
        total-credits-circulating: (var-get total-credits-circulating),
        initial-credits-per-user: INITIAL_CREDITS,
        min-transfer-amount: (var-get min-transfer-amount),
        protocol-paused: (var-get protocol-paused)
    }))

(define-read-only (get-user-activity-info (user principal))
    (match (map-get? users user)
        user-data (ok {
            last-activity: (get last-activity user-data),
            is-active: (get is-active user-data),
            hours-given: (get total-hours-given user-data),
            hours-received: (get total-hours-received user-data)
        })
        ERR_NOT_FOUND))
