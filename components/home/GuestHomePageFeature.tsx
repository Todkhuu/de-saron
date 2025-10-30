"use client";
import React from "react";
import { useCategory } from "@/app/_context/CategoryContext";
import { useSubcategory } from "@/app/_context/SubcategoryContext";
import Link from "next/link";

function GuestHomePageFeature() {
  const { categories } = useCategory();
  const { subcategories } = useSubcategory();

  return (
    <div className="px-4 pt-2">
      {categories?.map((cat) => {
        return (
          <div key={cat._id}>
            <h3 className="text-2xl font-semibold mb-4">{cat.name}</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {subcategories
                ?.filter((sc) => sc.category?._id === cat._id)
                .map((sc) => (
                  <Link
                    key={sc._id}
                    href={{
                      pathname: "/services",
                      query: { subcategoryId: sc._id },
                    }}
                    className="px-3 py-1 rounded-full border hover:bg-gray-50 text-sm"
                  >
                    {sc.name}
                  </Link>
                ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"></div>
          </div>
        );
      })}
    </div>
  );
}

export default GuestHomePageFeature;
