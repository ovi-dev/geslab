import { create } from "zustand";
import { Cliente } from "@/types/cliente";

/**
 * Store para la gestión de clientes con Zustand
 * Adaptado para integrarse con nuestra implementación actual
 */
interface ClienteStore {
  // Estado principal
  clientes: Cliente[];
  clienteSeleccionado: Cliente | null;
  isLoading: boolean;
  error: string | null;
  
  // Filtros y paginación para lazy loading
  filteredClientes: Cliente[];
  setFilteredClientes: (clientes: Cliente[]) => void;

  // Funciones de manipulación del store
  setClientes: (clientes: Cliente[]) => void;
  selectCliente: (cliente: Cliente | null) => void;
  getClienteById: (ID_CLIENTE: number) => Cliente | undefined;
  
  // Gestión de estado
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Operaciones CRUD
  addCliente: (cliente: Cliente) => void;
  updateCliente: (cliente: Cliente) => void;
  removeCliente: (ID_CLIENTE: number) => void;
  
  // Utilidades
  reset: () => void;
}

export const useClienteStore = create<ClienteStore>((set, get) => ({
  // Estado inicial
  clientes: [],
  clienteSeleccionado: null,
  isLoading: false,
  error: null,
  filteredClientes: [],

  // Establece la lista completa de clientes
  setClientes: (clientes) => {
    set({ 
      clientes,
      filteredClientes: clientes, // Por defecto, inicialmente todos los clientes están filtrados
      isLoading: false
    });
  },
  
  // Establece la lista de clientes filtrados (para usar con los filtros de búsqueda)
  setFilteredClientes: (filteredClientes) => set({ filteredClientes }),
  
  // Selecciona un cliente específico o limpia la selección si es null
  selectCliente: (cliente) => set({ clienteSeleccionado: cliente }),
  
  // Busca un cliente específico por ID
  getClienteById: (ID_CLIENTE) => get().clientes.find(c => c.ID_CLIENTE === ID_CLIENTE),

  // Controla el estado de carga para operaciones asíncronas
  setLoading: (isLoading) => set({ isLoading }),
  
  // Maneja los mensajes de error
  setError: (error) => set({ error }),
  
  // CRUD: Añade un nuevo cliente a la lista
  addCliente: (cliente) => {
    set((state) => ({ 
      clientes: [...state.clientes, cliente],
      // Actualiza también los clientes filtrados si corresponde
      filteredClientes: [...state.filteredClientes, cliente]
    }));
  },
  
  // CRUD: Actualiza los datos de un cliente existente (versión simplificada para recibir objeto completo)
  updateCliente: (clienteActualizado) => {
    if (!clienteActualizado.ID_CLIENTE) return;
    
    set((state) => ({
      clientes: state.clientes.map((c) => 
        c.ID_CLIENTE === clienteActualizado.ID_CLIENTE ? clienteActualizado : c
      ),
      filteredClientes: state.filteredClientes.map((c) => 
        c.ID_CLIENTE === clienteActualizado.ID_CLIENTE ? clienteActualizado : c
      ),
      clienteSeleccionado: state.clienteSeleccionado?.ID_CLIENTE === clienteActualizado.ID_CLIENTE 
        ? clienteActualizado 
        : state.clienteSeleccionado
    }));
  },
  
  // CRUD: Elimina un cliente y limpia la selección si era el cliente seleccionado
  removeCliente: (ID_CLIENTE) => {
    set((state) => ({ 
      clientes: state.clientes.filter((c) => c.ID_CLIENTE !== ID_CLIENTE),
      filteredClientes: state.filteredClientes.filter((c) => c.ID_CLIENTE !== ID_CLIENTE),
      clienteSeleccionado: state.clienteSeleccionado?.ID_CLIENTE === ID_CLIENTE 
        ? null 
        : state.clienteSeleccionado
    }));
  },
  
  // Reinicia el store a su estado inicial
  reset: () => set({ 
    clientes: [],
    filteredClientes: [],
    clienteSeleccionado: null,
    isLoading: false,
    error: null
  })
}));