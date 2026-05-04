import { NextRequest, NextResponse } from "next/server";
import { isTokenExpired } from "@repo/lib/jwtAux";

const validateSession = async (req: NextRequest) => {
  const accessToken = req.cookies.get("access_token")?.value;

  if (accessToken && !isTokenExpired(accessToken)) {
    return NextResponse.next();
  }

  const refreshToken = req.cookies.get("refresh_token")?.value;

  if (refreshToken && !isTokenExpired(refreshToken)) {
    const baseURL = process.env.backendBaseURL;

    const res = await fetch(`${baseURL}/login/refresh`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Cookie: `refresh_token=${refreshToken}`
      },
      credentials: "include",
    });

    if (res.ok) {
      const newCookies = res.headers!.getSetCookie();
      const response = NextResponse.next();
      newCookies.forEach((c) => response.headers.append("Set-Cookie", c));
      return response;
    }
    return NextResponse.next();
  }

  const url = req.nextUrl.clone();
  url.pathname = "/";
  url.searchParams.set("session", "expired");

  const response = NextResponse.redirect(url);

  response.cookies.delete("access_token");
  response.cookies.delete("refresh_token");

  return response;
};

export async function middleware(req: NextRequest) {
  const authResponse = await validateSession(req);

  return authResponse;
}

export const config = {
  // Aplique apenas nas rotas protegidas para não dar loop infinito na "/"
  matcher: ["/dashboard/:path*", "/perfil/:path*", "/editar-perfil/:path*"],
};
