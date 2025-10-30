"use client";
import { ServiceProvider } from "./_context/ServiceContext";
import { CategoryProvider } from "./_context/CategoryContext";
import { SubcategoryProvider } from "./_context/SubcategoryContext";
import { Toaster } from "sonner";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ServiceProvider>
      <CategoryProvider>
        <SubcategoryProvider>
          {children}
          <Toaster />
        </SubcategoryProvider>
      </CategoryProvider>
    </ServiceProvider>
  );
};
