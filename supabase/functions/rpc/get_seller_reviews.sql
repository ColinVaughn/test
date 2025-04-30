
CREATE OR REPLACE FUNCTION get_seller_reviews(p_seller_id UUID, p_status TEXT DEFAULT 'approved')
RETURNS SETOF json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT json_build_object(
    'id', r.id,
    'seller_id', r.seller_id,
    'customer_id', r.customer_id,
    'order_id', r.order_id,
    'rating', r.rating,
    'review_text', r.review_text,
    'created_at', r.created_at,
    'updated_at', r.updated_at,
    'reported', r.reported,
    'moderation_status', r.moderation_status,
    'helpful_count', r.helpful_count,
    'unhelpful_count', r.unhelpful_count,
    'customer', json_build_object(
      'email', u.email
    )
  )
  FROM marketplace_seller_reviews r
  LEFT JOIN auth.users u ON r.customer_id = u.id
  WHERE r.seller_id = p_seller_id
  AND (p_status IS NULL OR r.moderation_status = p_status)
  ORDER BY r.created_at DESC;
END;
$$;
