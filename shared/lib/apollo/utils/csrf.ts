import { isBrowser } from './isBrowser';

export function getCookie(name: string): string | undefined {
    if (!isBrowser()) return undefined;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
    return undefined;
}

export async function ensureCsrfToken(): Promise<void> {
    if (!isBrowser()) return;
    if (getCookie('csrftoken')) return;

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

    await fetch(`${baseUrl}/csrf/`, {
        method: 'GET',
        credentials: 'include',
    });
}

export const getGraphQLHeaders = (): Record<string, string> => {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };
    if (isBrowser()) {
        const csrftoken = getCookie('csrftoken');
        if (csrftoken) headers['X-CSRFToken'] = csrftoken;
    }
    return headers;
};
