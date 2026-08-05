"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const STORAGE_KEY = "vitatepro_demo_mode";

type DemoModeContextValue = {
  isDemo: boolean;
  enableDemo: () => void;
  disableDemo: () => void;
};

const DemoModeContext = createContext<DemoModeContextValue>({
  isDemo: false,
  enableDemo: () => undefined,
  disableDemo: () => undefined,
});

export function DemoModeProvider({ children }: { children: React.ReactNode }) {
  const [isDemo, setIsDemo] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const param = searchParams.get("demo");
    if (param === "1") {
      window.localStorage.setItem(STORAGE_KEY, "1");
      setIsDemo(true);
      return;
    }
    if (param === "0") {
      window.localStorage.removeItem(STORAGE_KEY);
      setIsDemo(false);
      return;
    }
    setIsDemo(window.localStorage.getItem(STORAGE_KEY) === "1");
  }, [searchParams]);

  const stripDemoParam = useCallback(() => {
    const next = new URLSearchParams(searchParams.toString());
    next.delete("demo");
    const q = next.toString();
    router.replace(q ? `${pathname}?${q}` : pathname);
  }, [pathname, router, searchParams]);

  const enableDemo = useCallback(() => {
    window.localStorage.setItem(STORAGE_KEY, "1");
    setIsDemo(true);
  }, []);

  const disableDemo = useCallback(() => {
    window.localStorage.removeItem(STORAGE_KEY);
    setIsDemo(false);
    if (searchParams.get("demo")) stripDemoParam();
  }, [searchParams, stripDemoParam]);

  const value = useMemo(
    () => ({ isDemo, enableDemo, disableDemo }),
    [isDemo, enableDemo, disableDemo],
  );

  return (
    <DemoModeContext.Provider value={value}>{children}</DemoModeContext.Provider>
  );
}

export function useDemoMode() {
  return useContext(DemoModeContext);
}
