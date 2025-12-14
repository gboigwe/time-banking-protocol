# TimeBank Frontend - Clarity 4 MVP

A complete React/Next.js MVP for the TimeBank decentralized time banking protocol built on Stacks blockchain with Clarity 4 smart contracts.

## Clarity 4 Features

All 7 contracts leverage the latest **Clarity 4** features (SIP-033):

- ⏰ **stacks-block-time**: Unix timestamp-based time tracking for exchanges, escrow, governance
- 🔐 **contract-hash?**: On-chain contract verification in skill-registry
- 📝 **Native print**: Enhanced debugging and event logging across all contracts
- 🔒 **Timelock mechanisms**: Governance proposals and escrow releases with time locks
- 📉 **Time-weighted decay**: Reputation system with automatic decay over time
- 🎁 **Periodic cycles**: Rewards distribution with defined reward periods

## MVP Features

- 🔐 **Wallet Integration**: Hiro, Xverse, Leather + WalletConnect (Reown)
- 💼 **Skill Marketplace**: Browse providers with contract-hash? verified skills
- ⏰ **Time Exchange**: stacks-block-time scheduled exchanges (1-24 hour duration)
- 🎯 **Reputation System**: Time-weighted decay reputation scoring
- 🔒 **Escrow Management**: Time-locked escrows for secure exchanges
- 🎁 **Rewards System**: Periodic reward cycles with tier-based distribution
- 🗳️ **Governance**: Proposals with timelock and voting periods
- 📊 **Dashboard**: Real-time contract data across all 7 contracts
- 📱 **Responsive Design**: Desktop, tablet, mobile optimized
- 🎨 **Modern UI**: Framer Motion animations with Tailwind CSS

## Tech Stack

- **Framework**: Next.js 14 with React 18
- **TypeScript**: Full type safety
- **Styling**: Tailwind CSS with custom components
- **Animations**: Framer Motion
- **Blockchain**: Stacks.js SDK for blockchain interactions
- **State Management**: React Context API
- **Icons**: Heroicons
- **Notifications**: React Hot Toast

## Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Layout.tsx       # Main layout wrapper
│   │   ├── Header.tsx       # Navigation header
│   │   ├── Sidebar.tsx      # Side navigation
│   │   └── LoadingScreen.tsx # Loading animation
│   ├── contexts/            # React contexts
│   │   ├── AppContext.tsx   # Global app state
│   │   └── WalletContext.tsx # Wallet connection state
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utility libraries
│   │   └── stacks.ts        # Stacks blockchain integration
│   ├── pages/               # Next.js pages
│   │   ├── index.tsx        # Landing page
│   │   ├── dashboard.tsx    # User dashboard
│   │   ├── marketplace.tsx  # Service marketplace
│   │   └── _app.tsx         # App wrapper
│   ├── styles/              # Global styles
│   │   └── globals.css      # Tailwind + custom styles
│   └── types/               # TypeScript type definitions
│       └── index.ts         # Shared types
├── public/                  # Static assets
├── package.json             # Dependencies and scripts
├── tailwind.config.js       # Tailwind configuration
├── tsconfig.json            # TypeScript configuration
└── next.config.js           # Next.js configuration
```

## Setup Instructions

### Prerequisites

- Node.js 18+ and npm
- A Stacks wallet (Hiro Wallet recommended)
- Access to Stacks testnet STX tokens

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/gboigwe/time-banking-protocol.git
   cd time-banking-protocol/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   
   The project includes a `.env.local` file with testnet configuration:
   ```env
   NEXT_PUBLIC_STACKS_NETWORK=testnet
   NEXT_PUBLIC_CONTRACT_ADDRESS=ST3A5HQKQM3T3BV1MCZ45S6Q729V8355BQ0W0NP2V
   NEXT_PUBLIC_CONTRACT_NAME=time-bank-core
   NEXT_PUBLIC_STACKS_API_URL=https://api.testnet.hiro.so
   NEXT_PUBLIC_BITCOIN_API_URL=https://blockstream.info/testnet/api
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

### Building for Production

