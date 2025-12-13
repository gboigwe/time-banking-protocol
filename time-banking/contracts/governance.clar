;; Governance Contract (Clarity 4)
;; Protocol governance with proposal creation, voting, and execution
;; Uses stacks-block-time for voting periods and timelock

;; Error Codes
(define-constant ERR_UNAUTHORIZED (err u6001))
(define-constant ERR_NOT_FOUND (err u6002))
(define-constant ERR_INVALID_PARAMS (err u6003))
(define-constant ERR_ALREADY_VOTED (err u6004))
(define-constant ERR_VOTING_CLOSED (err u6005))
(define-constant ERR_PROPOSAL_ACTIVE (err u6006))
(define-constant ERR_QUORUM_NOT_MET (err u6007))
(define-constant ERR_INSUFFICIENT_REPUTATION (err u6008))
(define-constant ERR_TIMELOCK_ACTIVE (err u6009))

;; Configuration
(define-constant CONTRACT_OWNER tx-sender)
(define-constant MIN_PROPOSAL_REPUTATION u100)
(define-constant VOTING_PERIOD u604800) ;; 7 days
(define-constant TIMELOCK_PERIOD u172800) ;; 2 days
(define-constant QUORUM_PERCENTAGE u10) ;; 10%
(define-constant EXECUTION_GRACE_PERIOD u86400) ;; 1 day

;; Proposal States
(define-constant STATE_ACTIVE "active")
(define-constant STATE_PASSED "passed")
(define-constant STATE_FAILED "failed")
(define-constant STATE_EXECUTED "executed")
(define-constant STATE_CANCELLED "cancelled")

;; Data Maps
(define-map proposals
    uint
    {
        proposer: principal,
        title: (string-ascii 100),
        description: (string-ascii 500),
        created-at: uint,
        voting-ends-at: uint,
        execution-available-at: uint,
        yes-votes: uint,
        no-votes: uint,
        total-voters: uint,
        state: (string-ascii 20),
        executed-at: (optional uint),
        proposal-type: (string-ascii 50)
    })

(define-map proposal-votes
    {proposal-id: uint, voter: principal}
    {
        vote: bool,
        weight: uint,
        voted-at: uint
    })

(define-map user-voting-power principal uint)

;; Data vars
(define-data-var next-proposal-id uint u1)
(define-data-var total-proposals uint u0)
(define-data-var total-passed-proposals uint u0)
(define-data-var total-active-voters uint u0)
(define-data-var governance-enabled bool true)

;; Events using Clarity 4 stacks-block-time
(define-private (emit-proposal-created (proposal-id uint) (proposer principal) (title (string-ascii 100)))
    (print {
        event: "proposal-created",
        proposal-id: proposal-id,
        proposer: proposer,
        title: title,
        timestamp: stacks-block-time
    }))

(define-private (emit-vote-cast (proposal-id uint) (voter principal) (vote bool) (weight uint))
    (print {
        event: "vote-cast",
        proposal-id: proposal-id,
        voter: voter,
        vote: vote,
        weight: weight,
        timestamp: stacks-block-time
    }))

(define-private (emit-proposal-executed (proposal-id uint))
    (print {
        event: "proposal-executed",
        proposal-id: proposal-id,
        timestamp: stacks-block-time
    }))

;; Helper Functions
(define-private (calculate-quorum (total-voters uint))
    (/ (* total-voters QUORUM_PERCENTAGE) u100))

(define-private (has-quorum (total-voters uint) (yes-votes uint) (no-votes uint))
    (let ((votes-cast (+ yes-votes no-votes))
          (required-quorum (calculate-quorum total-voters)))
        (>= votes-cast required-quorum)))

;; Public Functions
(define-public (create-proposal
    (title (string-ascii 100))
    (description (string-ascii 500))
    (proposal-type (string-ascii 50)))
    (let (
        (proposal-id (var-get next-proposal-id))
        (voting-ends-at (+ stacks-block-time VOTING_PERIOD))
        (execution-available-at (+ voting-ends-at TIMELOCK_PERIOD))
        (proposer-power (default-to u0 (map-get? user-voting-power tx-sender)))
    )
        (asserts! (var-get governance-enabled) ERR_UNAUTHORIZED)
        (asserts! (>= proposer-power MIN_PROPOSAL_REPUTATION) ERR_INSUFFICIENT_REPUTATION)
        (asserts! (> (len title) u0) ERR_INVALID_PARAMS)
        (asserts! (> (len description) u0) ERR_INVALID_PARAMS)

        (map-set proposals proposal-id {
            proposer: tx-sender,
            title: title,
            description: description,
            created-at: stacks-block-time,
            voting-ends-at: voting-ends-at,
            execution-available-at: execution-available-at,
            yes-votes: u0,
            no-votes: u0,
            total-voters: u0,
            state: STATE_ACTIVE,
            executed-at: none,
            proposal-type: proposal-type
        })

        (var-set next-proposal-id (+ proposal-id u1))
        (var-set total-proposals (+ (var-get total-proposals) u1))

        (emit-proposal-created proposal-id tx-sender title)
        (ok proposal-id)))

