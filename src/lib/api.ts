const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://planet-ai-backend-gules.vercel.app/api";

export interface User {
  _id: string;
  username: string;
  email: string;
  governorate?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    _id: string;
    username: string;
    email: string;
    token: string;
    governorate?: string;
  };
  error?: string[] | string;
}

export const api = {
  signin: async (email: string, password: string): Promise<AuthResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data: AuthResponse = await response.json();
      if (!response.ok) {
        return {
          success: false,
          message:
            typeof data.error === "string"
              ? data.error
              : data.message || "Login failed",
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

  signup: async (
    username: string,
    email: string,
    password: string,
    governorate: string,
  ): Promise<AuthResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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

  forgotPassword: async (email: string): Promise<AuthResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      return await response.json();
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : "An error occurred",
      };
    }
  },

  resetPassword: async (
    email: string,
    otp: string,
    newPassword: string,
  ): Promise<AuthResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword }),
      });
      return await response.json();
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : "An error occurred",
      };
    }
  },

  // --- Analytics ---

  getGovernorateDistribution: async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/analytics/distribution/governorate`,
      );
      if (!response.ok)
        throw new Error("Failed to fetch governorate distribution");
      return await response.json();
    } catch (error) {
      console.error(error);
      return [];
    }
  },

  getDiseaseDistribution: async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/analytics/distribution/disease`,
      );
      if (!response.ok) throw new Error("Failed to fetch disease distribution");
      return await response.json();
    } catch (error) {
      console.error(error);
      return [];
    }
  },

  getScansHistory: async (
    page = 1,
    limit = 10,
    governorate?: string,
    sortBy = "date",
  ) => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sortBy,
      });
      if (governorate) params.append("governorate", governorate);
      const response = await fetch(
        `${API_BASE_URL}/analytics/scans?${params.toString()}`,
      );
      if (!response.ok) throw new Error("Failed to fetch scans history");
      return await response.json();
    } catch (error) {
      console.error(error);
      return { data: [], total: 0 };
    }
  },

  // --- Chat & Assistant ---

  createConversation: async (title?: string) => {
    try {
      const token = api.getToken();
      const response = await fetch(`${API_BASE_URL}/chat/conversations`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(title ? { title } : {}),
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
      const response = await fetch(`${API_BASE_URL}/chat/conversations`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return await response.json();
    } catch (error) {
      console.error(error);
      return { success: false, data: [] };
    }
  },

  getConversationById: async (id: string, options?: RequestInit) => {
    try {
      const token = api.getToken();
      const response = await fetch(`${API_BASE_URL}/chat/conversations/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        signal: options?.signal,
      });
      return await response.json();
    } catch (error) {
      console.error(error);
      return { success: false, data: null };
    }
  },

  sendTextToConversation: async (
    id: string,
    text: string,
    options?: RequestInit,
  ) => {
    try {
      const token = api.getToken();
      const response = await fetch(
        `${API_BASE_URL}/chat/conversations/${id}/text`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ question: text }),
          signal: options?.signal,
        },
      );
      return await response.json();
    } catch (error) {
      console.error(error);
      return { success: false };
    }
  },

  sendImageToConversation: async (
    id: string,
    file: File,
    question?: string,
    options?: RequestInit,
  ) => {
    try {
      const token = api.getToken();
      const formData = new FormData();
      formData.append("file", file);
      if (question && question.trim() !== "") {
        formData.append("question", question);
      }
      const response = await fetch(
        `${API_BASE_URL}/chat/conversations/${id}/image`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
          signal: options?.signal,
        },
      );
      return await response.json();
    } catch (error) {
      console.error(error);
      return { success: false };
    }
  },

  deleteConversation: async (id: string) => {
    try {
      const token = api.getToken();
      const response = await fetch(`${API_BASE_URL}/chat/conversations/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      return await response.json();
    } catch (error) {
      console.error(error);
      return { success: false };
    }
  },

  // --- Community ---

  getPosts: async () => {
    try {
      const token = api.getToken();
      const response = await fetch(`${API_BASE_URL}/community/posts`, {
        headers: { Authorization: `Bearer ${token}` },
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
      if (media) formData.append("media", media);
      const response = await fetch(`${API_BASE_URL}/community/posts`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      return await response.json();
    } catch (error) {
      console.error(error);
      return { success: false };
    }
  },

  deletePost: async (postId: string) => {
    try {
      const token = api.getToken();
      const response = await fetch(
        `${API_BASE_URL}/community/posts/${postId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      return await response.json();
    } catch (error) {
      console.error(error);
      return { success: false };
    }
  },

  togglePostUpvote: async (postId: string) => {
    try {
      const token = api.getToken();
      const response = await fetch(
        `${API_BASE_URL}/community/posts/${postId}/upvote`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      return await response.json();
    } catch (error) {
      console.error(error);
      return { success: false };
    }
  },

  getPostComments: async (postId: string) => {
    try {
      const token = api.getToken();
      const response = await fetch(
        `${API_BASE_URL}/community/posts/${postId}/comments`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
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
      const response = await fetch(
        `${API_BASE_URL}/community/posts/${postId}/comments`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content }),
        },
      );
      return await response.json();
    } catch (error) {
      console.error(error);
      return { success: false };
    }
  },

  deleteComment: async (postId: string, commentId: string) => {
    try {
      const token = api.getToken();
      const response = await fetch(
        `${API_BASE_URL}/community/posts/${postId}/comments/${commentId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      return await response.json();
    } catch (error) {
      console.error(error);
      return { success: false };
    }
  },

  voteComment: async (commentId: string, voteType: "upvote" | "downvote") => {
    try {
      const token = api.getToken();
      const response = await fetch(
        `${API_BASE_URL}/community/comments/${commentId}/vote`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ voteType }),
        },
      );
      return await response.json();
    } catch (error) {
      console.error(error);
      return { success: false };
    }
  },

  getUserPosts: async (userId: string) => {
    try {
      const token = api.getToken();
      const response = await fetch(
        `${API_BASE_URL}/community/users/${userId}/posts`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      return await response.json();
    } catch (error) {
      console.error(error);
      return { success: false, data: [] };
    }
  },

  // --- User Profile ---

  getUserGreeting: async () => {
    try {
      const token = api.getToken();
      const response = await fetch(`${API_BASE_URL}/user/greeting`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return await response.json();
    } catch (error) {
      console.error(error);
      return { success: false, data: null };
    }
  },

  // --- Token & User Management ---

  getToken: (): string | null => {
    if (typeof window !== "undefined") return localStorage.getItem("token");
    return null;
  },

  setToken: (token: string): void => {
    if (typeof window !== "undefined") localStorage.setItem("token", token);
  },

  clearToken: (): void => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  },

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
