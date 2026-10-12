import { NextRequest, NextResponse } from 'next/server';
import { insforge } from '@/lib/insforge';

export async function GET(req: NextRequest) {
  try {
    const sessionCookie = req.cookies.get('omnisync_phone_session')?.value;
    const authHeader = req.headers.get('authorization')?.replace('Bearer ', '');
    const token = sessionCookie || authHeader;

    if (!token) {
      return NextResponse.json({ authenticated: false, user: null }, { status: 200 });
    }

    let parsedToken: { userId?: string; phone?: string };
    try {
      parsedToken = JSON.parse(Buffer.from(token, 'base64').toString('utf-8'));
    } catch {
      return NextResponse.json({ authenticated: false, user: null }, { status: 200 });
    }

    if (!parsedToken?.userId) {
      return NextResponse.json({ authenticated: false, user: null }, { status: 200 });
    }

    const { data: users, error } = await insforge.database
      .from('users')
      .select('*')
      .eq('id', parsedToken.userId)
      .limit(1);

    if (error || !users || users.length === 0) {
      return NextResponse.json({ authenticated: false, user: null }, { status: 200 });
    }

    return NextResponse.json({
      authenticated: true,
      user: users[0],
    });
  } catch (err) {
    console.error('[Phone Auth] session check error:', err);
    return NextResponse.json({ authenticated: false, user: null }, { status: 200 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true, message: 'Signed out' });
  response.cookies.delete('omnisync_phone_session');
  return response;
}
