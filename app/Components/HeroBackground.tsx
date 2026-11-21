"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const images: string[] = [
    '/hero-bg-images/mu-hero.jpg',
    '/hero-bg-images/mu-hero-2.jpg',
    '/hero-bg-images/mu-hero-3.jpg',
    '/hero-bg-images/mu-hero-4.jpg',
];

export default function HeroBackground() {
    const [index, setIndex] = useState<number>(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((i) => (i + 1) % images.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="absolute inset-0 -z-20">
            {images.map((src, i) => (
                <Image
                    key={src}
                    src={src}
                    alt=""
                    fill
                    sizes="100vw"
                    priority={i === 0}
                    className={`object-cover transition-opacity duration-1000 ${i === index ? "opacity-100" : "opacity-0"
                        }`}
                />
            ))}
        </div>
    );
}