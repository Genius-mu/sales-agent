-- Migration: Atomic Conversation Quota Reservation Function
-- Description:
-- Atomically checks and reserves a monthly conversation slot
-- while preventing concurrent requests from bypassing plan limits.

CREATE OR REPLACE FUNCTION check_and_reserve_conversation(
  p_business_id UUID,
  p_session_id TEXT,
  p_limit INT
) RETURNS TABLE (
  allowed BOOLEAN,
  current_count INT,
  is_new BOOLEAN
)
LANGUAGE plpgsql
AS $$
DECLARE
  v_count INT;
  v_exists BOOLEAN;
  v_business_exists BOOLEAN;
  v_start_of_month TIMESTAMPTZ;
BEGIN
  v_start_of_month := date_trunc('month', now());

  -- Validate business exists and lock the row.
  SELECT EXISTS (
    SELECT 1
    FROM businesses
    WHERE id = p_business_id
  )
  INTO v_business_exists;

  IF NOT v_business_exists THEN
    RETURN QUERY SELECT FALSE, 0, TRUE;
    RETURN;
  END IF;

  -- Lock the business row so concurrent requests for the same
  -- business cannot pass the quota check simultaneously.
  PERFORM id
  FROM businesses
  WHERE id = p_business_id
  FOR UPDATE;

  -- Check whether this session already has a conversation
  -- for THIS business.
  SELECT EXISTS (
    SELECT 1
    FROM conversations
    WHERE session_id = p_session_id
      AND business_id = p_business_id
  )
  INTO v_exists;

  -- Existing session: do not consume another monthly slot.
  IF v_exists THEN
    SELECT count(*)::INT
    INTO v_count
    FROM conversations
    WHERE business_id = p_business_id
      AND created_at >= v_start_of_month;

    RETURN QUERY SELECT TRUE, v_count, FALSE;
    RETURN;
  END IF;

  -- Count conversations for this business this month.
  SELECT count(*)::INT
  INTO v_count
  FROM conversations
  WHERE business_id = p_business_id
    AND created_at >= v_start_of_month;

  -- Monthly limit reached.
  IF v_count >= p_limit THEN
    RETURN QUERY SELECT FALSE, v_count, TRUE;
    RETURN;
  END IF;

  -- Atomically reserve the conversation slot.
  INSERT INTO conversations (
    session_id,
    business_id,
    messages
  )
  VALUES (
    p_session_id,
    p_business_id,
    '[]'::jsonb
  );

  RETURN QUERY SELECT TRUE, v_count + 1, TRUE;
END;
$$;
