;; Skill Certification NFT Contract (Clarity 4)
;; SIP-009 compliant NFT for verified skill certifications
;; Uses stacks-block-time for expiration tracking

;; traits
(impl-trait 'SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9.nft-trait.nft-trait)

;; token definitions
(define-non-fungible-token skill-certification uint)

;; constants
(define-constant CONTRACT_OWNER tx-sender)
(define-constant ERR_UNAUTHORIZED (err u2001))
(define-constant ERR_NOT_FOUND (err u2002))
(define-constant ERR_ALREADY_CERTIFIED (err u2003))
(define-constant ERR_EXPIRED (err u2004))
(define-constant ERR_INVALID_LEVEL (err u2005))
(define-constant ERR_NOT_OWNER (err u2006))

(define-constant LEVEL_BRONZE u1)
(define-constant LEVEL_SILVER u2)
(define-constant LEVEL_GOLD u3)
(define-constant LEVEL_PLATINUM u4)

(define-constant CERT_DURATION_BRONZE u15552000)
(define-constant CERT_DURATION_SILVER u31104000)
(define-constant CERT_DURATION_GOLD u62208000)
(define-constant CERT_DURATION_PLATINUM u124416000)

;; data vars
(define-data-var last-token-id uint u0)
(define-data-var total-certifications uint u0)

;; data maps
(define-map certification-data
    uint
    {
        skill-id: uint,
        owner: principal,
        level: uint,
        issued-at: uint,
        expires-at: uint,
        verified-by: principal,
        is-active: bool,
        renewal-count: uint
    })

(define-map user-skill-certs
    { owner: principal, skill-id: uint }
    uint)

(define-map verifiers principal bool)

;; public functions
(define-public (get-last-token-id)
    (ok (var-get last-token-id)))

(define-public (get-token-uri (token-id uint))
    (ok (some "https://timebank.io/certifications/")))

(define-public (get-owner (token-id uint))
    (ok (nft-get-owner? skill-certification token-id)))

(define-public (transfer (token-id uint) (sender principal) (recipient principal))
    (begin
        (asserts! (is-eq tx-sender sender) ERR_UNAUTHORIZED)
        (try! (nft-transfer? skill-certification token-id sender recipient))
        (let ((cert-data (unwrap! (map-get? certification-data token-id) ERR_NOT_FOUND)))
            (map-set certification-data token-id (merge cert-data { owner: recipient })))
        (ok true)))

(define-public (issue-certification
    (recipient principal)
    (skill-id uint)
    (level uint))
    (let ((new-token-id (+ (var-get last-token-id) u1)))
        (asserts! (or (is-eq tx-sender CONTRACT_OWNER) (default-to false (map-get? verifiers tx-sender))) ERR_UNAUTHORIZED)
        (asserts! (and (>= level LEVEL_BRONZE) (<= level LEVEL_PLATINUM)) ERR_INVALID_LEVEL)
        (try! (nft-mint? skill-certification new-token-id recipient))
        (map-set certification-data new-token-id {
            skill-id: skill-id,
            owner: recipient,
            level: level,
            issued-at: stacks-block-time,
            expires-at: (+ stacks-block-time (get-duration-for-level level)),
            verified-by: tx-sender,
            is-active: true,
            renewal-count: u0
        })
        (map-set user-skill-certs { owner: recipient, skill-id: skill-id } new-token-id)
        (var-set last-token-id new-token-id)
        (var-set total-certifications (+ (var-get total-certifications) u1))
        (ok new-token-id)))

(define-public (renew-certification (token-id uint))
    (let ((cert-data (unwrap! (map-get? certification-data token-id) ERR_NOT_FOUND)))
        (asserts! (is-eq tx-sender (get owner cert-data)) ERR_NOT_OWNER)
        (map-set certification-data token-id (merge cert-data {
            expires-at: (+ stacks-block-time (get-duration-for-level (get level cert-data))),
            renewal-count: (+ (get renewal-count cert-data) u1)
        }))
        (ok true)))

(define-public (add-verifier (verifier principal))
    (begin
        (asserts! (is-eq tx-sender CONTRACT_OWNER) ERR_UNAUTHORIZED)
        (map-set verifiers verifier true)
        (ok true)))

;; read only functions
(define-read-only (get-certification-info (token-id uint))
    (ok (map-get? certification-data token-id)))

(define-read-only (is-certified (owner principal) (skill-id uint))
    (is-some (get-active-certification owner skill-id)))

(define-read-only (get-active-certification (owner principal) (skill-id uint))
    (match (map-get? user-skill-certs { owner: owner, skill-id: skill-id })
        token-id (let ((cert-data (unwrap-panic (map-get? certification-data token-id))))
            (if (and
                (get is-active cert-data)
                (>= (get expires-at cert-data) stacks-block-time))
                (some cert-data)
                none))
        none))

;; private functions
(define-private (get-duration-for-level (level uint))
    (if (is-eq level LEVEL_BRONZE)
        CERT_DURATION_BRONZE
        (if (is-eq level LEVEL_SILVER)
            CERT_DURATION_SILVER
            (if (is-eq level LEVEL_GOLD)
                CERT_DURATION_GOLD
                CERT_DURATION_PLATINUM))))