(define-public (cast-vote (proposal-id uint) (vote bool))
    (let (
        (proposal (unwrap! (map-get? proposals proposal-id) ERR_NOT_FOUND))
        (voter-power (default-to u1 (map-get? user-voting-power tx-sender)))
    )
        (asserts! (var-get governance-enabled) ERR_UNAUTHORIZED)
        (asserts! (is-eq (get state proposal) STATE_ACTIVE) ERR_VOTING_CLOSED)
        (asserts! (< stacks-block-time (get voting-ends-at proposal)) ERR_VOTING_CLOSED)
        (asserts! (is-none (map-get? proposal-votes {proposal-id: proposal-id, voter: tx-sender})) ERR_ALREADY_VOTED)

        (map-set proposal-votes {proposal-id: proposal-id, voter: tx-sender} {
            vote: vote,
            weight: voter-power,
            voted-at: stacks-block-time
        })

        (let (
            (new-yes-votes (if vote (+ (get yes-votes proposal) voter-power) (get yes-votes proposal)))
            (new-no-votes (if vote (get no-votes proposal) (+ (get no-votes proposal) voter-power)))
            (new-total-voters (+ (get total-voters proposal) u1))
        )
            (map-set proposals proposal-id (merge proposal {
                yes-votes: new-yes-votes,
                no-votes: new-no-votes,
                total-voters: new-total-voters
            }))

            (var-set total-active-voters (+ (var-get total-active-voters) u1))
            (emit-vote-cast proposal-id tx-sender vote voter-power)
            (ok true))))

(define-public (finalize-proposal (proposal-id uint))
    (let ((proposal (unwrap! (map-get? proposals proposal-id) ERR_NOT_FOUND)))
        (asserts! (is-eq (get state proposal) STATE_ACTIVE) ERR_PROPOSAL_ACTIVE)
        (asserts! (>= stacks-block-time (get voting-ends-at proposal)) ERR_VOTING_CLOSED)

        (let (
            (yes-votes (get yes-votes proposal))
            (no-votes (get no-votes proposal))
            (total-voters (get total-voters proposal))
            (quorum-met (has-quorum total-voters yes-votes no-votes))
            (new-state (if (and quorum-met (> yes-votes no-votes)) STATE_PASSED STATE_FAILED))
        )
            (map-set proposals proposal-id (merge proposal {state: new-state}))

            (if (is-eq new-state STATE_PASSED)
                (var-set total-passed-proposals (+ (var-get total-passed-proposals) u1))
                true)

            (print {
                event: "proposal-finalized",
                proposal-id: proposal-id,
                state: new-state,
                yes-votes: yes-votes,
                no-votes: no-votes,
                quorum-met: quorum-met,
                timestamp: stacks-block-time
            })
            (ok new-state))))

(define-public (execute-proposal (proposal-id uint))
    (let ((proposal (unwrap! (map-get? proposals proposal-id) ERR_NOT_FOUND)))
        (asserts! (is-eq (get state proposal) STATE_PASSED) ERR_INVALID_PARAMS)
        (asserts! (>= stacks-block-time (get execution-available-at proposal)) ERR_TIMELOCK_ACTIVE)

        (map-set proposals proposal-id (merge proposal {
            state: STATE_EXECUTED,
            executed-at: (some stacks-block-time)
        }))

        (emit-proposal-executed proposal-id)
        (ok true)))

(define-public (cancel-proposal (proposal-id uint))
    (let ((proposal (unwrap! (map-get? proposals proposal-id) ERR_NOT_FOUND)))
        (asserts! (is-eq tx-sender (get proposer proposal)) ERR_UNAUTHORIZED)
        (asserts! (is-eq (get state proposal) STATE_ACTIVE) ERR_INVALID_PARAMS)

        (map-set proposals proposal-id (merge proposal {state: STATE_CANCELLED}))

        (print {event: "proposal-cancelled", proposal-id: proposal-id, timestamp: stacks-block-time})
        (ok true)))

(define-public (set-voting-power (user principal) (power uint))
    (begin
        (asserts! (is-eq tx-sender CONTRACT_OWNER) ERR_UNAUTHORIZED)
        (map-set user-voting-power user power)
        (print {event: "voting-power-updated", user: user, power: power, timestamp: stacks-block-time})
        (ok true)))

(define-public (toggle-governance)
    (begin
        (asserts! (is-eq tx-sender CONTRACT_OWNER) ERR_UNAUTHORIZED)
        (var-set governance-enabled (not (var-get governance-enabled)))
        (print {event: "governance-toggled", enabled: (var-get governance-enabled)})
        (ok true)))

;; Read-Only Functions
(define-read-only (get-proposal (proposal-id uint))
    (map-get? proposals proposal-id))

(define-read-only (get-vote (proposal-id uint) (voter principal))
    (map-get? proposal-votes {proposal-id: proposal-id, voter: voter}))

(define-read-only (get-voting-power (user principal))
    (ok (default-to u0 (map-get? user-voting-power user))))

(define-read-only (can-execute-proposal (proposal-id uint))
    (match (map-get? proposals proposal-id)
        proposal (ok (and
            (is-eq (get state proposal) STATE_PASSED)
            (>= stacks-block-time (get execution-available-at proposal))))
        ERR_NOT_FOUND))

(define-read-only (get-governance-stats)
    (ok {
        total-proposals: (var-get total-proposals),
        total-passed-proposals: (var-get total-passed-proposals),
        total-active-voters: (var-get total-active-voters),
        next-proposal-id: (var-get next-proposal-id),
        governance-enabled: (var-get governance-enabled),
        voting-period: VOTING_PERIOD,
        timelock-period: TIMELOCK_PERIOD,
        quorum-percentage: QUORUM_PERCENTAGE
    }))
