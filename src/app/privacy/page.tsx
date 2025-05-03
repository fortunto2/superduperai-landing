import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - SuperDuperAI",
  description: "Privacy Policy for SuperDuperAI video generation platform."
};

export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-1 container py-12">
        <Breadcrumbs
          items={[
            { label: "Privacy", href: "/privacy" }
          ]}
          className="mb-8"
        />
        
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        
        <div className="prose prose-invert max-w-4xl">
          <p className="lead text-xl mb-8">
            At SuperDuperAI, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our services.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Information We Collect</h2>
          <p>
            We collect information that you provide directly to us when you:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Create an account</li>
            <li>Use our services to generate content</li>
            <li>Contact our support team</li>
            <li>Subscribe to our newsletters or marketing communications</li>
            <li>Participate in surveys, contests, or other promotional activities</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">How We Use Your Information</h2>
          <p>
            We may use the information we collect for various purposes, including to:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Provide, maintain, and improve our services</li>
            <li>Process transactions and send related information</li>
            <li>Send technical notices, updates, security alerts, and support messages</li>
            <li>Respond to your comments, questions, and requests</li>
            <li>Develop new products and services</li>
            <li>Monitor and analyze trends, usage, and activities in connection with our services</li>
            <li>Detect, investigate, and prevent fraudulent transactions and other illegal activities</li>
            <li>Personalize and improve your experience</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect the security of your personal information. However, please note that no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Your Rights</h2>
          <p>
            Depending on your location, you may have certain rights regarding your personal information, including:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>The right to access your personal information</li>
            <li>The right to rectify inaccurate or incomplete information</li>
            <li>The right to erasure of your personal information</li>
            <li>The right to restrict processing of your personal information</li>
            <li>The right to data portability</li>
            <li>The right to object to processing of your personal information</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Contact Information</h2>
          <p>
            If you have any questions about this Privacy Policy or our data practices, please contact us at:
          </p>
          <p>
            Email: info@superduperai.co
          </p>
          <p>
            Address: SuperDuperAi, Corp.<br />
            57 Saulsbury Rd, Unit E #1333<br />
            Dover, DE 19904<br />
            +1 818 619 0966
          </p>
          
          <p className="text-sm text-muted-foreground mt-12">
            For the full Privacy Policy, please visit our official website at: <a href="https://superduperai.co/privacy" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">https://superduperai.co/privacy</a>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
} 