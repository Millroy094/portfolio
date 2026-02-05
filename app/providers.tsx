'use client';

import '@aws-amplify/ui-react/styles.css';
import { configureAmplify } from '@/services/amplifyClient';

export function Providers({ children }: { children: React.ReactNode }) {
    configureAmplify();

    return <>{children}</>;
}