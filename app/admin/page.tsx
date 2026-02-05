'use client';

import { useAuthenticator } from '@aws-amplify/ui-react';

export default function AdminPage() {
    const { user } = useAuthenticator((context) => [context.user]);

    const username =
        user?.signInDetails?.loginId ??
        user?.username ??
        'Unknown user';

    return (
        <main style={{ padding: 24 }}>
            <h1>Admin Dashboard</h1>
            <p>Welcome, <strong>{username}</strong></p>
        </main>
);
}