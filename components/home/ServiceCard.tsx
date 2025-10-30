import { ServiceType } from "@/app/utils/types";
import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const ServiceCard = ({ service }: { service: ServiceType }) => {
  return (
    <Card className="overflow-hidden p-0">
      <div className="relative">
        <Image
          src={service.image || "/placeholder.svg"}
          alt={service.name}
          width={250}
          height={150}
          className="w-full h-[250px] object-cover object-center"
        />
      </div>
      <CardContent className="p-4">
        <h3 className="font-bold">{service.name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-3 min-h-[4.5em]">
          {service.description}
        </p>
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{service.duration} мин</span>
          </div>
          <div className="text-lg font-bold">{service.price}₮</div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Link href={`staffs?service=${service._id}`} className="w-full">
          <Button className="w-full">Үйлчилгээ захиалах</Button>
        </Link>
      </CardFooter>
    </Card>
  );
};
