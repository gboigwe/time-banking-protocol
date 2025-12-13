# Time Banking Protocol

![Stacks](https://img.shields.io/badge/Stacks-Blockchain-blue)
![Clarity](https://img.shields.io/badge/Clarity-Smart%20Contracts-brightgreen)
![Status](https://img.shields.io/badge/Status-In%20Development-yellow)

A decentralized time-skill trading platform built on the Stacks blockchain that enables users to exchange expertise and services using time as currency. The platform leverages smart contracts to ensure secure, verifiable skill attestation and automatic time-value tracking.

## Tags
`#stacks` `#blockchain` `#smartcontracts` `#clarity` `#trade` `#gps` `#logistics` `#shipping` `#decentralized` `#dapp` `#bitcoin`

## Overview

Time Banking Protocol revolutionizes how people exchange skills and services by:
- Creating a trustless system for skill verification
- Enabling secure time-based value exchange
- Automating expertise validation and time tracking
- Building a decentralized marketplace for skill trading

## Key Features

### Skill Verification System
- Decentralized skill registration
- Expert-based verification process
- Immutable skill attestations

### Time Banking Mechanism
- Secure time unit tracking
- Smart contract-based exchange
- Automated balance management

### Trust and Reputation
- Blockchain-based reputation system
- Verifiable completion records
- Time-value adjustments based on expertise

## Technical Stack

- **Blockchain**: Stacks (Bitcoin L2)
- **Smart Contracts**: Clarity
- **Frontend**: Next.js + React + TypeScript
- **Wallet Integration**: Reown (WalletConnect) + Stacks Connect
- **Testing**: Clarinet

## Smart Contract Architecture (Clarity 4)

The protocol leverages **Clarity 4** features for enhanced security and functionality:

### Core Contracts (7 Total)

1. **time-bank-core.clar** - Core banking functionality
   - Uses `stacks-block-time` for precise timestamp tracking
   - User registration with initial credit allocation
   - Credit transfer and balance management

2. **skill-registry.clar** - Skill verification system
   - Implements `contract-hash?` for verified skill templates
   - Decentralized skill verification with reputation requirements
   - Badge and tier system for skill providers

3. **exchange-manager.clar** - Exchange lifecycle management
   - `stacks-block-time` for scheduling and deadlines
   - Dual-confirmation system for service completion
   - Integrated review and rating mechanism

4. **reputation-system.clar** - Advanced reputation tracking
   - Time-weighted reputation scoring with `stacks-block-time`
   - Endorsement system with category-based attestations
   - Automatic reputation decay for inactive users

5. **escrow-manager.clar** - Secure credit escrow
   - Time-locked escrow with expiration using `stacks-block-time`
   - Dispute resolution with mediator system
   - Automatic refund for expired escrows

6. **governance.clar** - Protocol governance
   - Proposal creation with timelock using `stacks-block-time`
   - Weighted voting based on reputation
   - Quorum-based decision making

7. **rewards-distributor.clar** - Reward distribution
   - Periodic reward cycles using `stacks-block-time`
   - Tier-based reward calculations
   - Pool contribution and claim tracking

### Clarity 4 Features Implemented

- **stacks-block-time**: Unix timestamp for all time-based operations
- **contract-hash?**: On-chain contract verification for skill templates
- **Native event emissions**: Using `print` for comprehensive logging
- **Enhanced type safety**: Strict optional and response handling
- **Modern patterns**: Follows SIP-033 best practices

## Getting Started

### Prerequisites
- Stacks wallet (Hiro or similar)
- Clarinet for local development
- Node.js and npm (for upcoming frontend)

### Installation

1. Clone the repository
```bash
git clone https://github.com/gboigwe/time-banking-protocol.git
cd time-banking-protocol
```

2. Install frontend dependencies
```bash
cd frontend
npm install
```

3. Configure environment variables
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Reown Project ID:
```env
NEXT_PUBLIC_REOWN_PROJECT_ID=your_project_id_here
```

Get your Project ID from [Reown Dashboard](https://dashboard.reown.com/)

4. Run the development server
```bash
npm run dev
```

## Smart Contract Functions

### Public Functions

- `register-skill`: Register a new skill for verification
- `verify-skill`: Verify a user's skill (verifier only)
- `commit-time`: Commit time units for a specific skill exchange
- `complete-time-exchange`: Mark a time exchange as completed

### Read-Only Functions

- `get-skill-verification`: Check if a skill is verified
- `get-time-balance`: Get a user's time unit balance

## Testing

Run the test suite:
```bash
clarinet test
```

## Contribution Guidelines

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## Security

- All smart contracts are designed with security-first principles
- Time commitments are immutably recorded on the Stacks blockchain
- Skill verifications require multi-party attestation

## Wallet Integration

This project integrates with Stacks wallets using **Reown (formerly WalletConnect)**, providing seamless wallet connectivity across mobile and desktop.

### Supported Wallets

- **Hiro Wallet** (Browser Extension)
- **Xverse Wallet** (Browser Extension, iOS, Android)
- **Any WalletConnect-compatible Stacks wallet** via Reown

### Features

- ✅ Traditional wallet connection (browser extensions)
- ✅ Reown (WalletConnect) integration for mobile wallets
- ✅ QR code scanning for mobile wallet connection
- ✅ Automatic session management
- ✅ Support for 600+ wallets via WalletConnect Network

### Reown Integration Details

The project uses `@stacks/connect v8.2.2` with built-in Reown support:

```typescript
// Connect with any Stacks wallet
import { connectWallet } from '@/lib/stacks';
connectWallet();

// Connect specifically via Reown (WalletConnect)
import { connectViaReown } from '@/lib/stacks';
connectViaReown();
```

The integration follows the **SIP-030 standard** and **WBIPs (Wallet Bitcoin Improvement Proposals)** for optimal compatibility.

## Roadmap

- [x] Core smart contract development
- [x] Frontend interface development
- [x] Reown (WalletConnect) integration
- [ ] Skill marketplace implementation
- [ ] Mobile-optimized UI
- [ ] Stacking (yield) integration

## Contact

For questions and support, please open an issue in the GitHub repository.

## Acknowledgments

- Stacks Foundation
- Bitcoin community
- Time banking pioneers

---
Built with ❤️ on Stacks
