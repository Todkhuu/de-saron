import { NextRequest, NextResponse } from "next/server";
import { connectMongoDb } from "@/server/database/mongodb";
import "@/server/models/Category";
import { Subcategory } from "@/server/models/Subcategory";
import "@/server/models/Service";

connectMongoDb();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
      const subcategory = await Subcategory.findById(id)
        .populate("category")
        .populate({
          path: "services",
          populate: [{ path: "category" }, { path: "subcategory" }],
        });

      return NextResponse.json(
        { message: "Дэд ангилал амжилттай уншигдлаа.", data: subcategory },
        { status: 200 }
      );
    }

    const subcategories = await Subcategory.find()
      .populate("category")
      .populate({
        path: "services",
        populate: [{ path: "category" }, { path: "subcategory" }],
      });

    return NextResponse.json(
      {
        message: "Бүх дэд ангилалууд амжилттай уншигдлаа.",
        data: subcategories,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Дэд ангилал унших үед алдаа гарлаа:", error);
    return NextResponse.json(
      {
        message: "Дэд ангилал унших үед алдаа гарлаа.",
        error: error instanceof Error ? error.message : "Тодорхойгүй алдаа",
      },
      { status: 500 }
    );
  }
}
