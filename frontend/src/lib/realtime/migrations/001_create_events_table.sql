-- Migration: Create chainhook_events table
-- Description: Store blockchain events from Chainhooks

CREATE TABLE IF NOT EXISTS chainhook_events (
  id SERIAL PRIMARY KEY,
  tx_hash VARCHAR(66) UNIQUE NOT NULL,
  block_height BIGINT NOT NULL,
  block_hash VARCHAR(66) NOT NULL,
  contract_id VARCHAR(255) NOT NULL,
  event_type VARCHAR(50) NOT NULL,
  event_topic VARCHAR(100),
  event_data JSONB NOT NULL,
  affected_addresses TEXT[] NOT NULL,
  success BOOLEAN NOT NULL,
  timestamp BIGINT NOT NULL,
  metadata JSONB DEFAULT '{}',
  received_at TIMESTAMP DEFAULT NOW(),

  -- Indexes for performance
  INDEX idx_tx_hash (tx_hash),
  INDEX idx_block_height (block_height DESC),
  INDEX idx_contract_id (contract_id),
  INDEX idx_event_type (event_type),
  INDEX idx_timestamp (timestamp DESC),
  INDEX idx_affected_addresses USING GIN(affected_addresses),
  INDEX idx_event_data USING GIN(event_data)
);

-- Create user_event_subscriptions table
CREATE TABLE IF NOT EXISTS user_event_subscriptions (
  id SERIAL PRIMARY KEY,
  user_address VARCHAR(42) NOT NULL,
  contract_id VARCHAR(255),
  event_types TEXT[],
  subscription_type VARCHAR(20) NOT NULL CHECK (subscription_type IN ('contract', 'user', 'event-type')),
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  -- Unique constraint
  UNIQUE(user_address, contract_id, subscription_type)
);

-- Indexes for subscriptions
CREATE INDEX idx_user_subscriptions ON user_event_subscriptions(user_address) WHERE active = TRUE;
CREATE INDEX idx_subscription_type ON user_event_subscriptions(subscription_type) WHERE active = TRUE;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON user_event_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Comments
COMMENT ON TABLE chainhook_events IS 'Stores blockchain events received from Chainhooks';
COMMENT ON TABLE user_event_subscriptions IS 'Stores user subscriptions to blockchain events';
COMMENT ON COLUMN chainhook_events.tx_hash IS 'Transaction hash (0x prefixed)';
COMMENT ON COLUMN chainhook_events.affected_addresses IS 'Array of addresses affected by this event';
COMMENT ON COLUMN chainhook_events.event_data IS 'JSON payload of the event';
