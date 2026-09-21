-- Migration: Add Paystack fields to businesses table and create paystack_webhook_events table

-- Add Paystack customer and subscription fields to businesses table
ALTER TABLE businesses
  ADD COLUMN IF NOT EXISTS paystack_customer_code TEXT,
  ADD COLUMN IF NOT EXISTS paystack_authorization_code TEXT,
  ADD COLUMN IF NOT EXISTS paystack_subscription_code TEXT;

-- Webhook idempotency tracking table
CREATE TABLE IF NOT EXISTS paystack_webhook_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id TEXT UNIQUE NOT NULL,
  event_type TEXT NOT NULL,
  processed BOOLEAN DEFAULT true,
  received_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  processed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  business_id UUID REFERENCES businesses(id) ON DELETE SET NULL,
  raw_metadata JSONB
);

CREATE INDEX IF NOT EXISTS idx_paystack_webhook_events_event_id ON paystack_webhook_events(event_id);
