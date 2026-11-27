"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowUpRight, Mail } from "lucide-react";

interface Developer {
  id: string;
  name: string;
  role: string;
  bio: string;
  // Put the picture in public/developed-by/pictures/ and reference it here
  image: string;
  // Only the socials that are filled in are shown
  socials: {
    github?: string;
    linkedin?: string;
    facebook?: string;
    portfolio?: string;
    email?: string;
  };
}

// TODO: edit the bios, roles and social links, and add the two pictures.
const developers: Developer[] = [
  {
    id: "fahim",
    name: "Fahim Ahmed Ayon",
    role: "Project Lead",
    bio: "Led the project and built most of its core: the database models, authentication, server actions, the archive and question bank backend, and the admin tools and user management.",
    image: "/developed-by/pictures/fahim.jpg",
    socials: {
      github: "https://github.com/fah20im04",
      linkedin: "https://www.linkedin.com/in/fahim-ahmed-ayon-07457a388",
      facebook: "https://www.facebook.com/fah20im04",
      email: "ahmedayonfahim@gmail.com",
    },
  },
  {
    id: "fahiyan",
    name: "Fahiyan Shah Chand",
    role: "Frontend Developer",
    bio: "Built much of the user-facing side: the navbar, dashboard pages, settings, home page sections and this About page, plus the theme and styling fixes that keep the interface consistent.",
    image: "/developed-by/pictures/fahiyan.jpg",
    socials: {
      github: "https://github.com/thisisyourfahi",
      linkedin: "https://www.linkedin.com/in/fahiyan-shah-chand",
      facebook: "https://www.facebook.com/thisisyourfahi1",
      email: "fahiyanofficial@gmail.com",
    },
  },

];

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

const socialLabels: [keyof Developer["socials"], string][] = [
  ["github", "GitHub"],
  ["linkedin", "LinkedIn"],
  ["facebook", "Facebook"],
  ["portfolio", "Portfolio"],
];

const pillClass =
  "inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-background/60 px-3.5 py-1.5 text-sm font-medium text-foreground! no-underline! transition hover:border-primary/40 hover:text-primary!";

const DevelopedBy = () => {
  // Remember which pictures failed to load, so we can show initials instead
  const [failedImages, setFailedImages] = useState<string[]>([]);

  return (
    <section className="px-5 py-16 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Developed by
          </h2>

          <p className="mt-3 text-base text-muted">
            Two students, one course project that turned into something we
            actually use.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
          {developers.map((developer) => {
            const imageFailed = failedImages.includes(developer.id);

            return (
              <div
                key={developer.id}
                className="flex flex-col items-center rounded-3xl border border-border/80 bg-surface/65 p-8 text-center transition hover:border-primary/40 hover:bg-surface"
              >
                {/* Picture (falls back to initials) */}
                <div className="relative h-32 w-32 overflow-hidden rounded-full border border-border bg-primary-light">
                  {imageFailed ? (
                    <div className="flex h-full w-full items-center justify-center text-3xl font-bold text-primary">
                      {getInitials(developer.name)}
                    </div>
                  ) : (
                    <Image
                      src={developer.image}
                      alt={developer.name}
                      fill
                      sizes="128px"
                      className="object-cover"
                      onError={() =>
                        setFailedImages((prev) => [...prev, developer.id])
                      }
                    />
                  )}
                </div>

                <h3 className="mt-5 text-xl font-bold tracking-tight">
                  {developer.name}
                </h3>

                <p className="mt-1 text-sm font-medium text-primary">
                  {developer.role}
                </p>

                <p className="mt-4 text-sm leading-relaxed text-muted">
                  {developer.bio}
                </p>

                {/* Socials */}
                <div className="mt-6 flex flex-wrap justify-center gap-2">
                  {socialLabels.map(([key, label]) => {
                    const href = developer.socials[key];

                    if (!href) return null;

                    return (
                      <a
                        key={key}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={pillClass}
                      >
                        {label}
                        <ArrowUpRight size={14} />
                      </a>
                    );
                  })}

                  {developer.socials.email && (
                    <a
                      href={`mailto:${developer.socials.email}`}
                      className={pillClass}
                    >
                      <Mail size={14} />
                      Email
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default DevelopedBy;
