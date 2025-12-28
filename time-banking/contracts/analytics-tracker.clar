;; Analytics Tracker Contract (Clarity 4)
;; On-chain metrics and aggregation
;; Uses stacks-block-time for time-series data

;; constants
(define-constant CONTRACT_OWNER tx-sender)
(define-constant ERR_UNAUTHORIZED (err u11001))

;; data vars
(define-data-var total-exchanges uint u0)
(define-data-var total-volume uint u0)
(define-data-var total-users uint u0)

;; data maps
(define-map daily-metrics
    uint
    {
        exchanges: uint,
        volume: uint,
        active-users: uint,
        recorded-at: uint
    })

(define-map skill-metrics
    uint
    {
        total-exchanges: uint,
        total-volume: uint,
        average-rate: uint,
        popularity: uint
    })

(define-map user-activity
    { user: principal, day: uint }
    {
        exchanges-count: uint,
        volume-given: uint,
        volume-received: uint,
        last-activity: uint
    })

;; public functions
(define-public (record-exchange
    (skill-id uint)
    (provider principal)
    (receiver principal)
    (amount uint))
    (begin
        (let ((day (get-current-day)))
            (update-daily-metrics day amount)
            (update-skill-metrics skill-id amount)
            (update-user-activity provider day amount true)
            (update-user-activity receiver day amount false))
        (var-set total-exchanges (+ (var-get total-exchanges) u1))
        (var-set total-volume (+ (var-get total-volume) amount))
        (ok true)))

;; read only functions
(define-read-only (get-daily-metrics (day uint))
    (ok (map-get? daily-metrics day)))

(define-read-only (get-skill-metrics (skill-id uint))
    (ok (map-get? skill-metrics skill-id)))

(define-read-only (get-user-activity (user principal) (day uint))
    (ok (map-get? user-activity { user: user, day: day })))

(define-read-only (get-total-stats)
    (ok {
        total-exchanges: (var-get total-exchanges),
        total-volume: (var-get total-volume),
        total-users: (var-get total-users)
    }))

;; private functions
(define-private (get-current-day)
    (/ stacks-block-time u86400))

(define-private (update-daily-metrics (day uint) (amount uint))
    (let ((metrics (default-to
        { exchanges: u0, volume: u0, active-users: u0, recorded-at: stacks-block-time }
        (map-get? daily-metrics day))))
        (map-set daily-metrics day {
            exchanges: (+ (get exchanges metrics) u1),
            volume: (+ (get volume metrics) amount),
            active-users: (get active-users metrics),
            recorded-at: stacks-block-time
        })))

(define-private (update-skill-metrics (skill-id uint) (amount uint))
    (let ((metrics (default-to
        { total-exchanges: u0, total-volume: u0, average-rate: u0, popularity: u0 }
        (map-get? skill-metrics skill-id))))
        (map-set skill-metrics skill-id {
            total-exchanges: (+ (get total-exchanges metrics) u1),
            total-volume: (+ (get total-volume metrics) amount),
            average-rate: (/ (+ (get total-volume metrics) amount) (+ (get total-exchanges metrics) u1)),
            popularity: (+ (get popularity metrics) u1)
        })))

(define-private (update-user-activity (user principal) (day uint) (amount uint) (is-provider bool))
    (let ((activity (default-to
        { exchanges-count: u0, volume-given: u0, volume-received: u0, last-activity: stacks-block-time }
        (map-get? user-activity { user: user, day: day }))))
        (map-set user-activity { user: user, day: day } {
            exchanges-count: (+ (get exchanges-count activity) u1),
            volume-given: (if is-provider (+ (get volume-given activity) amount) (get volume-given activity)),
            volume-received: (if is-provider (get volume-received activity) (+ (get volume-received activity) amount)),
            last-activity: stacks-block-time
        })))
