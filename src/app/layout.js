
import { Cormorant_Garamond, Manrope } from "next/font/google";
import Navbar from "@/components/layout/Navbar/Navbar";
import { ToastProvider } from "@/components/ui/ToastProvider";
import Toast from "@/components/ui/Toast";
import "./globals.css";
import Footer from "@/components/layout/Footer/Footer";

const manrope = Manrope({
    variable: "--font-manrope",
    subsets: ["latin"],
    display: "swap",
});

const cormorant = Cormorant_Garamond({
    variable: "--font-cormorant",
    subsets: ["latin"],
    weight: ["400", "500", "600"],
    style: ["normal", "italic"],
    display: "swap",
});

export const metadata = {
    title: {
        default: "WedPlan — Modern Wedding Planning",
        template: "%s | WedPlan",
    },
    description:
        "Plan a beautiful wedding with thoughtful tools and a calm, considered planning experience.",
};

export default function RootLayout({ children }) {
    return (
        <html
            lang="en"
            className={`${manrope.variable} ${cormorant.variable} h-full antialiased`}
        >
            <body className="flex min-h-full flex-col bg-ivory font-sans text-ink">
                <ToastProvider>
                    <Navbar />
                    <main className="flex-1">{children}</main>
                    <Footer/>
                    <Toast />
                </ToastProvider>
            </body>
        </html>
    );
}
