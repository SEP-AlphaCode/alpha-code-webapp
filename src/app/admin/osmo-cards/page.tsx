"use client";
import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Trash2, 
  Plus,
  Edit,
  Eye,
  Loader2,
  CreditCard,
  Activity,
  Palette,
  Filter,
  Play,
  Hand,
  Zap,
  Music,
  Smile
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useOsmoCard } from '@/hooks/use-osmo-card';

export default function OsmoCardManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterColor, setFilterColor] = useState<string>('all');
  const [flippedCards, setFlippedCards] = useState<Set<string>>(new Set());

  const osmoCardHooks = useOsmoCard();
  const { data: osmoCardsResponse, isLoading, error } = osmoCardHooks.useGetAllOsmoCards();
  const deleteOsmoCardMutation = osmoCardHooks.useDeleteOsmoCard();
  const updateOsmoCardMutation = osmoCardHooks.useUpdateOsmoCard();

  // Extract osmo cards from PagedResult
  const osmoCards = osmoCardsResponse?.data || [];

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

  // Get color and icon for card display based on type
  const getCardStyle = (type: string) => {
    const styleMap: { [key: string]: { bg: string, icon: any, border: string } } = {
      'action': { 
        bg: 'bg-red-500', 
        icon: Zap, 
        border: 'border-red-500' 
      },
      'expression': { 
        bg: 'bg-blue-500', 
        icon: Smile, 
        border: 'border-blue-500' 
      },
      'dance': { 
        bg: 'bg-orange-500', 
        icon: Music, 
        border: 'border-orange-500' 
      },
    };
    return styleMap[type.toLowerCase()] || { 
      bg: 'bg-gray-500', 
      icon: CreditCard, 
      border: 'border-gray-500' 
    };
  };

  // Determine card type based on which activity is assigned
  const getCardType = (card: any) => {
    if (card.actionName && card.actionName !== 'No Action') return 'action';
    if (card.expressionName && card.expressionName !== 'No Expression') return 'expression';
    if (card.danceName && card.danceName !== 'No Dance') return 'dance';
    return 'unknown';
  };

  // Get color for card display
  const getCardColor = (color: string) => {
    const colorMap: { [key: string]: string } = {
      'red': 'bg-red-100 text-red-800 border-red-200',
      'blue': 'bg-blue-100 text-blue-800 border-blue-200',
      'green': 'bg-green-100 text-green-800 border-green-200',
      'yellow': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'purple': 'bg-purple-100 text-purple-800 border-purple-200',
      'pink': 'bg-pink-100 text-pink-800 border-pink-200',
      'orange': 'bg-orange-100 text-orange-800 border-orange-200',
      'gray': 'bg-gray-100 text-gray-800 border-gray-200',
    };
    return colorMap[color.toLowerCase()] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusColor = (status: number) => {
    return status === 1 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600';
  };

  const getStatusText = (status: number) => {
    return status === 1 ? 'Active' : 'Inactive';
  };

  const handleDeleteCard = (cardId: string) => {
    if (window.confirm('Are you sure you want to delete this Osmo Card?')) {
      deleteOsmoCardMutation.mutate(cardId);
    }
  };

  const handleToggleStatus = (cardId: string, currentStatus: number) => {
    const newStatus = currentStatus === 1 ? 0 : 1;
    updateOsmoCardMutation.mutate({
      id: cardId,
      osmoCardData: { status: newStatus }
    });
  };

  const handleCardFlip = (cardId: string) => {
    setFlippedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(cardId)) {
        newSet.delete(cardId);
      } else {
        newSet.add(cardId);
      }
      return newSet;
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading Osmo Cards...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-8">
          <p className="text-red-500">Có lỗi xảy ra: {(error as Error)?.message}</p>
        </div>
      </div>
    );
  }

  // Statistics
  const totalCards = filteredOsmoCards.length;
  const activeCards = filteredOsmoCards.filter(card => card.status === 1).length;
  const uniqueColors = new Set(filteredOsmoCards.map(card => card.color).filter(color => color)).size;
  const recentCards = filteredOsmoCards.filter(card => {
    if (!card.createdDate) return false;
    const cardDate = new Date(card.createdDate);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return cardDate > weekAgo;
  }).length;

  return (
    <div className="space-y-6">
      {/* CSS for 3D card flip effect */}
      <style jsx>{`
        .transform-style-preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
      
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Osmo Card Management</h1>
          <p className="text-gray-600">Manage your Osmo Cards and their activities</p>
        </div>
        <Button className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Add New Card</span>
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Cards</p>
                <p className="text-3xl font-bold text-gray-900">{totalCards}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <CreditCard className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Cards</p>
                <p className="text-3xl font-bold text-green-600">{activeCards}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <Activity className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Unique Colors</p>
                <p className="text-3xl font-bold text-purple-600">{uniqueColors}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <Palette className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Recent Cards</p>
                <p className="text-3xl font-bold text-orange-600">{recentCards}</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <Plus className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Osmo Card List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by name, expression, action, dance, or color..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-4">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                {availableStatuses.map(status => (
                  <option key={status} value={status.toString()}>
                    {getStatusText(status)}
                  </option>
                ))}
              </select>
              <select
                value={filterColor}
                onChange={(e) => setFilterColor(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Colors</option>
                {availableColors.map(color => (
                  <option key={color} value={color}>
                    {color ? color.charAt(0).toUpperCase() + color.slice(1) : 'Unknown'}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredOsmoCards.map((card) => {
              const cardType = getCardType(card);
              const cardStyle = getCardStyle(cardType);
              const IconComponent = cardStyle.icon;
              const isFlipped = flippedCards.has(card.id);
              
              return (
                <div key={card.id} className="relative h-80">
                  {/* Card Container with 3D flip effect */}
                  <div 
                    className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d cursor-pointer ${
                      isFlipped ? 'rotate-y-180' : ''
                    }`}
                    onClick={() => handleCardFlip(card.id)}
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    {/* Front Side - Main Card */}
                    <div className={`absolute inset-0 w-full h-full backface-hidden ${cardStyle.bg} rounded-2xl p-6 text-white shadow-lg`}>
                      {/* Card Content */}
                      <div className="relative z-10 h-full flex flex-col justify-center">
                        {/* Icon */}
                        <div className="flex justify-center mb-4">
                          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                            <IconComponent className="w-8 h-8 text-white" />
                          </div>
                        </div>
                        
                        {/* Card Name */}
                        <div className="text-center mb-2">
                          <h3 className="text-lg font-semibold">{card.name || 'Unnamed Card'}</h3>
                          <p className="text-sm opacity-80 capitalize">{cardType}</p>
                        </div>
                        
                        {/* Activity Info */}
                        <div className="text-center text-sm opacity-90">
                          {cardType === 'action' && card.actionName && (
                            <p>{card.actionName}</p>
                          )}
                          {cardType === 'expression' && card.expressionName && (
                            <p>{card.expressionName}</p>
                          )}
                          {cardType === 'dance' && card.danceName && (
                            <p>{card.danceName}</p>
                          )}
                        </div>
                        
                        {/* Click to flip hint */}
                        <div className="text-center mt-4">
                          <p className="text-xs opacity-60">Click to flip</p>
                        </div>
                      </div>
                      
                      {/* Status Badge */}
                      <div className="absolute top-3 right-3">
                        <div className={`w-3 h-3 rounded-full ${card.status === 1 ? 'bg-green-400' : 'bg-red-400'}`}></div>
                      </div>
                    </div>

                    {/* Back Side - Card Details */}
                    <div 
                      className="absolute inset-0 w-full h-full backface-hidden bg-white rounded-2xl p-6 shadow-lg border rotate-y-180"
                      style={{ transform: 'rotateY(180deg)' }}
                    >
                      <div className="h-full flex flex-col justify-center items-center">
                        {/* Header */}
                        <div className="text-center mb-8">
                          <h3 className="text-lg font-semibold text-gray-900">{card.name || 'Unnamed Card'}</h3>
                          <p className="text-sm text-gray-500 capitalize">{cardType} Card</p>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex flex-col space-y-3 w-full max-w-xs">
                          <Button
                            variant="outline"
                            size="lg"
                            className="flex items-center justify-center space-x-2 w-full"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Handle view action
                            }}
                          >
                            <Eye className="h-5 w-5" />
                            <span>View</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="lg"
                            className="flex items-center justify-center space-x-2 w-full"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Handle edit action
                            }}
                          >
                            <Edit className="h-5 w-5" />
                            <span>Edit</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="lg"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteCard(card.id);
                            }}
                            className="text-red-600 hover:text-red-700 border-red-300 hover:border-red-400 flex items-center justify-center space-x-2 w-full"
                          >
                            <Trash2 className="h-5 w-5" />
                            <span>Delete</span>
                          </Button>
                        </div>
                        
                        {/* Click to flip back hint */}
                        <div className="text-center mt-8">
                          <p className="text-xs text-gray-400">Click to flip back</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredOsmoCards.length === 0 && !isLoading && (
            <div className="text-center py-8">
              {osmoCards.length === 0 ? (
                <div className="flex flex-col items-center space-y-4">
                  <CreditCard className="h-12 w-12 text-gray-400" />
                  <div>
                    <p className="text-gray-500 font-medium">No Osmo Cards found</p>
                    <p className="text-gray-400 text-sm">Create your first Osmo Card to get started</p>
                  </div>
                  <Button className="flex items-center space-x-2">
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
        </CardContent>
      </Card>
    </div>
  );
}