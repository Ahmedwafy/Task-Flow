// src/app/api/tasks/route.ts
// GET + POST
import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Task from "@/models/Task";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

// 🔹 التحقق من المستخدم من خلال الكوكيز
function verifyUser(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) return null;

  try {
    return jwt.verify(token, JWT_SECRET) as { id: string };
  } catch {
    return null;
  }
}

// 🔹 جلب كل المهام
export async function GET(req: NextRequest) {
  await connectToDatabase();

  const user = verifyUser(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const tasks = await Task.find({ userId: user.id }).sort({ createdAt: -1 });
  return NextResponse.json(tasks);
}

// 🔹 إضافة مهمة جديدة
export async function POST(req: NextRequest) {
  await connectToDatabase();

  const user = verifyUser(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { title, description, status } = await req.json();
    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const newTask = await Task.create({
      title,
      description: description || "",
      status: status || "pending",
      userId: user.id,
    });

    return NextResponse.json(newTask, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }
}
