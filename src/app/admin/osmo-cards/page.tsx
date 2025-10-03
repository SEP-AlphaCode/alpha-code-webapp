"use client";
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useOsmoCard } from '@/features/activities/hooks/use-osmo-card';
import { CreateCardData, OsmoCard } from '@/types/osmo-card';
import { toast } from 'sonner';
// Import các component đã tách
import PageHeader from '@/components/osmo-cards/page-header';
import StatisticsCards from '@/components/osmo-cards/statistics-cards';
import SearchAndFilter from '@/components/osmo-cards/search-and-filter';
import OsmoCardGrid from '@/components/osmo-cards/osmo-card-grid';
import LoadingState from '@/components/loading-state';
import ErrorState from '@/components/error-state';
import ViewOsmoCardModal from '@/components/osmo-cards/view-osmo-card-modal';
import EditOsmoCardModal from '@/components/osmo-cards/edit-osmo-card-modal';
import CreateOsmoCardModal from '@/components/osmo-cards/create-osmo-card-modal';
import { ApiResponse } from '@/types/api-error';

export default function OsmoCardManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterColor, setFilterColor] = useState<string>('all');

  // Modal states
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<OsmoCard | null>(null);
  const [editApiError, setEditApiError] = useState<ApiResponse>();

  const osmoCardHooks = useOsmoCard();
  // Keep full query object to enable retry (refetch)
  const osmoCardsQuery = osmoCardHooks.useGetAllOsmoCards();
  const { data: osmoCardsResponse, isLoading, error, refetch, isFetching } = osmoCardsQuery;
  const deleteOsmoCardMutation = osmoCardHooks.useDeleteOsmoCard();
  const updateOsmoCardMutation = osmoCardHooks.useUpdateOsmoCard();
  const createOsmoCardMutation = osmoCardHooks.useCreateOsmoCard();

  // Extract osmo cards from PagedResult with stable reference
  const osmoCards = useMemo(() => {
    return osmoCardsResponse?.data || [];
  }, [osmoCardsResponse?.data]);

  // Get unique colors and statuses for filters
  const availableColors = useMemo(() => {
    const colors = [...new Set(osmoCards.map(card => card.color).filter(color => color && color.trim() !== ''))];
    return colors;
  }, [osmoCards]);

  const availableStatuses = useMemo(() => {
    const statuses = [...new Set(osmoCards.map(card => card.status))];
    return statuses;
  }, [osmoCards]);

  const filteredOsmoCards = useMemo(() => {
    return osmoCards.filter(card => {
      const matchesSearch = (card.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (card.expressionName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (card.actionName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (card.danceName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (card.color || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || card.status?.toString() === filterStatus;
      const matchesColor = filterColor === 'all' || card.color === filterColor;
      return matchesSearch && matchesStatus && matchesColor;
    });
  }, [osmoCards, searchTerm, filterStatus, filterColor]);

  // Event handlers
  const handleDeleteCard = (cardId: string) => {
    deleteOsmoCardMutation.mutate(cardId, {
      onSuccess: () => {
        // Success toast will be shown by the osmo-card-item component
      },
      onError: (error: Error) => {
        console.error('Delete error:', error);

        // Extract error message from API response
        const errorMessage = 'Failed to delete Osmo Card';
        let errorDescription = 'Please try again later.';

        // Try to extract API error details if available
        const apiError = error as unknown as ApiResponse;
        if (typeof apiError?.message === 'string') {
          errorDescription = apiError.message;
        }

        toast.error(errorMessage, {
          description: errorDescription,
          duration: 5000,
        });
      }
    });
  };

  const handleAddNewCard = () => {
    setCreateModalOpen(true);
  };

  const handleViewCard = (cardId: string) => {
    const card = osmoCards.find(c => c.id === cardId);
    if (card) {
      setSelectedCard(card);
      setViewModalOpen(true);
    }
  };

  const handleEditCard = (cardId: string) => {
    const card = osmoCards.find(c => c.id === cardId);
    if (card) {
      setSelectedCard(card);
      setEditModalOpen(true);
    }
  };

  const handleSaveEdit = (cardId: string, updatedData: Partial<OsmoCard>) => {
    // Clear previous errors
    setEditApiError(undefined);

    updateOsmoCardMutation.mutate({
      id: cardId,
      osmoCardData: updatedData
    }, {
      onSuccess: () => {
        setEditModalOpen(false);
        setSelectedCard(null);
        setEditApiError(undefined);
        toast.success('Osmo Card updated successfully');
      },
      onError: (error: Error) => {
        // Cast error to ApiResponse to access custom properties
        const apiError = error as unknown as ApiResponse;
        // Store error for modal to display field-specific errors
        setEditApiError(apiError);

        // Extract error message from API response
        let errorMessage = 'Failed to update Osmo Card';
        const errorDescription = 'Please check the form and try again.';

        if (apiError) {

          // Handle validation errors (422)
          const response = (error as unknown as ApiResponse);
          if (typeof response?.message === 'string') {
            errorMessage = response.message;
          }
        }

        toast.error(errorMessage, {
          description: errorDescription,
          duration: 5000, // Show longer for error messages
        });
      }
    });
  };

  const handleCloseViewModal = () => {
    setViewModalOpen(false);
    setSelectedCard(null);
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setSelectedCard(null);
    setEditApiError(undefined);
  };

  const handleCreateCard = () => {
    setCreateModalOpen(true);
  };

  const handleSaveCreate = (cardData: CreateCardData) => {
    createOsmoCardMutation.mutate(cardData, {
      onSuccess: () => {
        setCreateModalOpen(false);
        toast.success('Osmo Card created successfully');
      },
      onError: (error: Error) => {
        // Extract error message from API response
        let errorMessage = 'Failed to create Osmo Card';
        const errorDescription = 'Please try again later.';

        // Try to extract API error details if available
        // @ts-expect-error - Error object might have additional properties from API response
        const response = (error as ApiResponse);
        if (typeof response?.message === 'string') {
          errorMessage = response.message;
        }
        // If response.message is not a string, keep the default

        toast.error(errorMessage, {
          description: errorDescription,
          duration: 5000,
        });
      }
    });
  };

  const handleCloseCreateModal = () => {
    setCreateModalOpen(false);
  };

  // Loading and error states
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingState />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <ErrorState
          error={error}
          onRetry={() => refetch()}
          className={isFetching ? 'opacity-70 pointer-events-none' : ''}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader onAddNewCard={handleAddNewCard} />

      {/* Statistics Cards */}
      <StatisticsCards osmoCards={filteredOsmoCards} />

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Osmo Card List</CardTitle>
        </CardHeader>
        <CardContent>
          <SearchAndFilter
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            filterColor={filterColor}
            setFilterColor={setFilterColor}
            availableStatuses={availableStatuses}
            availableColors={availableColors}
          />

          {/* Cards Grid */}
          <OsmoCardGrid
            osmoCards={osmoCards}
            filteredOsmoCards={filteredOsmoCards}
            onDeleteCard={handleDeleteCard}
            onViewCard={handleViewCard}
            onEditCard={handleEditCard}
            onCreateCard={handleCreateCard}
          />
        </CardContent>
      </Card>

      {/* Modals */}
      <ViewOsmoCardModal
        isOpen={viewModalOpen}
        onClose={handleCloseViewModal}
        card={selectedCard}
      />

      <EditOsmoCardModal
        isOpen={editModalOpen}
        onClose={handleCloseEditModal}
        onSave={handleSaveEdit}
        card={selectedCard}
        isLoading={updateOsmoCardMutation.isPending}
        apiError={editApiError}
      />

      <CreateOsmoCardModal
        isOpen={createModalOpen}
        onClose={handleCloseCreateModal}
        onCreate={handleSaveCreate}
        isLoading={createOsmoCardMutation?.isPending}
      />
    </div>
  );
}