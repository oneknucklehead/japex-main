"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import herotext from "../assets/herotext.png";
import GlowingTransparentdiv from "./GlowingTransparentdiv";
import { getAssetsStorageUrl, getPreviewUrl } from "@/utils/helpers";

const BADGES = [
  "5 Years warranty",
  "Verified by a team of experts",
  "Japanese imports",
];

// Hosted alongside the other Supabase assets. Adjust the paths if you drop
// these in /public instead (then use "/video/hero-desktop.mp4" etc).
const heroBlackJapexLogo = getAssetsStorageUrl("Homepage/japexBlackStrip1.png");

// Intrinsic size of the logo artwork. Used to reserve its space before the
// image loads — without it the element has zero height and everything below
// shifts down when it arrives.
const LOGO_W = 1920;
const LOGO_H = 1080;
const VIDEO_DESKTOP_MP4 = getAssetsStorageUrl(
  "Homepage/hero-desktop-latest.mp4",
);
const VIDEO_DESKTOP_WEBM = getAssetsStorageUrl(
  "Homepage/hero-desktop-latest.webm",
);
const VIDEO_MOBILE_MP4 = getAssetsStorageUrl("Homepage/hero-mobile-latest.mp4");
const POSTER_DESKTOP = getAssetsStorageUrl("Homepage/hero-poster-latest.jpg", {
  width: 1600,
});
const POSTER_MOBILE = getAssetsStorageUrl(
  "Homepage/hero-poster-mobile-latest.jpg",
);

/**
 * Subscribes to a media query via useSyncExternalStore. The value is read
 * during render rather than pushed in from an effect, so there's no
 * setState-inside-useEffect and no cascading render.
 */
function useMediaQuery(query: string, serverFallback = false) {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    [query],
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => serverFallback,
  );
}

/** True when the user is on a metered or slow connection (Chromium only). */
function useSlowConnection() {
  const subscribe = useCallback((onChange: () => void) => {
    const conn = (navigator as any).connection;
    if (!conn?.addEventListener) return () => {};
    conn.addEventListener("change", onChange);
    return () => conn.removeEventListener("change", onChange);
  }, []);

  return useSyncExternalStore(
    subscribe,
    () => {
      const conn = (navigator as any).connection;
      if (!conn) return false;
      return (
        conn.saveData === true ||
        ["slow-2g", "2g", "3g"].includes(conn.effectiveType)
      );
    },
    () => false,
  );
}

