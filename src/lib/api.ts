// Use Vercel backend by default, or override with environment variable
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://planet-ai-backend-gules.vercel.app/api";

export interface User {
  _id: string;
  username: string;
  email: string;
  governorate?: string; // 👈 ضفنا المحافظة هنا
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    _id: string;
    username: string;
    email: string;
    token: string;
    governorate?: string; // 👈 وهنا كمان عشان لو الباك إند بيرجعها في الرد
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

  // 👈 عدلنا الـ Parameters عشان تستقبل الـ governorate
  signup: async (username: string, email: string, password: string, governorate: string): Promise<AuthResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // 👈 ضفنا الـ governorate في الـ Body اللي مبعوت للباك إند
        body: JSON.stringify({ username, email, password, governorate }),
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

  // Analytics Endpoints

  /**
   * Fetches disease distribution across governorates for the heatmap.
   */
  getGovernorateDistribution: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/analytics/distribution/governorate`);
      if (!response.ok) throw new Error("Failed to fetch governorate distribution");
      return await response.json();
    } catch (error) {
      console.error(error);
      return [];
    }
  },

  /**
   * Fetches overall disease distribution for the charts.
   */
  getDiseaseDistribution: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/analytics/distribution/disease`);
      if (!response.ok) throw new Error("Failed to fetch disease distribution");
      return await response.json();
    } catch (error) {
      console.error(error);
      return [];
    }
  },

  /**
   * Fetches the scans history with pagination and optional governorate filtering.
   */
  getScansHistory: async (page = 1, limit = 10, governorate?: string, sortBy = "date") => {
    try {
      // Build query string dynamically
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sortBy,
      });
      if (governorate) params.append("governorate", governorate);

      const response = await fetch(`${API_BASE_URL}/analytics/scans?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch scans history");
      return await response.json();
    } catch (error) {
      console.error(error);
      return { data: [], total: 0 };
    }
  },
  
  // --- Chat & Assistant Endpoints ---
  
  createConversation: async (title?: string) => {
    try {
      const token = api.getToken();
      // التعديل هنا: ضفنا /chat قبل /conversations
      const response = await fetch(`${API_BASE_URL}/chat/conversations`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(title ? { title } : {})
      });
      return await response.json();
    } catch (error) {
      console.error(error);
      return { success: false };
    }
  },

  getConversations: async () => {
    try {
      const token = api.getToken();
      // التعديل هنا: ضفنا /chat قبل /conversations
      const response = await fetch(`${API_BASE_URL}/chat/conversations`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      return await response.json();
    } catch (error) {
      console.error(error);
      return { success: false, data: [] };
    }
  },

  getConversationById: async (id: string) => {
    try {
      const token = api.getToken();
      // التعديل هنا: الـ باث بقى /chat/conversations/:id
      const response = await fetch(`${API_BASE_URL}/chat/conversations/${id}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      return await response.json();
    } catch (error) {
      console.error(error);
      return { success: false, data: null };
    }
  },

  sendTextToConversation: async (id: string, text: string) => {
    try {
      const token = api.getToken();
      // التعديل هنا: الـ باث بقى /chat/conversations/:id/text
      const response = await fetch(`${API_BASE_URL}/chat/conversations/${id}/text`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ question: text })
      });
      return await response.json();
    } catch (error) {
      console.error(error);
      return { success: false };
    }
  },

  sendImageToConversation: async (id: string, file: File) => {
    try {
      const token = api.getToken();
      const formData = new FormData();
      formData.append("file", file);

      // التعديل هنا: الـ باث بقى /chat/conversations/:id/image
      const response = await fetch(`${API_BASE_URL}/chat/conversations/${id}/image`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: formData
      });
      return await response.json();
    } catch (error) {
      console.error(error);
      return { success: false };
    }
  },

  deleteConversation: async (id: string) => {
    try {
      const token = api.getToken();
      // التعديل هنا: الـ باث بقى /chat/conversations/:id
      const response = await fetch(`${API_BASE_URL}/chat/conversations/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      return await response.json();
    } catch (error) {
      console.error(error);
      return { success: false };
    }
  },

  // --- Community Endpoints ---

  getPosts: async () => {
    try {
      const token = api.getToken();
      const response = await fetch(`${API_BASE_URL}/community/posts`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      return await response.json();
    } catch (error) {
      console.error(error);
      return { success: false, data: [] };
    }
  },

  createPost: async (content: string, media?: File) => {
    try {
      const token = api.getToken();
      const formData = new FormData();
      formData.append("content", content);
      if (media) {
        formData.append("media", media);
      }
      const response = await fetch(`${API_BASE_URL}/community/posts`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: formData,
      });
      return await response.json();
    } catch (error) {
      console.error(error);
      return { success: false };
    }
  },

  togglePostUpvote: async (postId: string) => {
    try {
      const token = api.getToken();
      const response = await fetch(`${API_BASE_URL}/community/posts/${postId}/upvote`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      return await response.json();
    } catch (error) {
      console.error(error);
      return { success: false };
    }
  },

  getPostComments: async (postId: string) => {
    try {
      const token = api.getToken();
      const response = await fetch(`${API_BASE_URL}/community/posts/${postId}/comments`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      return await response.json();
    } catch (error) {
      console.error(error);
      return { success: false, data: [] };
    }
  },

  // Toggle save status of a post
  toggleSavePost: async (postId: string): Promise<{ success: boolean; savedPosts?: string[] }> => {
    try {
      const token = api.getToken();
      const response = await fetch(`${API_BASE_URL}/community/posts/${postId}/save`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return response.json();
    } catch (error) {
      console.error("Error toggling save post:", error);
      return { success: false };
    }
  },

  // Get user's saved posts IDs
  getSavedPosts: async (): Promise<{ success: boolean; data?: string[] }> => {
    try {
      const token = api.getToken();
      const response = await fetch(`${API_BASE_URL}/community/saved-posts`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      return response.json();
    } catch (error) {
      console.error("Error fetching saved posts:", error);
      return { success: false, data: [] };
    }
  },

  // Get community stats
  getCommunityStats: async (): Promise<{ success: boolean; data?: { membersCount: number; postsCount: number } }> => {
    try {
      const token = api.getToken();
      const response = await fetch(`${API_BASE_URL}/community/stats`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      return response.json();
    } catch (error) {
      console.error("Error fetching community stats:", error);
      return { success: false };
    }
  },

  // Community Comments
  // Submit a complaint
  submitComplaint: async (subject: string, description: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const token = api.getToken();
      const response = await fetch(`${API_BASE_URL}/complaints`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ subject, description }),
      });
      return response.json();
    } catch (error) {
      console.error("Error submitting complaint:", error);
      return { success: false, message: "Network error" };
    }
  },

  // Get user complaints
  getUserComplaints: async (): Promise<{ success: boolean; data?: any[] }> => {
    try {
      const token = api.getToken();
      const response = await fetch(`${API_BASE_URL}/complaints/my-complaints`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      return response.json();
    } catch (error) {
      console.error("Error fetching user complaints:", error);
      return { success: false, data: [] };
    }
  },

  addComment: async (postId: string, content: string): Promise<any> => {
    try {
      const token = api.getToken();
      const response = await fetch(`${API_BASE_URL}/community/posts/${postId}/comments`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });
      return await response.json();
    } catch (error) {
      console.error(error);
      return { success: false };
    }
  },

  voteComment: async (commentId: string, voteType: "upvote" | "downvote") => {
    try {
      const token = api.getToken();
      const response = await fetch(`${API_BASE_URL}/community/comments/${commentId}/vote`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ voteType }),
      });
      return await response.json();
    } catch (error) {
      console.error(error);
      return { success: false };
    }
  },

  getUserPosts: async (userId: string) => {
    try {
      const token = api.getToken();
      const response = await fetch(`${API_BASE_URL}/community/users/${userId}/posts`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      return await response.json();
    } catch (error) {
      console.error(error);
      return { success: false, data: [] };
    }
  },

  // --- User Profile & Greeting ---
  getUserGreeting: async () => {
    try {
      const token = api.getToken();
      const response = await fetch(`${API_BASE_URL}/user/greeting`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      return await response.json();
    } catch (error) {
      console.error(error);
      return { success: false, data: null };
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

