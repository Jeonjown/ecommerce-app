export function mapStripeRefundStatus(
  stripeStatus: string | null
): 'none' | 'requested' | 'processing' | 'completed' | 'rejected' {
  switch (stripeStatus) {
    case 'pending':
      return 'processing';
    case 'succeeded':
      return 'completed';
    case 'failed':
    case 'canceled':
      return 'rejected';
    case null:
      return 'requested';
    default:
      return 'requested';
  }
}
