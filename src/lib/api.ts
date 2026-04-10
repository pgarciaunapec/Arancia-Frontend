const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const AUTH_TOKEN_KEY = "restaurant_auth_token";

export const getAuthToken = (): string | null =>
  localStorage.getItem(AUTH_TOKEN_KEY);

export const setAuthToken = (token: string | null) => {
  if (token) {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  } else {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  }
};

interface ApiRequestOptions extends RequestInit {
  auth?: boolean;
}

export async function apiRequest<T = unknown>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const { auth = false, headers, ...rest } = options;
  const token = getAuthToken();
  const isFormDataBody =
    typeof FormData !== "undefined" && rest.body instanceof FormData;

  const requestHeaders: HeadersInit = {
    ...(headers || {}),
  };

  if (!isFormDataBody && !("Content-Type" in requestHeaders)) {
    requestHeaders["Content-Type"] = "application/json";
  }

  if (auth && token) {
    requestHeaders.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: requestHeaders,
  });

  const contentType = response.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const payload = isJson ? await response.json() : null;

  if (!response.ok) {
    const message =
      payload?.error ||
      payload?.message ||
      (payload?.errors && payload.errors[0]?.msg) ||
      `HTTP ${response.status}`;
    throw new Error(message);
  }

  return payload as T;
}

export type ApiEnvelope<T> = {
  success?: boolean;
  data: T;
  count?: number;
  message?: string;
};
