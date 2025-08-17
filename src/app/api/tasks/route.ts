// src/app/api/tasks/route.ts
// GET + POST
import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Task from "@/models/Task";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

type TokenUser = { id: string; role?: "user" | "admin" };

function verifyUser(req: NextRequest): TokenUser | null {
  const token = req.cookies.get("token")?.value;
  if (!token) return null;
  try {
    return jwt.verify(token, JWT_SECRET) as TokenUser;
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  await connectToDatabase();

  const user = verifyUser(req);
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const scope = url.searchParams.get("scope"); // scope=all للـ admin

  const isAdmin = user.role === "admin";
  const query = isAdmin && scope === "all" ? {} : { userId: user.id };

  const tasks = await Task.find(query).sort({ createdAt: -1 });
  return NextResponse.json(tasks);
}

export async function POST(req: NextRequest) {
  await connectToDatabase();

  const user = verifyUser(req);
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { title, description, status, dueDate } = await req.json();
    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    let parsedDue: Date | undefined = undefined;
    if (dueDate) {
      const d = new Date(dueDate);
      if (!isNaN(d.getTime())) parsedDue = d;
    }

    const newTask = await Task.create({
      title,
      description: description || "",
      status: status || "pending",
      dueDate: parsedDue,
      userId: user.id,
    });

    return NextResponse.json(newTask, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }
}
