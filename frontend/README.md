# TimeBank Frontend

A sophisticated React/Next.js frontend for the TimeBank decentralized time banking protocol built on Stacks blockchain.

## Features

- 🔐 **Wallet Integration**: Connect with Stacks wallets (Hiro, Xverse)
- 💼 **Skill Marketplace**: Browse and discover skilled professionals
- ⏰ **Time Exchange**: Create, manage, and complete time-based service exchanges
- 🎯 **Reputation System**: Track and display user reputation and ratings
- 📊 **Dashboard**: Comprehensive overview of user activity and stats
- 🔍 **Advanced Search**: Filter and search providers by skills, ratings, and more
- 📱 **Responsive Design**: Optimized for desktop, tablet, and mobile
- 🎨 **Modern UI**: Clean, accessible design with smooth animations

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

## Contract Integration

The frontend integrates with the TimeBank smart contract deployed on Stacks testnet:

- **Contract Address**: `ST3A5HQKQM3T3BV1MCZ45S6Q729V8355BQ0W0NP2V`
- **Contract Name**: `time-bank-core`
- **Transaction ID**: `0xe03888b09de7bc3c5f14c882ab4981d287b36ed24bad1047f8d565eb47848aa9`

### Key Contract Functions

- `register-user`: Register a new user account
- `create-exchange`: Create a new time exchange request
- `accept-exchange`: Accept an exchange request
- `complete-exchange`: Mark exchange as completed
- `register-skill`: Register a new skill
- `verify-user-skill`: Verify a user's skill

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