import { NextRequest, NextResponse } from 'next/server';
import { insforge } from '@/lib/insforge';
import { sendSentDmOtp } from '@/lib/sentdm';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { phoneNumber, method, name } = body;

    if (!phoneNumber || typeof phoneNumber !== 'string') {
      return NextResponse.json(
        { success: false, error: 'A valid phone number with country code is required.' },
        { status: 400 }
      );
    }

    const cleanPhone = phoneNumber.trim().replace(/[\s-()]/g, '');
    if (!/^\+[1-9]\d{6,14}$/.test(cleanPhone)) {
      return NextResponse.json(
        { success: false, error: 'Phone number must be in international format (e.g., +1234567890).' },
        { status: 400 }
      );
    }

    const verificationMethod = method === 'whatsapp' ? 'whatsapp' : 'sms';

    // Rate-limiting check: prevent spamming within 30 seconds
    const thirtySecondsAgo = new Date(Date.now() - 30 * 1000).toISOString();
    const { data: recentOtps } = await insforge.database
      .from('otp_verifications')
      .select('id, created_at')
      .eq('phone_number', cleanPhone)
      .gt('created_at', thirtySecondsAgo);

    if (recentOtps && recentOtps.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Please wait 30 seconds before requesting another verification code.',
        },
        { status: 429 }
      );
    }

    // Generate secure 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 minutes expiry

    // Send OTP using Sent.dm
    const sentDmResult = await sendSentDmOtp({
      to: cleanPhone,
      method: verificationMethod,
      otpCode,
      name: name || undefined,
    });

    if (!sentDmResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: sentDmResult.error || 'Failed to send OTP via Sent.dm. Please try again.',
        },
        { status: 502 }
      );
    }

    // Record OTP in InsForge database
    const { error: insertError } = await insforge.database
      .from('otp_verifications')
      .insert([
        {
          phone_number: cleanPhone,
          code: otpCode,
          method: verificationMethod,
          expires_at: expiresAt,
          attempts: 0,
          verified: false,
          message_id: sentDmResult.messageId || null,
        },
      ]);

    if (insertError) {
      console.error('[Phone Auth] Failed to save OTP in database:', insertError);
    }

    return NextResponse.json({
      success: true,
      message: `OTP sent via ${verificationMethod === 'whatsapp' ? 'WhatsApp' : 'SMS'}.`,
      method: verificationMethod,
      messageId: sentDmResult.messageId,
      isSimulated: sentDmResult.isSimulated || false,
      // In development simulation mode, return demo code to facilitate local testing
      ...(sentDmResult.isSimulated ? { demoCode: otpCode } : {}),
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Internal server error';
    console.error('[Phone Auth] send-otp error:', err);
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}