export default function HeroBanner() {
  const isDesktop = useMediaQuery("(min-width: 768px)", true);
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const slowConnection = useSlowConnection();

  const variant = isDesktop ? "desktop" : "mobile";
  const showVideo = !reducedMotion && !slowConnection;
  // Poster matches the video crop for that breakpoint, so the still and the
  // first frame line up instead of jumping.
  const poster = isDesktop ? POSTER_DESKTOP : POSTER_MOBILE;

  // Crossfade the poster out once real frames are on screen. Driven by the
  // video's own "playing" event — an external system callback.
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Don't render <video> during SSR.
  //
  // useMediaQuery falls back to `true` (desktop) on the server, so the markup
  // shipped to a phone contained the DESKTOP sources. The browser began
  // fetching both of those, then hydration flipped `variant` to "mobile",
  // `key={variant}` remounted the element, and it fetched the mobile file too.
  // Net result on a phone: 8.5 MB of video for a 1.9 MB clip.
  //
  // Waiting for mount costs nothing visually — the poster is already painted
  // and is the LCP element — and guarantees exactly one variant is requested.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    setPlaying(false);
  }, [variant]);

  // Force muted on the element, then ask it to play.
  //
  // React treats `muted` as a DOM property rather than an attribute, so the
  // server-rendered HTML frequently ships `autoplay playsinline` WITHOUT
  // `muted`. Safari then sees an unmuted autoplay request, blocks it per its
  // autoplay policy, and shows native controls — which are untappable here
  // because the element is pointer-events-none. Chrome is laxer, so this only
  // ever surfaces on Safari and iOS.
  //
  // Setting .muted directly guarantees the property is true before play() is
  // called, which is what the policy actually checks.
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    el.muted = true;
    el.defaultMuted = true;

    const attempt = () => {
      const p = el.play();
      // Older Safari returns undefined rather than a promise.
      if (p && typeof p.catch === "function") {
        p.catch(() => {
          // Autoplay refused (Low Power Mode, for instance). The poster stays
          // visible, which is a reasonable fallback — better than a stuck
          // control overlay.
        });
      }
    };

    attempt();

    // iOS sometimes refuses until the tab is actually visible.
    const onVisible = () => {
      if (document.visibilityState === "visible") attempt();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [variant, showVideo]);

  return (
    <section className="relative w-full h-full min-h-svh overflow-hidden bg-black">
      {/* background media + dust */}
      <div className="absolute inset-0">
        {/* Poster — paints immediately, stays put if the video never plays */}
        <Image
          key={poster}
          src={getPreviewUrl(poster, { width: 1920 })}
          alt=""
          fill
          priority
          unoptimized
          loading="eager"
          sizes="100vw"
          className={`object-cover object-center transition-opacity duration-700 ${
            playing ? "opacity-0" : "opacity-100"
          }`}
        />

        {mounted && showVideo && (
          <video
            key={variant}
            ref={videoRef}
            autoPlay
            muted
            // `muted` here is for React's benefit; the effect above sets the
            // property directly, which is what Safari's autoplay check reads.
            loop
            playsInline
            // "metadata", not "auto". On mobile the hero video is ~1.9 MB and
            // preload="auto" starts fetching all of it immediately, competing
            // with the poster — which IS the LCP element. Metadata is enough to
            // start playback; the browser streams the rest as it plays.
            preload="metadata"
            poster={poster}
            disablePictureInPicture
            inert
            onPlaying={() => setPlaying(true)}
            className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center"
          >
            {variant === "desktop" ? (
              <>
                <source src={VIDEO_DESKTOP_WEBM} type="video/webm" />
                <source src={VIDEO_DESKTOP_MP4} type="video/mp4" />
              </>
            ) : (
              <source src={VIDEO_MOBILE_MP4} type="video/mp4" />
            )}
          </video>
        )}

        {/* readability scrim over the footage */}
        <div className="pointer-events-none absolute inset-0 bg-black/10 sm:bg-black/10" />

        {/* badge strip + bottom fade */}
        <div className="flex flex-wrap content-end items-end justify-center gap-2 sm:gap-3 md:gap-4 px-4 pb-6 sm:pb-8 absolute h-52 sm:h-56 md:h-60 bottom-0 w-full bg-linear-to-b from-transparent to-black">
          {BADGES.map((badge, i) => (
            <div
              key={badge}
              className="hero-rise"
              style={{ animationDelay: `${0.36 + i * 0.12}s` }}
            >
              <GlowingTransparentdiv>
                <div className="px-4 py-1.5 sm:px-5 sm:py-2 md:px-6">
                  <p className="font-koulen uppercase leading-6 sm:leading-7 md:leading-8 text-xs sm:text-sm md:text-lg lg:text-xl text-white">
                    {badge}
                  </p>
                </div>
              </GlowingTransparentdiv>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute px-4 md:px-8 inset-0 flex flex-col items-center justify-center h-fit w-full max-w-3xl text-center mx-auto z-10 pt-28 sm:pt-32 md:pt-40">
        {/* aspect-ratio reserves the logo's box before the file arrives, so the
            button below doesn't jump down once it loads. The ratio must match
            the artwork — update both this and the width/height below if the
            logo is ever replaced. */}
        <div className="hero-rise w-full max-w-[80%] sm:max-w-md md:max-w-2xl lg:max-w-3xl mb-2 md:mb-4">
          <Image
            src={getPreviewUrl(heroBlackJapexLogo, { width: 1200 })}
            alt="Japex Motors"
            width={705}
            height={101}
            sizes="(max-width: 768px) 90vw, 50vw"
            priority={true}
            loading="eager"
            unoptimized
            className="w-full h-auto object-contain object-center"
          />
        </div>
        {/* <p
            className="hero-rise font-montserrat font-medium text-xs sm:text-sm md:text-xl text-white"
            style={{ animationDelay: "0.12s" }}
          >
            Buy and sell cars with confidence and ease.
          </p> */}
        {/* <button
          type="button"
          className="hero-rise group flex gap-3 sm:gap-4 w-fit cursor-pointer items-center justify-center bg-brand-primary text-white font-montserrat font-bold text-sm pl-4 pr-2 py-2 rounded-full hover:bg-red-700 active:scale-97 transition-all duration-300 mt-4"
          style={{ animationDelay: "0.24s" }}
        >
          <span className="text-sm md:text-lg">Get a quote</span>
          <span className="bg-white text-black rounded-full p-1 flex items-center justify-center group-hover:rotate-45 transition-all duration-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4 md:w-6 md:h-6"
            >
              <path d="M7 7h10v10" />
              <path d="M7 17 17 7" />
            </svg>
          </span>
        </button> */}
      </div>
    </section>
  );
}
