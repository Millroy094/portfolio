'use client'

import {Amplify} from "aws-amplify";
import outputs from '@/amplify_outputs.json'

export function configureAmplify () {
    if (typeof window === 'undefined') return

    try {
        Amplify.configure(outputs, {ssr: true})
    } catch {
        console.warn('Amplify outputs not found - running without backend')
    }
}