/* eslint-disable @typescript-eslint/no-explicit-any */
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

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectToDatabase();

  const user = verifyUser(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();

  const update: any = {};
  if (body.title !== undefined) update.title = body.title;
  if (body.description !== undefined) update.description = body.description;
  if (body.status !== undefined) update.status = body.status;
  if (body.dueDate !== undefined) {
    const d = new Date(body.dueDate);
    update.dueDate = isNaN(d.getTime()) ? null : d;
  }

  const filter =
    user.role === "admin" ? { _id: id } : { _id: id, userId: user.id };

  const updatedTask = await Task.findOneAndUpdate(filter, update, {
    new: true,
  });

  if (!updatedTask) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  return NextResponse.json(updatedTask);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectToDatabase();

  const user = verifyUser(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const filter =
    user.role === "admin" ? { _id: id } : { _id: id, userId: user.id };

  const deletedTask = await Task.findOneAndDelete(filter);

  if (!deletedTask) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "Task deleted successfully" });
}
