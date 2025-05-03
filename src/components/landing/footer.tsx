import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full py-12 bg-card/50 border-t border-border/50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-bold">SuperDuperAI</h3>
            <div className="text-muted-foreground space-y-2">
              <p>SuperDuperAi, Corp.</p>
              <p>57 Saulsbury Rd, Unit E #1333</p>
              <p>Dover, DE 19904</p>
              <p>+1 818 619 0966</p>
              <a 
                href="mailto:info@superduperai.co" 
                className="hover:text-primary transition-colors duration-300"
              >
                info@superduperai.co
              </a>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Product</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <Link href="/features" className="hover:text-primary transition-colors duration-300">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-primary transition-colors duration-300">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/docs" className="hover:text-primary transition-colors duration-300">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="/changelog" className="hover:text-primary transition-colors duration-300">
                  Changelog
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Resources</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <Link href="/blog" className="hover:text-primary transition-colors duration-300">
                  Blog
                </Link>
              </li>
              <li>
                <a 
                  href="https://discord.gg/superduperai" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-primary transition-colors duration-300"
                >
                  Discord
                </a>
              </li>
              <li>
                <Link href="/faq" className="hover:text-primary transition-colors duration-300">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/support" className="hover:text-primary transition-colors duration-300">
                  Support
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Company</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <Link href="/about" className="hover:text-primary transition-colors duration-300">
                  About
                </Link>
              </li>
              <li>
                <Link href="/jobs" className="hover:text-primary transition-colors duration-300">
                  Jobs
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-primary transition-colors duration-300">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-primary transition-colors duration-300">
                  Terms and Conditions
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-border/20 flex flex-col md:flex-row justify-between items-center text-muted-foreground">
          <p className="mb-4 md:mb-0">
            © {currentYear} SuperDuperAi Corp. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a 
              href="https://twitter.com/superduperai" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-primary transition-colors duration-300"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="h-5 w-5"
              >
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
              </svg>
            </a>
            <a 
              href="https://github.com/superduperai" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-primary transition-colors duration-300"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="h-5 w-5"
              >
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                <path d="M9 18c-4.51 2-5-2-7-2" />
              </svg>
            </a>
            <a 
              href="https://linkedin.com/company/superduperai" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-primary transition-colors duration-300"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="h-5 w-5"
              >
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect width="4" height="12" x="2" y="9" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
} 