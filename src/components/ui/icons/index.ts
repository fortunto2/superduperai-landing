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
  type LucideIcon
} from 'lucide-react';

// Экспортируем иконки из отдельных файлов
export * from "./discord";
export * from "./telegram";
export * from "./tiktok";
export * from "./youtube";
export * from "./instagram";
export * from "./microsoft";

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
  users: Users,
  star: Star
}; 