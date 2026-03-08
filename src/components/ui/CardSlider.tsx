"use client";

import { useState } from "react";
import Image from "next/image";

export default function CardSlider({
  images,
  alt,
  className = "",
}: {
  images: string[];
  alt: string;
  className?: string;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="card-slider"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {images.map((src, i) => {
        const isActive = hovered ? i === 0 : i === 1;
        return (
          <Image
            key={src}
            src={src}
            alt={`${alt} ${i + 1}`}
            fill
            className={`card-slider__img ${className} ${isActive ? "card-slider__img--active" : ""}`}
            sizes="(max-width: 768px) 50vw, 33vw"
            draggable={false}
          />
        );
      })}
    </div>
  );
}
