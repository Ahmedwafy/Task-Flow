import { NextRequest, NextResponse } from "next/server";
// النوع الرسمي للـ params غير متوفر في next/server، استخدم النوع المناسب مباشرةً
import connectToDatabase from "@/lib/mongodb";
import Task from "@/models/Task";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

function verifyUser(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) return null;

  try {
    return jwt.verify(token, JWT_SECRET) as { id: string };
  } catch {
    return null;
  }
}

// 🔹 تعديل مهمة
export async function PUT(
  req: NextRequest,
  context: { params: { id: string } }
) {
  await connectToDatabase();

  const user = verifyUser(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { title, description, status } = await req.json();
  const updatedTask = await Task.findOneAndUpdate(
    { _id: context.params.id, userId: user.id },
    { title, description, status },
    { new: true }
  );

  if (!updatedTask) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  return NextResponse.json(updatedTask);
}

// 🔹 حذف مهمة
export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } }
) {
  await connectToDatabase();

  const user = verifyUser(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const deletedTask = await Task.findOneAndDelete({
    _id: context.params.id,
    userId: user.id,
  });

  if (!deletedTask) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "Task deleted successfully" });
}
