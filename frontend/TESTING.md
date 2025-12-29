# Testing Guide

This guide covers all testing aspects of the Time Banking Protocol frontend application.

## Table of Contents

- [Overview](#overview)
- [Testing Stack](#testing-stack)
- [Running Tests](#running-tests)
- [Test Types](#test-types)
- [Writing Tests](#writing-tests)
- [Best Practices](#best-practices)
- [CI/CD Integration](#cicd-integration)
- [Coverage Requirements](#coverage-requirements)

## Overview

The Time Banking Protocol uses a comprehensive testing strategy with three layers:

1. **Unit & Integration Tests** - Vitest for components, hooks, and utilities
2. **End-to-End Tests** - Playwright for user flows and integration
3. **Contract Tests** - Clarinet for Clarity smart contracts

## Testing Stack

### Unit & Integration Testing

- **Vitest** - Fast unit test framework
- **React Testing Library** - Component testing utilities
- **@testing-library/user-event** - User interaction simulation
- **happy-dom** - Lightweight DOM implementation
- **@vitest/ui** - Interactive test UI
- **@vitest/coverage-v8** - Code coverage reporting

### End-to-End Testing

- **Playwright** - Cross-browser E2E testing
- Supports Chromium, Firefox, WebKit
- Mobile viewport testing
- Screenshot and video capture on failure

### Contract Testing

- **Clarinet** - Clarity smart contract testing framework

## Running Tests

### Unit & Integration Tests

```bash
# Run all unit tests
npm run test

# Run tests in watch mode
npm run test -- --watch

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm run test src/components/Header.test.tsx

# Run tests matching pattern
npm run test -- --grep="wallet"
```

### End-to-End Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui

# Run specific test file
npx playwright test e2e/wallet-connection.spec.ts

# Run tests in specific browser
npx playwright test --project=chromium

# Run tests in headed mode (visible browser)
npx playwright test --headed

# Debug tests
npx playwright test --debug
```

### Contract Tests

```bash
cd ../time-banking
clarinet test
clarinet check
```

### Type Checking

```bash
npm run type-check
```

### Linting

```bash
npm run lint
```

## Test Types

### 1. Component Tests

Test React components in isolation with mocked dependencies.

**Example: Header Component**

```typescript
// src/components/Header.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Header from './Header';

describe('Header Component', () => {
  it('should display TimeBank logo', () => {
    render(<Header />);
    expect(screen.getByText('TimeBank')).toBeInTheDocument();
  });
});
```

**Location**: `src/components/**/*.test.tsx`

### 2. Hook Tests

Test custom React hooks using `renderHook` from Testing Library.

**Example: useWallet Hook**

```typescript
// src/contexts/WalletContext.test.tsx
import { renderHook } from '@testing-library/react';
import { useWallet, WalletProvider } from './WalletContext';

describe('useWallet Hook', () => {
  it('should initialize with disconnected state', () => {
    const { result } = renderHook(() => useWallet(), {
      wrapper: WalletProvider,
    });

    expect(result.current.isConnected).toBe(false);
  });
});
```

**Location**: `src/hooks/**/*.test.ts`, `src/contexts/**/*.test.tsx`

### 3. Integration Tests

Test integration between multiple modules and API routes.

**Example: Chainhook Webhook**

```typescript
// src/pages/api/webhooks/chainhook.test.ts
import handler from './chainhook';

describe('Chainhook Webhook', () => {
  it('should process webhook payload', async () => {
    const req = { method: 'POST', body: mockPayload };
    const res = { status: vi.fn(), json: vi.fn() };

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
  });
});
```

**Location**: `src/pages/api/**/*.test.ts`, `src/lib/**/*.test.ts`

### 4. End-to-End Tests

Test complete user flows across the application.

**Example: Wallet Connection Flow**

```typescript
// e2e/wallet-connection.spec.ts
import { test, expect } from '@playwright/test';

test('should open wallet modal', async ({ page }) => {
  await page.goto('/');
  await page.click('button:has-text("Connect Wallet")');

  await expect(page.getByText('Browser Extension')).toBeVisible();
});
```

**Location**: `e2e/**/*.spec.ts`

## Writing Tests

### Test Structure

Use the **Arrange-Act-Assert** pattern:

```typescript
describe('Feature', () => {
  it('should do something', () => {
    // Arrange - Set up test data and dependencies
    const mockData = { ... };
    const { result } = renderHook(() => useHook());

    // Act - Perform the action being tested
    act(() => {
      result.current.someMethod(mockData);
    });

    // Assert - Verify the expected outcome
    expect(result.current.state).toBe(expected);
  });
});
```

### Mocking Dependencies

#### Mocking Modules

```typescript
vi.mock('@/lib/stacks', () => ({
  userSession: {
    isUserSignedIn: vi.fn(),
    loadUserData: vi.fn(),
  },
  connectWallet: vi.fn(),
}));
```

#### Mocking Contexts

```typescript
const mockWalletContext = {
  isConnected: true,
  address: 'ST1...',
  connect: vi.fn(),
};

vi.mock('@/contexts/WalletContext', () => ({
  useWallet: () => mockWalletContext,
}));
```

#### Mocking Next.js Router

```typescript
vi.mock('next/router', () => ({
  useRouter: () => ({
    pathname: '/dashboard',
    push: vi.fn(),
  }),
}));
```

### Test Utilities

Use shared test utilities from `src/test/utils.tsx`:

```typescript
import {
  renderWithProviders,
  createMockChainhookEvent,
  mockWalletConnection,
} from '@/test/utils';

const event = createMockChainhookEvent({
  txHash: '0x123',
  blockHeight: 100,
});
```

### Async Testing

```typescript
import { waitFor } from '@testing-library/react';

it('should load data', async () => {
  const { result } = renderHook(() => useData());

  await waitFor(() => {
    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeDefined();
  });
});
```

### User Interactions

```typescript
import userEvent from '@testing-library/user-event';

it('should handle button click', async () => {
  const user = userEvent.setup();
  render(<Button onClick={handleClick} />);

  await user.click(screen.getByRole('button'));

  expect(handleClick).toHaveBeenCalled();
});
```

## Best Practices

### 1. Test Behavior, Not Implementation

❌ **Bad**: Testing internal state
```typescript
expect(component.state.count).toBe(5);
```

✅ **Good**: Testing user-visible behavior
```typescript
expect(screen.getByText('5 items')).toBeInTheDocument();
```

### 2. Use Semantic Queries

Prefer accessible queries in this order:

1. `getByRole` - Most accessible
2. `getByLabelText` - Form elements
3. `getByPlaceholderText` - Inputs
4. `getByText` - Non-interactive content
5. `getByTestId` - Last resort

### 3. Avoid Testing Library Implementation Details

❌ **Bad**:
```typescript
expect(wrapper.find('.modal-class')).toHaveLength(1);
```

✅ **Good**:
```typescript
expect(screen.getByRole('dialog')).toBeVisible();
```

### 4. Keep Tests Independent

Each test should be able to run in isolation:

```typescript
beforeEach(() => {
  // Reset mocks and state
  vi.clearAllMocks();
});
```

### 5. Use Descriptive Test Names

❌ **Bad**: `it('works', ...)`

✅ **Good**: `it('should display error message when wallet connection fails', ...)`

### 6. Test Edge Cases

- Empty states
- Loading states
- Error states
- Maximum values
- Invalid inputs

### 7. Mock External Dependencies

Always mock:
- API calls
- WebSocket connections
- Wallet interactions
- Time-dependent functions
- Random number generation

## CI/CD Integration

### GitHub Actions Workflows

#### Test Workflow (`.github/workflows/test.yml`)

Runs on every push and pull request:

- Unit & Integration Tests
- E2E Tests
- Build Check
- Clarity Contract Tests

#### Coverage Workflow (`.github/workflows/coverage.yml`)

Runs on main/master branch:

- Generates coverage reports
- Uploads to Codecov
- Comments on PRs with coverage diff
- Enforces coverage thresholds

### Running Tests Locally Before Commit

```bash
# Run all checks
npm run type-check && npm run lint && npm test && npm run build
```

### Pre-commit Hooks (Recommended)

Create `.husky/pre-commit`:

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npm run type-check
npm run lint
npm test -- --run
```

## Coverage Requirements

### Thresholds

Minimum coverage requirements (enforced in CI):

- **Lines**: 70%
- **Functions**: 70%
- **Branches**: 70%
- **Statements**: 70%

### Viewing Coverage Reports

```bash
# Generate and view coverage
npm run test:coverage

# Open HTML report
open coverage/index.html  # macOS
xdg-open coverage/index.html  # Linux
start coverage/index.html  # Windows
```

### Coverage Configuration

Coverage is configured in `vitest.config.ts`:

```typescript
coverage: {
  provider: 'v8',
  reporter: ['text', 'json', 'html', 'lcov'],
  include: ['src/**/*.{ts,tsx}'],
  exclude: [
    'src/**/*.{test,spec}.{ts,tsx}',
    'src/test/**',
    'src/**/*.d.ts',
  ],
  thresholds: {
    lines: 70,
    functions: 70,
    branches: 70,
    statements: 70,
  },
}
```

## Debugging Tests

### Vitest Debugging

```bash
# Run tests in debug mode
node --inspect-brk ./node_modules/vitest/vitest.mjs run

# Use Vitest UI for interactive debugging
npm run test:ui
```

### Playwright Debugging

```bash
# Debug mode with browser UI
npx playwright test --debug

# Step through tests
npx playwright test --debug e2e/wallet-connection.spec.ts

# Trace viewer for failed tests
npx playwright show-trace trace.zip
```

### VSCode Debugging

Add to `.vscode/launch.json`:

```json
{
  "type": "node",
  "request": "launch",
  "name": "Debug Vitest Tests",
  "runtimeExecutable": "npm",
  "runtimeArgs": ["run", "test"],
  "console": "integratedTerminal",
  "internalConsoleOptions": "neverOpen"
}
```

## Common Issues & Solutions

### Issue: Tests timeout

**Solution**: Increase timeout in test file:
```typescript
it('should complete', async () => {
  // ...
}, { timeout: 10000 });
```

### Issue: Mock not working

**Solution**: Ensure mock is defined before imports:
```typescript
vi.mock('@/lib/module');

import { useModule } from '@/lib/module';
```

### Issue: Async state updates

**Solution**: Use `waitFor`:
```typescript
await waitFor(() => {
  expect(screen.getByText('Loaded')).toBeInTheDocument();
});
```

### Issue: Memory leaks in tests

**Solution**: Clean up in `afterEach`:
```typescript
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});
```

## Resources

- [Vitest Documentation](https://vitest.dev)
- [React Testing Library](https://testing-library.com/react)
- [Playwright Documentation](https://playwright.dev)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Clarinet Documentation](https://docs.hiro.so/clarinet)

## Contributing

When adding new features:

1. Write tests first (TDD)
2. Ensure all tests pass
3. Maintain minimum coverage thresholds
4. Document complex test scenarios
5. Update this guide if introducing new patterns
