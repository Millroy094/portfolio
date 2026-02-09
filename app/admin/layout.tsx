'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, signOut } from 'aws-amplify/auth';
import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react';
import { Button } from '@mui/material';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                await getCurrentUser();
                setChecking(false);
            } catch (error) {
                console.error(error);
                router.replace('/login');
            }
        })();
    }, [router]);

    if (checking) return null;

    return (
        <Authenticator>
            <LayoutWithUser>{children}</LayoutWithUser>
        </Authenticator>
    );
}

function LayoutWithUser({ children }: { children: React.ReactNode }) {
    const { user, route } = useAuthenticator((context) => [context.user, context.route]);

    const username =
        user?.signInDetails?.loginId ??
        user?.username ??
        "Unknown user";

    return (
        <div>
            <header
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 12,
                    padding: 16,
                }}
            >
                <p>
                    Logged in as <strong>{username}</strong>
                </p>

                <SignOutButton route={route} />
            </header>

            {children}
        </div>
    );
}

function SignOutButton({ route }: { route: string }) {
    return (
        <Button
            variant="contained"
            onClick={async () => {
                await signOut();
                if (route !== 'signIn') window.location.href = '/login';
            }}
        >
            Logout
        </Button>
    );
}