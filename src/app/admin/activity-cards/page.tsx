"use client";

import React, { useState } from 'react';
import { 
  CreditCard, 
  Edit, 
  Trash2, 
  Search,
  Download,
  Upload,
  Eye,
  Copy,
  Star,
  Tag,
  Users,
  Book,
  Volume2,
  Zap,
  Image as ImageIcon,
  Clock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface ActivityCard {
  id: string;
  title: string;
  description: string;
  category: 'language' | 'math' | 'science' | 'art' | 'music' | 'social';
  difficulty: 'easy' | 'medium' | 'hard';
  ageGroup: string;
  duration: number; // in minutes
  instructions: string[];
  materials: string[];
  qrCode: string;
  imageUrl?: string;
  tags: string[];
  usageCount: number;
  rating: number;
  createdBy: string;
  createdAt: string;
  lastUsed?: string;
  status: 'active' | 'draft' | 'archived';
  robotFunctions: string[];
}

interface Collection {
  id: string;
  name: string;
  description: string;
  cardIds: string[];
  createdAt: string;
  isPublic: boolean;
}

export default function ActivityCardsManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  // const [ showAddModal, setShowAddModal] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'cards' | 'collections'>('cards');

  // Mock data - replace with real API calls
  const activityCards: ActivityCard[] = [
    {
      id: '1',
      title: 'Animal Sounds Adventure',
      description: 'Learn about different animals and their sounds through interactive play with Alpha Mini',
      category: 'language',
      difficulty: 'easy',
      ageGroup: '3-5 years',
      duration: 15,
      instructions: [
        'Show the animal card to Alpha Mini',
        'Listen to the animal sound',
        'Repeat the sound with Alpha Mini',
        'Learn the animal name'
      ],
      materials: ['Animal picture cards', 'Alpha Mini robot'],
      qrCode: 'QR001',
      imageUrl: '/images/animal-sounds.jpg',
      tags: ['animals', 'sounds', 'vocabulary'],
      usageCount: 145,
      rating: 4.8,
      createdBy: 'Sarah Johnson',
      createdAt: '2024-01-15',
      lastUsed: '2024-08-18',
      status: 'active',
      robotFunctions: ['voice_recognition', 'sound_playback', 'face_detection']
    },
    {
      id: '2',
      title: 'Counting with Colors',
      description: 'Practice counting and color recognition using physical blocks and Alpha Mini guidance',
      category: 'math',
      difficulty: 'easy',
      ageGroup: '4-6 years',
      duration: 20,
      instructions: [
        'Place colored blocks in front of Alpha Mini',
        'Follow counting instructions',
        'Sort blocks by color',
        'Count each color group'
      ],
      materials: ['Colored counting blocks', 'Alpha Mini robot'],
      qrCode: 'QR002',
      imageUrl: '/images/counting-colors.jpg',
      tags: ['counting', 'colors', 'sorting', 'math'],
      usageCount: 89,
      rating: 4.6,
      createdBy: 'Mike Chen',
      createdAt: '2024-02-20',
      lastUsed: '2024-08-17',
      status: 'active',
      robotFunctions: ['voice_recognition', 'visual_recognition', 'gesture_detection']
    },
    {
      id: '3',
      title: 'Dance Party',
      description: 'Learn basic dance moves and rhythm with Alpha Mini in this fun movement activity',
      category: 'art',
      difficulty: 'medium',
      ageGroup: '4-7 years',
      duration: 25,
      instructions: [
        'Stand in front of Alpha Mini',
        'Watch the dance demonstration',
        'Copy the movements',
        'Create your own dance sequence'
      ],
      materials: ['Open space', 'Alpha Mini robot', 'Music playlist'],
      qrCode: 'QR003',
      imageUrl: '/images/dance-party.jpg',
      tags: ['dance', 'movement', 'music', 'creativity'],
      usageCount: 67,
      rating: 4.9,
      createdBy: 'Emily Davis',
      createdAt: '2024-03-10',
      lastUsed: '2024-08-16',
      status: 'active',
      robotFunctions: ['dance_moves', 'music_playback', 'motion_sensor']
    },
    {
      id: '4',
      title: 'Weather Station',
      description: 'Explore weather concepts and make daily weather observations with Alpha Mini',
      category: 'science',
      difficulty: 'medium',
      ageGroup: '5-8 years',
      duration: 30,
      instructions: [
        'Observe current weather conditions',
        'Record findings with Alpha Mini',
        'Learn weather vocabulary',
        'Predict tomorrow\'s weather'
      ],
      materials: ['Weather chart', 'Alpha Mini robot', 'Window for observation'],
      qrCode: 'QR004',
      tags: ['weather', 'observation', 'science', 'vocabulary'],
      usageCount: 34,
      rating: 4.4,
      createdBy: 'John Smith',
      createdAt: '2024-04-05',
      status: 'draft',
      robotFunctions: ['voice_recognition', 'data_recording', 'educational_content']
    }
  ];

  const collections: Collection[] = [
    {
      id: '1',
      name: 'Beginner Language Pack',
      description: 'Essential language learning activities for preschoolers',
      cardIds: ['1', '2'],
      createdAt: '2024-01-20',
      isPublic: true
    },
    {
      id: '2',
      name: 'STEM Basics',
      description: 'Introduction to science, technology, engineering, and math concepts',
      cardIds: ['2', '4'],
      createdAt: '2024-02-15',
      isPublic: true
    },
    {
      id: '3',
      name: 'Creative Arts',
      description: 'Art, music, and creative expression activities',
      cardIds: ['3'],
      createdAt: '2024-03-01',
      isPublic: false
    }
  ];

  const filteredCards = activityCards.filter(card => {
    const matchesSearch = card.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         card.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         card.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = filterCategory === 'all' || card.category === filterCategory;
    const matchesDifficulty = filterDifficulty === 'all' || card.difficulty === filterDifficulty;
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const getCategoryColor = (category: string) => {
    const colors = {
      language: 'bg-blue-100 text-blue-800',
      math: 'bg-green-100 text-green-800',
      science: 'bg-purple-100 text-purple-800',
      art: 'bg-pink-100 text-pink-800',
      music: 'bg-yellow-100 text-yellow-800',
      social: 'bg-indigo-100 text-indigo-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      easy: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      hard: 'bg-red-100 text-red-800'
    };
    return colors[difficulty as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      draft: 'bg-yellow-100 text-yellow-800',
      archived: 'bg-gray-100 text-gray-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      language: Book,
      math: Calculator,
      science: Zap,
      art: ImageIcon,
      music: Volume2,
      social: Users
    };
    const IconComponent = icons[category as keyof typeof icons] || Book;
    return <IconComponent className="h-4 w-4" />;
  };

  const handleDeleteCard = (cardId: string) => {
    if (confirm('Are you sure you want to delete this activity card?')) {
      console.log('Deleting card:', cardId);
    }
  };

  const handleDuplicateCard = (cardId: string) => {
    console.log('Duplicating card:', cardId);
  };

  const handleExportCards = () => {
    console.log('Exporting activity cards...');
  };

  const stats = {
    totalCards: activityCards.length,
    activeCards: activityCards.filter(c => c.status === 'active').length,
    totalUsage: activityCards.reduce((sum, c) => sum + c.usageCount, 0),
    averageRating: (activityCards.reduce((sum, c) => sum + c.rating, 0) / activityCards.length).toFixed(1),
    totalCollections: collections.length
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Activity Cards Management</h1>
          <p className="text-gray-600">Create and manage interactive learning activities</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleExportCards}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
          {/* <Button onClick={() => setShowAddModal(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add New Card
          </Button> */}
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Cards</p>
                <p className="text-2xl font-bold">{stats.totalCards}</p>
              </div>
              <CreditCard className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Cards</p>
                <p className="text-2xl font-bold text-green-600">{stats.activeCards}</p>
              </div>
              <Eye className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Usage</p>
                <p className="text-2xl font-bold">{stats.totalUsage}</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Rating</p>
                <p className="text-2xl font-bold">{stats.averageRating}</p>
              </div>
              <Star className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Collections</p>
                <p className="text-2xl font-bold">{stats.totalCollections}</p>
              </div>
              <Book className="h-8 w-8 text-indigo-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setSelectedTab('cards')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              selectedTab === 'cards'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Activity Cards
          </button>
          <button
            onClick={() => setSelectedTab('collections')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              selectedTab === 'collections'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Collections
          </button>
        </nav>
      </div>

      {selectedTab === 'cards' && (
        <>
          {/* Filters and Search */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search activity cards..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Categories</option>
                  <option value="language">Language</option>
                  <option value="math">Math</option>
                  <option value="science">Science</option>
                  <option value="art">Art</option>
                  <option value="music">Music</option>
                  <option value="social">Social</option>
                </select>
                <select
                  value={filterDifficulty}
                  onChange={(e) => setFilterDifficulty(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Difficulties</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Activity Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredCards.map((card) => (
              <Card key={card.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        {getCategoryIcon(card.category)}
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg line-clamp-1">{card.title}</CardTitle>
                        <p className="text-sm text-gray-500">{card.ageGroup}</p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(card.status)}>
                      {card.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Description */}
                    <p className="text-sm text-gray-600 line-clamp-2">{card.description}</p>

                    {/* Badges */}
                    <div className="flex flex-wrap gap-2">
                      <Badge className={getCategoryColor(card.category)}>
                        {card.category}
                      </Badge>
                      <Badge className={getDifficultyColor(card.difficulty)}>
                        {card.difficulty}
                      </Badge>
                      <Badge variant="outline">
                        <Clock className="h-3 w-3 mr-1" />
                        {card.duration}m
                      </Badge>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1">
                      {card.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          <Tag className="h-2 w-2 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                      {card.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{card.tags.length - 3}
                        </Badge>
                      )}
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Users className="h-3 w-3" />
                        <span>{card.usageCount} uses</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span>{card.rating}</span>
                      </div>
                    </div>

                    {/* Robot Functions */}
                    <div>
                      <p className="text-xs font-medium text-gray-600 mb-1">Robot Functions:</p>
                      <div className="flex flex-wrap gap-1">
                        {card.robotFunctions.slice(0, 2).map((func) => (
                          <Badge key={func} variant="outline" className="text-xs">
                            {func.replace('_', ' ')}
                          </Badge>
                        ))}
                        {card.robotFunctions.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{card.robotFunctions.length - 2}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Created Info */}
                    <div className="text-xs text-gray-500">
                      <p>Created by {card.createdBy}</p>
                      <p>QR Code: {card.qrCode}</p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2 pt-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Eye className="h-3 w-3 mr-1" />
                        Preview
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleDuplicateCard(card.id)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleDeleteCard(card.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredCards.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No activity cards found matching your criteria.</p>
                {/* <Button className="mt-4" onClick={() => setShowAddModal(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Card
                </Button> */}
              </CardContent>
            </Card>
          )}
        </>
      )}

      {selectedTab === 'collections' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {collections.map((collection) => (
            <Card key={collection.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{collection.name}</CardTitle>
                    <p className="text-sm text-gray-500">{collection.cardIds.length} cards</p>
                  </div>
                  <Badge className={collection.isPublic ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                    {collection.isPublic ? 'Public' : 'Private'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">{collection.description}</p>
                  
                  <div className="text-xs text-gray-500">
                    Created: {new Date(collection.createdAt).toLocaleDateString()}
                  </div>

                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                    <Button size="sm" variant="outline">
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// Helper component for missing Calculator icon
function Calculator({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  );
}
