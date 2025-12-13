;; Skill Registry Contract (Clarity 4)
;; Manages skill registration, verification, and categorization
;; Uses contract-hash? for verified skill templates

;; Error Codes
(define-constant ERR_UNAUTHORIZED (err u2001))
(define-constant ERR_NOT_FOUND (err u2002))
(define-constant ERR_ALREADY_EXISTS (err u2003))
(define-constant ERR_INVALID_PARAMS (err u2004))
(define-constant ERR_INSUFFICIENT_REPUTATION (err u2005))
(define-constant ERR_SELF_VERIFY (err u2007))

;; Configuration
(define-constant CONTRACT_OWNER tx-sender)
(define-constant MIN_VERIFIER_REPUTATION u50)
(define-constant MIN_VERIFICATIONS_REQUIRED u3)

;; Data Maps
(define-map skills
    {user: principal, skill-id: uint}
    {
        skill-name: (string-ascii 50),
        category: (string-ascii 20),
        description: (string-ascii 200),
        registered-at: uint,
        verification-count: uint,
        is-verified: bool,
        hourly-rate: uint,
        total-services-provided: uint
    })

(define-map skill-verifications
    {user: principal, skill-id: uint, verifier: principal}
    {
        verified-at: uint,
        verification-note: (string-ascii 100)
    })

(define-map user-skill-count principal uint)

;; Clarity 4: Store verified skill template hashes using contract-hash?
(define-map verified-skill-templates
    (string-ascii 50)
    {
        template-hash: (buff 32),
        creator: principal,
        approved-at: uint
    })

;; Data vars
(define-data-var next-skill-id uint u1)
(define-data-var total-skills-registered uint u0)
(define-data-var total-verified-skills uint u0)
(define-data-var registration-enabled bool true)

;; Trait for core contract integration
(define-trait time-bank-core-trait
    (
        (get-user-info (principal) (response (optional {
            joined-at: uint,
            total-hours-given: uint,
            total-hours-received: uint,
            reputation-score: uint,
            is-active: bool,
            last-activity: uint
        }) uint))
    ))

;; Events using Clarity 4 stacks-block-time
(define-private (emit-skill-registered (user principal) (skill-id uint) (skill-name (string-ascii 50)))
    (print {
        event: "skill-registered",
        user: user,
        skill-id: skill-id,
        skill-name: skill-name,
        timestamp: stacks-block-time
    }))

(define-private (emit-skill-verified (user principal) (skill-id uint) (verifier principal))
    (print {
        event: "skill-verified",
        user: user,
        skill-id: skill-id,
        verifier: verifier,
        timestamp: stacks-block-time
    }))

(define-private (emit-template-approved (template-name (string-ascii 50)) (hash (buff 32)))
    (print {
        event: "template-approved",
        template-name: template-name,
        hash: hash,
        timestamp: stacks-block-time
    }))

;; Helper: Validate skill category
(define-private (is-valid-category (category (string-ascii 20)))
    (or
        (is-eq category "technical")
        (or (is-eq category "creative")
        (or (is-eq category "professional")
        (or (is-eq category "manual")
            (is-eq category "educational"))))))

;; Public Functions
(define-public (register-skill
    (skill-name (string-ascii 50))
    (category (string-ascii 20))
    (description (string-ascii 200))
    (hourly-rate uint))
    (let (
        (skill-id (var-get next-skill-id))
        (user-skills (default-to u0 (map-get? user-skill-count tx-sender)))
    )
        (asserts! (var-get registration-enabled) ERR_UNAUTHORIZED)
        (asserts! (is-valid-category category) ERR_INVALID_PARAMS)
        (asserts! (> (len skill-name) u0) ERR_INVALID_PARAMS)
        (asserts! (> hourly-rate u0) ERR_INVALID_PARAMS)

        (map-set skills {user: tx-sender, skill-id: skill-id} {
            skill-name: skill-name,
            category: category,
            description: description,
            registered-at: stacks-block-time,
            verification-count: u0,
            is-verified: false,
            hourly-rate: hourly-rate,
            total-services-provided: u0
        })

        (map-set user-skill-count tx-sender (+ user-skills u1))
        (var-set next-skill-id (+ skill-id u1))
        (var-set total-skills-registered (+ (var-get total-skills-registered) u1))

        (emit-skill-registered tx-sender skill-id skill-name)
        (ok skill-id)))

