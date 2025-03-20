'use client';
import { useEffect, useState } from 'react';
import { useMuestraStore } from '@/store/muestraStore';
import { fetchMuestras } from '@/services/muestraService';
import MuestraTable from '@/components/MuestraModal/MuestraTable';
import MuestraModal from '@/components/MuestraModal/MuestraModal';
import DeleteConfirmationModal from '@/components/MuestraModal/DeleteConfirmationModal';

export default function MuestrasPage() {
    const { setMuestras, setLoading, setError } = useMuestraStore();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    useEffect(() => {
        const loadMuestras = async () => {
            try {
                setLoading(true);
                const muestras = await fetchMuestras();
                setMuestras(muestras);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Error al cargar las muestras');
            } finally {
                setLoading(false);
            }
        };

        loadMuestras();
    }, [setMuestras, setLoading, setError]);

    return (
        <div className="h-full flex flex-col">
            <div className="flex-grow">
                <MuestraTable
                    onCreateMuestra={() => setIsCreateModalOpen(true)}
                    onEditMuestra={() => setIsEditModalOpen(true)}
                    onDeleteMuestra={() => setIsDeleteModalOpen(true)}
                />
            </div>

            <MuestraModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                mode="create"
            />

            <MuestraModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                mode="edit"
            />

            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
            />
        </div>
    );
}
