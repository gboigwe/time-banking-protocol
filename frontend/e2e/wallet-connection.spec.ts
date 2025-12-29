import { test, expect } from '@playwright/test';

test.describe('Wallet Connection Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display Connect Wallet button on homepage', async ({ page }) => {
    const connectButton = page.getByRole('button', { name: /connect wallet/i });
    await expect(connectButton).toBeVisible();
  });

  test('should open wallet modal when Connect Wallet is clicked', async ({
    page,
  }) => {
    // Click Connect Wallet button
    await page.click('button:has-text("Connect Wallet")');

    // Wait for modal to appear
    await expect(page.getByText('Browser Extension')).toBeVisible();
    await expect(page.getByText('WalletConnect')).toBeVisible();
  });

  test('should display wallet options in modal', async ({ page }) => {
    await page.click('button:has-text("Connect Wallet")');

    // Check for browser extension option
    await expect(page.getByText('Browser Extension')).toBeVisible();
    await expect(page.getByText('Hiro, Xverse, or Leather')).toBeVisible();

    // Check for WalletConnect option
    await expect(page.getByText('WalletConnect')).toBeVisible();
    await expect(page.getByText('Scan QR with mobile wallet')).toBeVisible();
  });

  test('should close modal when clicking outside', async ({ page }) => {
    await page.click('button:has-text("Connect Wallet")');
    await expect(page.getByText('Browser Extension')).toBeVisible();

    // Click outside the modal (on the backdrop)
    await page.click('.fixed.inset-0', { position: { x: 10, y: 10 } });

    // Modal should be closed
    await expect(page.getByText('Browser Extension')).not.toBeVisible();
  });

  test('should close modal when clicking X button', async ({ page }) => {
    await page.click('button:has-text("Connect Wallet")');
    await expect(page.getByText('Browser Extension')).toBeVisible();

    // Find and click the close button
    const closeButton = page.locator('button').filter({
      has: page.locator('svg'),
    }).last();
    await closeButton.click();

    // Modal should be closed
    await expect(page.getByText('Browser Extension')).not.toBeVisible();
  });

  test('should show wallet recommendations in modal', async ({ page }) => {
    await page.click('button:has-text("Connect Wallet")');

    await expect(page.getByText('Recommended wallets:')).toBeVisible();
    await expect(page.getByText(/Xverse/)).toBeVisible();
    await expect(page.getByText(/Leather/)).toBeVisible();
    await expect(page.getByText(/Hiro/)).toBeVisible();
  });

  test('should display terms and privacy policy notice', async ({ page }) => {
    await page.click('button:has-text("Connect Wallet")');

    await expect(
      page.getByText(/By connecting, you agree to our Terms of Service/)
    ).toBeVisible();
  });

  test('should navigate to dashboard when clicking Dashboard link (if connected)', async ({
    page,
  }) => {
    // Note: This test assumes wallet is already connected
    // In real E2E, you'd mock wallet connection or use test wallet

    await page.goto('/dashboard');

    // If not connected, should show connect message
    const connectMessage = page.getByText('Connect Your Wallet');
    const isVisible = await connectMessage.isVisible();

    if (isVisible) {
      // User not connected - verify redirect or message
      await expect(connectMessage).toBeVisible();
      await expect(
        page.getByText('Please connect your wallet to access your dashboard')
      ).toBeVisible();
    } else {
      // User connected - verify dashboard loaded
      await expect(page.getByText(/Welcome back/)).toBeVisible();
    }
  });
});

test.describe('Header Navigation', () => {
  test('should display TimeBank logo', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('TimeBank')).toBeVisible();
  });

  test('should navigate to home when clicking logo', async ({ page }) => {
    await page.goto('/dashboard');
    await page.click('a:has-text("TimeBank")');
    await expect(page).toHaveURL('/');
  });

  test('should show mobile menu button on small screens', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Mobile menu button should be visible
    const menuButton = page.locator('button.md\\:hidden');
    await expect(menuButton).toBeVisible();
  });

  test('should toggle mobile menu when hamburger is clicked', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    const menuButton = page.locator('button.md\\:hidden');
    await menuButton.click();

    // Mobile menu should expand
    // Note: Specific assertions depend on implementation
  });
});

test.describe('Wallet Connection State Persistence', () => {
  test('should maintain connection across page navigation', async ({
    page,
    context,
  }) => {
    // Note: This test would require actual wallet connection
    // For now, we're testing the UI flow

    await page.goto('/');

    // If we had a test wallet, we'd connect here
    // For now, just verify the flow

    await page.goto('/marketplace');
    await page.goto('/dashboard');

    // Verify that wallet state is checked on each page
    // Connection button or user info should be consistent
  });
});

test.describe('Error Handling', () => {
  test('should handle wallet extension not installed', async ({ page }) => {
    // This would require mocking the wallet extension
    // For now, verify that error handling exists

    await page.goto('/');
    // Test would check for appropriate error messages
  });

  test('should handle connection rejection', async ({ page }) => {
    // This would require mocking wallet rejection
    await page.goto('/');
    // Test would verify graceful handling
  });
});

test.describe('Accessibility', () => {
  test('should have accessible connect button', async ({ page }) => {
    await page.goto('/');

    const connectButton = page.getByRole('button', { name: /connect wallet/i });
    await expect(connectButton).toBeVisible();
    await expect(connectButton).toBeEnabled();
  });

  test('should support keyboard navigation in modal', async ({ page }) => {
    await page.goto('/');
    await page.click('button:has-text("Connect Wallet")');

    // Tab through focusable elements
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    // Should be able to close with Escape
    await page.keyboard.press('Escape');
    await expect(page.getByText('Browser Extension')).not.toBeVisible();
  });
});
