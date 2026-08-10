import {
  Bricolage_Grotesque,
  DM_Sans,
  Montserrat,
  Koulen,
  Poppins,
} from "next/font/google";

export const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["500", "700", "800"],
  display: "swap",
  preload: true,
});

export const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  preload: false,
});

export const dm_sans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  preload: true,
});

export const koulen = Koulen({
  weight: "400",
  variable: "--font-koulen",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

export const poppins = Poppins({
  weight: ["400", "600", "700", "800", "900"],
  variable: "--font-poppins",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});
