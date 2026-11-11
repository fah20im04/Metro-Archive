import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  FileText,
  GraduationCap,
  Search,
  Star,
  Users,
  ShieldCheck,
  LibraryBig,
  Menu,
} from "lucide-react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Features from "./Features";
import Hero from "./Hero";

const features = [
  {
    icon: LibraryBig,
    title: "Semester Archives",
    description: "Academic resources by department, semester, and batch.",
    label: "Browse archives",
    href: "/archives",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: FileText,
    title: "Previous Question Papers",
    description: "Previous exam questions collected from different batches.",
    label: "Explore questions",
    href: "/question-bank",
    color: "bg-orange-50 text-orange-600",
  },
  {
    icon: Star,
    title: "Faculty Feedback",
    description:
      "Student ratings and constructive reviews about our faculty members.",
    label: "View faculty",
    href: "/faculty",
    color: "bg-amber-50 text-amber-600",
  },
  {
    icon: BookOpen,
    title: "Shared Study Notes",
    description:
      "Find helpful notes, study materials, and resources shared by fellow students.",
    label: "Find resources",
    href: "/resources",
    color: "bg-emerald-50 text-emerald-600",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <Hero />

      <Features />

      <Footer />
    </main>
  );
}
