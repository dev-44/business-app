import type { Metadata } from "next";
import MainHeader from "@/components/MainHeader";
import SideBarMenu from "@/components/SideBarMenu";
import './globals.css'

import { ReduxProvider } from "@/components/ReduxProvider";

export const metadata: Metadata = {
  title: "Companies Form",
  description: "An App for register new companies",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
      <ReduxProvider>
        <MainHeader />
        <div className="layout-container">
          
            <SideBarMenu />
            <div className="main-content">
              {children}
            </div>
          
        </div>  
      </ReduxProvider> 
      </body>
    </html>
  );
}