```bash
npm run build
npm start
```

## Deployed Contracts (Testnet)

### Primary Address: `SP3BXJENEWVNCFYGJF75DFS478H1BZJXNZPT84EAD`
- **time-bank-core**: User registration, time balance tracking
- **skill-registry**: Skill registration with contract-hash? verification
- **rewards-distributor**: Periodic reward cycles and distribution

### Secondary Address: `SPD5ETF2HZ921C8RJG2MHPAN7SSP9AYEYD5GSP84`
- **escrow-manager**: Time-locked escrow for exchanges
- **exchange-manager**: stacks-block-time scheduled exchanges
- **governance**: Proposals with timelock and voting
- **reputation-system**: Time-weighted decay reputation

## MVP Pages

### 1. Dashboard (`/dashboard`)
- User time balance, hours given/received, reputation score
- Platform statistics with live contract data
- Register new users on-chain
- Activity feed

### 2. Skills (`/skills`)
- Register skills with category, description, hourly rate
- Verify other users' skills with endorsements
- contract-hash? template verification
- View skill statistics

### 3. Exchanges (`/exchanges`)
- Create exchanges with stacks-block-time scheduling
- Accept, confirm, or cancel exchanges
- Validates time ranges (1-24 hours, future times)
- Exchange statistics

### 4. Reputation (`/reputation`)
- View reputation score with time-weighted decay
- Endorse users in specific categories
- Track endorsements, ratings, flags
- Platform reputation statistics

### 5. Escrow (`/escrow`)
- Create time-locked escrows
- Release escrow after time lock expires
- Raise disputes
- Track active, released, refunded escrows

### 6. Rewards (`/rewards`)
- View current reward period info
- Claim rewards for completed periods
- Contribute to reward pool
- See reward tiers and amounts

### 7. Governance (`/governance`)
- Create proposals with timelock
- Cast votes on proposals
- Execute passed proposals after timelock
- View governance statistics

### 8. Marketplace (`/marketplace`)
- Browse service providers
- Filter by skill, rating, hours
- Request services

## Features Overview

### 🏠 Landing Page
- Hero section with project introduction
- Feature highlights and benefits
- Statistics and social proof
- Call-to-action for wallet connection

### 📊 Dashboard
- User profile overview
- Time balance and statistics
- Recent exchange activity
- Quick action buttons
- Activity feed

### 🛒 Marketplace
- Browse available service providers
- Advanced search and filtering
- Skill category filtering
- Rating and reputation sorting
- Provider profiles with verification badges

### ⏰ Exchange Management
- Create new exchange requests
- View and manage active exchanges
- Exchange history and status tracking
- Completion and feedback system

### 🎯 Skill Management
- Register new skills
- Skill verification system
- Portfolio management
- Expertise ratings

## Development

### Code Style

The project follows these conventions:

- **TypeScript**: Strict type checking enabled
- **ESLint**: Code linting with Next.js and TypeScript rules
- **Prettier**: Code formatting (configured via ESLint)
- **Tailwind CSS**: Utility-first styling with custom components
- **Component Structure**: Functional components with hooks

### Custom Hooks

- `useWallet()`: Wallet connection state and actions
- `useApp()`: Global application state management

### Utility Classes

The project includes custom Tailwind utility classes:

- `.btn-*`: Button variants (primary, secondary, outline, ghost)
- `.card-*`: Card components with header, body, footer
- `.badge-*`: Status badges with color variants
- `.input`: Styled form inputs
- `.loading-*`: Loading states and animations

### State Management

- **WalletContext**: Manages wallet connection, user authentication
- **AppContext**: Global app state, user profile, notifications
- **Local State**: Component-specific state using React hooks

## Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms

The app can be deployed to any platform that supports Next.js:

- Netlify
- AWS Amplify
- Digital Ocean App Platform
- Railway

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is part of the TimeBank protocol and is licensed under the MIT License.

## Support

For support and questions:

- Open an issue on GitHub
- Join our Discord community
- Follow us on Twitter

---

Built with ❤️ for the decentralized future of time banking.