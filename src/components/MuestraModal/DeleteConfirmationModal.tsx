'use client';
import { useMuestraStore } from '@/store/muestraStore';
import { deleteMuestra } from '@/services/muestraService';
import { useState } from 'react';

interface DeleteConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function DeleteConfirmationModal({ isOpen, onClose }: DeleteConfirmationModalProps) {
    const { muestraSeleccionada, removeMuestra } = useMuestraStore();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleDelete = async () => {
        if (!muestraSeleccionada) return;

        setIsLoading(true);
        setError(null);

        try {
            await deleteMuestra(muestraSeleccionada.ID_MUESTRA);
            removeMuestra(muestraSeleccionada.ID_MUESTRA);
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al eliminar la muestra');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen || !muestraSeleccionada) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h2 className="text-lg font-semibold mb-4">Confirmar Eliminación</h2>
                
                <p className="text-sm text-gray-600 mb-4">
                    ¿Está seguro de que desea eliminar la muestra con referencia "{muestraSeleccionada.REFERENCIA_CLIENTE}"?
                    Esta acción no se puede deshacer.
                </p>

                {error && (
                    <div className="mb-4 p-2 bg-red-100 text-red-700 text-xs rounded">
                        {error}
                    </div>
                )}

                <div className="flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleDelete}
                        disabled={isLoading}
                        className="px-4 py-2 text-xs bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-red-300"
                    >
                        {isLoading ? 'Eliminando...' : 'Eliminar'}
                    </button>
                </div>
            </div>
        </div>
    );
} 