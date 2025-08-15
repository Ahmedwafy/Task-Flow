// // src/app/api/auth/logout/route.ts
// // Delete Cookie
// import { NextResponse } from "next/server";

// export async function POST() {
//   const res = NextResponse.json({ message: "Logged out" });
//   res.cookies.set("token", "", {
//     httpOnly: true,
//     path: "/",
//     maxAge: 0,
//   });
//   return res;
// }
// src/app/api/auth/logout/route.ts
// Delete Cookie
import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ message: "Logged out" });

  res.cookies.set("token", "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
    secure: process.env.NODE_ENV === "production",
  });

  return res;
}
