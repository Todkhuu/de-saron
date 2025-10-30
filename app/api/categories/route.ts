import { NextRequest, NextResponse } from "next/server";
import { connectMongoDb } from "@/server/database/mongodb";
import { CategoryModel } from "@/server/models/Category";

connectMongoDb();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
      const category = await CategoryModel.findById(id).populate("services");
      return NextResponse.json(
        { message: "Ангилал амжилттай олдлоо.", category },
        { status: 200 }
      );
    } else {
      const allCategory = await CategoryModel.find().populate("services");
      return NextResponse.json(
        { message: "Бүх ангиллууд амжилттай уншигдлаа.", data: allCategory },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Ангилал унших үед алдаа гарлаа:", error);

    return NextResponse.json(
      {
        message: "Ангилал унших үед алдаа гарлаа.",
        error: error instanceof Error ? error.message : "Тодорхойгүй алдаа",
      },
      { status: 500 }
    );
  }
}
