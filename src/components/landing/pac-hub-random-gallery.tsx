"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";

const GALLERY_IMAGES = [
  "/images/pac-hub/gallery/photo-01.jpg",
  "/images/pac-hub/gallery/photo-02.jpg",
  "/images/pac-hub/gallery/photo-03.jpg",
  "/images/pac-hub/gallery/photo-04.jpg",
  "/images/pac-hub/gallery/photo-05.jpg",
  "/images/pac-hub/gallery/photo-06.jpg",
  "/images/pac-hub/gallery/photo-07.jpg",
  "/images/pac-hub/gallery/photo-08.jpg",
  "/images/pac-hub/gallery/photo-09.jpg",
  "/images/pac-hub/gallery/photo-10.jpg",
] as const;

const SLIDES_TO_SHOW = 3;
const ROTATE_MS = 3500;

function pickRandomSlides(pool: readonly string[], count: number): string[] {
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, pool.length));
}

export default function PacHubRandomGallery() {
  const initialSlides = useMemo(
    () => pickRandomSlides(GALLERY_IMAGES, SLIDES_TO_SHOW),
    []
  );
  const [slides, setSlides] = useState<string[]>(initialSlides);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setSlides((current) => {
        let next = pickRandomSlides(GALLERY_IMAGES, SLIDES_TO_SHOW);
        while (next.join("|") === current.join("|")) {
          next = pickRandomSlides(GALLERY_IMAGES, SLIDES_TO_SHOW);
        }
        return next;
      });
    }, ROTATE_MS);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <section className="border-t border-white/5 py-10">
      <h2 className="text-center text-2xl font-bold">Hub Gallery</h2>
      <p className="mx-auto mt-2 text-center text-sm text-zinc-500">
        Random moments from Gazipasa hub setup
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {slides.map((src) => (
          <div
            key={src}
            className="relative overflow-hidden rounded-xl border border-white/5 bg-[hsl(220,13%,9%)]"
          >
            <div className="relative aspect-[2/3] w-full">
              <Image
                src={src}
                alt="PAC Hub Gazipasa gallery photo"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover"
                priority={false}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
