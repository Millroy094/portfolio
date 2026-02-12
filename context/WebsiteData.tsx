"use client";

import { createContext, useContext, useState, ReactNode } from "react";

import type { WebsiteData } from "@/app/home/actions/getWebsiteData";

export type WebsiteDataContextType = {
  data: WebsiteData;
  setData: (d: WebsiteData) => void;
};

const WebsiteDataContext = createContext<WebsiteDataContextType | undefined>(undefined);

type WebsiteDataProviderProps = {
  children: ReactNode;
  initialData: WebsiteData;
};

export function WebsiteDataProvider({ children, initialData }: WebsiteDataProviderProps) {
  const [data, setData] = useState<WebsiteData>(initialData);

  return (
    <WebsiteDataContext.Provider value={{ data, setData }}>{children}</WebsiteDataContext.Provider>
  );
}

export function useWebsiteData() {
  const ctx = useContext(WebsiteDataContext);
  if (!ctx) throw new Error("useWebsiteData must be used inside WebsiteDataProvider");
  return ctx;
}
