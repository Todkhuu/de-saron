"use client";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useService } from "@/app/_context/ServiceContext";
import { Input } from "@/components/ui/input";
import { useCategory } from "@/app/_context/CategoryContext";
import { useSubcategory } from "@/app/_context/SubcategoryContext";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import axios from "axios";
import { toast } from "sonner";
import {
  transliterate,
  cyrillicToLatinMap,
  latinToCyrillicMap,
} from "@/app/lib/transliteration";
import { ServiceType } from "@/app/utils/types";

export default function ServicesPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-[1200px] m-auto py-10 px-4 md:px-6">
          Уншиж байна...
        </div>
      }
    >
      <ServicesPageContent />
    </Suspense>
  );
}

function ServicesPageContent() {
  const searchParams = useSearchParams();
  const subcategoryId = searchParams.get("subcategoryId");
  const categoryId = searchParams.get("categoryId");
  const { services, setServices } = useService();
  const { categories } = useCategory();
  const { subcategories } = useSubcategory();
  const [q, setQ] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    price: "",
    duration: "",
    description: "",
  });
  const [saving, setSaving] = useState(false);

  const openEdit = (s: ServiceType) => {
    setEditingId(s._id);
    setForm({
      name: s.name || "",
      price: String(s.price ?? ""),
      duration: String(s.duration ?? ""),
      description: s.description || "",
    });
  };

  const closeEdit = () => {
    setEditingId(null);
    setSaving(false);
  };

  const saveEdit = async () => {
    if (!editingId) return;
    try {
      setSaving(true);
      const priceNum = Number(form.price);
      const durationNum = Number(form.duration);
      const nameOk = form.name.trim().length > 0;
      const priceOk = Number.isFinite(priceNum) && priceNum >= 0;
      const durationOk = Number.isFinite(durationNum) && durationNum >= 1;
      if (!nameOk || !priceOk || !durationOk) {
        toast.error("Мэдээллээ зөв бөглөнө үү");
        setSaving(false);
        return;
      }
      const payload = {
        _id: editingId,
        name: form.name.trim(),
        description: form.description.trim(),
        price: priceNum,
        duration: durationNum,
      };
      const { data } = await axios.put("/api/services", payload);
      const updated = data?.service;
      setServices((prev) =>
        (prev || []).map((it) => (it._id === updated._id ? updated : it))
      );
      toast.success("Үйлчилгээ шинэчлэгдлээ");
      closeEdit();
    } catch {
      toast.error("Шинэчлэхэд алдаа гарлаа");
    } finally {
      setSaving(false);
    }
  };

  // Radix Popover handles Escape and outside clicks

  const filtered = useMemo(() => {
    let list = services ?? [];
    if (categoryId) {
      list = list.filter((s) => s.category?._id === categoryId);
    }
    if (subcategoryId) {
      list = list.filter((s) => s.subcategory?._id === subcategoryId);
    }
    const queryRaw = q.trim();
    const queryVariants = [
      queryRaw.toLowerCase(),
      transliterate(queryRaw, cyrillicToLatinMap),
      transliterate(queryRaw, latinToCyrillicMap),
    ].filter(Boolean);
    if (!queryVariants[0]) return list;
    const valueMatches = (value?: string) => {
      if (!value) return false;
      const v = String(value);
      const valueVariants = [
        v.toLowerCase(),
        transliterate(v, cyrillicToLatinMap),
        transliterate(v, latinToCyrillicMap),
      ];
      return queryVariants.some((qv) =>
        valueVariants.some((vv) => vv.includes(qv))
      );
    };
    return list.filter((s) =>
      [s.name, s.description, s.category?.name, s.subcategory?.name].some((v) =>
        valueMatches(v as string | undefined)
      )
    );
  }, [services, q, categoryId, subcategoryId]);

  useEffect(() => {
    // reset search when changing filters
    setQ("");
  }, [subcategoryId, categoryId]);

  return (
    <div className="max-w-[1200px] m-auto py-10 px-4 md:px-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        {(() => {
          const selectedSub = subcategories?.find(
            (s) => s._id === subcategoryId
          );
          const selectedCat = categories?.find(
            (c) => c._id === (categoryId || selectedSub?.category?._id)
          );
          const subName = selectedSub?.name;
          const catName = selectedCat?.name;
          if (!subName && !catName) return null;
          return (
            <div className="text-2xl md:text-3xl font-bold">
              {catName}
              {subName ? (
                <>
                  <span className="mx-2">•</span>
                  <span>{subName}</span>
                </>
              ) : null}
            </div>
          );
        })()}
        <div className="w-full md:w-[380px]">
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Хайлт: үйлчилгээ, ангилал, дэд ангилал..."
          />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((s) => (
          <Popover
            key={s._id}
            open={editingId === s._id}
            onOpenChange={(open) => {
              if (open) {
                openEdit(s);
              } else if (editingId === s._id) {
                closeEdit();
              }
            }}
          >
            <PopoverTrigger asChild>
              <div className="border rounded-lg p-4 cursor-pointer">
                <div className="flex space-x-2.5 justify-between">
                  <div>
                    <div className="font-semibold">{s.name}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">₮{s.price}</div>
                    <div className="text-xs text-gray-500">
                      {s.duration} мин
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                  {s.description}
                </p>
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-[420px] p-4" align="center">
              <div className="space-y-3">
                <div>
                  <Label htmlFor="name">Нэр</Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, name: e.target.value }))
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="price">Үнэ (₮)</Label>
                    <Input
                      id="price"
                      inputMode="numeric"
                      value={form.price}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, price: e.target.value }))
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="duration">Хугацаа (мин)</Label>
                    <Input
                      id="duration"
                      inputMode="numeric"
                      value={form.duration}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, duration: e.target.value }))
                      }
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">Тайлбар</Label>
                  <Input
                    id="description"
                    value={form.description}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, description: e.target.value }))
                    }
                  />
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  <Button
                    variant="outline"
                    onClick={closeEdit}
                    disabled={saving}
                  >
                    Болих
                  </Button>
                  <Button onClick={saveEdit} disabled={saving}>
                    {saving ? "Хадгалж байна..." : "Хадгалах"}
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        ))}
      </div>
      {!filtered.length && (
        <div className="text-center text-gray-500 mt-10">Илэрц олдсонгүй</div>
      )}
    </div>
  );
}
