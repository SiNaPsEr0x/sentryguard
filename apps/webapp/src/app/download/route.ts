import { NextRequest, NextResponse } from 'next/server';
import { detectLocale } from '../../locale-proxy';
import { getAppStoreUrls } from '@/core/site';

export const dynamic = 'force-dynamic';

const IOS_USER_AGENT_PATTERN = /iphone|ipad|ipod/i;
const ANDROID_USER_AGENT_PATTERN = /android/i;

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { appStoreUrl, googlePlayUrl } = getAppStoreUrls();
  const userAgent = request.headers.get('user-agent') ?? '';

  if (appStoreUrl && IOS_USER_AGENT_PATTERN.test(userAgent)) {
    return NextResponse.redirect(appStoreUrl);
  }

  if (googlePlayUrl && ANDROID_USER_AGENT_PATTERN.test(userAgent)) {
    return NextResponse.redirect(googlePlayUrl);
  }

  const locale = detectLocale(request);
  const search = request.nextUrl.search;
  const location = `/${locale}${search}#mobile-app`;

  return new NextResponse(null, {
    status: 307,
    headers: {
      Location: location,
    },
  });
}
