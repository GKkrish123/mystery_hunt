/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import imageCompression, { type Options } from "browser-image-compression";

const emojis = [
  "😊",
  "😜",
  "😎",
  "😴",
  "😇",
  "😺",
  "💀",
  "👽",
  "💫",
  "👏",
  "💪",
  "👑",
  "💛",
  "💍",
  "🐷",
  "🐒",
  "🐥",
  "🐍",
  "🐝",
  "🐜",
  "🐬",
  "🐳",
  "🐐",
  "🐓",
  "🐖",
  "🐁",
  "🍀",
  "🌹",
  "🌻",
  "🌙",
  "🌍",
  "⭐",
  "🌀",
  "🎁",
  "🎊",
  "🎈",
  "🔑",
  "🚬",
  "💣",
  "🎸",
  "🎮",
  "🎯",
  "🏆",
  "🍼",
  "🍺",
  "🍗",
  "🍖",
  "🍩",
  "🍮",
  "🍦",
  "🍬",
  "🍭",
  "🍓",
  "🍑",
  "🍆",
  "🍅",
  "🌽",
  "⛲",
  "🎢",
  "🎭",
  "📍",
  "🚩",
  "❇",
  "♏",
  "♐",
  "🔱",
];

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getRandomEmoji = () => {
  return emojis[Math.floor(Math.random() * emojis.length)];
};

export async function compressBase64Image(
  base64String: string,
  options: Options,
): Promise<string> {
  const file = await base64ToFile(base64String);
  const compressedFile = await imageCompression(file, options);
  return toBase64(compressedFile);
}

export async function base64ToFile(base64String: string): Promise<File> {
  const response = await fetch(base64String);
  const blob = await response.blob();
  const fileType = base64String.substring(
    base64String.indexOf(":") + 1,
    base64String.indexOf(";"),
  );
  return new File([blob], "compressedImage.jpeg", { type: fileType });
}

export function toBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function chunkArray<T>(array: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}

export function pick<T extends object, K extends keyof T>(
  obj: T,
  keys: K[],
): Pick<T, K> {
  return keys.reduce(
    (acc, key) => {
      if (key in obj) {
        acc[key] = obj[key];
      }
      return acc;
    },
    {} as Pick<T, K>,
  );
}

export function shuffleArray(array: any[]): any[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
