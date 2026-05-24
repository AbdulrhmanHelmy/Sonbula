// Use Vercel backend by default, or override with environment variable
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://planet-ai-backend-gules.vercel.app/api";

export interface User {
  _id: string;
  username: string;
  email: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    _id: string;
    username: string;
    email: string;
    token: string;
  };
  error?: string[] | string;
}

export const api = {
  // Authentication endpoints
  signin: async (email: string, password: string): Promise<AuthResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data: AuthResponse = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: typeof data.error === "string" ? data.error : data.message || "Login failed",
        };
      }

      return data;
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : "An error occurred",
      };
    }
  },

  signup: async (username: string, email: string, password: string): Promise<AuthResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data: AuthResponse = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message:
            typeof data.error === "string"
              ? data.error
              : Array.isArray(data.error)
              ? data.error.join(", ")
              : data.message || "Signup failed",
        };
      }

      return data;
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : "An error occurred",
      };
    }
  },

  // Token management
  getToken: (): string | null => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token");
    }
    return null;
  },

  setToken: (token: string): void => {
    if (typeof window !== "undefined") {
      localStorage.setItem("token", token);
    }
  },

  clearToken: (): void => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  },

  // User info management
  getUser: (): User | null => {
    if (typeof window !== "undefined") {
      const user = localStorage.getItem("user");
      return user ? JSON.parse(user) : null;
    }
    return null;
  },

  setUser: (user: User): void => {
    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(user));
    }
  },

  isAuthenticated: (): boolean => {
    return api.getToken() !== null;
  },
};
