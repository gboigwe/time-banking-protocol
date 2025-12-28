;; Automation Scheduler Contract (Clarity 4)
;; Recurring exchanges and subscription management
;; Uses stacks-block-time for scheduling

;; constants
(define-constant CONTRACT_OWNER tx-sender)
(define-constant ERR_UNAUTHORIZED (err u6001))
(define-constant ERR_NOT_FOUND (err u6002))
(define-constant ERR_INVALID_SCHEDULE (err u6003))

(define-constant TYPE_RECURRING u1)
(define-constant TYPE_SUBSCRIPTION u2)

;; data vars
(define-data-var schedule-counter uint u0)

;; data maps
(define-map schedules
    uint
    {
        owner: principal,
        schedule-type: uint,
        interval: uint,
        next-execution: uint,
        execution-count: uint,
        is-active: bool,
        recipient: principal,
        amount: uint
    })

;; public functions
(define-public (create-schedule
    (recipient principal)
    (amount uint)
    (interval uint)
    (schedule-type uint))
    (let ((schedule-id (+ (var-get schedule-counter) u1)))
        (asserts! (> interval u0) ERR_INVALID_SCHEDULE)
        (map-set schedules schedule-id {
            owner: tx-sender,
            schedule-type: schedule-type,
            interval: interval,
            next-execution: (+ stacks-block-time interval),
            execution-count: u0,
            is-active: true,
            recipient: recipient,
            amount: amount
        })
        (var-set schedule-counter schedule-id)
        (ok schedule-id)))

(define-public (execute-schedule (schedule-id uint))
    (let ((schedule (unwrap! (map-get? schedules schedule-id) ERR_NOT_FOUND)))
        (asserts! (get is-active schedule) ERR_INVALID_SCHEDULE)
        (asserts! (>= stacks-block-time (get next-execution schedule)) ERR_INVALID_SCHEDULE)
        (map-set schedules schedule-id (merge schedule {
            next-execution: (+ stacks-block-time (get interval schedule)),
            execution-count: (+ (get execution-count schedule) u1)
        }))
        (ok true)))

(define-public (cancel-schedule (schedule-id uint))
    (let ((schedule (unwrap! (map-get? schedules schedule-id) ERR_NOT_FOUND)))
        (asserts! (is-eq tx-sender (get owner schedule)) ERR_UNAUTHORIZED)
        (map-set schedules schedule-id (merge schedule { is-active: false }))
        (ok true)))

;; read only functions
(define-read-only (get-schedule (schedule-id uint))
    (ok (map-get? schedules schedule-id)))

(define-read-only (is-ready (schedule-id uint))
    (match (map-get? schedules schedule-id)
        schedule (ok (and
            (get is-active schedule)
            (>= stacks-block-time (get next-execution schedule))))
        ERR_NOT_FOUND))
