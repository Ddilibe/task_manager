
const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api`;

interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}


const getToken = (): string | null => {
    return localStorage.getItem('token');
};


export const makeAuthenticatedRequest = async <T>(
    endpoint: string,
    method: string,
    body?: any
): Promise<ApiResponse<T>> => {
    const token = getToken();
    if (!token) {
        return { success: false, error: 'Authentication required. No token found.' };
    }

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
    };

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method,
            headers,
            body: body ? JSON.stringify(body) : undefined,
        });

        const data = await response.json();

        if (!response.ok) {
            return { success: false, error: data.message || data.error || 'Request failed.' };
        }

        return { success: true, data: data as T };
    } catch (error: any) {
        console.error(`API Error (${method} ${endpoint}):`, error);
        return { success: false, error: error.message || 'Network error or unexpected response.' };
    }
};


export const makeUnauthenticatedRequest = async <T>(
    endpoint: string,
    method: string,
    body?: any
): Promise<ApiResponse<T>> => {
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method,
            headers,
            body: body ? JSON.stringify(body) : undefined,
        });

        const data = await response.json();

        if (!response.ok) {
            return { success: false, error: data.message || data.error || 'Request failed.' };
        }

        return { success: true, data: data as T };
    } catch (error: any) {
        console.error(`API Error (${method} ${endpoint}):`, error);
        return { success: false, error: error.message || 'Network error or unexpected response.' };
    }
};