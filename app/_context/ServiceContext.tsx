"use client";
import { ServiceType } from "../utils/types";
import React, { createContext, useEffect, useContext, useState } from "react";
import axios from "axios";
import { toast } from "sonner";

type ServiceContextType = {
  services: ServiceType[] | null;
  setServices: React.Dispatch<React.SetStateAction<ServiceType[] | null>>;
  loading: boolean;
};

export const ServiceContext = createContext<ServiceContextType>(
  {} as ServiceContextType
);

export const ServiceProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [services, setServices] = useState<ServiceType[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const getService = async () => {
    try {
      setLoading(true);
      const services = await axios.get("/api/services");
      setServices(services.data.data);
    } catch (error: unknown) {
      toast.error(axios.isAxiosError(error).toString());
      console.log("error in context", error);
      setServices(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getService();
  }, []);

  return (
    <ServiceContext.Provider value={{ services, setServices, loading }}>
      {children}
    </ServiceContext.Provider>
  );
};
export const useService = () => useContext(ServiceContext);
