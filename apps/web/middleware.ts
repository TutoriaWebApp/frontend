import { NextRequest, NextResponse } from "next/server";
import { isTokenExpired } from "@repo/lib/jwtAux";
import { getBackendUrl } from "@repo/lib/getBackendUrl";

const redirectToLogin = (req: NextRequest) => {
  const url = req.nextUrl.clone();
  url.pathname = "/";
  url.searchParams.set("session", "expired");

  const response = NextResponse.redirect(url);
  response.cookies.delete("access_token");
  response.cookies.delete("refresh_token");
  return response;
};

const validateSession = async (req: NextRequest) => {
  const accessToken = req.cookies.get("access_token")?.value;

  if (accessToken && !isTokenExpired(accessToken)) {
    return NextResponse.next();
  }

  const refreshToken = req.cookies.get("refresh_token")?.value;

  if (refreshToken && !isTokenExpired(refreshToken)) {
    try {
      const baseURL = getBackendUrl();
      const res = await fetch(`${baseURL}/login/refresh/`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          Cookie: `refresh_token=${refreshToken}`,
        },
        credentials: "include",
      });

      if (res.ok) {
        const newCookies = res.headers.getSetCookie();
        const response = NextResponse.next();
        newCookies.forEach((c) => response.headers.append("Set-Cookie", c));
        return response;
      }
    } catch (e) {
      console.error("Erro ao renovar token no middleware:", e);
    }
  }

  return redirectToLogin(req);
};

export async function middleware(req: NextRequest) {
  return await validateSession(req);
}

export const config = {
  matcher: [
    "/buscar-tutores/:path*",
    "/conquistas/:path*",
    "/dashboard/:path*",
    "/editar-perfil/:path*",
    "/mensagens/:path*",
    "/meu-perfil/:path*",
    "/perfil/:path*",
    "/recomendacoes/:path*",
    "/solicitacoes/:path*",
  ],
};