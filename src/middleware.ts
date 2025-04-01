import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Verificar se a rota começa com /admin e não é a página de login
  if (
    request.nextUrl.pathname.startsWith("/admin") &&
    !request.nextUrl.pathname.startsWith("/admin/login")
  ) {
    // Verificar o cookie de autenticação
    const adminAuth = request.cookies.get("adminAuth")?.value;

    // Se não houver cookie ou não estiver autenticado, redirecionar para o login
    if (!adminAuth) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    try {
      // Tentar analisar o cookie
      const authData = JSON.parse(adminAuth);

      // Se não estiver autenticado, redirecionar para o login
      if (!authData.isAuthenticated) {
        return NextResponse.redirect(new URL("/admin/login", request.url));
      }
    } catch (_) {
      // Se houver erro na análise do cookie, redirecionar para o login
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  // Aplicar o middleware apenas nas rotas de admin
  matcher: "/admin/:path*",
};
