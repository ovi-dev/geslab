import { NextRequest, NextResponse } from "next/server";

// Constantes para mejorar legibilidad y mantenimiento
const PUBLIC_ROUTES = ['/'];
const PROTECTED_ROUTES = ['/menu', '/menu/:path*'];
const HOME_ROUTE = '/';
const DEFAULT_AUTHENTICATED_ROUTE = '/menu';

/**
 * Middleware de autenticación para Next.js
 * Controla el acceso a rutas protegidas y redirecciones basadas en autenticación
 */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("token")?.value;
  
  // Determinar el estado de autenticación y tipo de ruta
  const isAuthenticated = Boolean(token);
  const isPublicRoute = isRouteMatch(pathname, PUBLIC_ROUTES);
  const isProtectedRoute = isRouteMatch(pathname, PROTECTED_ROUTES);

  // Log para depuración en desarrollo
  if (process.env.NODE_ENV === 'development') {
    console.log(`Ruta: ${pathname}, Autenticado: ${isAuthenticated}`);
  }

  // Caso 1: Usuario autenticado intentando acceder a ruta pública (ej. login)
  if (isAuthenticated && isPublicRoute) {
    return redirectTo(req, DEFAULT_AUTHENTICATED_ROUTE);
  }

  // Caso 2: Usuario no autenticado intentando acceder a ruta protegida
  if (!isAuthenticated && isProtectedRoute) {
    return redirectTo(req, HOME_ROUTE);
  }

  // Permitir la solicitud para todos los demás casos
  return NextResponse.next();
}

/**
 * Verifica si una ruta coincide con alguno de los patrones proporcionados
 */
function isRouteMatch(pathname: string, patterns: string[]): boolean {
  return patterns.some(pattern => {
    // Manejo simple de patrones con comodín
    if (pattern.includes('*')) {
      const basePattern = pattern.replace('*', '');
      return pathname.startsWith(basePattern.replace('/:path', ''));
    }
    return pathname === pattern;
  });
}

/**
 * Crea una respuesta de redirección a la URL especificada
 */
function redirectTo(req: NextRequest, path: string): NextResponse {
  return NextResponse.redirect(new URL(path, req.url));
}

// Configuración de rutas que serán procesadas por el middleware
// IMPORTANTE: Next.js requiere que este objeto sea estático y no use variables
export const config = {
  matcher: ['/', '/menu', '/menu/:path*'],
};