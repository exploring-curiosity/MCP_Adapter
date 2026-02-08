"use client";

const LOGOS = [
  { name: "OpenAPI", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/openapi/openapi-original.svg" },
  { name: "Swagger", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/swagger/swagger-original.svg" },
  { name: "Postman", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postman/postman-original.svg" },
  { name: "Claude", src: "https://cdn.simpleicons.org/anthropic/D4A27F" },
  { name: "OpenAI", src: "https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg" },
  { name: "Docker", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg" },
  { name: "TypeScript", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg" },
  { name: "Python", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg" },
  { name: "Node.js", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg" },
];

export function LogoBar() {
  const doubled = [...LOGOS, ...LOGOS];

  return (
    <section className="py-16 overflow-hidden relative">
      <div className="section-glow-line absolute top-0 left-0 right-0" />
      <div className="section-glow-line absolute bottom-0 left-0 right-0" />
      <div className="max-w-7xl mx-auto px-6 mb-10">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
          Compatible with your entire stack
        </p>
      </div>
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-40 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-40 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
        <div className="flex animate-marquee items-center">
          {doubled.map((logo, idx) => (
            <div key={`${logo.name}-${idx}`} className="flex items-center gap-3 px-8 shrink-0 opacity-50 hover:opacity-100 transition-all duration-300 group">
              <div className="w-8 h-8 rounded-lg glass flex items-center justify-center group-hover:glow-border transition-all">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={logo.src} alt={logo.name} className="w-5 h-5 object-contain" loading="lazy" />
              </div>
              <span className="text-sm font-medium text-foreground/50 group-hover:text-foreground/80 whitespace-nowrap transition-colors">
                {logo.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
