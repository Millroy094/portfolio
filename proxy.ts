import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { fetchAuthSession } from 'aws-amplify/auth/server';
import { runWithAmplifyServerContext } from '@/services/amplify/amplifyServer';

export async function proxy(request: NextRequest) {
    const response = NextResponse.next();

    const authenticated = await runWithAmplifyServerContext({
        nextServerContext: { request, response },
        operation: async (contextSpec) => {
            try {
                const session = await fetchAuthSession(contextSpec);
                return session.tokens !== undefined;
            } catch (error) {
                return false;
            }
        }
    });

    if (!authenticated && request.nextUrl.pathname.startsWith('/admin')) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    if (authenticated && request.nextUrl.pathname.startsWith('/login')) {
        return NextResponse.redirect(new URL('/admin', request.url));
    }

    return response;
}

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
    ],
};