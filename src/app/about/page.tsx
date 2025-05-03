import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About SuperDuperAI - Our Mission and Team",
  description: "Learn about SuperDuperAI's mission, technology, and vision for democratizing video creation with AI."
};

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-1 container py-12">
        <Breadcrumbs
          items={[
            { label: "About", href: "/about" }
          ]}
          className="mb-8"
        />
        
        <h1 className="text-4xl font-bold mb-8">About SuperDuperAI</h1>
        
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
          <p className="text-lg mb-4">
            At SuperDuperAI, we're on a mission to democratize video creation. We believe that powerful storytelling should be accessible to everyone, regardless of technical skills or budget constraints.
          </p>
          <p className="text-lg mb-4">
            From concept to final cut, our AI agents collaborate seamlessly to transform your ideas into stunning movies in minutes, not days. We're revolutionizing the way stories are told through the power of artificial intelligence.
          </p>
        </section>
        
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">What We Do</h2>
          <p className="text-lg mb-4">
            SuperDuperAI helps you create engaging content by building consistent, customizable characters and stories using generative AI. Our seamless API integration allows developers to easily generate videos, images, and text for platforms like TikTok and Instagram Reels.
          </p>
          <p className="text-lg mb-4">
            With SuperDuperAI, you can craft powerful narratives around consistent characters, driving better audience connection and engagement. We revolutionize your content creation process with advanced AI tools, and elevate your social marketing efforts with ease and efficiency.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-4">Our Technology</h2>
          <p className="text-lg mb-4">
            Our platform is built on cutting-edge technologies including:
          </p>
          <ul className="list-disc pl-8 mb-4 space-y-2">
            <li className="text-lg">Stable Diffusion</li>
            <li className="text-lg">OpenTimelineIO</li>
            <li className="text-lg">Advanced AI agent architecture</li>
            <li className="text-lg">Customizable character generation</li>
          </ul>
        </section>
      </main>
      <Footer />
    </div>
  );
} 