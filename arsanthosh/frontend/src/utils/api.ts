const getBaseUrl = () => {
    if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;
    if (typeof window !== "undefined") {
        if (window.location.hostname === "localhost") {
            return "http://localhost:5000/api";
        }
        // Fallback for arsanthosh.in
        return "https://arsanthosh.onrender.com/api";
    }
    return "http://localhost:5000/api";
};

const BASE_URL = getBaseUrl();

type ApiResponse<T> = {
    success: boolean;
    data: T;
    error: {
        message: string;
    } | null;
    statusCode: number;
};

export async function request<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<ApiResponse<T>> {
    const url = `${BASE_URL}${endpoint}`;
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    const headers = new Headers(options.headers);
    headers.set("Content-Type", "application/json");
    if (token) {
        headers.set("Authorization", `Bearer ${token}`);
    }

    try {
        const response = await fetch(url, {
            ...options,
            headers,
        });

        const data = await response.json();

        if (!response.ok && !data.success) {
            return {
                success: false,
                data: null as any,
                error: data.error || { message: "Something went wrong" },
                statusCode: response.status,
            };
        }

        return data;
    } catch (error: any) {
        return {
            success: false,
            data: null as any,
            error: { message: error.message || "Network Error" },
            statusCode: 500,
        };
    }
}

export const api = {
    get: <T>(endpoint: string, options?: RequestInit) =>
        request<T>(endpoint, { ...options, method: "GET" }),
    post: <T>(endpoint: string, body: any, options?: RequestInit) =>
        request<T>(endpoint, { ...options, method: "POST", body: JSON.stringify(body) }),
    patch: <T>(endpoint: string, body: any, options?: RequestInit) =>
        request<T>(endpoint, { ...options, method: "PATCH", body: JSON.stringify(body) }),
    delete: <T>(endpoint: string, options?: RequestInit) =>
        request<T>(endpoint, { ...options, method: "DELETE" }),
};
