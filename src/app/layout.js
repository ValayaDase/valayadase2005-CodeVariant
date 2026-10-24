import { Inter, Newsreader } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const newsreader = Newsreader({
  variable: "--font-serif",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata = {
  title: "Spotwise — Choose your spot wisely | Space Discovery Engine",
  description:
    "Discover sensory-verified quiet workspaces based on real-time acoustic telemetry, crowd forecasts, power outlet density, and high-speed Wi-Fi.",
  keywords: [
    "quiet workspaces",
    "focus spots",
    "remote work cafes",
    "acoustic telemetry",
    "study spaces",
    "deep work",
  ],
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${newsreader.variable} scroll-smooth`}
    >
      <body className="min-h-screen bg-[#F5F3EC] text-[#20231F] selection:bg-[#819477] selection:text-white">
        {children}
      </body>
    </html>
  );
}
