import { Metadata } from "next";

const PDF_URL =
  "https://blog.superduperai.co/api/file/uploads/2025-11-08T01-31-48-999Z-0a219428-SuperDuper_Pitch_-websummit_-mini.pdf";

export const metadata: Metadata = {
  title: "SuperDuperAI Pitch",
  description: "SuperDuperAI Investor Pitch Deck",
  robots: {
    index: false,
    follow: false,
  },
};

export default function PitchPage() {
  return (
    <div className="w-screen h-screen">
      <iframe
        src={PDF_URL}
        className="w-full h-full border-0"
        title="SuperDuperAI Pitch Deck"
      />
    </div>
  );
}
