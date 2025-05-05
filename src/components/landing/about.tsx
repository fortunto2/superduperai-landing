import { default as Link } from "@/components/ui/optimized-link";
import { APP_URLS } from "@/lib/constants";

export function About() {
  return (
    <div className="container max-w-4xl py-16 px-4">
      <h1 className="text-5xl font-bold mb-12 text-center">About SuperDuperAI</h1>
      
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-6">Our Mission</h2>
        <p className="text-lg mb-6">
          At SuperDuperAI, we&apos;re on a mission to democratize video creation. We believe that powerful storytelling should be accessible to everyone, regardless of technical skills or budget constraints.
        </p>
        <p className="text-lg mb-6">
          From concept to final cut, our AI agents collaborate seamlessly to transform your ideas into stunning movies in minutes, not days. We&apos;re revolutionizing the way stories are told through the power of artificial intelligence.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-6">What We Do</h2>
        <p className="text-lg mb-6">
          SuperDuperAI helps you create engaging content by building consistent, customizable characters and stories using generative AI. Our seamless API integration allows developers to easily generate videos, images, and text for platforms like TikTok and Instagram Reels.
        </p>
        <p className="text-lg mb-6">
          With SuperDuperAI, you can craft powerful narratives around consistent characters, driving better audience connection and engagement. We revolutionize your content creation process with advanced AI tools, and elevate your social marketing efforts with ease and efficiency.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-6">Our Technology</h2>
        <p className="text-lg mb-6">
          Our platform is built on cutting-edge technologies including:
        </p>
        <ul className="list-disc list-inside text-lg space-y-2 mb-6">
          <li>Stable Diffusion</li>
          <li>OpenTimelineIO</li>
          <li>Advanced AI agent architecture</li>
          <li>Customizable character generation</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-6">Contact Us</h2>
        <div className="text-lg space-y-2">
          <p>SuperDuperAi, Corp.</p>
          <p>57 Saulsbury Rd, Unit E #1333</p>
          <p>Dover, DE 19904</p>
          <p>+1 818 619 0966</p>
          <p>
            <a 
              href="mailto:info@superduperai.co" 
              className="text-primary hover:underline"
            >
              info@superduperai.co
            </a>
          </p>
        </div>
      </section>

      <div className="mt-12 text-center">
        <Link 
          href={APP_URLS.EDITOR_URL} 
          className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3 rounded-lg text-lg font-medium transition-colors"
        >
          Start Creating Your Story
        </Link>
      </div>
    </div>
  );
} 