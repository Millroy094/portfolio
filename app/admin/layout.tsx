'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, signOut } from 'aws-amplify/auth';
import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react';
import {Button} from '@mui/material'

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
            {() => (
                <div>
                    <header style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, padding: 16 }}>
                        <SignOutButton />
                    </header>
                    {children}
                </div>
            )}
        </Authenticator>
    );
}

function SignOutButton() {
    const { route } = useAuthenticator(context => [context.route]);

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