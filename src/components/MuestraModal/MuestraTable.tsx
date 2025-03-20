'use client';
import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { useMuestraStore } from "@/store/muestraStore";
import { Muestra } from "@/types/muestra";

interface MuestraTableProps {
    onCreateMuestra: () => void;
    onEditMuestra: () => void;
    onDeleteMuestra: () => void;
}

export default function MuestraTable({ 
    onCreateMuestra, 
    onEditMuestra, 
    onDeleteMuestra
}: MuestraTableProps) {
    const { 
        muestras, 
        muestraSeleccionada, 
        selectMuestra, 
        isLoading,
        setFilteredMuestras
    } = useMuestraStore();
    
    const [expandedMuestraId, setExpandedMuestraId] = useState<number | null>(null);
    const [filtrosVisible, setFiltrosVisible] = useState(true);
    
    // Estado para filtros
    const [filtros, setFiltros] = useState({
        referencia: '',
        cliente: '',
        producto: '',
        fechaMuestreo: '',
        fechaRecepcion: '',
        urgente: false,
        anulada: false,
        cerrada: false,
        enac: false,
        nadcap: false
    });

    // Estado para paginación y lazy loading
    const [visibleMuestras, setVisibleMuestras] = useState<Muestra[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const itemsPerPage = 50;
    const observerTarget = useRef<HTMLDivElement>(null);
    const tableContainerRef = useRef<HTMLDivElement>(null);

    // Filtrar muestras
    const filteredMuestras = useMemo(() => {
        return muestras.filter(muestra => {
            // Filtros de texto
            const referenciaMatch = muestra.REFERENCIA_CLIENTE?.toLowerCase().includes(filtros.referencia.toLowerCase()) || filtros.referencia === '';
            const productoMatch = muestra.PRODUCTO?.toLowerCase().includes(filtros.producto.toLowerCase()) || filtros.producto === '';
            
            // Filtros de fecha
            const fechaMuestreoMatch = !filtros.fechaMuestreo || 
                (muestra.FECHA_MUESTREO && new Date(muestra.FECHA_MUESTREO).toISOString().split('T')[0] === filtros.fechaMuestreo);
            const fechaRecepcionMatch = !filtros.fechaRecepcion || 
                (muestra.FECHA_RECEPCION && new Date(muestra.FECHA_RECEPCION).toISOString().split('T')[0] === filtros.fechaRecepcion);
            
            // Filtros de checkbox
            const urgenteMatch = !filtros.urgente || muestra.URGENTE === 1;
            const anuladaMatch = !filtros.anulada || muestra.ANULADA === 1;
            const cerradaMatch = !filtros.cerrada || muestra.CERRADA === 1;
            const enacMatch = !filtros.enac || muestra.ENAC === 1;
            const nadcapMatch = !filtros.nadcap || muestra.NADCAP === 1;
            
            return referenciaMatch && productoMatch && 
                   fechaMuestreoMatch && fechaRecepcionMatch && 
                   urgenteMatch && anuladaMatch && cerradaMatch && 
                   enacMatch && nadcapMatch;
        });
    }, [muestras, filtros]);

    // Actualizar las muestras filtradas en el store
    useEffect(() => {
        setFilteredMuestras(filteredMuestras);
    }, [filteredMuestras, setFilteredMuestras]);

    // Cargar más muestras al hacer scroll
    const loadMoreMuestras = useCallback(() => {
        if (isLoadingMore) return;
        
        setIsLoadingMore(true);
        const nextPage = currentPage + 1;
        const startIndex = (nextPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const newItems = filteredMuestras.slice(startIndex, endIndex);
        
        if (newItems.length > 0) {
            setVisibleMuestras(prev => [...prev, ...newItems]);
            setCurrentPage(nextPage);
        }
        
        setIsLoadingMore(false);
    }, [currentPage, filteredMuestras, isLoadingMore]);

    // Configurar intersection observer para lazy loading
    useEffect(() => {
        const observerTargetCurrent = observerTarget.current;
        
        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting && !isLoadingMore && visibleMuestras.length < filteredMuestras.length) {
                    loadMoreMuestras();
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
    }, [loadMoreMuestras, isLoadingMore, visibleMuestras.length, filteredMuestras.length]);

    // Reiniciar la paginación cuando cambian los filtros
    useEffect(() => {
        setCurrentPage(1);
        setVisibleMuestras(filteredMuestras.slice(0, itemsPerPage));
    }, [filteredMuestras]);

    const handleSelectMuestra = (muestra: Muestra) => {
        selectMuestra(muestra);
    };

    const toggleExpandMuestra = (muestraId: number, e: React.MouseEvent) => {
        e.stopPropagation();
        if (expandedMuestraId === muestraId) {
            setExpandedMuestraId(null);
        } else {
            setExpandedMuestraId(muestraId);
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
            referencia: '',
            cliente: '',
            producto: '',
            fechaMuestreo: '',
            fechaRecepcion: '',
            urgente: false,
            anulada: false,
            cerrada: false,
            enac: false,
            nadcap: false
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
                    onClick={onCreateMuestra}
                    className="flex items-center gap-1 px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                    title="Añadir nueva muestra"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Añadir
                </button>
                <button 
                    onClick={onEditMuestra}
                    disabled={!muestraSeleccionada}
                    className={`flex items-center gap-1 px-2 py-1 text-xs rounded ${
                        muestraSeleccionada 
                            ? "bg-blue-600 text-white hover:bg-blue-700" 
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                    title="Modificar muestra seleccionada"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    Modificar
                </button>
                <button 
                    onClick={onDeleteMuestra}
                    disabled={!muestraSeleccionada}
                    className={`flex items-center gap-1 px-2 py-1 text-xs rounded ${
                        muestraSeleccionada 
                            ? "bg-red-600 text-white hover:bg-red-700" 
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                    title="Eliminar muestra seleccionada"
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
                    {muestraSeleccionada ? `Muestra seleccionada: ${muestraSeleccionada.REFERENCIA_CLIENTE}` : 'Ninguna muestra seleccionada'}
                </div>
            </div>

            {/* Panel de filtros - mostrar/ocultar según estado */}
            {filtrosVisible && (
                <div className="bg-gray-100 p-2 border-b">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-2">
                        <div>
                            <label className="text-xs text-gray-600">Referencia</label>
                            <input
                                type="text"
                                name="referencia"
                                value={filtros.referencia}
                                onChange={handleFilterChange}
                                className="w-full h-6 px-1 py-0 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-gray-600">Producto</label>
                            <input
                                type="text"
                                name="producto"
                                value={filtros.producto}
                                onChange={handleFilterChange}
                                className="w-full h-6 px-1 py-0 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-gray-600">Fecha Muestreo</label>
                            <input
                                type="date"
                                name="fechaMuestreo"
                                value={filtros.fechaMuestreo}
                                onChange={handleFilterChange}
                                className="w-full h-6 px-1 py-0 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-gray-600">Fecha Recepción</label>
                            <input
                                type="date"
                                name="fechaRecepcion"
                                value={filtros.fechaRecepcion}
                                onChange={handleFilterChange}
                                className="w-full h-6 px-1 py-0 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                name="urgente"
                                checked={filtros.urgente}
                                onChange={handleFilterChange}
                                className="h-3 w-3"
                            />
                            <label className="ml-1 text-xs text-gray-600">Urgente</label>
                        </div>
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                name="anulada"
                                checked={filtros.anulada}
                                onChange={handleFilterChange}
                                className="h-3 w-3"
                            />
                            <label className="ml-1 text-xs text-gray-600">Anulada</label>
                        </div>
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                name="cerrada"
                                checked={filtros.cerrada}
                                onChange={handleFilterChange}
                                className="h-3 w-3"
                            />
                            <label className="ml-1 text-xs text-gray-600">Cerrada</label>
                        </div>
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                name="enac"
                                checked={filtros.enac}
                                onChange={handleFilterChange}
                                className="h-3 w-3"
                            />
                            <label className="ml-1 text-xs text-gray-600">ENAC</label>
                        </div>
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                name="nadcap"
                                checked={filtros.nadcap}
                                onChange={handleFilterChange}
                                className="h-3 w-3"
                            />
                            <label className="ml-1 text-xs text-gray-600">NADCAP</label>
                        </div>
                    </div>
                    <div className="mt-2 flex justify-end">
                        <button
                            onClick={resetFilters}
                            className="text-xs text-blue-600 hover:text-blue-800"
                        >
                            Limpiar filtros
                        </button>
                    </div>
                </div>
            )}

            {/* Tabla de muestras */}
            <div className="flex-grow overflow-auto" ref={tableContainerRef}>
                <table className="w-full text-xs">
                    <thead>
                        <tr className="bg-gray-100 sticky top-0">
                            <th className="px-1 py-1 border w-8"></th>
                            <th className="px-1 py-1 border w-16">ID</th>
                            <th className="px-1 py-1 border w-32">Referencia</th>
                            <th className="px-1 py-1 border w-32">Producto</th>
                            <th className="px-1 py-1 border w-24">Fecha Muestreo</th>
                            <th className="px-1 py-1 border w-24">Fecha Recepción</th>
                            <th className="px-1 py-1 border w-24">Fecha Prev. Fin</th>
                            <th className="px-1 py-1 border w-16">Estado</th>
                        </tr>
                    </thead>
                    <tbody className="text-xs">
                        {isLoading ? (
                            <tr>
                                <td colSpan={8} className="px-1 py-2 text-center text-xs">
                                    Cargando muestras...
                                </td>
                            </tr>
                        ) : visibleMuestras.length > 0 ? (
                            visibleMuestras.map((muestra) => (
                                <>
                                    <tr 
                                        key={muestra.ID_MUESTRA} 
                                        onClick={() => handleSelectMuestra(muestra)}
                                        className={`cursor-pointer ${
                                            muestraSeleccionada?.ID_MUESTRA === muestra.ID_MUESTRA 
                                                ? "bg-blue-100" 
                                                : "hover:bg-blue-50"
                                        }`}
                                    >
                                        <td className="px-1 py-1 border-b border-gray-200 text-center">
                                            <button 
                                                onClick={(e) => toggleExpandMuestra(muestra.ID_MUESTRA, e)}
                                                className="text-xs text-blue-500 hover:text-blue-700 focus:outline-none"
                                            >
                                                {expandedMuestraId === muestra.ID_MUESTRA ? '−' : '+'}
                                            </button>
                                        </td>
                                        <td className="px-1 py-1 border-b border-gray-200 text-gray-800">
                                            {muestra.ID_MUESTRA}
                                        </td>
                                        <td className="px-1 py-1 border-b border-gray-200">
                                            {muestra.REFERENCIA_CLIENTE || '-'}
                                        </td>
                                        <td className="px-1 py-1 border-b border-gray-200">
                                            {muestra.PRODUCTO || '-'}
                                        </td>
                                        <td className="px-1 py-1 border-b border-gray-200">
                                            {muestra.FECHA_MUESTREO ? new Date(muestra.FECHA_MUESTREO).toLocaleDateString() : '-'}
                                        </td>
                                        <td className="px-1 py-1 border-b border-gray-200">
                                            {muestra.FECHA_RECEPCION ? new Date(muestra.FECHA_RECEPCION).toLocaleDateString() : '-'}
                                        </td>
                                        <td className="px-1 py-1 border-b border-gray-200">
                                            {muestra.FECHA_PREV_FIN ? new Date(muestra.FECHA_PREV_FIN).toLocaleDateString() : '-'}
                                        </td>
                                        <td className="px-1 py-1 border-b border-gray-200">
                                            {muestra.ANULADA ? 'Anulada' : 
                                             muestra.CERRADA ? 'Cerrada' : 
                                             muestra.URGENTE ? 'Urgente' : 'Activa'}
                                        </td>
                                    </tr>
                                    {expandedMuestraId === muestra.ID_MUESTRA && (
                                        <tr>
                                            <td colSpan={8} className="px-2 py-2 bg-gray-50 border-b border-gray-300">
                                                <div className="grid grid-cols-3 gap-2 text-xs">
                                                    <div>
                                                        <h4 className="font-medium mb-1">Información Principal</h4>
                                                        <ul className="space-y-1">
                                                            <li><span className="font-medium">Tipo Muestra:</span> {muestra.TIPO_MUESTRA_ID || '-'}</li>
                                                            <li><span className="font-medium">Tipo Análisis:</span> {muestra.TIPO_ANALISIS_ID || '-'}</li>
                                                            <li><span className="font-medium">Cliente:</span> {muestra.CLIENTE_ID || '-'}</li>
                                                            <li><span className="font-medium">Centro:</span> {muestra.CENTRO_ID || '-'}</li>
                                                        </ul>
                                                    </div>
                                                    <div>
                                                        <h4 className="font-medium mb-1">Detalles</h4>
                                                        <ul className="space-y-1">
                                                            <li><span className="font-medium">Detalle Muestreo:</span> {muestra.DETALLE_MUESTREO || '-'}</li>
                                                            <li><span className="font-medium">Observaciones:</span> {muestra.OBSERVACIONES || '-'}</li>
                                                            <li><span className="font-medium">Precinto:</span> {muestra.PRECINTO || '-'}</li>
                                                            <li><span className="font-medium">Precio:</span> {muestra.PRECIO || '-'} €</li>
                                                        </ul>
                                                    </div>
                                                    <div>
                                                        <h4 className="font-medium mb-1">Certificaciones</h4>
                                                        <ul className="space-y-1">
                                                            <li><span className="font-medium">ENAC:</span> {muestra.ENAC ? 'Sí' : 'No'}</li>
                                                            <li><span className="font-medium">NADCAP:</span> {muestra.NADCAP ? 'Sí' : 'No'}</li>
                                                            <li><span className="font-medium">IPA:</span> {muestra.IPA ? 'Sí' : 'No'}</li>
                                                            <li><span className="font-medium">Informe Manual:</span> {muestra.INFORME_MANUAL ? 'Sí' : 'No'}</li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={8} className="px-1 py-2 text-center text-xs">
                                    No se encontraron muestras
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Barra de estado */}
            <div className="bg-gray-100 border-t px-2 py-1 text-xs text-gray-600 flex items-center justify-between h-6">
                <div>Total: {filteredMuestras.length} muestras</div>
                <div>Mostrando: {visibleMuestras.length} muestras</div>
                {isLoadingMore && <div>Cargando más registros...</div>}
            </div>

            {/* Elemento para detectar cuando llegar al final de la tabla */}
            <div ref={observerTarget} className="h-4"></div>
        </div>
    );
} 