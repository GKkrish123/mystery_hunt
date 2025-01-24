"use client";

import { type ImageProps } from "next/image";

export default function myImageLoader({ src, width, quality }: ImageProps) {
  return `https://example.com/${src as string}?w=${width}&q=${quality ?? 75}`;
}
