"use client";
import { motion, useMotionValue, useMotionTemplate } from "framer-motion";
import { useRef } from "react";

export default function GlowingTransparentDivTestimonial({
  children,
  border = "full",
}: {
  children: React.ReactNode;
  border?: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(50); // percent
  const mouseY = useMotionValue(50); // percent

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    mouseX.set(x);
    mouseY.set(y);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className={`relative group cursor-pointer flex flex-col justify-between rounded-${border} overflow-hidden w-full h-full`}
      initial="rest"
      whileHover="hover"
      animate="rest"
      style={{
        background: `
          linear-gradient(#1a1414, #1a1414) padding-box,
          linear-gradient(90deg,
            rgba(175,175,175,0.18) 0%,
            rgba(255,255,255,0.18) 50%,
            rgba(126,126,126,0.18) 100%
          ) border-box
        `,
        border: "1px solid transparent",
        boxShadow: `
          inset 0 0 12.7px rgba(255,255,255,0.25),
          0 2px 10.1px -2px rgba(255,0,0,0.2),
          0 4px 6px -1px rgba(0,0,0,0.1)
        `,
        backdropFilter: "blur(61.8px)",
        WebkitBackdropFilter: "blur(61.8px)",
      }}
    >
      {/* Cursor-tracking glow, hugs border only, all sides */}
      <motion.div
        className={`pointer-events-none absolute inset-0 rounded-${border} z-20`}
        variants={{
          rest: { opacity: 0 },
          hover: { opacity: 1 },
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        style={{
          padding: "2px",
          background: useMotionTemplate`radial-gradient(140px circle at ${mouseX}% ${mouseY}%, rgba(255,20,20,1) 0%, rgba(180,10,10,0.6) 40%, transparent 70%)`,
          WebkitMask:
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />

      <div className="h-full w-full">
        {/* INNER CARD CONTENT */}
        {children}
      </div>
    </motion.div>
  );
}
