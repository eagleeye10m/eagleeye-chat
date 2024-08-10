import { Inter } from "next/font/google";
import "../globals.css";
import ToasterContext from "@/components/ToasterContext";
import Provider from "@/components/Provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Auth Eagleeye Chat",
  description: "Build a nextjs 14 chat app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-teal-500`}>
        <Provider>
          <ToasterContext />
        </Provider>
        {children}
      </body>
    </html>
  );
}
