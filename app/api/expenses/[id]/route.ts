import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { verifyToken } from "@/lib/jwt";
import UserData from "@/models/UserData";

// ✅ Correct typing for App Router dynamic route
export async function PUT(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = context.params;

  await dbConnect();

  const token = req.headers.get("authorization")?.split(" ")[1];
  if (!token)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { username } = verifyToken(token) as { username: string };
    const updatedData = await req.json();

    const user = await UserData.findOne({ username });
    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    const expense = user.expenses.id(id);
    if (!expense)
      return NextResponse.json({ error: "Expense not found" }, { status: 404 });

    Object.assign(expense, updatedData);
    await user.save();

    return NextResponse.json({
      success: true,
      message: "Expense updated",
    });
  } catch (err) {
    console.error("Error updating expense:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = context.params;

  await dbConnect();
  const token = req.headers.get("authorization")?.split(" ")[1];
  if (!token)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { username } = verifyToken(token) as { username: string };
    const user = await UserData.findOne({ username });
    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    const originalLength = user.expenses.length;
    user.expenses = user.expenses.filter(
      (exp: any) => exp._id.toString() !== id
    );

    if (user.expenses.length === originalLength) {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 });
    }

    await user.save();
    return NextResponse.json({
      success: true,
      message: "Expense deleted",
    });
  } catch (err) {
    console.error("Error deleting expense:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
