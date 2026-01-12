import { httpRequest } from '@/helpers/api';
import { ApiError } from '@/types/api';
import { stat } from 'fs';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type } = body as any;

    if (type === 'forgot') {
      const { email } = body;
      // TODO: Hit backend API untuk kirim OTP
      // const response = await httpRequest.post('/auth/forgot-password', { email });
      console.log('Send OTP to', email);
      return NextResponse.json({ ok: true, message: 'OTP sent — check your inbox' });
    }

    if (type === 'otp') {
      const { code } = body;
      // TODO: Hit backend API untuk verify OTP
      // const response = await httpRequest.post('/auth/verify-otp', { code });
      if (code === '123456') {
        return NextResponse.json({ ok: true, message: 'OTP verified' });
      }
      return NextResponse.json({ ok: false, message: 'Invalid OTP' }, { status: 400 });
    }

    if (type === 'login') {
      const { username, email, password } = body;
      if (username && email && password) {
        const response = await httpRequest.post('/auth/signin', {
          username,
          email,
          password
        });
        console.log('Logged in user:', response.data);
        return NextResponse.json({ ok: true, message: 'Logged in', data: response.data });
      }
      return NextResponse.json({ ok: false, message: 'Invalid credentials' }, { status: 401 });
    }

    if (type === "register") {
      const { username, email, password } = body;
      if (!username || !email || !password) {
        return NextResponse.json({ ok: false, message: 'Invalid registration data' }, { status: 400 });
      }

      const response = await httpRequest.post('/auth/signup', {
        username,
        email,
        password
      });

      return NextResponse.json({ 
        ok: true, 
        status: response.status, 
        data: response.data 
      });
    }

    return NextResponse.json({ ok: false, message: 'Unknown action' }, { status: 400 });
  } catch (err: unknown) {
    const error = err as ApiError;
    console.error('Auth submit error:', error);
    return NextResponse.json(
      { ok: false, message: error?.data?.message || 'Bad request' },
      { status: error?.status || 400 }
    );
  }
}
