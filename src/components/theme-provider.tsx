"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // React.useEffect(() => {
  //   if (navigator.hardwareConcurrency <= 12) {
  //     console.log(document.body.classList)
  //     document.body.classList.add('disable-animations');
  //   }
  // }, [])
  // return <NextThemesProvider {...props}><h1>{navigator.hardwareConcurrency}</h1>{children}</NextThemesProvider>
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
