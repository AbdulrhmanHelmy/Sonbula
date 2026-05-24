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
