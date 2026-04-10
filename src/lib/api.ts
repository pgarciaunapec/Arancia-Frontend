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

  // Only set Content-Type when there is a body and it's not FormData
  if (!isFormDataBody && rest.body && !("Content-Type" in requestHeaders)) {
    requestHeaders["Content-Type"] = "application/json";
  }

  if (auth && token) {
    requestHeaders.Authorization = `Bearer ${token}`;
  }

  // Ensure GET requests bypass browser cache to avoid receiving 304 Not Modified
  const method = (rest.method ? String(rest.method) : "GET").toUpperCase();
  const fetchOptions: RequestInit = {
    ...rest,
    headers: requestHeaders,
  };

  if (method === "GET" && !(fetchOptions as any).cache) {
    fetchOptions.cache = "no-store";
  }

  const response = await fetch(`${API_BASE_URL}${path}`, fetchOptions);

  const cacheKey = `api_cache:${API_BASE_URL}${path}`;

  // If server indicates resource not modified, try to return cached payload
  if (response.status === 304) {
    try {
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) {
        return JSON.parse(cached) as T;
      }
    } catch (e) {
      // ignore parse errors and fall-through to empty response
    }

    return {} as unknown as T;
  }

  const contentType = response.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const payload = isJson ? await response.json() : null;

  if (!response.ok) {
    const message =
      payload?.error ||
      payload?.message ||
      (payload?.details?.errors &&
        (payload.details.errors[0]?.message ||
          payload.details.errors[0]?.msg)) ||
      (payload?.errors && payload.errors[0]?.msg) ||
      (payload?.errors && payload.errors[0]?.message) ||
      `HTTP ${response.status}`;
    throw new Error(message);
  }

  // Persist successful JSON GET responses to sessionStorage so we can
  // recover data when the server later responds with 304 Not Modified.
  try {
    if (method === "GET" && isJson && payload) {
      sessionStorage.setItem(cacheKey, JSON.stringify(payload));
    }
  } catch (e) {
    // ignore storage errors
  }

  return payload as T;
}

export type ApiEnvelope<T> = {
  success?: boolean;
  data: T;
  count?: number;
  message?: string;
};
