// components/LightShard.tsx
"use client";
import Image, { StaticImageData } from "next/image";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { getAssetsStorageUrl } from "@/utils/helpers";

export default function LightShard({
  src,
  className,
}: {
  src?: string | StaticImageData;
  className: string;
}) {
  const sectionRef = useRef(null);
  const lightshardleft = getAssetsStorageUrl("Homepage/lightshardleft.png");

  const inView = useInView(sectionRef, { once: true, margin: "-100px" });
  return (
    <motion.div
      ref={sectionRef}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 1, delay: 0.3 }}
      //   viewport={{ once: true }}
      className={className}
    >
      <Image
        src={src ? src : lightshardleft}
        alt="glowing background"
        width={1920}
        height={1080}
        priority
        loading="eager"
        className="w-full h-full object-cover object-center"
      />
    </motion.div>
  );
}
