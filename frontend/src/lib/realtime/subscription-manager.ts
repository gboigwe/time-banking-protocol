/**
 * Subscription Manager
 * Manages user subscriptions to blockchain events
 */

import { Subscription, SubscriptionType } from '@/types/realtime';

export interface SubscriptionRecord {
  id: string;
  userId: string;
  type: SubscriptionType;
  target: string;
  eventTypes?: string[];
  createdAt: number;
  active: boolean;
}

export class SubscriptionManager {
  private subscriptions: Map<string, SubscriptionRecord> = new Map();

  /**
   * Create a new subscription
   */
  public createSubscription(
    userId: string,
    subscription: Subscription
  ): SubscriptionRecord {
    const id = this.generateId();
    const target = this.getSubscriptionTarget(subscription);

    const record: SubscriptionRecord = {
      id,
      userId,
      type: subscription.type,
      target,
      eventTypes: subscription.eventTypes,
      createdAt: Date.now(),
      active: true,
    };

    this.subscriptions.set(id, record);
    return record;
  }

  /**
   * Get subscription target identifier
   */
  private getSubscriptionTarget(subscription: Subscription): string {
    switch (subscription.type) {
      case 'contract':
        return subscription.contractId || '';
      case 'user':
        return subscription.address || '';
      case 'event-type':
        return subscription.eventTypes?.join(',') || '';
      default:
        return '';
    }
  }

  /**
   * Get subscriptions for user
   */
  public getUserSubscriptions(userId: string): SubscriptionRecord[] {
    return Array.from(this.subscriptions.values()).filter(
      (sub) => sub.userId === userId && sub.active
    );
  }

  /**
   * Get subscription by ID
   */
  public getSubscription(id: string): SubscriptionRecord | undefined {
    return this.subscriptions.get(id);
  }

  /**
   * Update subscription
   */
  public updateSubscription(
    id: string,
    updates: Partial<SubscriptionRecord>
  ): boolean {
    const subscription = this.subscriptions.get(id);
    if (!subscription) return false;

    Object.assign(subscription, updates);
    return true;
  }

  /**
   * Deactivate subscription
   */
  public deactivateSubscription(id: string): boolean {
    return this.updateSubscription(id, { active: false });
  }

  /**
   * Delete subscription
   */
  public deleteSubscription(id: string): boolean {
    return this.subscriptions.delete(id);
  }

  /**
   * Get all active subscriptions
   */
  public getActiveSubscriptions(): SubscriptionRecord[] {
    return Array.from(this.subscriptions.values()).filter((sub) => sub.active);
  }

  /**
   * Get subscriptions by type
   */
  public getSubscriptionsByType(type: SubscriptionType): SubscriptionRecord[] {
    return Array.from(this.subscriptions.values()).filter(
      (sub) => sub.type === type && sub.active
    );
  }

  /**
   * Check if user has subscription
   */
  public hasSubscription(userId: string, target: string): boolean {
    return Array.from(this.subscriptions.values()).some(
      (sub) => sub.userId === userId && sub.target === target && sub.active
    );
  }

  /**
   * Clear all subscriptions for user
   */
  public clearUserSubscriptions(userId: string): number {
    const userSubs = this.getUserSubscriptions(userId);
    userSubs.forEach((sub) => this.deleteSubscription(sub.id));
    return userSubs.length;
  }

  /**
   * Get subscription statistics
   */
  public getStats() {
    const all = Array.from(this.subscriptions.values());
    const active = all.filter((sub) => sub.active);

    return {
      total: all.length,
      active: active.length,
      byType: {
        contract: active.filter((s) => s.type === 'contract').length,
        user: active.filter((s) => s.type === 'user').length,
        eventType: active.filter((s) => s.type === 'event-type').length,
      },
      uniqueUsers: new Set(active.map((s) => s.userId)).size,
    };
  }

  /**
   * Generate unique subscription ID
   */
  private generateId(): string {
    return `sub-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Export subscriptions for user
   */
  public exportUserSubscriptions(userId: string): SubscriptionRecord[] {
    return this.getUserSubscriptions(userId);
  }

  /**
   * Import subscriptions for user
   */
  public importUserSubscriptions(subscriptions: SubscriptionRecord[]): number {
    let imported = 0;
    subscriptions.forEach((sub) => {
      this.subscriptions.set(sub.id, sub);
      imported++;
    });
    return imported;
  }
}

// Singleton instance
let subscriptionManager: SubscriptionManager | null = null;

/**
 * Get or create subscription manager instance
 */
export function getSubscriptionManager(): SubscriptionManager {
  if (!subscriptionManager) {
    subscriptionManager = new SubscriptionManager();
  }
  return subscriptionManager;
}
