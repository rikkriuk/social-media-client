import { NextResponse } from 'next/server';

export async function handlerAuthSubmit(req: Request) {
  try {
    const body = await req.json();
    const { type } = body as any;

    if (type === 'forgot') {
      const { email } = body;
      console.log('Send OTP to', email);
      return NextResponse.json({ ok: true, message: 'OTP sent — check your inbox' });
    }

    if (type === 'otp') {
      const { code } = body;
      if (code === '123456') {
        return NextResponse.json({ ok: true, message: 'OTP verified' });
      }
      return NextResponse.json({ ok: false, message: 'Invalid OTP' }, { status: 400 });
    }

    if (type === 'login') {
      const { email, password } = body;
      // Mock authentication
      if (email === 'test@example.com' && password === 'password') {
        return NextResponse.json({ ok: true, message: 'Logged in' });
      }
      return NextResponse.json({ ok: false, message: 'Invalid credentials' }, { status: 401 });
    }

    if (type === 'register') {
      const { fullname, email, password, confirm } = body;
      if (email && password && password === confirm) {
        return NextResponse.json({ ok: true, message: 'Registered' });
      }
      return NextResponse.json({ ok: false, message: 'Invalid registration data' }, { status: 400 });
    }

    return NextResponse.json({ ok: false, message: 'Unknown action' }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ ok: false, message: 'Bad request' }, { status: 400 });
  }
}
