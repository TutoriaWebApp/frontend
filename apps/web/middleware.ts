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

  // Se o access token existir e ainda for válido, prossegue normalmente
  if (accessToken && !isTokenExpired(accessToken)) {
    return NextResponse.next();
  }

  const refreshToken = req.cookies.get("refresh_token")?.value;

  // Se o refresh token existir e estiver válido, tenta renovar no Django
  if (refreshToken && !isTokenExpired(refreshToken)) {
    try {
      const baseURL = getBackendUrl();
      const res = await fetch(`${baseURL}/login/refresh`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          Cookie: `refresh_token=${refreshToken}`,
        },
      });

      if (res.ok) {
        // Pega todos os Set-Cookie retornados pelo Django (contendo o novo access_token)
        const newCookies = res.headers.getSetCookie();

        // Cria a resposta permitindo que a rota continue
        const response = NextResponse.next({
          request: {
            headers: new Headers(req.headers),
          },
        });

        // Aplica o Set-Cookie na resposta para salvar no navegador do usuário
        newCookies.forEach((cookieStr) => {
          response.headers.append("Set-Cookie", cookieStr);
        });

        return response;
      }
    } catch (e) {
      console.error("Erro ao renovar token no middleware:", e);
    }
  }

  // Se o refresh falhar ou já estiver vencido (> 3 min), redireciona para login
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