'use client';
import { useState } from 'react';

interface Documento {
    id: number;
    nombre: string;
    tipo: string;
    fecha: string;
    tamaño: string;
}

interface AdjuntosModalProps {
    isOpen: boolean;
    onClose: () => void;
    clienteNombre?: string;
}

export default function AdjuntosModal({
    isOpen,
    onClose,
    clienteNombre
}: AdjuntosModalProps) {
    // Estados
    const [documentos, setDocumentos] = useState<Documento[]>([
        { id: 1, nombre: 'factura_2023.pdf', tipo: 'PDF', fecha: '15/03/2023', tamaño: '245 KB' },
        { id: 2, nombre: 'contrato_firmado.pdf', tipo: 'PDF', fecha: '22/01/2023', tamaño: '1.2 MB' },
        { id: 3, nombre: 'logo_empresa.jpg', tipo: 'JPG', fecha: '05/12/2022', tamaño: '340 KB' }
    ]);
    const [selectedDocId, setSelectedDocId] = useState<number | null>(null);
    const [fileType, setFileType] = useState('PDF');
    const [file, setFile] = useState<File | null>(null);

    // Manejar la selección de archivo
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
        }
    };

    // Agregar nuevo documento
    const handleAddDocument = () => {
        if (!file) return;
        
        const newDoc: Documento = {
            id: Date.now(),
            nombre: file.name,
            tipo: fileType,
            fecha: new Date().toLocaleDateString('es-ES'),
            tamaño: formatFileSize(file.size)
        };
        
        setDocumentos([...documentos, newDoc]);
        setFile(null);
        
        // Resetear el input file
        const fileInput = document.getElementById('fileInput') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
    };

    // Eliminar documento seleccionado
    const handleRemoveDocument = () => {
        if (selectedDocId) {
            setDocumentos(documentos.filter(doc => doc.id !== selectedDocId));
            setSelectedDocId(null);
        }
    };

    // Formatear tamaño de archivo
    const formatFileSize = (bytes: number): string => {
        if (bytes < 1024) return bytes + ' bytes';
        else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
        else return (bytes / 1048576).toFixed(1) + ' MB';
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl flex flex-col">
                {/* Cabecera */}
                <div className="bg-blue-600 text-white px-4 py-2 rounded-t-lg flex items-center justify-between">
                    <h2 className="text-sm font-semibold">
                        Documentos adjuntos - {clienteNombre || 'Cliente'} 
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
                
                {/* Cuerpo */}
                <div className="p-4 overflow-hidden flex flex-col" style={{ maxHeight: 'calc(100vh - 200px)' }}>
                    {/* Tabla de documentos */}
                    <div className="border border-gray-300 rounded mb-4 overflow-hidden flex-grow flex flex-col">
                        <div className="bg-gray-100 px-2 py-1 border-b">
                            <h3 className="text-xs font-semibold text-gray-700">Documentos adjuntos</h3>
                        </div>
                        <div className="overflow-auto flex-grow" style={{ maxHeight: '300px' }}>
                            <table className="min-w-full bg-white text-xs">
                                <thead className="bg-blue-50">
                                    <tr>
                                        <th className="px-2 py-1 border-b border-gray-300 text-left">Nombre</th>
                                        <th className="px-2 py-1 border-b border-gray-300 text-left">Tipo</th>
                                        <th className="px-2 py-1 border-b border-gray-300 text-left">Fecha</th>
                                        <th className="px-2 py-1 border-b border-gray-300 text-left">Tamaño</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {documentos.length > 0 ? (
                                        documentos.map((doc) => (
                                            <tr 
                                                key={doc.id} 
                                                className={`cursor-pointer hover:bg-blue-50 ${selectedDocId === doc.id ? 'bg-blue-100' : ''}`}
                                                onClick={() => setSelectedDocId(doc.id)}
                                            >
                                                <td className="px-2 py-1 border-b border-gray-200">{doc.nombre}</td>
                                                <td className="px-2 py-1 border-b border-gray-200">{doc.tipo}</td>
                                                <td className="px-2 py-1 border-b border-gray-200">{doc.fecha}</td>
                                                <td className="px-2 py-1 border-b border-gray-200">{doc.tamaño}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className="px-2 py-4 text-center text-gray-500">
                                                No hay documentos adjuntos
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    
                    {/* Formulario para adjuntar */}
                    <div className="border border-gray-300 rounded p-3 bg-gray-50">
                        <div className="flex items-end gap-2 flex-wrap">
                            <div>
                                <label className="block text-xs text-gray-700 mb-1">Tipo de documento</label>
                                <select
                                    value={fileType}
                                    onChange={(e) => setFileType(e.target.value)}
                                    className="w-32 px-2 py-1 text-xs border border-gray-300 rounded"
                                >
                                    <option value="PDF">PDF</option>
                                    <option value="DOC">DOC/DOCX</option>
                                    <option value="XLS">XLS/XLSX</option>
                                    <option value="JPG">JPG/JPEG</option>
                                    <option value="PNG">PNG</option>
                                    <option value="TXT">TXT</option>
                                </select>
                            </div>
                            
                            <div className="flex-grow">
                                <label className="block text-xs text-gray-700 mb-1">Seleccionar archivo</label>
                                <input
                                    id="fileInput"
                                    type="file"
                                    onChange={handleFileChange}
                                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded bg-white"
                                />
                            </div>
                            
                            <div className="flex gap-1">
                                <button
                                    onClick={handleAddDocument}
                                    disabled={!file}
                                    className="flex items-center gap-1 px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    Agregar
                                </button>
                                
                                <button
                                    onClick={handleRemoveDocument}
                                    disabled={!selectedDocId}
                                    className="flex items-center gap-1 px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-red-300"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    Quitar
                                </button>
                            </div>
                        </div>
                        
                        {file && (
                            <div className="mt-2 text-xs text-gray-700">
                                <span className="font-medium">Archivo seleccionado:</span> {file.name} ({formatFileSize(file.size)})
                            </div>
                        )}
                    </div>
                </div>
                
                {/* Pie */}
                <div className="bg-gray-100 px-4 py-2 border-t flex justify-end gap-2 rounded-b-lg">
                    <button
                        onClick={onClose}
                        className="px-4 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Aceptar
                    </button>
                </div>
            </div>
        </div>
    );
}