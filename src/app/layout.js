import "./globals.css";

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata = {
  title: "Spotwise — The Quiet Place | Find Your Focus",
  description:
    "Spotwise helps students, remote workers, researchers, and professionals discover quiet workspaces based on live acoustic telemetry, crowd forecasts, seating, and Wi-Fi reliability.",
  keywords: [
    "Spotwise",
    "quiet workspaces",
    "focus places",
    "acoustic telemetry",
    "study cafes",
    "silent libraries",
    "remote work spaces",
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen bg-[#F4F1E8] text-[#252B26] antialiased selection:bg-[#263D31] selection:text-[#F4F1E8]">
        {children}
      </body>
    </html>
  );
}
