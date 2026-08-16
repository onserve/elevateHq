import { NextRequest, NextResponse } from 'next/server';
import { confirmGoogleCallback } from '@/lib/api/service/integration-service';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state');

  const settingsUrl = new URL('/settings', request.nextUrl.origin);

  if (!code || !state) {
    settingsUrl.searchParams.set('integration', 'gmail');
    settingsUrl.searchParams.set('status', 'error');
    settingsUrl.searchParams.set('message', 'Missing code or state parameters');
    return NextResponse.redirect(settingsUrl);
  }

  try {
    await confirmGoogleCallback(code, state);
    settingsUrl.searchParams.set('integration', 'gmail');
    settingsUrl.searchParams.set('status', 'success');
    return NextResponse.redirect(settingsUrl);
  } catch (error: any) {
    console.error('[Google OAuth Callback Error]:', error);
    settingsUrl.searchParams.set('integration', 'gmail');
    settingsUrl.searchParams.set('status', 'error');
    settingsUrl.searchParams.set('message', error?.message || 'Failed to complete OAuth callback');
    return NextResponse.redirect(settingsUrl);
  }
}
