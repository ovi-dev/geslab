'use client';
import ClienteModal from "@/components/ClienteModal/ClienteModal";
import ClienteTable from "@/components/ClienteModal/ClienteTable";
import DeleteConfirmationModal from "@/components/ClienteModal/DeleteConfirmationModal";
import { fetchClientes } from "@/services/clienteService";
import { useClienteStore } from "@/store/clienteStore";
import { useState, useEffect } from "react";

export default function Home() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);

    // Usar el cliente seleccionado directamente del store
    const { 
        setClientes, 
        removeCliente, 
        clienteSeleccionado, 
        selectCliente,
        setLoading,
        error,
        setError
    } = useClienteStore();

    // Cargar los clientes al iniciar
    useEffect(() => {
        const loadClientes = async () => {
            try {
                setLoading(true);
                const data = await fetchClientes();
                setClientes(data);
            } catch (error) {
                console.error("Error al cargar clientes:", error);
                setError(error instanceof Error ? error.message : "Error desconocido al cargar clientes");
            } finally {
                setLoading(false);
            }
        };
        loadClientes();
    }, [setClientes, setLoading, setError]);

    const handleCreateCliente = () => {
        // Limpiar selección y abrir modal en modo creación
        selectCliente(null);
        setIsCreating(true);
        setIsModalOpen(true);
    };

    const handleEditCliente = () => {
        // Solo abrir en modo edición si hay un cliente seleccionado
        if (clienteSeleccionado) {
            setIsCreating(false);
            setIsModalOpen(true);
        }
    };

    const handleDeleteCliente = () => {
        if (clienteSeleccionado && clienteSeleccionado.ID_CLIENTE !== undefined) {
            removeCliente(clienteSeleccionado.ID_CLIENTE);
            setIsDeleteModalOpen(false);
            // El store ya limpia la selección al eliminar
        }
    };

    return (
        <div className="flex flex-col h-screen bg-gray-100 overflow-hidden">
            {/* Barra superior - altura fija */}
            {error && (
                    <div className="ml-auto text-sm bg-red-700 px-2 py-1 rounded">
                        {error}
                    </div>
                )}

            {/* Contenido principal - ocupa todo el espacio disponible sin crear scrollbar */}
            <div className="flex-grow h-[calc(100vh-40px)]">
                <ClienteTable 
                    onCreateCliente={handleCreateCliente}
                    onEditCliente={handleEditCliente}
                    onDeleteCliente={() => setIsDeleteModalOpen(true)}
                />
            </div>

            {/* Modal de Cliente */}
            <ClienteModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                initialData={isCreating ? undefined : clienteSeleccionado || undefined}
                isCreating={isCreating}
            />

            {/* Modal de confirmación de eliminación */}
            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteCliente}
                title="¿Eliminar cliente?"
                message={`¿Estás seguro de que deseas eliminar al cliente ${clienteSeleccionado?.NOMBRE || ''}? Esta acción no se puede deshacer.`}
            />
        </div>
    );
}