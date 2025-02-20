import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import WebsiteHeader from "./components/WebsiteHeader";
import WebsiteFooter from "./components/WebsiteFooter";
import ClientSessionProvider from "./sessionProvider";
import ShoppingCartContextWrapper from "./(Contexts)/ShoppingCartContextWrapper";
import GlobalLoginPromptContextWrapper from "./(Contexts)/GlobalLoginPromptContextWrapper";
import { GlobalLoginTypeContextWrapper } from "./(Contexts)/GlobalLoginPromptContextWrapper";
import WishlistContextWrapper from "./(Contexts)/WishlistModalContextWrapper";
import GlobalWishlistTrackerContextWrapper from "./(Contexts)/GlobalWishlistTrackerContextWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Threadify",
  description: "E-commerce website mockup",
  icons: {
    icon: "/icon.png"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClientSessionProvider >
          <ShoppingCartContextWrapper >
            <GlobalLoginTypeContextWrapper >
              <GlobalLoginPromptContextWrapper >
                <GlobalWishlistTrackerContextWrapper >
                  <WishlistContextWrapper >
                    <WebsiteHeader />
                    {/* the padding top 100px is to account for the website top bar which is 100px for now*/}
                    <div className="pt-[100px] bg-white" >
                      {children}
                    </div>
                    <WebsiteFooter />
                  </WishlistContextWrapper>
                </GlobalWishlistTrackerContextWrapper>
              </GlobalLoginPromptContextWrapper>
            </GlobalLoginTypeContextWrapper>
          </ShoppingCartContextWrapper>
        </ClientSessionProvider>
      </body>
    </html>
  );
}
