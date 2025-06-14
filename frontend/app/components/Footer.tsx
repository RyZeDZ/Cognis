import Link from "next/link";
import { Github } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="mt-20 py-8 bg-card-bg border-t border-border">
      <div className="container mx-auto px-6 text-sm text-center">
        <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-6 text-muted-accent">
          <p>
            Made with <span className="text-red-500">❤️</span>
          </p>

          <span className="hidden md:block">|</span>

          <Link
            href="https://github.com/RyZeDZ/Cognis"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-accent transition-colors"
          >
            <Github size={16} />
            View Source
          </Link>
        </div>
      </div>
    </footer>
  );
};
