"use server";

import apiClient from './apiClient';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { User } from '@/types';

export interface AuthState {
      error?: string;
    }

const AUTH_COOKIE_NAME = 'auth_user';

export async function login(
      prevState: AuthState | undefined, 
      formData: FormData
    ): Promise<AuthState>{
      
  const email = String(formData.get('email') || '').trim();
  const password = String(formData.get('password') || '');
  const rememberMe = String(formData.get('remember-me') || '') === 'on';

  if (!email || !password) {
    return { error: 'Missing credentials' };
  }

  let users: User[] = [];
  try {
    users = await apiClient.get('/users', { email });
  } catch (err) {
    console.error('Login error:', err);
    return { error: 'Unexpected error occurred. Please try again later.' };
  }

  const user = Array.isArray(users) && users.length > 0 ? users[0] : null;

  if (!user || user.password !== password) {
    return { error: 'Invalid credentials' };
  }

  const maxAge = rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24 * 7; // 30d or 7d

  const cookieStore = await cookies();
  cookieStore.set(
    AUTH_COOKIE_NAME,
    JSON.stringify({ id: user!.id }),
    {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge,
    }
  );

  redirect('/');
}


export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE_NAME);
  redirect('/');
}

