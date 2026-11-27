import type { Metadata } from "next";

import AboutUsDetails from "@/app/Components/aboutUs/AboutUsDetails";
import DevelopedBy from "@/app/Components/aboutUs/DevelopedBy";
import Footer from "@/app/Components/Footer";

export const metadata: Metadata = {
    title: "About Us | MUArchive",
    description:
        "What MUArchive is, how it works, and the students who built it.",
};

export default function Page() {
    return (
        <main className="min-h-screen bg-background text-foreground">
            <AboutUsDetails />

            <DevelopedBy />

            <Footer />
        </main>
    );
}