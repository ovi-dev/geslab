'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import { useClienteStore } from "@/store/clienteStore";
import { fetchClientes } from "@/services/clienteService";

const Principal = () => {
  const router = useRouter();
  const [userName, setUserName] = useState('');
  
  // Usar el store de clientes para obtener datos reales
  const { 
    clientes, 
    setClientes, 
    setLoading, 
    setError,
    isLoading 
  } = useClienteStore();

  const [dashboardStats, setDashboardStats] = useState({
    muestras: 0,
    ensayos: 0,
    informes: 0
  });

  // Cargar datos del store
  useEffect(() => {
    const loadData = async () => {
      try {
        // Cargar datos de usuario (simulado por ahora)
        setUserName('Usuario Administrador');
        
        // Cargar clientes reales si aún no están en el store
        if (clientes.length === 0) {
          setLoading(true);
          const data = await fetchClientes();
          setClientes(data);
          setLoading(false);
        }
        
        // Cargar otras estadísticas (simuladas por ahora)
        setDashboardStats({
          muestras: 1249,
          ensayos: 4367,
          informes: 956
        });
      } catch (error) {
        console.error("Error al cargar datos:", error);
        setError(error instanceof Error ? error.message : "Error desconocido al cargar datos");
        setLoading(false);
      }
    };

    loadData();
  }, [setClientes, setLoading, setError, clientes.length]);

  // Calcular estadísticas de clientes
  const clienteStats = useMemo(() => {
    return {
      total: clientes.length,
      activos: clientes.filter(c => c.ANULADO !== 1).length,
      inactivos: clientes.filter(c => c.ANULADO === 1).length
    };
  }, [clientes]);

  const navigateTo = (path:any) => {
    router.push(path);
  };

  // Elementos del dashboard
  const dashboardItems = [
    {
      title: 'Gestión de Clientes',
      description: 'Administrar clientes, contactos y detalles comerciales',
      icon: (
        <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      stats: clienteStats.total,
      statsLabel: 'Total clientes',
      extraStats: clienteStats.activos,
      extraStatsLabel: 'Activos',
      path: '/menu/clientes',
      color: 'bg-blue-50 hover:bg-blue-100'
    },
    {
      title: 'Gestión de Muestras',
      description: 'Control y seguimiento de muestras',
      icon: (
        <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      ),
      stats: dashboardStats.muestras,
      statsLabel: 'Muestras activas',
      path: '/menu/muestras',
      color: 'bg-green-50 hover:bg-green-100'
    },
    {
      title: 'Gestión de Ensayos',
      description: 'Seguimiento de ensayos y resultados',
      icon: (
        <svg className="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      ),
      stats: dashboardStats.ensayos,
      statsLabel: 'Ensayos realizados',
      path: '/menu/ensayos',
      color: 'bg-purple-50 hover:bg-purple-100'
    },
    {
      title: 'Informes y Reportes',
      description: 'Generación de informes y estadísticas',
      icon: (
        <svg className="w-10 h-10 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      stats: dashboardStats.informes,
      statsLabel: 'Informes generados',
      path: '/menu/informes',
      color: 'bg-amber-50 hover:bg-amber-100'
    },
    {
      title: 'Gestión de Usuarios',
      description: 'Administración de usuarios y permisos',
      icon: (
        <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      stats: null,
      statsLabel: 'Administración',
      path: '/menu/usuarios',
      color: 'bg-red-50 hover:bg-red-100'
    },
    {
      title: 'Configuración',
      description: 'Ajustes del sistema y preferencias',
      icon: (
        <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      stats: null,
      statsLabel: 'Configuración',
      path: '/menu/configuracion',
      color: 'bg-gray-50 hover:bg-gray-100'
    }
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-50px)] overflow-hidden bg-gray-50">
      {/* Contenido principal */}
      <div className="flex-grow p-4 overflow-auto">
        <div className="max-w-7xl mx-auto">
          {/* Estado de carga */}
          {isLoading ? (
            <div className="flex justify-center items-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              <span className="ml-3 text-gray-600">Cargando datos...</span>
            </div>
          ) : (
            /* Grid de tarjetas */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dashboardItems.map((item, index) => (
                <div 
                  key={index}
                  className={`border rounded-lg shadow-sm overflow-hidden cursor-pointer transition-all duration-200 ${item.color} group`}
                  onClick={() => navigateTo(item.path)}
                >
                  <div className="p-5">
                    <div className="flex items-center mb-4">
                      <div className="rounded-full p-2 bg-white shadow-sm">
                        {item.icon}
                      </div>
                      <h3 className="ml-3 text-lg font-semibold text-gray-800 group-hover:text-gray-900">{item.title}</h3>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-4">
                      {item.description}
                    </p>
                    
                    {item.stats !== null && (
                      <div className="flex items-center justify-between border-t pt-3">
                        <span className="text-sm text-gray-500">{item.statsLabel}</span>
                        <span className="font-bold text-xl text-gray-700">{item.stats.toLocaleString()}</span>
                      </div>
                    )}
                    
                    {item.extraStats !== undefined && (
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-sm text-gray-500">{item.extraStatsLabel}</span>
                        <span className="font-medium text-md text-gray-700">{item.extraStats.toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Pie de página */}
      <div className="bg-gray-100 border-t px-4 py-3 text-xs text-gray-600">
        <div className="flex justify-between items-center">
          <div>Sistema de Gestión v2.0</div>
          <div>Canagrosa © {new Date().getFullYear()}</div>
        </div>
      </div>
    </div>
  );
};

export default Principal;