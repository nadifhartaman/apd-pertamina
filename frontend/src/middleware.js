import { NextResponse } from "next/server";

export function middleware (req) {
  const token = req.cookies.get("token")?.value;
  const pathname = req.nextUrl.pathname;

  const isApiRoute = pathname.startsWith("/api/");
  if (isApiRoute) {
    return NextResponse.next();
  }

  const protectedRoutes = ["/", "/camera", "/camera/manager"];
  const validRoutes = ["/", "/auth/login", "/camera", "/not-found", "/auth/register", "/camera/manager"];
  const isRouteValid = (path) => validRoutes.includes(path);

  // Jika halaman bukan valid route, redirect ke not-found
  if (pathname === "/auth") {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  if (!isRouteValid(pathname)) {
    return NextResponse.redirect(new URL("/not-found", req.url));
  }

  // Jika auth, izinkan akses tanpa token
  if (pathname === "/auth/login") {
    return NextResponse.next();
  }

  // Jika path = protectedRoutes dan tidak ada token, redirect ke login
  if (protectedRoutes.includes(pathname) && !token) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  return NextResponse.next();
}
// export const config = {
//   matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
// };
// export const config = {
//   matcher: ["/:path*"]
// }
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|public|models/|api/upload|.*\\.(?:svg|jpg|png|jpeg|gif|webp|json)$).*)",
  ],
};
