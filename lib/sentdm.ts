import SentDm from '@sentdm/sentdm';

export interface SendOtpOptions {
  to: string; // E.164 phone number, e.g. +1234567890
  method: 'sms' | 'whatsapp';
  otpCode: string;
  name?: string;
}

export interface SendOtpResult {
  success: boolean;
  messageId?: string;
  status?: string;
  isSimulated?: boolean;
  error?: string;
}

const TEMPLATE_ID =
  process.env.SENT_DM_TEMPLATE_ID || 'a9e7239a-b846-4863-ab25-33faffbfa058';

/**
 * Sends an OTP message via Sent.dm using either SMS or WhatsApp.
 * Follows official Sent.dm SDK guidelines.
 */
export async function sendSentDmOtp({
  to,
  method,
  otpCode,
  name,
}: SendOtpOptions): Promise<SendOtpResult> {
  const apiKey = process.env.SENT_DM_API_KEY?.trim();

  // If no API key is provided, log helpful info and run in simulated sandbox mode
  if (!apiKey) {
    console.warn(
      `\n⚠️ [Sent.dm] SENT_DM_API_KEY is not configured in .env.local!\n` +
      `➡️  Simulated OTP for ${to} via ${method.toUpperCase()}: [ ${otpCode} ]\n` +
      `➡️  Add your Sent.dm API key to .env.local to send real SMS/WhatsApp messages.\n`
    );

    return {
      success: true,
      status: 'simulated',
      messageId: `sim_${Date.now()}`,
      isSimulated: true,
    };
  }

  try {
    const client = new SentDm({ apiKey });

    // Multi-channel selection: 'whatsapp' or 'sms'
    const channel = method === 'whatsapp' ? ['whatsapp'] : ['sms'];

    const response = await client.messages.send({
      to: [to],
      channel,
      template: {
        id: TEMPLATE_ID,
        parameters: {
          var_1: otpCode, // required by template
          code: otpCode,
          otp: otpCode,
          '1': otpCode,
          name: name || 'User',
        },
      },
    });

    const recipient = response.data?.recipients?.[0];
    const messageId = recipient?.message_id;
    const status = response.data?.status || 'QUEUED';

    console.log(`[Sent.dm] Message sent successfully to ${to} via ${method}. Message ID: ${messageId}, Status: ${status}`);

    return {
      success: true,
      messageId,
      status,
      isSimulated: false,
    };
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error(`[Sent.dm] Error sending OTP via ${method}:`, err);

    return {
      success: false,
      error: errorMessage,
    };
  }
}
