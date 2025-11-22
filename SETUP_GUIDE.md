# TimeBank Protocol - Complete Setup Guide

This guide provides step-by-step instructions to set up and run the TimeBank decentralized time banking protocol, including both the smart contract and frontend application.

## 🚀 Quick Start

### Contract Information
- **Deployed Contract**: `ST3A5HQKQM3T3BV1MCZ45S6Q729V8355BQ0W0NP2V.time-bank-core`
- **Network**: Stacks Testnet
- **Transaction ID**: `0xe03888b09de7bc3c5f14c882ab4981d287b36ed24bad1047f8d565eb47848aa9`

## 📋 Prerequisites

Before starting, ensure you have:

- **Node.js 18+** and npm installed
- **Git** for version control
- **Stacks Wallet** (Hiro Wallet recommended)
- **Testnet STX tokens** for testing

## 🛠️ Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/gboigwe/time-banking-protocol.git
cd time-banking-protocol
```

### 2. Backend Setup (Smart Contract)

The smart contract is already deployed on testnet, but you can explore it:

```bash
cd time-banking
npm install
```

**To run tests:**
```bash
clarinet test
```

**To check deployment:**
```bash
clarinet deployments apply --devnet
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

**Start the development server:**
```bash
npm run dev
```

**Open your browser:**
Navigate to `http://localhost:3000`

## 🔧 Configuration

### Wallet Setup

1. **Install Hiro Wallet**
   - Go to [Hiro Wallet](https://wallet.hiro.so/)
   - Install the browser extension
   - Create a new wallet or import existing

2. **Get Testnet STX**
   - Visit [Stacks Testnet Faucet](https://explorer.hiro.so/sandbox/faucet)
   - Enter your testnet address
   - Request testnet STX tokens

## 🎯 Using the Application

### Getting Started

1. **Connect Your Wallet**
   - Click "Connect Wallet" on the landing page
   - Approve the connection in your wallet

2. **Register as a User**
   - Once connected, the app will prompt you to register
   - You'll receive 10 initial time credits

3. **Explore Features**
   - **Dashboard**: View your profile and activity
   - **Marketplace**: Browse available service providers
   - **Exchanges**: Create and manage time exchanges
   - **Skills**: Register and verify your skills

### Core Features

#### 🏠 Landing Page
- Introduction to TimeBank protocol
- Feature highlights and benefits
- Statistics and user testimonials
- Wallet connection interface

#### 📊 Dashboard
- Personal profile overview
- Time balance and transaction history
- Recent exchange activity
- Quick action buttons
- Activity feed and notifications

#### 🛒 Marketplace
- Browse service providers
- Advanced search and filtering
- Skill category navigation
- Provider profiles with ratings
- Request services directly

#### ⏰ Exchange Management
- Create new exchange requests
- Accept incoming requests
- Track exchange progress
- Complete exchanges and provide feedback

#### 🎯 Skill Management
- Register new skills
- Skill verification system
- Portfolio management
- Expertise ratings and reviews

## 🏗️ Architecture Overview

### Smart Contract Layer
- **Language**: Clarity
- **Blockchain**: Stacks
- **Features**: User management, skill verification, time exchanges, reputation system

### Frontend Layer
- **Framework**: Next.js 14 with React 18
- **Styling**: Tailwind CSS with custom components
- **Animations**: Framer Motion
- **State Management**: React Context API
- **Blockchain Integration**: Stacks.js SDK

### Key Components

```
TimeBank Protocol
├── Smart Contract (time-bank-core.clar)
│   ├── User Management
│   ├── Skill Registration & Verification
│   ├── Time Exchange System
│   ├── Credit Management
│   └── Reputation Tracking
│
└── Frontend Application
    ├── Landing Page
    ├── Dashboard
    ├── Marketplace
    ├── Exchange Management
    ├── Skill Management
    └── User Profile
```

## 📱 User Journey

### For Service Providers

1. **Register** and connect wallet
2. **Add skills** to your profile
3. **Get skills verified** by experts
4. **Create exchanges** to offer services
5. **Complete exchanges** and build reputation

### For Service Seekers

1. **Register** and receive initial credits
2. **Browse marketplace** for providers
3. **Request services** from providers
4. **Accept exchanges** and pay with time credits
5. **Rate providers** after completion

## 🔐 Security Features

- **Wallet Integration**: Secure connection with Stacks wallets
- **Smart Contract Security**: Immutable logic on blockchain
- **Input Validation**: Comprehensive parameter checking
- **Error Handling**: Graceful error recovery
- **Access Control**: Role-based permissions

## 🧪 Testing

### Smart Contract Tests
```bash
cd time-banking
clarinet test
```

### Frontend Development
```bash
cd frontend
npm run dev
npm run build
npm run type-check
npm run lint
```

## 📈 Production Deployment

### Alternative Deployment Platforms
- Netlify
- AWS Amplify
- Digital Ocean App Platform
- Railway

## 📊 Monitoring & Analytics

### Blockchain Analytics
- Transaction history on Stacks Explorer
- Contract interaction metrics
- User adoption tracking

### Frontend Analytics
- User engagement metrics
- Performance monitoring
- Error tracking and reporting

## 🔄 Development Workflow

### Smart Contract Development
```bash
# Test contracts
clarinet test

# Check syntax
clarinet check

# Deploy to devnet
clarinet deployments apply --devnet
```

### Frontend Development
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run type checking
npm run type-check

# Run linting
npm run lint
```

## 🚀 Future Enhancements

### Planned Features
- **Mobile App**: Native iOS and Android applications
- **Advanced Analytics**: Detailed insights and reporting
- **Multi-language Support**: Internationalization
- **Integration APIs**: Third-party service integrations
- **Governance Features**: Community voting and proposals

### Technical Improvements
- **Performance Optimization**: Faster loading and interactions
- **Enhanced Security**: Additional security measures
- **Scalability**: Support for more users and transactions
- **User Experience**: Improved UI/UX based on feedback

## 📞 Support & Community

### Getting Help
- **GitHub Issues**: Report bugs and request features
- **Discord**: Join our community for real-time support
- **Documentation**: Comprehensive guides and tutorials
- **Email Support**: Direct support for critical issues

### Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request
5. Participate in code review

## 📄 License

This project is licensed under the MIT License. See the LICENSE file for details.

---

**Built with ❤️ on Stacks blockchain**
