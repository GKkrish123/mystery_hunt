import type { CapacitorConfig } from "@capacitor/cli";

// Use env vars if available to point the webview at a running server (dev or prod)
const SERVER_URL = process.env.CAP_SERVER_URL || process.env.NEXT_PUBLIC_CAP_SERVER_URL;

const config: CapacitorConfig = {
  appId: "com.mystery.hunt",
  appName: "MysteryHunt",
  webDir: "out",
  ios: {
    scheme: "https",
  },
  android: {
    scheme: "https",
  } as CapacitorConfig["android"],
  server: SERVER_URL
    ? {
        url: SERVER_URL,
        cleartext: SERVER_URL.startsWith("http://"),
      }
    : undefined,
};

export default config;
