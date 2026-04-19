"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface SkeletonImageProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
}

export default function SkeletonImage({
  src,
  alt,
  className,
  containerClassName,
}: SkeletonImageProps) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className={`relative overflow-hidden ${containerClassName}`}>
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 z-10 bg-gray-200"
          >
            {/* Shimmer Effect */}
            <motion.div
              className="absolute inset-0 bg-linear-to-r from-gray-200 via-gray-100 to-gray-200"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, 100vw"
        className={`object-cover transition-opacity duration-700 ${
          isLoading ? "opacity-0" : "opacity-100"
        } ${className}`}
        onLoad={() => setIsLoading(false)}
        priority
      />
    </div>
  );
}
