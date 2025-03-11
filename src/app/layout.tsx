import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from '@/auth';
import { TodoProvider } from '@/todo';
import { ModalProvider } from '@/modal/ModalProvider';
import { Modal } from '@/modal/Modal';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Todo List App",
  description: "A modern todo list application",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <TodoProvider>
            <ModalProvider>
              {children}
              <Modal />
            </ModalProvider>
          </TodoProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
