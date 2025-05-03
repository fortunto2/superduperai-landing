import Link from "next/link";
import { APP_URLS } from "@/lib/constants";

export function Pricing() {
  const plans = [
    {
      name: "Free",
      price: "0",
      description: "Perfect for trying out SuperDuperAI",
      features: [
        "Limited video generation",
        "720p resolution",
        "Basic character customization",
        "Standard quality renders",
        "Export with watermark"
      ],
      cta: "Start Creating",
      popular: false
    },
    {
      name: "Creator",
      price: "29",
      description: "Everything you need for content creation",
      features: [
        "Unlimited video generation",
        "1080p resolution",
        "Advanced character customization",
        "High quality renders",
        "Watermark-free exports",
        "Priority rendering"
      ],
      cta: "Get Started",
      popular: true
    },
    {
      name: "Business",
      price: "99",
      description: "For teams and businesses with advanced needs",
      features: [
        "Everything in Creator plan",
        "4K resolution",
        "Team collaboration",
        "API access",
        "Custom branding",
        "Premium support",
        "Commercial usage rights"
      ],
      cta: "Contact Sales",
      popular: false
    }
  ];

  return (
    <div className="container max-w-6xl py-16 px-4">
      <h1 className="text-5xl font-bold mb-6 text-center">Simple, Transparent Pricing</h1>
      <p className="text-xl text-center text-muted-foreground mb-16 max-w-3xl mx-auto">
        Choose the plan that works best for your creative needs. All plans include access to our AI video generation platform.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <div 
            key={plan.name}
            className={`rounded-xl border bg-card p-8 flex flex-col ${
              plan.popular 
                ? "border-primary shadow-lg relative" 
                : "border-border"
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                Most Popular
              </div>
            )}
            
            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <div className="flex items-end gap-1 mb-2">
                <span className="text-4xl font-bold">${plan.price}</span>
                <span className="text-muted-foreground mb-1">/month</span>
              </div>
              <p className="text-muted-foreground">{plan.description}</p>
            </div>
            
            <ul className="space-y-3 mb-8 flex-grow">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            
            <Link
              href={plan.name === "Business" ? APP_URLS.CALENDLY_URL : APP_URLS.EDITOR_URL}
              className={`w-full py-3 rounded-lg text-center font-medium transition-colors ${
                plan.popular
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
              target={plan.name === "Business" ? "_blank" : undefined}
              rel={plan.name === "Business" ? "noopener noreferrer" : undefined}
            >
              {plan.cta}
            </Link>
          </div>
        ))}
      </div>
      
      <div className="mt-16 max-w-3xl mx-auto text-center">
        <h2 className="text-2xl font-bold mb-4">Need a custom plan?</h2>
        <p className="text-muted-foreground mb-6">
          For enterprise needs or custom requirements, our team is here to help create the perfect solution for your business.
        </p>
        <a
          href={APP_URLS.CALENDLY_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-secondary text-secondary-foreground hover:bg-secondary/80 px-6 py-2 rounded-lg inline-block font-medium transition-colors"
        >
          Contact Our Sales Team
        </a>
      </div>
    </div>
  );
} 