(define-public (verify-skill
    (user principal)
    (skill-id uint)
    (verification-note (string-ascii 100))
    (core-contract <time-bank-core-trait>))
    (let (
        (skill-data (unwrap! (map-get? skills {user: user, skill-id: skill-id}) ERR_NOT_FOUND))
        (verifier-info (unwrap! (contract-call? core-contract get-user-info tx-sender) ERR_NOT_FOUND))
        (verifier-data (unwrap! verifier-info ERR_NOT_FOUND))
        (current-verifications (get verification-count skill-data))
    )
        (asserts! (not (is-eq tx-sender user)) ERR_SELF_VERIFY)
        (asserts! (>= (get reputation-score verifier-data) MIN_VERIFIER_REPUTATION) ERR_INSUFFICIENT_REPUTATION)
        (asserts! (is-none (map-get? skill-verifications {user: user, skill-id: skill-id, verifier: tx-sender})) ERR_ALREADY_EXISTS)

        (map-set skill-verifications
            {user: user, skill-id: skill-id, verifier: tx-sender}
            {
                verified-at: stacks-block-time,
                verification-note: verification-note
            })

        (let ((new-count (+ current-verifications u1)))
            (map-set skills {user: user, skill-id: skill-id}
                (merge skill-data {
                    verification-count: new-count,
                    is-verified: (>= new-count MIN_VERIFICATIONS_REQUIRED)
                }))

            (if (is-eq new-count MIN_VERIFICATIONS_REQUIRED)
                (var-set total-verified-skills (+ (var-get total-verified-skills) u1))
                true)

            (emit-skill-verified user skill-id tx-sender)
            (ok true))))

(define-public (update-skill-rate (skill-id uint) (new-rate uint))
    (let ((skill-data (unwrap! (map-get? skills {user: tx-sender, skill-id: skill-id}) ERR_NOT_FOUND)))
        (asserts! (> new-rate u0) ERR_INVALID_PARAMS)
        (map-set skills {user: tx-sender, skill-id: skill-id}
            (merge skill-data {hourly-rate: new-rate}))
        (print {event: "skill-rate-updated", skill-id: skill-id, new-rate: new-rate, timestamp: stacks-block-time})
        (ok true)))

(define-public (increment-service-count (user principal) (skill-id uint))
    (let ((skill-data (unwrap! (map-get? skills {user: user, skill-id: skill-id}) ERR_NOT_FOUND)))
        (map-set skills {user: user, skill-id: skill-id}
            (merge skill-data {
                total-services-provided: (+ (get total-services-provided skill-data) u1)
            }))
        (ok true)))

;; Clarity 4 Feature: Approve verified skill templates using contract-hash?
(define-public (approve-skill-template
    (template-name (string-ascii 50))
    (template-contract principal))
    (let ((template-hash (unwrap! (contract-hash? template-contract) ERR_NOT_FOUND)))
        (asserts! (is-eq tx-sender CONTRACT_OWNER) ERR_UNAUTHORIZED)
        (map-set verified-skill-templates template-name {
            template-hash: template-hash,
            creator: tx-sender,
            approved-at: stacks-block-time
        })
        (emit-template-approved template-name template-hash)
        (ok template-hash)))

(define-public (toggle-registration)
    (begin
        (asserts! (is-eq tx-sender CONTRACT_OWNER) ERR_UNAUTHORIZED)
        (var-set registration-enabled (not (var-get registration-enabled)))
        (print {event: "registration-toggled", enabled: (var-get registration-enabled)})
        (ok true)))

;; Read-Only Functions
(define-read-only (get-skill-info (user principal) (skill-id uint))
    (map-get? skills {user: user, skill-id: skill-id}))

(define-read-only (get-verification-info (user principal) (skill-id uint) (verifier principal))
    (map-get? skill-verifications {user: user, skill-id: skill-id, verifier: verifier}))

(define-read-only (get-user-skill-count (user principal))
    (ok (default-to u0 (map-get? user-skill-count user))))

(define-read-only (is-skill-verified (user principal) (skill-id uint))
    (match (map-get? skills {user: user, skill-id: skill-id})
        skill-data (ok (get is-verified skill-data))
        (ok false)))

(define-read-only (get-skill-hourly-rate (user principal) (skill-id uint))
    (match (map-get? skills {user: user, skill-id: skill-id})
        skill-data (ok (get hourly-rate skill-data))
        ERR_NOT_FOUND))

(define-read-only (get-verified-template (template-name (string-ascii 50)))
    (map-get? verified-skill-templates template-name))

(define-read-only (get-registry-stats)
    (ok {
        total-skills-registered: (var-get total-skills-registered),
        total-verified-skills: (var-get total-verified-skills),
        next-skill-id: (var-get next-skill-id),
        registration-enabled: (var-get registration-enabled),
        min-verifications-required: MIN_VERIFICATIONS_REQUIRED,
        min-verifier-reputation: MIN_VERIFIER_REPUTATION
    }))
