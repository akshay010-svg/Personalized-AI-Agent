import { NextRequest, NextResponse } from 'next/server';
import { insforge } from '@/lib/insforge';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { phoneNumber, code, method, name, email } = body;

    if (!phoneNumber || !code) {
      return NextResponse.json(
        { success: false, error: 'Phone number and verification code are required.' },
        { status: 400 }
      );
    }

    const cleanPhone = phoneNumber.trim().replace(/[\s-()]/g, '');
    const cleanCode = code.trim();

    // Query active OTP record
    const { data: otps, error: otpFetchError } = await insforge.database
      .from('otp_verifications')
      .select('*')
      .eq('phone_number', cleanPhone)
      .eq('verified', false)
      .order('created_at', { ascending: false })
      .limit(1);

    if (otpFetchError || !otps || otps.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No verification code found. Please request a new code.' },
        { status: 400 }
      );
    }

    const activeOtp = otps[0];

    // Check expiration
    if (new Date(activeOtp.expires_at).getTime() < Date.now()) {
      return NextResponse.json(
        { success: false, error: 'Verification code has expired. Please request a new one.' },
        { status: 400 }
      );
    }

    // Check attempt threshold
    if ((activeOtp.attempts || 0) >= 5) {
      return NextResponse.json(
        { success: false, error: 'Too many incorrect attempts. Please request a new code.' },
        { status: 429 }
      );
    }

    // Validate code
    if (activeOtp.code !== cleanCode) {
      // Increment attempt count
      await insforge.database
        .from('otp_verifications')
        .update({ attempts: (activeOtp.attempts || 0) + 1 })
        .eq('id', activeOtp.id);

      return NextResponse.json(
        { success: false, error: 'Invalid verification code. Please check and try again.' },
        { status: 400 }
      );
    }

    // Mark OTP as verified
    await insforge.database
      .from('otp_verifications')
      .update({ verified: true })
      .eq('id', activeOtp.id);

    const verificationMethod = method || activeOtp.method || 'sms';
    const nowIso = new Date().toISOString();

    // Check if user exists in public.users
    const { data: existingUsers, error: userQueryError } = await insforge.database
      .from('users')
      .select('*')
      .eq('phone_number', cleanPhone)
      .limit(1);

    if (userQueryError) {
      console.error('[Phone Auth] Error querying users table:', userQueryError);
    }

    let finalUser: Record<string, unknown>;

    if (existingUsers && existingUsers.length > 0) {
      // Existing user: Update last login date & verification method
      const existing = existingUsers[0];
      const updatePayload: Record<string, unknown> = {
        auth_provider: 'phone',
        provider: 'phone',
        verification_method: verificationMethod,
        last_login_date: nowIso,
        updated_at: nowIso,
      };

      if (name && !existing.name) updatePayload.name = name;
      if (email && !existing.email) updatePayload.email = email;

      const { error: updateError } = await insforge.database
        .from('users')
        .update(updatePayload)
        .eq('id', existing.id);

      if (updateError) {
        console.error('[Phone Auth] Error updating user:', updateError);
      }

      finalUser = {
        ...existing,
        ...updatePayload,
      };
    } else {
      // New user: Insert into users table
      const newUserId = `usr_ph_${crypto.randomUUID()}`;
      const newUserPayload = {
        id: newUserId,
        phone_number: cleanPhone,
        name: name || null,
        email: email || null,
        provider: 'phone',
        auth_provider: 'phone',
        verification_method: verificationMethod,
        created_at: nowIso,
        created_date: nowIso,
        updated_at: nowIso,
        last_login_date: nowIso,
      };

      const { error: insertError } = await insforge.database
        .from('users')
        .insert([newUserPayload]);

      if (insertError) {
        console.error('[Phone Auth] Error inserting new user:', insertError);
        return NextResponse.json(
          { success: false, error: 'Failed to create user record in database.' },
          { status: 500 }
        );
      }

      finalUser = newUserPayload;
    }

    // Create session token
    const sessionToken = Buffer.from(
      JSON.stringify({
        userId: finalUser.id,
        phone: cleanPhone,
        timestamp: Date.now(),
      })
    ).toString('base64');

    const response = NextResponse.json({
      success: true,
      message: 'Authentication successful.',
      user: finalUser,
      token: sessionToken,
    });

    // Set secure cookie for persistent session
    response.cookies.set('omnisync_phone_session', sessionToken, {
      httpOnly: false, // Accessible by client AuthContext
      path: '/',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      sameSite: 'lax',
    });

    return response;
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Internal server error';
    console.error('[Phone Auth] verify-otp error:', err);
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}
