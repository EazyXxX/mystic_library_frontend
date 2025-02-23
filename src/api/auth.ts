import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { jwtDecode } from "jwt-decode";

// Create axios instance
export const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Create mock adapter
const mock = new MockAdapter(api, { delayResponse: 1000 });

// Mock tokens
const generateToken = (payload: any, expiresIn: number) => {
  const token = btoa(
    JSON.stringify({
      ...payload,
      exp: Date.now() + expiresIn,
    })
  );
  return `mock-jwt-${token}`;
};

const mockTokens = {
  access: generateToken({ id: "1", username: "admin" }, 15 * 60 * 1000), // 15 minutes
  refresh: generateToken({ id: "1" }, 7 * 24 * 60 * 60 * 1000), // 7 days
};

// Mock login endpoint
mock.onPost("/auth/login").reply(200, {
  user: {
    id: "1",
    username: "admin",
    email: "admin@example.com",
  },
  tokens: mockTokens,
});

// Mock refresh token endpoint
mock.onPost("/auth/refresh").reply((config) => {
  const { refresh_token } = JSON.parse(config.data);
  try {
    const decoded = jwtDecode(refresh_token);
    if (decoded.exp && decoded.exp < Date.now()) {
      return [401, { message: "Refresh token expired" }];
    }
    return [200, { tokens: mockTokens }];
  } catch {
    return [401, { message: "Invalid refresh token" }];
  }
});

// Add token refresh interceptor
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
          throw new Error("No refresh token");
        }

        const { data } = await api.post("/auth/refresh", {
          refresh_token: refreshToken,
        });

        const { tokens } = data;
        localStorage.setItem("accessToken", tokens.access);
        localStorage.setItem("refreshToken", tokens.refresh);

        api.defaults.headers.common.Authorization = `Bearer ${tokens.access}`;
        processQueue(null, tokens.access);
        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// Auth API functions
export const login = async (username: string, password: string) => {
  const response = await api.post("/auth/login", { username, password });
  const { user, tokens } = response.data;

  localStorage.setItem("accessToken", tokens.access);
  localStorage.setItem("refreshToken", tokens.refresh);

  api.defaults.headers.common.Authorization = `Bearer ${tokens.access}`;

  return user;
};

export const logout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  delete api.defaults.headers.common.Authorization;
};
