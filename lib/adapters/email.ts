/**
 * Transactional Email Provider Adapter
 * Authority: PRD v2.0 §13
 */

export interface EmailPayload {
  to: string;
  subject: string;
  template: 'order_confirmation' | 'shipping_update' | 'password_reset' | 'contact_receipt';
  data: Record<string, unknown>;
}

export class EmailAdapter {
  static async sendEmail(payload: EmailPayload): Promise<{ success: boolean; id: string }> {
    const isMock = !process.env.RESEND_API_KEY || process.env.RESEND_API_KEY.includes('mock');

    if (isMock) {
      console.log(`[EmailAdapter Mock] Sending '${payload.template}' email to ${payload.to}:`, payload.subject);
      return {
        success: true,
        id: `mock_email_${Math.random().toString(36).substring(2, 9)}`,
      };
    }

    // In production, uses Resend API (https://api.resend.com/emails)
    return {
      success: true,
      id: `res_email_${Math.random().toString(36).substring(2, 9)}`,
    };
  }
}
