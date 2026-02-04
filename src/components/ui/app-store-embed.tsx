"use client";

import Image from "next/image";
import { Star, Apple } from "lucide-react";
import { useEffect, useState } from "react";

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
    <div className="w-full max-w-2xl mx-auto rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden animate-pulse">
      <div className="p-6 flex gap-4">
        <div className="w-[120px] h-[120px] rounded-[22px] bg-muted" />
        <div className="flex flex-col justify-between py-1 flex-1">
          <div>
            <div className="h-6 w-40 bg-muted rounded mb-2" />
            <div className="h-4 w-24 bg-muted rounded" />
          </div>
          <div className="h-10 w-20 bg-muted rounded-full" />
        </div>
      </div>
      <div className="px-6 pb-6">
        <div className="h-4 w-full bg-muted rounded mb-2" />
        <div className="h-4 w-3/4 bg-muted rounded" />
      </div>
    </div>
  );
}

export function AppStoreEmbed({ appId, country = "us" }: AppStoreEmbedProps) {
  const [app, setApp] = useState<AppData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  if (loading) return <Skeleton />;
  if (error || !app) return null;

  return (
    <div className="w-full max-w-2xl mx-auto rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden my-8">
      {/* Header */}
      <div className="p-6 flex gap-4">
        <Image
          src={app.icon}
          alt={app.name}
          width={120}
          height={120}
          className="rounded-[22px] shadow-lg flex-shrink-0"
          unoptimized
        />
        <div className="flex flex-col justify-between py-1">
          <div>
            <h3 className="text-xl font-semibold">{app.name}</h3>
            <p className="text-sm text-muted-foreground">{app.developer}</p>
            {app.rating > 0 && (
              <StarRating rating={app.rating} count={app.ratingCount} />
            )}
          </div>
          <a
            href={app.appStoreUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-black hover:bg-gray-800 text-white text-sm font-medium rounded-xl transition-colors w-fit"
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
      {app.screenshots.length > 0 && (
        <div className="px-6 pb-4">
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-border snap-x">
            {app.screenshots.map((url, i) => (
              <Image
                key={i}
                src={url}
                alt={`${app.name} screenshot ${i + 1}`}
                width={200}
                height={433}
                className="rounded-xl flex-shrink-0 shadow-md snap-start"
                unoptimized
              />
            ))}
          </div>
        </div>
      )}

      {/* Description */}
      <div className="px-6 pb-6">
        <p className="text-sm text-muted-foreground whitespace-pre-line line-clamp-6">
          {app.description}
        </p>
      </div>
    </div>
  );
}
