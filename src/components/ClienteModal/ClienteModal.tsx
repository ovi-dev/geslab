'use client';
import { Cliente } from "@/types/cliente";
import { useEffect, useState } from "react";
import { createCliente, updateCliente } from "@/services/clienteService";
import { useClienteStore } from "@/store/clienteStore";
import AdjuntosModal from "./AdjuntosModal";

interface ClienteModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData?: Cliente;
    isCreating?: boolean;
}

export default function ClienteModal({ 
    isOpen, 
    onClose, 
    initialData, 
    isCreating = true 
}: ClienteModalProps) {
    // Store hooks
    const { 
        addCliente, 
        updateCliente: updateClienteInStore,
        setLoading,
        setError
    } = useClienteStore();
    
    // Estado del formulario
    const [formData, setFormData] = useState<Cliente>({
        ID_CLIENTE: undefined,
        NOMBRE: '',
        DIRECCION: '',
        CIF: '',
        TELEFONO: '',
        EMAIL: '',
        RESPONSABLE: '',
        OBSERVACIONES: ''
    });

    // Estados UI
    const [validationErrors, setValidationErrors] = useState<Partial<Record<keyof Cliente, string>>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [activeTab, setActiveTab] = useState('general');
    const [showAdjuntosModal, setShowAdjuntosModal] = useState(false);
    
    // Datos de ejemplo para la tabla de indicadores
    const indicadoresData = [
        { año: '2024', muestras: 2, importe: '247,00 €' },
        { año: '2023', muestras: 4, importe: '300,00 €' },
        { año: '2022', muestras: 3, importe: '180,00 €' }
    ];

    // Inicializar formulario
    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            // Reiniciar formulario
            setFormData({
                ID_CLIENTE: undefined,
                NOMBRE: '',
                DIRECCION: '',
                CIF: '',
                TELEFONO: '',
                FAX: '',
                EMAIL: '',
                EMAIL2: '',
                EMAIL_FACTURACION: '',
                RESPONSABLE: '',
                RESPONSABLE_OTROS: '',
                OBSERVACIONES: '',
                TIPO: '',
                INTRA: 0,
                EXTRANJERO: 0,
                AIRBUS: 0,
                IBERIA: 0,
                AGROALIMENTARIO: 0,
                FACTURA_ELECTRONICA: 1,
                FACTURA_DETERMINACIONES: 0,
                BANCO: '',
                CUENTA: '',
                COD_POSTAL: 0,
                PROVINCIA_ID: 0,
                MUNICIPIO_ID: 0,
                PAIS_ID: 0,
                CENTRO: '',
                CARGO: '',
                WEB: '',
                TARIFA_ID: 0,
                CALIBRY_ID: 0,
                PARENT_ID: 0
            });
        }
        
        setValidationErrors({});
        setActiveTab('general'); // Restablecer a la pestaña general
    }, [initialData, isOpen]);

    // Validar formulario
    const validate = (): boolean => {
        const newErrors: Partial<Record<keyof Cliente, string>> = {};
        
        if (!formData.NOMBRE) {
            newErrors.NOMBRE = 'El nombre es obligatorio';
        }
        
        // Validar email si está presente
        if (formData.EMAIL && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.EMAIL)) {
            newErrors.EMAIL = 'El formato del email no es válido';
        }
        
        setValidationErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Manejar cambios en campos de texto e inputs
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Manejar cambios en checkboxes
    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: checked ? 1 : 0
        }));
    };

    // Enviar formulario
    const handleSubmit = async () => {
        if (!validate()) return;
        
        setIsSubmitting(true);
        setLoading(true);
        
        try {
            if (isCreating) {
                const newCliente = await createCliente(formData);
                addCliente(newCliente);
            } else {
                const updatedCliente = await updateCliente(formData);
                updateClienteInStore(updatedCliente);
            }
            
            onClose();
        } catch (error) {
            console.error('Error al guardar cliente:', error);
            setError(error instanceof Error ? error.message : "Error al guardar cliente");
        } finally {
            setIsSubmitting(false);
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 overflow-y-auto">
            <div className="bg-gray-100 rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] flex flex-col my-8">
                {/* Cabecera */}
                <div className="bg-blue-600 text-white px-4 py-2 rounded-t-lg flex items-center justify-between">
                    <h2 className="text-lg font-semibold">
                        {isCreating ? 'Creación de Cliente' : 'Modificación de Cliente'}
                    </h2>
                    <button 
                        onClick={onClose}
                        className="text-white hover:text-red-200"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                
                {/* Pestañas */}
                <div className="flex border-b bg-gray-200">
                    <button 
                        className={`px-4 py-1 text-sm border-r ${
                            activeTab === 'general' 
                                ? 'bg-white text-gray-800 font-medium border-b-0' 
                                : 'bg-gray-200 text-gray-600'
                        }`}
                        onClick={() => setActiveTab('general')}
                    >
                        General
                    </button>
                    <button 
                        className={`px-4 py-1 text-sm border-r ${
                            activeTab === 'correos' 
                                ? 'bg-white text-gray-800 font-medium border-b-0' 
                                : 'bg-gray-200 text-gray-600'
                        }`}
                        onClick={() => setActiveTab('correos')}
                    >
                        Correos
                    </button>
                </div>
                
                {/* Contenido principal */}
                <div className="overflow-auto p-2 flex-grow bg-white" style={{ scrollbarWidth: 'thin', scrollbarColor: '#cbd5e0 #f7fafc' }}>
                    <div className="flex flex-col md:flex-row gap-2">
                        {/* Columna izquierda: formulario principal */}
                        <div className="md:w-3/5 space-y-3">
                            {activeTab === 'general' && (
                                <>
                                    {/* Datos del Cliente */}
                                    <div className="border border-gray-300 p-2 rounded bg-gray-50">
                                        <h3 className="text-xs font-bold mb-2 border-b pb-1">Datos del Cliente</h3>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                            <div>
                                                <label className="block text-xs text-gray-700 mb-1">
                                                    Nombre <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="NOMBRE"
                                                    value={formData.NOMBRE || ''}
                                                    onChange={handleChange}
                                                    className={`w-full px-2 py-1 text-xs border rounded ${
                                                        validationErrors.NOMBRE ? 'border-red-500' : 'border-gray-300'
                                                    }`}
                                                />
                                                {validationErrors.NOMBRE && (
                                                    <p className="text-xs text-red-500 mt-1">{validationErrors.NOMBRE}</p>
                                                )}
                                            </div>
                                            
                                            <div className="flex gap-2">
                                                <div className="w-1/2">
                                                    <label className="block text-xs text-gray-700 mb-1">C.I.F.</label>
                                                    <input
                                                        type="text"
                                                        name="CIF"
                                                        value={formData.CIF || ''}
                                                        onChange={handleChange}
                                                        className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                                                    />
                                                </div>
                                                
                                                <div className="w-1/2">
                                                    <label className="block text-xs text-gray-700 mb-1">Teléfono</label>
                                                    <input
                                                        type="text"
                                                        name="TELEFONO"
                                                        value={formData.TELEFONO || ''}
                                                        onChange={handleChange}
                                                        className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                                                    />
                                                </div>
                                            </div>
                                            
                                            <div className="flex gap-2">
                                                <div className="w-1/2">
                                                    <label className="block text-xs text-gray-700 mb-1">FAX</label>
                                                    <input
                                                        type="text"
                                                        name="FAX"
                                                        value={formData.FAX || ''}
                                                        onChange={handleChange}
                                                        className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                                                    />
                                                </div>
                                                
                                                <div className="w-1/2 flex flex-col gap-1">
                                                    <div className="flex items-center mt-3">
                                                        <input
                                                            type="checkbox"
                                                            id="factura_determinaciones"
                                                            name="FACTURA_DETERMINACIONES"
                                                            checked={formData.FACTURA_DETERMINACIONES === 1}
                                                            onChange={handleCheckboxChange}
                                                            className="h-3 w-3"
                                                        />
                                                        <label htmlFor="factura_determinaciones" className="ml-1 text-xs text-gray-700">
                                                            Factura por determinaciones
                                                        </label>
                                                    </div>
                                                    
                                                    <div className="flex items-center space-x-4">
                                                        <div className="flex items-center">
                                                            <input
                                                                type="checkbox"
                                                                id="aeronautico"
                                                                name="TIPO"
                                                                checked={formData.TIPO?.includes('aeronáutico')}
                                                                onChange={handleCheckboxChange}
                                                                className="h-3 w-3"
                                                            />
                                                            <label htmlFor="aeronautico" className="ml-1 text-xs text-gray-700">
                                                                Aeronáutico
                                                            </label>
                                                        </div>
                                                        
                                                        <div className="flex items-center">
                                                            <input
                                                                type="checkbox"
                                                                id="airbus"
                                                                name="AIRBUS"
                                                                checked={formData.AIRBUS === 1}
                                                                onChange={handleCheckboxChange}
                                                                className="h-3 w-3"
                                                            />
                                                            <label htmlFor="airbus" className="ml-1 text-xs text-gray-700">
                                                                Airbus Military
                                                            </label>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="flex items-center space-x-4">
                                                        <div className="flex items-center">
                                                            <input
                                                                type="checkbox"
                                                                id="agroalimentario"
                                                                name="AGROALIMENTARIO"
                                                                checked={formData.AGROALIMENTARIO === 1}
                                                                onChange={handleCheckboxChange}
                                                                className="h-3 w-3"
                                                            />
                                                            <label htmlFor="agroalimentario" className="ml-1 text-xs text-gray-700">
                                                                Agroalimentario
                                                            </label>
                                                        </div>
                                                        
                                                        <div className="flex items-center">
                                                            <input
                                                                type="checkbox"
                                                                id="iberia"
                                                                name="IBERIA"
                                                                checked={formData.IBERIA === 1}
                                                                onChange={handleCheckboxChange}
                                                                className="h-3 w-3"
                                                            />
                                                            <label htmlFor="iberia" className="ml-1 text-xs text-gray-700">
                                                                Iberia
                                                            </label>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="flex items-center space-x-4">
                                                        <div className="flex items-center">
                                                            <input
                                                                type="checkbox"
                                                                id="intra"
                                                                name="INTRA"
                                                                checked={formData.INTRA === 1}
                                                                onChange={handleCheckboxChange}
                                                                className="h-3 w-3"
                                                            />
                                                            <label htmlFor="intra" className="ml-1 text-xs text-gray-700">
                                                                Intracomuniario
                                                            </label>
                                                        </div>
                                                        
                                                        <div className="flex items-center">
                                                            <input
                                                                type="checkbox"
                                                                id="extranjero"
                                                                name="EXTRANJERO"
                                                                checked={formData.EXTRANJERO === 1}
                                                                onChange={handleCheckboxChange}
                                                                className="h-3 w-3"
                                                            />
                                                            <label htmlFor="extranjero" className="ml-1 text-xs text-gray-700">
                                                                Extracomuniario
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Dirección Fiscal */}
                                    <div className="border border-gray-300 p-2 rounded bg-gray-50">
                                        <h3 className="text-xs font-bold mb-2 border-b pb-1">Dirección Fiscal</h3>
                                        
                                        <div className="grid grid-cols-1 gap-2">
                                            <div>
                                                <label className="block text-xs text-gray-700 mb-1">Dirección</label>
                                                <input
                                                    type="text"
                                                    name="DIRECCION"
                                                    value={formData.DIRECCION || ''}
                                                    onChange={handleChange}
                                                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                                                />
                                            </div>
                                            
                                            <div className="grid grid-cols-3 gap-2">
                                                <div>
                                                    <label className="block text-xs text-gray-700 mb-1">C.P.</label>
                                                    <input
                                                        type="text"
                                                        name="COD_POSTAL"
                                                        value={formData.COD_POSTAL || ''}
                                                        onChange={handleChange}
                                                        className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                                                    />
                                                </div>
                                                
                                                <div>
                                                    <label className="block text-xs text-gray-700 mb-1">País</label>
                                                    <select
                                                        name="PAIS_ID"
                                                        value={formData.PAIS_ID || ''}
                                                        onChange={handleChange}
                                                        className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                                                    >
                                                        <option value="">Seleccionar...</option>
                                                        <option value="1">España</option>
                                                        <option value="2">Francia</option>
                                                        <option value="3">Portugal</option>
                                                    </select>
                                                </div>
                                            </div>
                                            
                                            <div className="grid grid-cols-2 gap-2">
                                                <div>
                                                    <label className="block text-xs text-gray-700 mb-1">Provincia</label>
                                                    <select
                                                        name="PROVINCIA_ID"
                                                        value={formData.PROVINCIA_ID || ''}
                                                        onChange={handleChange}
                                                        className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                                                    >
                                                        <option value="">Seleccionar...</option>
                                                        <option value="1">Badajoz</option>
                                                        <option value="2">Madrid</option>
                                                        <option value="3">Barcelona</option>
                                                    </select>
                                                </div>
                                                
                                                <div>
                                                    <label className="block text-xs text-gray-700 mb-1">Municipio</label>
                                                    <select
                                                        name="MUNICIPIO_ID"
                                                        value={formData.MUNICIPIO_ID || ''}
                                                        onChange={handleChange}
                                                        className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                                                    >
                                                        <option value="">Seleccionar...</option>
                                                        <option value="1">Mérida</option>
                                                        <option value="2">Badajoz</option>
                                                        <option value="3">Cáceres</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Otros Datos */}
                                    <div className="border border-gray-300 p-2 rounded bg-gray-50">
                                        <h3 className="text-xs font-bold mb-2 border-b pb-1">Otros Datos</h3>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                            <div>
                                                <label className="block text-xs text-gray-700 mb-1">E-mail</label>
                                                <input
                                                    type="email"
                                                    name="EMAIL"
                                                    value={formData.EMAIL || ''}
                                                    onChange={handleChange}
                                                    className={`w-full px-2 py-1 text-xs border rounded ${
                                                        validationErrors.EMAIL ? 'border-red-500' : 'border-gray-300'
                                                    }`}
                                                />
                                                {validationErrors.EMAIL && (
                                                    <p className="text-xs text-red-500 mt-1">{validationErrors.EMAIL}</p>
                                                )}
                                            </div>
                                            
                                            <div>
                                                <label className="block text-xs text-gray-700 mb-1">Responsable</label>
                                                <input
                                                    type="text"
                                                    name="RESPONSABLE"
                                                    value={formData.RESPONSABLE || ''}
                                                    onChange={handleChange}
                                                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                                                />
                                            </div>
                                            
                                            <div>
                                                <label className="block text-xs text-gray-700 mb-1">Centro</label>
                                                <input
                                                    type="text"
                                                    name="CENTRO"
                                                    value={formData.CENTRO || ''}
                                                    onChange={handleChange}
                                                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                                                />
                                            </div>
                                            
                                            <div>
                                                <label className="block text-xs text-gray-700 mb-1">Cargo</label>
                                                <input
                                                    type="text"
                                                    name="CARGO"
                                                    value={formData.CARGO || ''}
                                                    onChange={handleChange}
                                                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                                                />
                                            </div>
                                            
                                            <div className="col-span-2">
                                                <label className="block text-xs text-gray-700 mb-1">Idioma</label>
                                                <div className="flex space-x-4">
                                                    <div className="flex items-center">
                                                        <input 
                                                            type="radio" 
                                                            name="IDIOMA_FACTURA" 
                                                            value="1"
                                                            checked={formData.IDIOMA_FACTURA === 1} 
                                                            onChange={handleChange}
                                                            className="h-3 w-3" 
                                                        />
                                                        <label className="ml-1 text-xs">Español</label>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <input 
                                                            type="radio" 
                                                            name="IDIOMA_FACTURA" 
                                                            value="2"
                                                            checked={formData.IDIOMA_FACTURA === 2} 
                                                            onChange={handleChange}
                                                            className="h-3 w-3" 
                                                        />
                                                        <label className="ml-1 text-xs">Inglés</label>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <input 
                                                            type="radio" 
                                                            name="IDIOMA_FACTURA" 
                                                            value="3"
                                                            checked={formData.IDIOMA_FACTURA === 3} 
                                                            onChange={handleChange}
                                                            className="h-3 w-3" 
                                                        />
                                                        <label className="ml-1 text-xs">Francés</label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Datos financieros */}
                                    <div className="border border-gray-300 p-2 rounded bg-gray-50">
                                        <h3 className="text-xs font-bold mb-2 border-b pb-1">Datos financieros</h3>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                            <div>
                                                <label className="block text-xs text-gray-700 mb-1">Banco</label>
                                                <input
                                                    type="text"
                                                    name="BANCO"
                                                    value={formData.BANCO || ''}
                                                    onChange={handleChange}
                                                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                                                />
                                            </div>
                                            
                                            <div>
                                                <label className="block text-xs text-gray-700 mb-1">CCC</label>
                                                <input
                                                    type="text"
                                                    name="CUENTA"
                                                    value={formData.CUENTA || ''}
                                                    onChange={handleChange}
                                                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                                                />
                                            </div>
                                            
                                            <div>
                                                <label className="block text-xs text-gray-700 mb-1">Forma Pago</label>
                                                <select
                                                    name="FP_ID"
                                                    value={formData.FP_ID || ''}
                                                    onChange={handleChange}
                                                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                                                >
                                                    <option value="">Seleccionar...</option>
                                                    <option value="1">Transferencia a la Caixa</option>
                                                    <option value="2">Tarjeta de crédito</option>
                                                    <option value="3">Efectivo</option>
                                                </select>
                                            </div>
                                            
                                            <div>
                                                <label className="block text-xs text-gray-700 mb-1">Tarifa</label>
                                                <select
                                                    name="TARIFA_ID"
                                                    value={formData.TARIFA_ID || ''}
                                                    onChange={handleChange}
                                                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                                                >
                                                    <option value="">Seleccionar...</option>
                                                    <option value="1">GENERAL</option>
                                                    <option value="2">ESPECIAL</option>
                                                    <option value="3">REDUCIDA</option>
                                                </select>
                                            </div>
                                            
                                            <div>
                                                <label className="block text-xs text-gray-700 mb-1">Email (Fact.)</label>
                                                <input
                                                    type="email"
                                                    name="EMAIL_FACTURACION"
                                                    value={formData.EMAIL_FACTURACION || ''}
                                                    onChange={handleChange}
                                                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                                                />
                                            </div>
                                            
                                            <div className="flex items-center mt-4">
                                                <input
                                                    type="checkbox"
                                                    id="factura_electronica"
                                                    name="FACTURA_ELECTRONICA"
                                                    checked={formData.FACTURA_ELECTRONICA === 1}
                                                    onChange={handleCheckboxChange}
                                                    className="h-3 w-3"
                                                />
                                                <label htmlFor="factura_electronica" className="ml-1 text-xs text-gray-700">
                                                    Factura Electrónica
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Cliente Padre (Delegaciones) */}
                                    <div className="border border-gray-300 p-2 rounded bg-gray-50">
                                        <h3 className="text-xs font-bold mb-2 border-b pb-1">Cliente Padre (Delegaciones)</h3>
                                        
                                        <div className="flex items-center gap-2">
                                            <select
                                                name="PARENT_ID"
                                                value={formData.PARENT_ID || ''}
                                                onChange={handleChange}
                                                className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                                            >
                                                <option value="">Seleccionar cliente padre...</option>
                                                <option value="1">AIRBUS</option>
                                                <option value="2">IBERIA</option>
                                            </select>
                                            
                                            <button className="text-xs text-blue-600">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            </button>
                                            
                                            <button className="text-xs text-red-600">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                            
                                            <button className="text-xs text-blue-600">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                    
                                    {/* Observaciones */}
                                    <div className="border border-gray-300 p-2 rounded bg-gray-50">
                                        <h3 className="text-xs font-bold mb-2 border-b pb-1">Observaciones</h3>
                                        
                                        <textarea
                                            name="OBSERVACIONES"
                                            value={formData.OBSERVACIONES || ''}
                                            onChange={handleChange}
                                            rows={4}
                                            className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                                        />
                                    </div>
                                </>
                            )}
                            
                            {activeTab === 'correos' && (
                                <div className="border border-gray-300 p-2 rounded bg-gray-50">
                                    <h3 className="text-xs font-bold mb-2 border-b pb-1">Gestión de Correos</h3>
                                    
                                    <div className="space-y-2">
                                        <div>
                                            <label className="block text-xs text-gray-700 mb-1">Email Principal</label>
                                            <input
                                                type="email"
                                                name="EMAIL"
                                                value={formData.EMAIL || ''}
                                                onChange={handleChange}
                                                className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-xs text-gray-700 mb-1">Email Secundario</label>
                                            <input
                                                type="email"
                                                name="EMAIL2"
                                                value={formData.EMAIL2 || ''}
                                                onChange={handleChange}
                                                className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-xs text-gray-700 mb-1">Email Facturación</label>
                                            <input
                                                type="email"
                                                name="EMAIL_FACTURACION"
                                                value={formData.EMAIL_FACTURACION || ''}
                                                onChange={handleChange}
                                                className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-xs text-gray-700 mb-1">Email Metrología</label>
                                            <input
                                                type="email"
                                                name="EMAIL_METROLOGIA"
                                                value={formData.EMAIL_METROLOGIA || ''}
                                                onChange={handleChange}
                                                className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        
                        {/* Columna derecha: secciones adicionales */}
                        <div className="md:w-2/5 space-y-3">
                            {/* Responsables del Cliente */}
                            <div className="border border-gray-300 p-2 rounded bg-gray-50">
                                <h3 className="text-xs font-bold mb-2 border-b pb-1">Responsables del Cliente</h3>
                                
                                <table className="w-full text-xs">
                                    <thead>
                                        <tr>
                                            <th className="px-2 py-1 text-left border-b">Nombre</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="px-2 py-1 border-b">{formData.RESPONSABLE || '(Sin responsables)'}</td>
                                        </tr>
                                    </tbody>
                                </table>
                                
                                <div className="flex justify-end mt-2 space-x-1">
                                    <button className="bg-green-100 p-1 rounded">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                    </button>
                                    <button className="bg-red-100 p-1 rounded">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            
                            {/* Indicadores */}
                            <div className="border border-gray-300 p-2 rounded bg-gray-50">
                                <h3 className="text-xs font-bold mb-2 border-b pb-1">Indicadores</h3>
                                
                                <table className="w-full text-xs">
                                    <thead>
                                        <tr className="bg-gray-100">
                                            <th className="px-2 py-1 border">Año</th>
                                            <th className="px-2 py-1 border">Nº Muestras</th>
                                            <th className="px-2 py-1 border">Importe</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {indicadoresData.map((item, index) => (
                                            <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                                <td className="px-2 py-1 border">{item.año}</td>
                                                <td className="px-2 py-1 border text-center">{item.muestras}</td>
                                                <td className="px-2 py-1 border text-right">{item.importe}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            
                            {/* CALIBRY */}
                            <div className="border border-gray-300 p-2 rounded bg-gray-50">
                                <h3 className="text-xs font-bold mb-2 border-b pb-1">CALIBRY</h3>
                                
                                <div className="flex items-center gap-2">
                                    <label className="text-xs text-gray-700">ID</label>
                                    <input
                                        type="text"
                                        name="CALIBRY_ID"
                                        value={formData.CALIBRY_ID || ''}
                                        onChange={handleChange}
                                        className="w-40 px-2 py-1 text-xs border border-gray-300 rounded"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Pie con botones */}
                <div className="px-2 py-2 bg-gray-200 border-t flex justify-between items-center">
                    {/* Lado izquierdo: botones de navegación */}
                    <div className="flex space-x-2">
                        <button 
                            onClick={() => setShowAdjuntosModal(true)}
                            className="flex items-center px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded border border-blue-200"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                            </svg>
                            Adjuntos
                        </button>
                        
                        <button className="flex items-center px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded border border-gray-200">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Pedidos
                        </button>
                        
                        <button className="flex items-center px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded border border-gray-200">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                            </svg>
                            Direcciones
                        </button>
                        
                        <button className="flex items-center px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded border border-gray-200">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                            Ofertas
                        </button>
                    </div>
                    
                    {/* Lado derecho: botones de acciones */}
                    <div className="flex space-x-2">
                        <button className="flex items-center px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded border border-gray-200">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                            Historial Cambios
                        </button>
                        
                        <button 
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="flex items-center px-4 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300"
                        >
                            {isSubmitting ? (
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
                        
                        <button 
                            onClick={onClose}
                            className="flex items-center px-4 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            ESC-Salir
                        </button>
                    </div>
                </div>
            </div>
            
            {/* Modal para adjuntos */}
            {showAdjuntosModal && (
                <AdjuntosModal 
                    isOpen={showAdjuntosModal} 
                    onClose={() => setShowAdjuntosModal(false)} 
                    clienteId={formData.ID_CLIENTE}
                    clienteNombre={formData.NOMBRE}
                />
            )}
        </div>
    );
}