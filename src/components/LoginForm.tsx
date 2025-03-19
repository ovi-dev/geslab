"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { login } from "@/services/auth";

interface LoginFormData {
  USUARIO: string;
  PASSWORD: string;
}

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting }
  } = useForm<LoginFormData>({ mode: "onBlur" });

  const onSubmit = async (data: LoginFormData) => {
    setError(""); // Limpiar error anterior
  
    try {
      const response = await login(data.USUARIO, data.PASSWORD);
      console.log("Respuesta login:", response);
      
      if (response.status === 200) {
        // Extraer el token de la respuesta
        const responseData = response.data;
        console.log("Datos de respuesta:", responseData);
        
        if (responseData.token) {
          // Guardar el token en una cookie
          document.cookie = `token=${responseData.token}; path=/; max-age=86400`;
          console.log("Token guardado en cookie:", responseData.token);
          
          // Redireccionar al menú
          router.push("/menu");
        } else {
          console.error("No se recibió token en la respuesta");
          setError("Error de autenticación: No se recibió token");
        }
      } else {
        setError("Usuario o contraseña incorrectos");
      }
    } catch (err) {
      console.error("Error durante el inicio de sesión:", err);
      setError("Error de conexión. Por favor, inténtalo de nuevo.");
    }
  };

  return (
    <div className="flex items-center justify-center bg-gradient-to-r from-blue-700 to-blue-600 pt-20">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Iniciar Sesión</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
            <p className="text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Campo Usuario */}
          <div className="mb-4">
            <label htmlFor="USUARIO" className="block text-gray-700 text-sm font-bold mb-2">
              Usuario
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                <FaUser />
              </span>
              <input
                id="USUARIO"
                type="text"
                {...register("USUARIO", { required: "El usuario es obligatorio" })}
                className={`w-full border rounded-lg py-2 pl-10 pr-3 ${
                  errors.USUARIO ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Ingresa tu usuario"
                autoComplete="username"
              />
            </div>
            {errors.USUARIO && <p className="text-red-500 text-xs mt-1">{errors.USUARIO.message}</p>}
          </div>

          {/* Campo Contraseña */}
          <div className="mb-6">
            <label htmlFor="PASSWORD" className="block text-gray-700 text-sm font-bold mb-2">
              Contraseña
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                <FaLock />
              </span>
              <input
                id="PASSWORD"
                type={showPassword ? "text" : "password"}
                {...register("PASSWORD", { required: "La contraseña es obligatoria" })}
                className={`w-full border rounded-lg py-2 pl-10 pr-10 ${
                  errors.PASSWORD ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Ingresa tu contraseña"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-gray-700"
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.PASSWORD && <p className="text-red-500 text-xs mt-1">{errors.PASSWORD.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-blue-600 text-white py-2 px-4 rounded-lg transition duration-200 ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700 focus:ring-2 focus:ring-blue-300"
            }`}
          >
            {isSubmitting ? "Iniciando sesión..." : "Iniciar Sesión"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;