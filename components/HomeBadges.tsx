"use client";

import GlowingTransparentdiv from "./GlowingTransparentdiv";
import { motion } from "framer-motion";

const HomeBadges = () => {
  return (
    <div className="hidden sm:flex  flex-wrap  justify-center space-x-2 space-y-2 px-6">
      <GlowingTransparentdiv>
        <div className="px-4 md:px-6 py-1 md:py-2">
          <motion.p className="font-koulen uppercase leading-8 text-sm md:text-xl text-white">
            5 Years warranty
          </motion.p>
        </div>
      </GlowingTransparentdiv>
      <GlowingTransparentdiv>
        <div className="px-4 md:px-6 py-1 md:py-2">
          <motion.p className="font-koulen uppercase leading-8 text-sm md:text-xl text-white">
            Japanese imports
          </motion.p>
        </div>
      </GlowingTransparentdiv>
      <GlowingTransparentdiv>
        <div className="px-4 md:px-6 py-1 md:py-2">
          <motion.p className="font-koulen uppercase leading-8 text-sm md:text-xl text-white">
            Verified by a team of experts
          </motion.p>
        </div>
      </GlowingTransparentdiv>
    </div>
  );
};

export default HomeBadges;
