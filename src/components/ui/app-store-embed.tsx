"use client";

import Image from "next/image";
import { Star, Apple, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

interface AppData {
  appId: string;
  name: string;
  developer: string;
  icon: string;
  rating: number;
  ratingCount: number;
  description: string;
  price: string;
  screenshots: string[];
  appStoreUrl: string;
}

interface AppStoreEmbedProps {
  appId: string;
  country?: string;
  /** Override screenshots if API doesn't return them yet */
  screenshots?: string[];
}

function StarRating({ rating, count }: { rating: number; count: number }) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.5;

  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < fullStars
                ? "fill-yellow-400 text-yellow-400"
                : i === fullStars && hasHalf
                  ? "fill-yellow-400/50 text-yellow-400"
                  : "text-gray-400"
            }`}
          />
        ))}
      </div>
      {count > 0 && (
        <span className="text-sm text-muted-foreground">
          {rating.toFixed(1)} ({count})
        </span>
      )}
    </div>
  );
}

function Skeleton() {
  return (
    <div className="w-full animate-pulse">
      <div className="flex gap-6 items-center justify-center py-8">
        <div className="w-[100px] h-[100px] rounded-[22px] bg-muted" />
        <div className="flex flex-col gap-2">
          <div className="h-6 w-40 bg-muted rounded" />
          <div className="h-4 w-24 bg-muted rounded" />
        </div>
      </div>
      <div className="flex gap-4 justify-center pb-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="w-[200px] h-[433px] bg-muted rounded-2xl" />
        ))}
      </div>
    </div>
  );
}

export function AppStoreEmbed({
  appId,
  country = "us",
  screenshots: overrideScreenshots,
}: AppStoreEmbedProps) {
  const [app, setApp] = useState<AppData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(
          `https://itunes.apple.com/lookup?id=${appId}&country=${country}`
        );
        const data = await res.json();

        if (data.resultCount === 0) {
          setError("App not found");
          return;
        }

        const appData = data.results[0];
        setApp({
          appId: String(appData.trackId),
          name: appData.trackName,
          developer: appData.artistName,
          icon: appData.artworkUrl512,
          rating: appData.averageUserRating || 0,
          ratingCount: appData.userRatingCount || 0,
          description: appData.description,
          price: appData.formattedPrice,
          screenshots: appData.screenshotUrls || [],
          appStoreUrl: appData.trackViewUrl.replace("?uo=4", ""),
        });
      } catch {
        setError("Failed to load app data");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [appId, country]);

  useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  if (loading) return <Skeleton />;
  if (error || !app) return null;

  const screenshots =
    overrideScreenshots?.length ? overrideScreenshots : app.screenshots;

  return (
    <div className="w-full py-8">
      {/* App info header */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-8 px-4">
        <Image
          src={app.icon}
          alt={app.name}
          width={100}
          height={100}
          className="rounded-[22px] shadow-lg"
          unoptimized
        />
        <div className="flex flex-col items-center sm:items-start gap-2">
          <h3 className="text-2xl font-bold">{app.name}</h3>
          <p className="text-sm text-muted-foreground">{app.developer}</p>
          {app.rating > 0 && (
            <StarRating rating={app.rating} count={app.ratingCount} />
          )}
          <a
            href={app.appStoreUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-black hover:bg-gray-800 text-white text-sm font-medium rounded-xl transition-colors mt-2"
          >
            <Apple className="w-5 h-5" />
            <div className="text-left">
              <div className="text-[10px] opacity-70 leading-none">
                Download on the
              </div>
              <div className="leading-tight font-semibold">App Store</div>
            </div>
          </a>
        </div>
      </div>

      {/* Screenshots carousel */}
      {screenshots.length > 0 && (
        <div className="relative px-4 md:px-12">
          <Carousel
            setApi={setApi}
            opts={{
              align: "center",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {screenshots.map((url, i) => (
                <CarouselItem
                  key={i}
                  className="pl-2 md:pl-4 basis-[280px] md:basis-[320px] cursor-pointer"
                  onClick={() => api?.scrollTo(i)}
                >
                  <div
                    className={cn(
                      "transition-all duration-300 ease-out",
                      current === i
                        ? "scale-100 opacity-100"
                        : "scale-90 opacity-50"
                    )}
                  >
                    <Image
                      src={url}
                      alt={`${app.name} screenshot ${i + 1}`}
                      width={320}
                      height={693}
                      className="rounded-2xl shadow-2xl"
                      unoptimized
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            {/* Navigation buttons */}
            <button
              onClick={() => api?.scrollPrev()}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors"
              aria-label="Previous screenshot"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={() => api?.scrollNext()}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors"
              aria-label="Next screenshot"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </Carousel>

          {/* Dots indicator */}
          <div className="flex justify-center gap-2 mt-6">
            {screenshots.map((_, i) => (
              <button
                key={i}
                onClick={() => api?.scrollTo(i)}
                className={cn(
                  "w-2 h-2 rounded-full transition-all",
                  current === i
                    ? "bg-white w-6"
                    : "bg-white/30 hover:bg-white/50"
                )}
                aria-label={`Go to screenshot ${i + 1}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
