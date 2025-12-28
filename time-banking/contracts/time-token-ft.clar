;; Time Token Fungible Token (Clarity 4)
;; SIP-010 compliant fungible token for tradeable time credits
;; Uses stacks-block-time for staking reward calculations

;; traits
(impl-trait 'SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE.sip-010-trait-ft-standard.sip-010-trait)

;; token definitions
(define-fungible-token time-token)

;; constants
(define-constant CONTRACT_OWNER tx-sender)
(define-constant ERR_UNAUTHORIZED (err u3001))
(define-constant ERR_INSUFFICIENT_BALANCE (err u3002))
(define-constant ERR_INVALID_AMOUNT (err u3003))

(define-constant TOKEN_NAME "Time Token")
(define-constant TOKEN_SYMBOL "TIME")
(define-constant TOKEN_DECIMALS u6)
(define-constant MICRO_TIME_PER_HOUR u1000000)

;; data vars
(define-data-var total-supply uint u0)
(define-data-var staking-enabled bool true)
(define-data-var min-stake-amount uint u10000000)

;; data maps
(define-map stakes
    principal
    {
        amount: uint,
        staked-at: uint,
        last-reward-claim: uint,
        total-rewards: uint
    })

(define-map allowances
    { owner: principal, spender: principal }
    uint)

;; public functions
(define-public (transfer (amount uint) (sender principal) (recipient principal) (memo (optional (buff 34))))
    (begin
        (asserts! (or (is-eq tx-sender sender) (>= (get-allowance-or-default sender tx-sender) amount)) ERR_UNAUTHORIZED)
        (asserts! (> amount u0) ERR_INVALID_AMOUNT)
        (try! (ft-transfer? time-token amount sender recipient))
        (match memo m (print m) 0x)
        (ok true)))

(define-public (get-name)
    (ok TOKEN_NAME))

(define-public (get-symbol)
    (ok TOKEN_SYMBOL))

(define-public (get-decimals)
    (ok TOKEN_DECIMALS))

(define-public (get-balance (account principal))
    (ok (ft-get-balance time-token account)))

(define-public (get-total-supply)
    (ok (ft-get-supply time-token)))

(define-public (get-token-uri)
    (ok (some "https://timebank.io/tokens/time-token")))

(define-public (mint (recipient principal) (amount uint))
    (begin
        (asserts! (is-eq tx-sender CONTRACT_OWNER) ERR_UNAUTHORIZED)
        (asserts! (> amount u0) ERR_INVALID_AMOUNT)
        (try! (ft-mint? time-token amount recipient))
        (ok true)))

(define-public (burn (amount uint))
    (begin
        (asserts! (> amount u0) ERR_INVALID_AMOUNT)
        (try! (ft-burn? time-token amount tx-sender))
        (ok true)))

(define-public (stake (amount uint))
    (begin
        (asserts! (var-get staking-enabled) ERR_UNAUTHORIZED)
        (asserts! (>= amount (var-get min-stake-amount)) ERR_INVALID_AMOUNT)
        (let ((current-stake (default-to
            { amount: u0, staked-at: u0, last-reward-claim: u0, total-rewards: u0 }
            (map-get? stakes tx-sender))))
            (try! (ft-transfer? time-token amount tx-sender (as-contract tx-sender)))
            (map-set stakes tx-sender {
                amount: (+ (get amount current-stake) amount),
                staked-at: stacks-block-time,
                last-reward-claim: stacks-block-time,
                total-rewards: (get total-rewards current-stake)
            }))
        (ok true)))

(define-public (unstake (amount uint))
    (let ((stake-data (unwrap! (map-get? stakes tx-sender) ERR_UNAUTHORIZED)))
        (asserts! (>= (get amount stake-data) amount) ERR_INSUFFICIENT_BALANCE)
        (try! (as-contract (ft-transfer? time-token amount tx-sender tx-sender)))
        (if (is-eq (get amount stake-data) amount)
            (map-delete stakes tx-sender)
            (map-set stakes tx-sender (merge stake-data {
                amount: (- (get amount stake-data) amount)
            })))
        (ok true)))

(define-public (approve (spender principal) (amount uint))
    (begin
        (map-set allowances { owner: tx-sender, spender: spender } amount)
        (ok true)))

;; read only functions
(define-read-only (get-allowance (owner principal) (spender principal))
    (ok (get-allowance-or-default owner spender)))

(define-read-only (get-stake-info (staker principal))
    (ok (map-get? stakes staker)))

;; private functions
(define-private (get-allowance-or-default (owner principal) (spender principal))
    (default-to u0 (map-get? allowances { owner: owner, spender: spender })))
