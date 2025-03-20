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
    const [formData, setFormData] = useState<Muestra>({
        ID_MUESTRA: 0,
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
        INFORME_MANUAL: 0,
        ID_GENERAL: 0,
        ID_PARTICULAR: 0,
        ANNO: new Date().getFullYear(),
        EMPLEADO_ID: 1,
        REPLACEMENT_ID: 0,
        TIPO_FRECUENCIA_ID: 1,
        BANO_ID: 0,
        ENTIDAD_MUESTREO_ID: 0,
        FORMATO_ID: 0,
        ENTIDAD_ENTREGA_ID: 0,
        OP_VUELO: 0,
        OP_INSITU: 0,
        OP_LABMOVIL: 0,
        OP_NORUTINARIA: 0,
        OP_REPETICION: 0,
        RESPONSABLE_ID: 0,
        FIRMA: 0
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [validationErrors, setValidationErrors] = useState<Partial<Record<keyof Muestra, string>>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [activeTab, setActiveTab] = useState('general');
    const [submitError, setSubmitError] = useState<string | null>(null);

    useEffect(() => {
        if (mode === 'edit' && muestraSeleccionada) {
            setFormData(muestraSeleccionada);
        } else {
            setFormData({
                ID_MUESTRA: 0,
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
                INFORME_MANUAL: 0,
                ID_GENERAL: 0,
                ID_PARTICULAR: 0,
                ANNO: new Date().getFullYear(),
                EMPLEADO_ID: 1,
                REPLACEMENT_ID: 0,
                TIPO_FRECUENCIA_ID: 1,
                BANO_ID: 0,
                ENTIDAD_MUESTREO_ID: 0,
                FORMATO_ID: 0,
                ENTIDAD_ENTREGA_ID: 0,
                OP_VUELO: 0,
                OP_INSITU: 0,
                OP_LABMOVIL: 0,
                OP_NORUTINARIA: 0,
                OP_REPETICION: 0,
                RESPONSABLE_ID: 0,
                FIRMA: 0
            });
        }
    }, [mode, muestraSeleccionada]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setFormErrors({});

        // Validar campos requeridos
        const newErrors: Record<string, string> = {};
        
        if (!formData.CLIENTE_ID) newErrors.CLIENTE_ID = 'El cliente es requerido';
        if (!formData.TIPO_MUESTRA_ID) newErrors.TIPO_MUESTRA_ID = 'El tipo de muestra es requerido';
        if (!formData.TIPO_ANALISIS_ID) newErrors.TIPO_ANALISIS_ID = 'El tipo de análisis es requerido';
        if (!formData.FECHA_MUESTREO) newErrors.FECHA_MUESTREO = 'La fecha de muestreo es requerida';
        if (!formData.FECHA_RECEPCION) newErrors.FECHA_RECEPCION = 'La fecha de recepción es requerida';
        if (!formData.FECHA_PREV_FIN) newErrors.FECHA_PREV_FIN = 'La fecha prevista de fin es requerida';
        if (!formData.PRODUCTO) newErrors.PRODUCTO = 'El producto es requerido';
        if (!formData.PRECIO) newErrors.PRECIO = 'El precio es requerido';
        if (!formData.ID_GENERAL) newErrors.ID_GENERAL = 'El ID general es requerido';
        if (!formData.ID_PARTICULAR) newErrors.ID_PARTICULAR = 'El ID particular es requerido';
        if (!formData.ANNO) newErrors.ANNO = 'El año es requerido';
        if (!formData.ENTIDAD_MUESTREO_ID) newErrors.ENTIDAD_MUESTREO_ID = 'La entidad de muestreo es requerida';
        if (!formData.FORMATO_ID) newErrors.FORMATO_ID = 'El formato es requerido';
        if (!formData.ENTIDAD_ENTREGA_ID) newErrors.ENTIDAD_ENTREGA_ID = 'La entidad de entrega es requerida';
        if (!formData.BANO_ID) newErrors.BANO_ID = 'El baño es requerido';
        if (!formData.TIPO_FRECUENCIA_ID) newErrors.TIPO_FRECUENCIA_ID = 'El tipo de frecuencia es requerido';
        if (!formData.FIRMA) newErrors.FIRMA = 'La firma es requerida';

        if (Object.keys(newErrors).length > 0) {
            setFormErrors(newErrors);
            setIsLoading(false);
            return;
        }

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
            setFormErrors({ submit: 'Error al guardar la muestra. Por favor, intente nuevamente.' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        
        // Validación para campos numéricos
        if (name === 'TIPO_MUESTRA_ID' || name === 'TIPO_ANALISIS_ID' || name === 'PRECIO') {
            const numValue = parseFloat(value);
            if (numValue < 0) {
                return; // No actualizar el valor si es negativo
            }
        }
        
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked ? 1 : 0 :
                    type === 'number' ? value ? Number(value) : 0 :
                    value
        }));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: checked ? 1 : 0
        }));
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-2xl">
                {/* Cabecera */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 rounded-t-lg flex items-center justify-between">
                    <h2 className="text-xl font-semibold">
                        {mode === 'create' ? 'Nueva Muestra' : 'Editar Muestra'}
                    </h2>
                    <button 
                        onClick={onClose}
                        className="text-white hover:text-red-200 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6">
                    <div className="space-y-6">
                        {/* Información Principal */}
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Información Principal
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Cliente <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        name="CLIENTE_ID"
                                        value={formData.CLIENTE_ID || 0}
                                        onChange={handleChange}
                                        className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                            formErrors.CLIENTE_ID ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        required
                                        min="0"
                                    />
                                    {formErrors.CLIENTE_ID && (
                                        <p className="mt-1 text-sm text-red-600">{formErrors.CLIENTE_ID}</p>
                                    )}
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Producto <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="PRODUCTO"
                                        value={formData.PRODUCTO || ''}
                                        onChange={handleChange}
                                        className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                            formErrors.PRODUCTO ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        required
                                    />
                                    {formErrors.PRODUCTO && (
                                        <p className="mt-1 text-sm text-red-600">{formErrors.PRODUCTO}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Tipo Muestra <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        name="TIPO_MUESTRA_ID"
                                        value={formData.TIPO_MUESTRA_ID || 0}
                                        onChange={handleChange}
                                        className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                            formErrors.TIPO_MUESTRA_ID ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        required
                                        min="0"
                                    />
                                    {formErrors.TIPO_MUESTRA_ID && (
                                        <p className="mt-1 text-sm text-red-600">{formErrors.TIPO_MUESTRA_ID}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Tipo Análisis <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        name="TIPO_ANALISIS_ID"
                                        value={formData.TIPO_ANALISIS_ID || 0}
                                        onChange={handleChange}
                                        className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                            formErrors.TIPO_ANALISIS_ID ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        required
                                        min="0"
                                    />
                                    {formErrors.TIPO_ANALISIS_ID && (
                                        <p className="mt-1 text-sm text-red-600">{formErrors.TIPO_ANALISIS_ID}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Fechas */}
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                Fechas
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Fecha Muestreo <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        name="FECHA_MUESTREO"
                                        value={formData.FECHA_MUESTREO ? new Date(formData.FECHA_MUESTREO).toISOString().split('T')[0] : ''}
                                        onChange={handleChange}
                                        className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                            formErrors.FECHA_MUESTREO ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        required
                                    />
                                    {formErrors.FECHA_MUESTREO && (
                                        <p className="mt-1 text-sm text-red-600">{formErrors.FECHA_MUESTREO}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Fecha Recepción <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        name="FECHA_RECEPCION"
                                        value={formData.FECHA_RECEPCION ? new Date(formData.FECHA_RECEPCION).toISOString().split('T')[0] : ''}
                                        onChange={handleChange}
                                        className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                            formErrors.FECHA_RECEPCION ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        required
                                    />
                                    {formErrors.FECHA_RECEPCION && (
                                        <p className="mt-1 text-sm text-red-600">{formErrors.FECHA_RECEPCION}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Fecha Prev. Fin <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        name="FECHA_PREV_FIN"
                                        value={formData.FECHA_PREV_FIN ? new Date(formData.FECHA_PREV_FIN).toISOString().split('T')[0] : ''}
                                        onChange={handleChange}
                                        className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                            formErrors.FECHA_PREV_FIN ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        required
                                    />
                                    {formErrors.FECHA_PREV_FIN && (
                                        <p className="mt-1 text-sm text-red-600">{formErrors.FECHA_PREV_FIN}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Detalles */}
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                Detalles
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Detalle Muestreo
                                    </label>
                                    <textarea
                                        name="DETALLE_MUESTREO"
                                        value={formData.DETALLE_MUESTREO || ''}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        rows={3}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Observaciones
                                    </label>
                                    <textarea
                                        name="OBSERVACIONES"
                                        value={formData.OBSERVACIONES || ''}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        rows={3}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Información Adicional */}
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Información Adicional
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Precinto
                                    </label>
                                    <input
                                        type="text"
                                        name="PRECINTO"
                                        value={formData.PRECINTO || ''}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Precio <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        name="PRECIO"
                                        value={formData.PRECIO || 0}
                                        onChange={handleChange}
                                        className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                            formErrors.PRECIO ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        required
                                        min="0"
                                    />
                                    {formErrors.PRECIO && (
                                        <p className="mt-1 text-sm text-red-600">{formErrors.PRECIO}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Opciones */}
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                Opciones
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        name="URGENTE"
                                        checked={formData.URGENTE === 1}
                                        onChange={handleChange}
                                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <label className="text-sm text-gray-700">Urgente</label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        name="ANULADA"
                                        checked={formData.ANULADA === 1}
                                        onChange={handleChange}
                                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <label className="text-sm text-gray-700">Anulada</label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        name="CERRADA"
                                        checked={formData.CERRADA === 1}
                                        onChange={handleChange}
                                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <label className="text-sm text-gray-700">Cerrada</label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        name="ENAC"
                                        checked={formData.ENAC === 1}
                                        onChange={handleChange}
                                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <label className="text-sm text-gray-700">ENAC</label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        name="NADCAP"
                                        checked={formData.NADCAP === 1}
                                        onChange={handleChange}
                                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <label className="text-sm text-gray-700">NADCAP</label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        name="IPA"
                                        checked={formData.IPA === 1}
                                        onChange={handleChange}
                                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <label className="text-sm text-gray-700">IPA</label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        name="INFORME_MANUAL"
                                        checked={formData.INFORME_MANUAL === 1}
                                        onChange={handleChange}
                                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <label className="text-sm text-gray-700">Informe Manual</label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
                            {error}
                        </div>
                    )}

                    {formErrors.submit && (
                        <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
                            {formErrors.submit}
                        </div>
                    )}

                    <div className="mt-6 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex items-center px-4 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            ESC-Salir
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex items-center px-4 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300"
                        >
                            {isLoading ? (
                                <svg className="animate-spin h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            )}
                            Aceptar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
} 