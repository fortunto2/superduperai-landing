export function VideoShowcase() {
  return (
    <section className="py-16 w-full">
      <div className="container mx-auto px-4">
        <h2 className="text-5xl font-bold text-center mb-8">Look!</h2>
        <div className="max-w-4xl mx-auto aspect-video rounded-xl overflow-hidden shadow-2xl border border-primary/20">
          <iframe
            width="100%"
            height="100%"
            src="https://www.youtube.com/embed/ulG2_BLFzxc"
            title="SuperDuperAI Demo Video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          ></iframe>
        </div>
        <div className="flex justify-center gap-8 mt-16">
          <a
            href="https://instagram.com/superduperai"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:text-accent/80 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-12 w-12"
            >
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
            </svg>
          </a>
          <a
            href="https://youtube.com/@superduperai"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:text-accent/80 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-12 w-12"
            >
              <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
              <path d="m10 15 5-3-5-3z" />
            </svg>
          </a>
          <a
            href="https://t.me/superduperai"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:text-accent/80 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-12 w-12"
            >
              <path d="M21.5 12 18 8.5V5.5a1.5 1.5 0 0 0-1.5-1.5h-3L10 .5 6.5 4h-3A1.5 1.5 0 0 0 2 5.5v3L.5 12 4 15.5v3a1.5 1.5 0 0 0 1.5 1.5h3L12 23.5l3.5-3.5h3a1.5 1.5 0 0 0 1.5-1.5v-3l3.5-3.5z" />
              <path d="M9 12 5 5h13.5l-9 13" />
            </svg>
          </a>
          <a
            href="https://tiktok.com/@superduperai"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:text-accent/80 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-12 w-12"
            >
              <path d="M9 12a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" />
              <path d="M15 8c0 2 2 4 4 4V8c-2 0-4-2-4-4Z" />
              <path d="M15 8h-4v4h4" />
              <path d="M19 8V4a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v0" />
              <path d="M11 12v7c0 .6-.4 1-1 1H9c-1.1 0-2-.9-2-2v-5" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
} 