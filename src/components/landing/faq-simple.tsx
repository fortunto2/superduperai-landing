import { Locale } from "@/config/i18n-config";
import { useTranslation } from "@/hooks/use-translation";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  items?: FAQItem[];
  locale: string;
}

export function FAQ({ items, locale }: FAQProps) {
  const { t } = useTranslation(locale as Locale);

  // Default FAQ items if none are provided
  const faqItems = items || [
    {
      question: "Is this service free?",
      answer:
        "SuperDuperAI offers a free tier with limited features to help you get started. We also offer premium plans with additional capabilities for professionals and businesses.",
    },
    {
      question:
        "How can I download your app or create videos myself using your algorithm?",
      answer:
        "Our platform is web-based, so you don't need to download anything. Simply create an account on our website, and you can start creating videos using our intuitive interface right away.",
    },
    {
      question: "How long does it take for you to create a video?",
      answer:
        "With SuperDuperAI, most videos are generated within minutes. The exact time depends on the complexity of your request, the length of the video, and current system load.",
    },
    {
      question: "Can you create a video for free?",
      answer:
        "Yes, you can create videos using our free tier. Free videos have certain limitations in length, quality, and available styles, but they're great for testing our platform.",
    },
    {
      question: "What technology do you use for your video creation service?",
      answer:
        "SuperDuperAI uses a combination of advanced AI technologies including stable diffusion models, OpenTimelineIO, and our proprietary multi-agent system that handles various aspects of video creation from scripting to editing.",
    },
  ];

  return (
    <section className="py-16 w-full bg-card/50">
      <div className="container mx-auto px-4">
        <h2 className="text-5xl font-bold text-center mb-12">{t("ui.faq")}</h2>
        <div className="max-w-3xl mx-auto space-y-6">
          {faqItems.map((item, index) => (
            <div
              key={index}
              className="border-b border-border/20 pb-6"
            >
              <h3 className="text-xl font-medium mb-2">{item.question}</h3>
              <p className="text-lg text-muted-foreground">{item.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
