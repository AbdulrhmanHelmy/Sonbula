export interface Disease {
  name: string;
  type: string;
  affectsLeaf: boolean;
  affectsFruit: boolean;
  severity: "متوسط" | "شديد" | string;
  symptoms: string[];
  causes: string;
  treatment: string;
  prevention: string;
}

export interface Plant {
  id: string;
  name: string;
  nameEn: string;
  emoji: string;
  category: string;
  image: string;
  leafImage: string;
  description: string;
  season: string;
  region: string;
  diseases: Disease[];
}

export interface Settings {
  theme: "light" | "dark" | "system";
  fontSize: "small" | "medium" | "large";
  language: "ar" | "en";
}


export interface User {
  _id?: string;
  username: string;
  email: string;
  governorate?: string;
}



// src/lib/types.ts

export type ChatMessage = {
  _id: string;
  role: "user" | "assistant";
  type: "text" | "image";
  content?: string;
  source?: "llm" | "cnn";
  imageUrl?: string;
  createdAt?: string;
  metadata?: {
    disease?: string;
    confidence?: number;
    [key: string]: any;
  };
  // Added for Optimistic UI handling
  isOptimistic?: boolean;
  isError?: boolean;
  originalFile?: File; // To keep the file in memory for retries
};

export type Conversation = {
  _id: string;
  title: string;
  updatedAt: string;
  createdAt: string;
};