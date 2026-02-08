"use client";

import { motion } from "framer-motion";

interface NexusLogoProps {
  size?: number;
  className?: string;
  animated?: boolean;
}

export function NexusLogo({ size = 36, className = "", animated = false }: NexusLogoProps) {
  const Wrapper = animated ? motion.div : "div";
  const animProps = animated
    ? { whileHover: { scale: 1.08, rotate: 15 }, transition: { type: "spring", stiffness: 300 } }
    : {};

  return (
    <Wrapper
      className={`relative flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
      {...(animProps as Record<string, unknown>)}
    >
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <circle cx="20" cy="20" r="18" stroke="url(#nexus-ring)" strokeWidth="1.5" opacity="0.4" strokeDasharray="8 4">
          {animated && (
            <animateTransform attributeName="transform" type="rotate" from="0 20 20" to="360 20 20" dur="12s" repeatCount="indefinite" />
          )}
        </circle>
        {animated && (
          <circle cx="20" cy="20" r="19.5" stroke="url(#nexus-ring)" strokeWidth="0.8" opacity="0.2" strokeDasharray="3 6">
            <animateTransform attributeName="transform" type="rotate" from="360 20 20" to="0 20 20" dur="18s" repeatCount="indefinite" />
          </circle>
        )}
        <path d="M20 3L35.32 11.5V28.5L20 37L4.68 28.5V11.5L20 3Z" fill="url(#nexus-fill)" stroke="url(#nexus-stroke)" strokeWidth="1.5" />
        <circle cx="20" cy="10" r="2.5" fill="url(#nexus-node)">
          {animated && <animate attributeName="r" values="2.5;3;2.5" dur="3s" repeatCount="indefinite" />}
        </circle>
        <circle cx="12" cy="25" r="2.5" fill="url(#nexus-node)">
          {animated && <animate attributeName="r" values="2.5;3;2.5" dur="3s" begin="1s" repeatCount="indefinite" />}
        </circle>
        <circle cx="28" cy="25" r="2.5" fill="url(#nexus-node)">
          {animated && <animate attributeName="r" values="2.5;3;2.5" dur="3s" begin="2s" repeatCount="indefinite" />}
        </circle>
        <circle cx="20" cy="20" r="3" fill="url(#nexus-center)">
          {animated && (
            <>
              <animate attributeName="r" values="3;3.8;3" dur="2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="1;0.7;1" dur="2s" repeatCount="indefinite" />
            </>
          )}
        </circle>
        <line x1="20" y1="10" x2="20" y2="20" stroke="hsl(172 66% 50% / 0.6)" strokeWidth="1.2" />
        <line x1="12" y1="25" x2="20" y2="20" stroke="hsl(172 66% 50% / 0.6)" strokeWidth="1.2" />
        <line x1="28" y1="25" x2="20" y2="20" stroke="hsl(172 66% 50% / 0.6)" strokeWidth="1.2" />
        <line x1="20" y1="10" x2="12" y2="25" stroke="hsl(172 66% 50% / 0.3)" strokeWidth="0.8" />
        <line x1="20" y1="10" x2="28" y2="25" stroke="hsl(172 66% 50% / 0.3)" strokeWidth="0.8" />
        <line x1="12" y1="25" x2="28" y2="25" stroke="hsl(172 66% 50% / 0.3)" strokeWidth="0.8" />
        <defs>
          <linearGradient id="nexus-fill" x1="4" y1="3" x2="36" y2="37" gradientUnits="userSpaceOnUse">
            <stop stopColor="hsl(172 66% 50% / 0.2)" />
            <stop offset="1" stopColor="hsl(260 60% 60% / 0.15)" />
          </linearGradient>
          <linearGradient id="nexus-stroke" x1="4" y1="3" x2="36" y2="37" gradientUnits="userSpaceOnUse">
            <stop stopColor="hsl(172 66% 50% / 0.7)" />
            <stop offset="1" stopColor="hsl(260 60% 60% / 0.5)" />
          </linearGradient>
          <linearGradient id="nexus-ring" x1="2" y1="2" x2="38" y2="38" gradientUnits="userSpaceOnUse">
            <stop stopColor="hsl(172 66% 50%)" />
            <stop offset="1" stopColor="hsl(260 60% 60%)" />
          </linearGradient>
          <radialGradient id="nexus-node" cx="0.5" cy="0.3" r="0.7">
            <stop stopColor="hsl(172 66% 70%)" />
            <stop offset="1" stopColor="hsl(172 66% 50%)" />
          </radialGradient>
          <radialGradient id="nexus-center" cx="0.5" cy="0.3" r="0.7">
            <stop stopColor="hsl(172 90% 80%)" />
            <stop offset="1" stopColor="hsl(172 66% 50%)" />
          </radialGradient>
        </defs>
      </svg>
    </Wrapper>
  );
}
