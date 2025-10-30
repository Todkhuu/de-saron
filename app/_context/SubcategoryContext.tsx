"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { SubCategoryType } from "../utils/types";

type SubcategoryContextType = {
  subcategories: SubCategoryType[] | null;
  setSubcategories: React.Dispatch<
    React.SetStateAction<SubCategoryType[] | null>
  >;
  loading: boolean;
};

export const SubcategoryContext = createContext<SubcategoryContextType>(
  {} as SubcategoryContextType
);

export const SubcategoryProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [subcategories, setSubcategories] = useState<SubCategoryType[] | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);

  const getSubcategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/subcategories");
      setSubcategories(response.data.data);
    } catch (error: unknown) {
      toast.error(axios.isAxiosError(error).toString());
      console.log("error in subcategory context", error);
      setSubcategories(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSubcategories();
  }, []);

  return (
    <SubcategoryContext.Provider
      value={{ subcategories, setSubcategories, loading }}
    >
      {children}
    </SubcategoryContext.Provider>
  );
};

export const useSubcategory = () => useContext(SubcategoryContext);
