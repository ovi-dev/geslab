'use client';
import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { useClienteStore } from "@/store/clienteStore";
import { Cliente } from "@/types/cliente";

interface ClienteTableProps {
    onCreateCliente: () => void;
    onEditCliente: () => void;
    onDeleteCliente: () => void;
}

export default function ClienteTable({ 
    onCreateCliente, 
    onEditCliente, 
    onDeleteCliente
}: ClienteTableProps) {
    const { 
        clientes, 
        clienteSeleccionado, 
        selectCliente, 
        isLoading,
        setFilteredClientes
    } = useClienteStore();
    
    const [expandedClienteId, setExpandedClienteId] = useState<number | null>(null);
    const [filtrosVisible, setFiltrosVisible] = useState(true);
    
    // Estado para filtros
    const [filtros, setFiltros] = useState({
        nombre: '',
        cif: '',
        telefono: '',
        responsable: '',
        aeronauticos: false,
        extracomuniario: false,
        intracomuniario: false,
        airbusM: false,
        iberia: false,
        agroalimentarios: false,
        sinFacturaElectronica: false,
        delegaciones: false
    });

    // Estado para paginación y lazy loading
    const [visibleClientes, setVisibleClientes] = useState<Cliente[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const itemsPerPage = 50;
    const observerTarget = useRef<HTMLDivElement>(null);
    const tableContainerRef = useRef<HTMLDivElement>(null);

    // Filtrar clientes
    const filteredClientes = useMemo(() => {
        return clientes.filter(cliente => {
            // Filtros de texto
            const nombreMatch = cliente.NOMBRE?.toLowerCase().includes(filtros.nombre.toLowerCase()) || filtros.nombre === '';
            const cifMatch = cliente.CIF?.toLowerCase().includes(filtros.cif.toLowerCase()) || filtros.cif === '';
            const telefonoMatch = cliente.TELEFONO?.toLowerCase().includes(filtros.telefono.toLowerCase()) || filtros.telefono === '';
            const responsableMatch = cliente.RESPONSABLE?.toLowerCase().includes(filtros.responsable.toLowerCase()) || filtros.responsable === '';
            
            // Filtros de checkbox
            const aeronauticosMatch = !filtros.aeronauticos || (cliente.TIPO?.toLowerCase().includes('aeronáutico') || false);
            const extracomuniarioMatch = !filtros.extracomuniario || (cliente.EXTRANJERO === 1 && cliente.INTRA !== 1);
            const intracomuniarioMatch = !filtros.intracomuniario || cliente.INTRA === 1;
            const airbusMatch = !filtros.airbusM || cliente.AIRBUS === 1;
            const iberiaMatch = !filtros.iberia || cliente.IBERIA === 1;
            const agroalimentariosMatch = !filtros.agroalimentarios || cliente.AGROALIMENTARIO === 1;
            const sinFacturaElectronicaMatch = !filtros.sinFacturaElectronica || cliente.FACTURA_ELECTRONICA !== 1;
            const delegacionesMatch = !filtros.delegaciones || cliente.TIPO?.toLowerCase().includes('delegación');
            
            return nombreMatch && cifMatch && telefonoMatch && responsableMatch && 
                   aeronauticosMatch && extracomuniarioMatch && intracomuniarioMatch && 
                   airbusMatch && iberiaMatch && agroalimentariosMatch && 
                   sinFacturaElectronicaMatch && delegacionesMatch;
        });
    }, [clientes, filtros]);

    // Actualizar los clientes filtrados en el store
    useEffect(() => {
        setFilteredClientes(filteredClientes);
    }, [filteredClientes, setFilteredClientes]);

    // Cargar más clientes al hacer scroll
    const loadMoreClientes = useCallback(() => {
        if (isLoadingMore) return;
        
        setIsLoadingMore(true);
        const nextPage = currentPage + 1;
        const startIndex = (nextPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const newItems = filteredClientes.slice(startIndex, endIndex);
        
        if (newItems.length > 0) {
            setVisibleClientes(prev => [...prev, ...newItems]);
            setCurrentPage(nextPage);
        }
        
        setIsLoadingMore(false);
    }, [currentPage, filteredClientes, isLoadingMore]);

    // Configurar intersection observer para lazy loading
    useEffect(() => {
        const observerTargetCurrent = observerTarget.current;
        
        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting && !isLoadingMore && visibleClientes.length < filteredClientes.length) {
                    loadMoreClientes();
                }
            },
            { threshold: 0.1 }
        );
        
        if (observerTargetCurrent) {
            observer.observe(observerTargetCurrent);
        }
        
        return () => {
            if (observerTargetCurrent) {
                observer.unobserve(observerTargetCurrent);
            }
        };
    }, [loadMoreClientes, isLoadingMore, visibleClientes.length, filteredClientes.length]);

    // Reiniciar la paginación cuando cambian los filtros
    useEffect(() => {
        setCurrentPage(1);
        setVisibleClientes(filteredClientes.slice(0, itemsPerPage));
    }, [filteredClientes]);

    const handleSelectCliente = (cliente: Cliente) => {
        selectCliente(cliente);
    };

    const toggleExpandCliente = (clienteId: number, e: React.MouseEvent) => {
        e.stopPropagation();
        if (expandedClienteId === clienteId) {
            setExpandedClienteId(null);
        } else {
            setExpandedClienteId(clienteId);
        }
    };

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFiltros(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const resetFilters = () => {
        setFiltros({
            nombre: '',
            cif: '',
            telefono: '',
            responsable: '',
            aeronauticos: false,
            extracomuniario: false,
            intracomuniario: false,
            airbusM: false,
            iberia: false,
            agroalimentarios: false,
            sinFacturaElectronica: false,
            delegaciones: false
        });
    };

    // Toggle para mostrar/ocultar filtros
    const toggleFiltros = () => {
        setFiltrosVisible(!filtrosVisible);
    };

    return (
        <div className="flex flex-col h-full">
            {/* Barra de herramientas principal - altura fija */}
            <div className="bg-gray-200 border-b flex items-center p-1 gap-1 h-9">
                <button 
                    onClick={onCreateCliente}
                    className="flex items-center gap-1 px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                    title="Añadir nuevo cliente"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Añadir
                </button>
                <button 
                    onClick={onEditCliente}
                    disabled={!clienteSeleccionado}
                    className={`flex items-center gap-1 px-2 py-1 text-xs rounded ${
                        clienteSeleccionado 
                            ? "bg-blue-600 text-white hover:bg-blue-700" 
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                    title="Modificar cliente seleccionado"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    Modificar
                </button>
                <button 
                    onClick={onDeleteCliente}
                    disabled={!clienteSeleccionado}
                    className={`flex items-center gap-1 px-2 py-1 text-xs rounded ${
                        clienteSeleccionado 
                            ? "bg-red-600 text-white hover:bg-red-700" 
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                    title="Eliminar cliente seleccionado"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Eliminar
                </button>
                <div className="h-4 mx-1 border-r border-gray-400"></div>
                <button className="flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                    Listado
                </button>
                <button className="flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Etiquetas
                </button>
                <button 
                    onClick={toggleFiltros}
                    className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                    title="Mostrar/Ocultar filtros"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                    {filtrosVisible ? 'Ocultar filtros' : 'Mostrar filtros'}
                </button>
                <div className="flex-grow"></div>
                <div className="text-xs text-gray-600 font-medium">
                    {clienteSeleccionado ? `Cliente seleccionado: ${clienteSeleccionado.NOMBRE}` : 'Ningún cliente seleccionado'}
                </div>
            </div>

            {/* Panel de filtros - mostrar/ocultar según estado */}
            {filtrosVisible && (
                <div className="bg-gray-100 p-2 border-b">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-2">
                        <div>
                            <label className="text-xs text-gray-600">Nombre</label>
                            <input
                                type="text"
                                name="nombre"
                                value={filtros.nombre}
                                onChange={handleFilterChange}
                                className="w-full h-6 px-1 py-0 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-gray-600">CIF</label>
                            <input
                                type="text"
                                name="cif"
                                value={filtros.cif}
                                onChange={handleFilterChange}
                                className="w-full h-6 px-1 py-0 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-gray-600">Teléfono</label>
                            <input
                                type="text"
                                name="telefono"
                                value={filtros.telefono}
                                onChange={handleFilterChange}
                                className="w-full h-6 px-1 py-0 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-gray-600">Responsable</label>
                            <input
                                type="text"
                                name="responsable"
                                value={filtros.responsable}
                                onChange={handleFilterChange}
                                className="w-full h-6 px-1 py-0 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-x-3 gap-y-1">
                        <label className="flex items-center text-xs">
                            <input 
                                type="checkbox" 
                                name="aeronauticos"
                                checked={filtros.aeronauticos}
                                onChange={handleFilterChange}
                                className="mr-1 h-3 w-3"
                            />
                            Aeronáuticos
                        </label>
                        <label className="flex items-center text-xs">
                            <input 
                                type="checkbox" 
                                name="extracomuniario"
                                checked={filtros.extracomuniario}
                                onChange={handleFilterChange}
                                className="mr-1 h-3 w-3"
                            />
                            Extracomuniario
                        </label>
                        <label className="flex items-center text-xs">
                            <input 
                                type="checkbox" 
                                name="intracomuniario"
                                checked={filtros.intracomuniario}
                                onChange={handleFilterChange}
                                className="mr-1 h-3 w-3"
                            />
                            Intracomuniario
                        </label>
                        <label className="flex items-center text-xs">
                            <input 
                                type="checkbox" 
                                name="airbusM"
                                checked={filtros.airbusM}
                                onChange={handleFilterChange}
                                className="mr-1 h-3 w-3"
                            />
                            Airbus Military
                        </label>
                        <label className="flex items-center text-xs">
                            <input 
                                type="checkbox" 
                                name="iberia"
                                checked={filtros.iberia}
                                onChange={handleFilterChange}
                                className="mr-1 h-3 w-3"
                            />
                            Iberia
                        </label>
                        <label className="flex items-center text-xs">
                            <input 
                                type="checkbox" 
                                name="agroalimentarios"
                                checked={filtros.agroalimentarios}
                                onChange={handleFilterChange}
                                className="mr-1 h-3 w-3"
                            />
                            Agroalimentarios
                        </label>
                        <label className="flex items-center text-xs">
                            <input 
                                type="checkbox" 
                                name="sinFacturaElectronica"
                                checked={filtros.sinFacturaElectronica}
                                onChange={handleFilterChange}
                                className="mr-1 h-3 w-3"
                            />
                            Sin Factura electrónica
                        </label>
                        <label className="flex items-center text-xs">
                            <input 
                                type="checkbox" 
                                name="delegaciones"
                                checked={filtros.delegaciones}
                                onChange={handleFilterChange}
                                className="mr-1 h-3 w-3"
                            />
                            Delegaciones
                        </label>
                        
                        <div className="flex-grow"></div>
                        
                        <button 
                            onClick={resetFilters}
                            className="px-2 py-0 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                        >
                            Limpiar filtros
                        </button>
                    </div>
                </div>
            )}

            {/* Tabla de clientes - contenedor con overflow auto que permitirá scroll */}
            <div 
                className="overflow-auto flex-grow" 
                ref={tableContainerRef}
                style={{ 
                    height: "calc(100% - 36px - " + (filtrosVisible ? "88px" : "0px") + " - 24px)",
                    scrollbarWidth: 'thin', 
                    scrollbarColor: '#cbd5e0 #f7fafc' 
                }}
            >
                <table className="w-full border-collapse">
                    <thead className="bg-gray-100 sticky top-0 z-10">
                        <tr className="text-xs">
                            <th className="w-8 px-1 py-1 border-b border-gray-300 text-center font-medium text-gray-600">Exp.</th>
                            <th className="w-14 px-1 py-1 border-b border-gray-300 text-left font-medium text-gray-600">Código</th>
                            <th className="px-1 py-1 border-b border-gray-300 text-left font-medium text-gray-600">Nombre</th>
                            <th className="px-1 py-1 border-b border-gray-300 text-left font-medium text-gray-600">Dirección</th>
                            <th className="w-24 px-1 py-1 border-b border-gray-300 text-left font-medium text-gray-600">Teléfono</th>
                            <th className="w-24 px-1 py-1 border-b border-gray-300 text-left font-medium text-gray-600">CIF</th>
                            <th className="w-16 px-1 py-1 border-b border-gray-300 text-center font-medium text-gray-600">Calibry ID</th>
                            <th className="w-8 px-1 py-1 border-b border-gray-300 text-center font-medium text-gray-600">Del</th>
                        </tr>
                    </thead>
                    <tbody className="text-xs">
                        {isLoading ? (
                            <tr>
                                <td colSpan={8} className="px-1 py-2 text-center text-xs">
                                    Cargando clientes...
                                </td>
                            </tr>
                        ) : visibleClientes.length > 0 ? (
                            visibleClientes.map((cliente) => (
                                <>
                                    <tr 
                                        key={cliente.ID_CLIENTE} 
                                        onClick={() => handleSelectCliente(cliente)}
                                        className={`cursor-pointer ${
                                            clienteSeleccionado?.ID_CLIENTE === cliente.ID_CLIENTE 
                                                ? "bg-blue-100" 
                                                : "hover:bg-blue-50"
                                        }`}
                                    >
                                        <td className="px-1 py-1 border-b border-gray-200 text-center">
                                            <button 
                                                onClick={(e) => toggleExpandCliente(cliente.ID_CLIENTE!, e)}
                                                className="text-xs text-blue-500 hover:text-blue-700 focus:outline-none"
                                            >
                                                {expandedClienteId === cliente.ID_CLIENTE ? '−' : '+'}
                                            </button>
                                        </td>
                                        <td className="px-1 py-1 border-b border-gray-200 text-gray-800">
                                            {cliente.ID_CLIENTE}
                                        </td>
                                        <td className="px-1 py-1 border-b border-gray-200 text-gray-800 truncate max-w-xs">
                                            {cliente.NOMBRE || '-'}
                                        </td>
                                        <td className="px-1 py-1 border-b border-gray-200 text-gray-800 truncate max-w-xs">
                                            {cliente.DIRECCION || '-'}
                                        </td>
                                        <td className="px-1 py-1 border-b border-gray-200 text-gray-800">
                                            {cliente.TELEFONO || '-'}
                                        </td>
                                        <td className="px-1 py-1 border-b border-gray-200 text-gray-800">
                                            {cliente.CIF || '-'}
                                        </td>
                                        <td className="px-1 py-1 border-b border-gray-200 text-center text-gray-800">
                                            {cliente.CALIBRY_ID || '-'}
                                        </td>
                                        <td className="px-1 py-1 border-b border-gray-200 text-center text-gray-800">
                                            {cliente.ANULADO === 1 ? '✓' : ''}
                                        </td>
                                    </tr>
                                    {expandedClienteId === cliente.ID_CLIENTE && (
                                        <tr>
                                            <td colSpan={8} className="px-2 py-2 bg-gray-50 border-b border-gray-300">
                                                <div className="grid grid-cols-3 gap-2 text-xs">
                                                    <div>
                                                        <h4 className="font-medium mb-1">Información Principal</h4>
                                                        <ul className="space-y-1">
                                                            <li><span className="font-medium">Tipo:</span> {cliente.TIPO || '-'}</li>
                                                            <li><span className="font-medium">Web:</span> {cliente.WEB || '-'}</li>
                                                            <li><span className="font-medium">Fax:</span> {cliente.FAX || '-'}</li>
                                                            <li><span className="font-medium">Centro:</span> {cliente.CENTRO || '-'}</li>
                                                        </ul>
                                                    </div>
                                                    <div>
                                                        <h4 className="font-medium mb-1">Contacto</h4>
                                                        <ul className="space-y-1">
                                                            <li><span className="font-medium">Responsable:</span> {cliente.RESPONSABLE || '-'}</li>
                                                            <li><span className="font-medium">Cargo:</span> {cliente.CARGO || '-'}</li>
                                                            <li><span className="font-medium">Email:</span> {cliente.EMAIL || '-'}</li>
                                                            <li><span className="font-medium">Email 2:</span> {cliente.EMAIL2 || '-'}</li>
                                                        </ul>
                                                    </div>
                                                    <div>
                                                        <h4 className="font-medium mb-1">Facturación</h4>
                                                        <ul className="space-y-1">
                                                            <li><span className="font-medium">Email fact.:</span> {cliente.EMAIL_FACTURACION || '-'}</li>
                                                            <li><span className="font-medium">Fact. Electrónica:</span> {cliente.FACTURA_ELECTRONICA ? 'Sí' : 'No'}</li>
                                                            <li><span className="font-medium">Banco:</span> {cliente.BANCO || '-'}</li>
                                                            <li><span className="font-medium">Cuenta:</span> {cliente.CUENTA || '-'}</li>
                                                        </ul>
                                                    </div>
                                                    {cliente.OBSERVACIONES && (
                                                        <div className="col-span-3 mt-1">
                                                            <h4 className="font-medium mb-1">Observaciones</h4>
                                                            <p className="bg-white p-1 text-gray-700 border rounded text-xs">
                                                                {cliente.OBSERVACIONES}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={8} className="px-1 py-2 text-center text-xs text-gray-500">
                                    No se encontraron clientes con los criterios de búsqueda
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
                
                {/* Elemento invisible para detección de scroll (lazy loading) */}
                {visibleClientes.length < filteredClientes.length && (
                    <div 
                        ref={observerTarget} 
                        className="h-10 flex items-center justify-center text-xs text-gray-500"
                    >
                        {isLoadingMore ? 'Cargando más clientes...' : ''}
                    </div>
                )}
            </div>

            {/* Barra de estado inferior - altura fija */}
            <div className="bg-gray-100 border-t px-2 py-1 text-xs text-gray-600 flex items-center justify-between h-6">
                <div>Total: {filteredClientes.length} clientes</div>
                <div>Mostrando: {visibleClientes.length} clientes</div>
                {isLoadingMore && <div>Cargando más registros...</div>}
            </div>
        </div>
    );
}