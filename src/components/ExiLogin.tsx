"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getUser, logout, verificarToken } from "@/services/auth";
import { FiLogOut } from "react-icons/fi";
// Definición de tipos para mejor tipado
interface User {
  NOMBRE: string;
  email?: string;
  // Otras propiedades del usuario
  [key: string]: any;
}

/**
 * Componente simplificado de la página de menú
 * Solo muestra el nombre del usuario y el botón para salir del sistema
 */
export default function ExiLogin() {
  // Estado y hooks
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Carga los datos del usuario al montar el componente
   */
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Primero verificar si el token es válido
        const tokenValido = await verificarToken();
        if (!tokenValido) {
          setError("Sesión expirada. Por favor, inicie sesión nuevamente.");
          router.push("/");
          return;
        }

        // Si el token es válido, obtener datos del usuario
        const userData = await getUser();
        setUser(userData);
        setError(null);
      } catch (error) {
        console.error("Error de autenticación:", error);
        setError("No se pudo verificar la autenticación");
        router.push("/");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  /**
   * Maneja el cierre de sesión del usuario
   */
  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      router.push("/");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      setError("No se pudo cerrar sesión correctamente");
    }
  };

  /**
   * Componente de carga mientras se verifica la autenticación
   */
  if (loading) return (
    <div className="flex justify-center items-center h-10">
      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-300"></div>
    </div>
  );

  return (
    <div className="flex items-center text-white">
      {/* Nombre de usuario (oculto en móvil) */}
      <span className="hidden sm:inline mr-2 text-xs">
        {user?.NOMBRE || 'Usuario'}
      </span>
      
      {/* Botón para salir del sistema con icono */}
      <button
        onClick={handleLogout}
        className="inline-flex items-center text-white py-1 px-2 rounded focus:outline-none transition-colors hover:bg-blue-800"
        title="Cerrar sesión"
      >
        <FiLogOut className="h-4 w-4" />
        <span className="hidden sm:inline ml-1">Salir</span>
      </button>
    </div>
  );
}