'use client';
import { useState, useEffect } from 'react';
import { Muestra } from '@/types/muestra';
import { useMuestraStore } from '@/store/muestraStore';
import { createMuestra, updateMuestra } from '@/services/muestraService';

interface MuestraModalProps {
    isOpen: boolean;
    onClose: () => void;
    mode: 'create' | 'edit';
}

export default function MuestraModal({ isOpen, onClose, mode }: MuestraModalProps) {
    const { muestraSeleccionada, addMuestra, updateMuestraInStore } = useMuestraStore();
    const [formData, setFormData] = useState<Partial<Muestra>>({
        REFERENCIA_CLIENTE: '',
        PRODUCTO: '',
        TIPO_MUESTRA_ID: 0,
        TIPO_ANALISIS_ID: 0,
        CLIENTE_ID: 0,
        CENTRO_ID: 0,
        FECHA_MUESTREO: new Date(),
        FECHA_RECEPCION: new Date(),
        FECHA_PREV_FIN: new Date(),
        DETALLE_MUESTREO: '',
        OBSERVACIONES: '',
        PRECINTO: '',
        PRECIO: 0,
        URGENTE: 0,
        ANULADA: 0,
        CERRADA: 0,
        ENAC: 0,
        NADCAP: 0,
        IPA: 0,
        INFORME_MANUAL: 0
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (mode === 'edit' && muestraSeleccionada) {
            setFormData(muestraSeleccionada);
        } else {
            setFormData({
                REFERENCIA_CLIENTE: '',
                PRODUCTO: '',
                TIPO_MUESTRA_ID: 0,
                TIPO_ANALISIS_ID: 0,
                CLIENTE_ID: 0,
                CENTRO_ID: 0,
                FECHA_MUESTREO: new Date(),
                FECHA_RECEPCION: new Date(),
                FECHA_PREV_FIN: new Date(),
                DETALLE_MUESTREO: '',
                OBSERVACIONES: '',
                PRECINTO: '',
                PRECIO: 0,
                URGENTE: 0,
                ANULADA: 0,
                CERRADA: 0,
                ENAC: 0,
                NADCAP: 0,
                IPA: 0,
                INFORME_MANUAL: 0
            });
        }
    }, [mode, muestraSeleccionada]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            if (mode === 'create') {
                const newMuestra = await createMuestra(formData as Omit<Muestra, 'ID_MUESTRA'>);
                addMuestra(newMuestra);
            } else {
                const updatedMuestra = await updateMuestra(muestraSeleccionada!.ID_MUESTRA, formData as Partial<Muestra>);
                updateMuestraInStore(updatedMuestra);
            }
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al guardar la muestra');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked ? 1 : 0 :
                    type === 'number' ? value ? Number(value) : 0 :
                    value
        }));
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="p-4 border-b">
                    <h2 className="text-lg font-semibold">
                        {mode === 'create' ? 'Nueva Muestra' : 'Editar Muestra'}
                    </h2>
                </div>

                <form onSubmit={handleSubmit} className="p-4">
                    <div className="grid grid-cols-2 gap-4">
                        {/* Información Principal */}
                        <div className="col-span-2">
                            <h3 className="text-sm font-medium mb-2">Información Principal</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs text-gray-600 mb-1">
                                        Referencia Cliente
                                    </label>
                                    <input
                                        type="text"
                                        name="REFERENCIA_CLIENTE"
                                        value={formData.REFERENCIA_CLIENTE || ''}
                                        onChange={handleChange}
                                        className="w-full px-2 py-1 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-600 mb-1">
                                        Producto
                                    </label>
                                    <input
                                        type="text"
                                        name="PRODUCTO"
                                        value={formData.PRODUCTO || ''}
                                        onChange={handleChange}
                                        className="w-full px-2 py-1 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-600 mb-1">
                                        Tipo Muestra
                                    </label>
                                    <input
                                        type="number"
                                        name="TIPO_MUESTRA_ID"
                                        value={formData.TIPO_MUESTRA_ID || 0}
                                        onChange={handleChange}
                                        className="w-full px-2 py-1 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-600 mb-1">
                                        Tipo Análisis
                                    </label>
                                    <input
                                        type="number"
                                        name="TIPO_ANALISIS_ID"
                                        value={formData.TIPO_ANALISIS_ID || 0}
                                        onChange={handleChange}
                                        className="w-full px-2 py-1 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Fechas */}
                        <div className="col-span-2">
                            <h3 className="text-sm font-medium mb-2">Fechas</h3>
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs text-gray-600 mb-1">
                                        Fecha Muestreo
                                    </label>
                                    <input
                                        type="date"
                                        name="FECHA_MUESTREO"
                                        value={formData.FECHA_MUESTREO ? new Date(formData.FECHA_MUESTREO).toISOString().split('T')[0] : ''}
                                        onChange={handleChange}
                                        className="w-full px-2 py-1 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-600 mb-1">
                                        Fecha Recepción
                                    </label>
                                    <input
                                        type="date"
                                        name="FECHA_RECEPCION"
                                        value={formData.FECHA_RECEPCION ? new Date(formData.FECHA_RECEPCION).toISOString().split('T')[0] : ''}
                                        onChange={handleChange}
                                        className="w-full px-2 py-1 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-600 mb-1">
                                        Fecha Prev. Fin
                                    </label>
                                    <input
                                        type="date"
                                        name="FECHA_PREV_FIN"
                                        value={formData.FECHA_PREV_FIN ? new Date(formData.FECHA_PREV_FIN).toISOString().split('T')[0] : ''}
                                        onChange={handleChange}
                                        className="w-full px-2 py-1 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Detalles */}
                        <div className="col-span-2">
                            <h3 className="text-sm font-medium mb-2">Detalles</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs text-gray-600 mb-1">
                                        Detalle Muestreo
                                    </label>
                                    <textarea
                                        name="DETALLE_MUESTREO"
                                        value={formData.DETALLE_MUESTREO || ''}
                                        onChange={handleChange}
                                        className="w-full px-2 py-1 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        rows={3}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-600 mb-1">
                                        Observaciones
                                    </label>
                                    <textarea
                                        name="OBSERVACIONES"
                                        value={formData.OBSERVACIONES || ''}
                                        onChange={handleChange}
                                        className="w-full px-2 py-1 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        rows={3}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Información Adicional */}
                        <div className="col-span-2">
                            <h3 className="text-sm font-medium mb-2">Información Adicional</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs text-gray-600 mb-1">
                                        Precinto
                                    </label>
                                    <input
                                        type="text"
                                        name="PRECINTO"
                                        value={formData.PRECINTO || ''}
                                        onChange={handleChange}
                                        className="w-full px-2 py-1 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-600 mb-1">
                                        Precio
                                    </label>
                                    <input
                                        type="number"
                                        name="PRECIO"
                                        value={formData.PRECIO || 0}
                                        onChange={handleChange}
                                        className="w-full px-2 py-1 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        step="0.01"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Opciones */}
                        <div className="col-span-2">
                            <h3 className="text-sm font-medium mb-2">Opciones</h3>
                            <div className="grid grid-cols-4 gap-4">
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        name="URGENTE"
                                        checked={formData.URGENTE === 1}
                                        onChange={handleChange}
                                        className="h-3 w-3"
                                    />
                                    <label className="ml-1 text-xs text-gray-600">Urgente</label>
                                </div>
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        name="ANULADA"
                                        checked={formData.ANULADA === 1}
                                        onChange={handleChange}
                                        className="h-3 w-3"
                                    />
                                    <label className="ml-1 text-xs text-gray-600">Anulada</label>
                                </div>
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        name="CERRADA"
                                        checked={formData.CERRADA === 1}
                                        onChange={handleChange}
                                        className="h-3 w-3"
                                    />
                                    <label className="ml-1 text-xs text-gray-600">Cerrada</label>
                                </div>
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        name="ENAC"
                                        checked={formData.ENAC === 1}
                                        onChange={handleChange}
                                        className="h-3 w-3"
                                    />
                                    <label className="ml-1 text-xs text-gray-600">ENAC</label>
                                </div>
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        name="NADCAP"
                                        checked={formData.NADCAP === 1}
                                        onChange={handleChange}
                                        className="h-3 w-3"
                                    />
                                    <label className="ml-1 text-xs text-gray-600">NADCAP</label>
                                </div>
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        name="IPA"
                                        checked={formData.IPA === 1}
                                        onChange={handleChange}
                                        className="h-3 w-3"
                                    />
                                    <label className="ml-1 text-xs text-gray-600">IPA</label>
                                </div>
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        name="INFORME_MANUAL"
                                        checked={formData.INFORME_MANUAL === 1}
                                        onChange={handleChange}
                                        className="h-3 w-3"
                                    />
                                    <label className="ml-1 text-xs text-gray-600">Informe Manual</label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="mt-4 p-2 bg-red-100 text-red-700 text-xs rounded">
                            {error}
                        </div>
                    )}

                    <div className="mt-6 flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-4 py-2 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300"
                        >
                            {isLoading ? 'Guardando...' : 'Guardar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
} 