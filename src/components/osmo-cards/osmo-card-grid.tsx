import React from 'react';
import { CreditCard, Plus, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { OsmoCard } from '@/types/osmo-card';
import OsmoCardItem from './osmo-card-item';

interface OsmoCardGridProps {
  osmoCards: OsmoCard[];
  filteredOsmoCards: OsmoCard[];
  onDeleteCard: (cardId: string) => void;
  onViewCard?: (cardId: string) => void;
  onEditCard?: (cardId: string) => void;
  onCreateCard?: () => void;
}

export default function OsmoCardGrid({
  osmoCards,
  filteredOsmoCards,
  onDeleteCard,
  onViewCard,
  onEditCard,
  onCreateCard
}: OsmoCardGridProps) {
  return (
    <>
      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredOsmoCards.map((card) => (
          <OsmoCardItem
            key={card.id}
            card={card}
            onDelete={onDeleteCard}
            onView={onViewCard}
            onEdit={onEditCard}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredOsmoCards.length === 0 && (
        <div className="text-center py-8">
          {osmoCards.length === 0 ? (
            <div className="flex flex-col items-center space-y-4">
              <CreditCard className="h-12 w-12 text-gray-400" />
              <div>
                <p className="text-gray-500 font-medium">No Osmo Cards found</p>
                <p className="text-gray-400 text-sm">Create your first Osmo Card to get started</p>
              </div>
              <Button 
                className="flex items-center space-x-2"
                onClick={onCreateCard}
              >
                <Plus className="h-4 w-4" />
                <span>Create Osmo Card</span>
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-4">
              <Filter className="h-12 w-12 text-gray-400" />
              <div>
                <p className="text-gray-500 font-medium">No cards match your criteria</p>
                <p className="text-gray-400 text-sm">Try adjusting your search or filter settings</p>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
