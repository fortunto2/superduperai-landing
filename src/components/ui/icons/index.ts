import { 
  Image, 
  Settings, 
  Clock, 
  Edit, 
  Palette, 
  Layers,
  CheckCircle,
  ArrowRight,
  Zap,
  Shield,
  BarChart,
  Users,
  Star,
  Video,
  Store,
  Music,
  Book,
  Sparkle,
  Tv,
  Share,
  ShoppingCart,
  type LucideIcon
} from 'lucide-react';

// Экспортируем иконки из отдельных файлов
export * from "./discord";
export * from "./telegram";
export * from "./tiktok";
export * from "./youtube";
export * from "./instagram";
export * from "./microsoft";
export * from "./linkedin";

export const Icons: Record<string, LucideIcon> = {
  image: Image,
  quality: CheckCircle,
  speed: Zap,
  settings: Settings,
  clock: Clock,
  edit: Edit,
  palette: Palette,
  layers: Layers,
  arrow: ArrowRight,
  security: Shield,
  chart: BarChart,
  chartBar: BarChart,
  users: Users,
  star: Star,
  video: Video,
  store: Store,
  music: Music,
  book: Book,
  sparkles: Sparkle,
  tv: Tv,
  share: Share,
  shoppingCart: ShoppingCart
}; 