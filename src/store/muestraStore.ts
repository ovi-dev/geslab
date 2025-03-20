import { create } from "zustand";
import { Muestra } from "@/types/muestra";

/**
 * Store para la gestión de muestras con Zustand
 */
interface MuestraStore {
  // Estado principal
  muestras: Muestra[];
  muestraSeleccionada: Muestra | null;
  isLoading: boolean;
  error: string | null;
  
  // Filtros y paginación para lazy loading
  filteredMuestras: Muestra[];
  setFilteredMuestras: (muestras: Muestra[]) => void;

  // Funciones de manipulación del store
  setMuestras: (muestras: Muestra[]) => void;
  selectMuestra: (muestra: Muestra) => void;
  getMuestraById: (id: number) => Muestra | undefined;
  
  // Gestión de estado
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Operaciones CRUD
  addMuestra: (muestra: Muestra) => void;
  updateMuestraInStore: (muestra: Muestra) => void;
  removeMuestra: (id: number) => void;
  
  // Utilidades
  reset: () => void;
}

const initialState = {
  muestras: [],
  muestraSeleccionada: null,
  isLoading: false,
  error: null,
  filteredMuestras: []
};

export const useMuestraStore = create<MuestraStore>((set, get) => ({
  ...initialState,

  setMuestras: (muestras) => set({ muestras }),

  setFilteredMuestras: (muestras) => set({ filteredMuestras: muestras }),

  selectMuestra: (muestra) => set({ muestraSeleccionada: muestra }),

  getMuestraById: (id) => {
    const { muestras } = get();
    return muestras.find(m => m.ID_MUESTRA === id);
  },

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  addMuestra: (muestra) => set((state) => ({
    muestras: [...state.muestras, muestra]
  })),

  updateMuestraInStore: (muestra) => set((state) => ({
    muestras: state.muestras.map(m => 
      m.ID_MUESTRA === muestra.ID_MUESTRA ? muestra : m
    ),
    muestraSeleccionada: state.muestraSeleccionada?.ID_MUESTRA === muestra.ID_MUESTRA 
      ? muestra 
      : state.muestraSeleccionada
  })),

  removeMuestra: (id) => set((state) => ({
    muestras: state.muestras.filter(m => m.ID_MUESTRA !== id),
    muestraSeleccionada: state.muestraSeleccionada?.ID_MUESTRA === id 
      ? null 
      : state.muestraSeleccionada
  })),

  reset: () => set(initialState)
})); 