import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from '@/auth';
import { TodoProvider } from '@/todo';
import { ModalProvider } from '@/modal/ModalProvider';
import { Modal } from '@/modal/Modal';
import { API_URL, checkApiHealth } from '../api';

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
  // Validate API URL on the client side
  if (typeof window !== 'undefined') {
    // This will run only in the browser
    try {
      console.log('API URL:', API_URL);
      
      // Optionally check API health on initial load
      checkApiHealth().then(isHealthy => {
        if (!isHealthy) {
          console.error('API health check failed. The API may be unavailable.');
        }
      });
    } catch (error) {
      console.error('API configuration error:', error);
      // You could render an error page here
    }
  }

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
