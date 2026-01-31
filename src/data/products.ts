export interface Product {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  icon: string;
  category: "video" | "ai" | "music" | "utility";
  status: "flagship" | "new" | "beta" | "coming-soon";
  badge?: string;
  externalUrl?: string;
  appStoreUrl?: string;
  image?: string;
}

export const products: Product[] = [
  {
    slug: "video-editor",
    name: "Video Editor",
    tagline: "AI-powered video creation platform",
    description:
      "Turn vibes into videos instantly. Multi-agent AI system for professional video creation without skills, equipment, or budget.",
    icon: "video",
    category: "video",
    status: "flagship",
    badge: "Flagship",
    externalUrl: "https://editor.superduperai.co",
    image: "/images/screens/screen1.webp",
  },
  {
    slug: "super-chatbot",
    name: "Super Chatbot",
    tagline: "Intelligent AI assistant for your business",
    description:
      "Multi-agent chatbot platform with RAG, tool use, and custom knowledge bases. Deploy on web, Telegram, or WhatsApp.",
    icon: "bot",
    category: "ai",
    status: "new",
    badge: "New",
    image: "/images/products/chatbot.webp",
  },
  {
    slug: "face-alarm",
    name: "FaceAlarm",
    tagline: "Wake up with face detection",
    description:
      "Smart alarm clock that uses face detection to make sure you're actually awake. No more snoozing — the alarm stops only when it sees your face.",
    icon: "alarm",
    category: "utility",
    status: "new",
    badge: "iOS App",
    externalUrl: "https://www.face-alarm.com",
    image: "/images/products/face-alarm.webp",
  },
  {
    slug: "jaw-harp-synth",
    name: "Jaw Harp Synth",
    tagline: "Digital kubyz instrument for iOS",
    description:
      "Virtual jaw harp (kubyz) synthesizer. Play traditional instrument sounds with modern digital effects on your iPhone.",
    icon: "music",
    category: "music",
    status: "beta",
    badge: "Beta",
    image: "/images/products/jaw-harp.webp",
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(category: Product["category"]): Product[] {
  return products.filter((p) => p.category === category);
}
