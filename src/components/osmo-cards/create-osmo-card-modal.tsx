import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Plus, X, Palette, Music, Zap, Smile } from 'lucide-react';
import { CreateCardData } from '@/types/osmo-card';
import { useAction } from '@/features/activities/hooks/use-action';
import { useExpression } from '@/features/activities/hooks/use-expression';
import { useDance } from '@/features/activities/hooks/use-dance';

interface CreateOsmoCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (cardData: CreateCardData) => void;
  isLoading?: boolean;
}

export default function CreateOsmoCardModal({ 
  isOpen, 
  onClose, 
  onCreate, 
  isLoading = false 
}: CreateOsmoCardModalProps) {
  const [formData, setFormData] = useState<CreateCardData>({
    name: '',
    color: '',
    status: 1,
    actionId: '',
    actionName: '',
    expressionId: '',
    expressionName: '',
    danceId: '',
    danceName: ''
  });

  const [errors, setErrors] = useState<Partial<CreateCardData>>({});

  // Fetch data from APIs
  const actionHooks = useAction();
  const expressionHooks = useExpression();
  const danceHooks = useDance();

  // Fetch actions, expressions, and dances
  const { data: actionsResponse, isLoading: actionsLoading, error: actionsError } = actionHooks.useGetPagedActions(1, 100); // Get all actions
  const { data: expressionsResponse, isLoading: expressionsLoading, error: expressionsError } = expressionHooks.useGetPagedExpressions(1, 100); // Get all expressions  
  const { data: dancesResponse, isLoading: dancesLoading, error: dancesError } = danceHooks.useGetPagedDances(1, 100); // Get all dances

  // Extract data from API responses
  const actions = actionsResponse?.data || [];
  const expressions = expressionsResponse?.data || [];
  const dances = dancesResponse?.data || [];

  // Check if any API is loading
  const isDataLoading = actionsLoading || expressionsLoading || dancesLoading;
  const hasApiError = actionsError || expressionsError || dancesError;

  // Available options
  const colorOptions = [
    { value: 'red', label: 'Red' },
    { value: 'blue', label: 'Blue' },
    { value: 'green', label: 'Green' },
    { value: 'yellow', label: 'Yellow' },
    { value: 'purple', label: 'Purple' },
    { value: 'pink', label: 'Pink' },
    { value: 'orange', label: 'Orange' },
    { value: 'gray', label: 'Gray' }
  ];

  const handleInputChange = (field: keyof CreateCardData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const handleActionChange = (actionId: string) => {
    const selectedAction = actions.find(action => action.id === actionId);
    setFormData(prev => ({
      ...prev,
      actionId: actionId === 'none' ? '' : actionId,
      actionName: actionId === 'none' ? '' : (selectedAction?.name || '')
    }));
  };

  const handleExpressionChange = (expressionId: string) => {
    const selectedExpression = expressions.find(expr => expr.id === expressionId);
    setFormData(prev => ({
      ...prev,
      expressionId: expressionId === 'none' ? '' : expressionId,
      expressionName: expressionId === 'none' ? '' : (selectedExpression?.name || '')
    }));
  };

  const handleDanceChange = (danceId: string) => {
    const selectedDance = dances.find(dance => dance.id === danceId);
    setFormData(prev => ({
      ...prev,
      danceId: danceId === 'none' ? '' : danceId,
      danceName: danceId === 'none' ? '' : (selectedDance?.name || '')
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<CreateCardData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Card name is required';
    }

    if (!formData.color) {
      newErrors.color = 'Color is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreate = () => {
    if (!validateForm()) return;

    onCreate(formData);
  };

  const handleClose = () => {
    // Reset form
    setFormData({
      name: '',
      color: '',
      status: 1,
      actionId: '',
      actionName: '',
      expressionId: '',
      expressionName: '',
      danceId: '',
      danceName: ''
    });
    setErrors({});
    onClose();
  };

  const getColorPreview = (colorValue: string) => {
    const colorMap: { [key: string]: string } = {
      'red': '#ef4444',
      'blue': '#3b82f6',
      'green': '#22c55e',
      'yellow': '#eab308',
      'purple': '#a855f7',
      'pink': '#ec4899',
      'orange': '#f97316',
      'gray': '#6b7280',
    };
    
    return colorMap[colorValue] || '#6b7280';
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-green-500 text-white">
              <Plus className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Create New Osmo Card</h2>
              <p className="text-sm text-gray-500">Add a new Osmo Card with activities</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Loading State */}
          {isDataLoading && (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                <span className="text-sm text-gray-500">Loading activities data...</span>
              </div>
            </div>
          )}

          {/* Error State */}
          {hasApiError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <X className="h-4 w-4 text-red-500" />
                <span className="text-sm text-red-700">Failed to load activities data. Some options may not be available.</span>
              </div>
            </div>
          )}

          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center space-x-2">
              <Palette className="h-5 w-5" />
              <span>Basic Information</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cardName">Card Name *</Label>
                <Input
                  id="cardName"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter card name"
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cardColor">Color *</Label>
                <Select value={formData.color} onValueChange={(value) => handleInputChange('color', value)}>
                  <SelectTrigger className={errors.color ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select color">
                      {formData.color && (
                        <div className="flex items-center space-x-2">
                          <div 
                            className="w-4 h-4 rounded-full border"
                            style={{ backgroundColor: getColorPreview(formData.color) }}
                          />
                          <span className="capitalize">{formData.color}</span>
                        </div>
                      )}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {colorOptions.map((color) => (
                      <SelectItem key={color.value} value={color.value}>
                        <div className="flex items-center space-x-2">
                          <div 
                            className="w-4 h-4 rounded-full border"
                            style={{ backgroundColor: getColorPreview(color.value) }}
                          />
                          <span>{color.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.color && (
                  <p className="text-sm text-red-500">{errors.color}</p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="cardStatus"
                checked={formData.status === 1}
                onCheckedChange={(checked) => handleInputChange('status', checked ? 1 : 0)}
              />
              <Label htmlFor="cardStatus">
                Active Status {formData.status === 1 ? '(Active)' : '(Inactive)'}
              </Label>
            </div>
          </div>

          <Separator />

          {/* Activity Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Activity Configuration</h3>
            <p className="text-sm text-gray-600">Configure the activities that this card will trigger (optional)</p>
            
            <div className="space-y-4">
              {/* Action */}
              <div className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center space-x-2">
                  <Zap className="h-4 w-4 text-red-500" />
                  <Label className="text-base font-medium">Action</Label>
                </div>
                <Select value={formData.actionId || 'none'} onValueChange={handleActionChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an action (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Action</SelectItem>
                    {actions.length === 0 && !actionsLoading ? (
                      <SelectItem value="no-data" disabled>No actions available</SelectItem>
                    ) : (
                      actions.map((action) => (
                        <SelectItem key={action.id} value={action.id}>
                          {action.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Expression */}
              <div className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center space-x-2">
                  <Smile className="h-4 w-4 text-blue-500" />
                  <Label className="text-base font-medium">Expression</Label>
                </div>
                <Select value={formData.expressionId || 'none'} onValueChange={handleExpressionChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an expression (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Expression</SelectItem>
                    {expressions.length === 0 && !expressionsLoading ? (
                      <SelectItem value="no-data" disabled>No expressions available</SelectItem>
                    ) : (
                      expressions.map((expression) => (
                        <SelectItem key={expression.id} value={expression.id}>
                          {expression.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Dance */}
              <div className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center space-x-2">
                  <Music className="h-4 w-4 text-orange-500" />
                  <Label className="text-base font-medium">Dance</Label>
                </div>
                <Select value={formData.danceId || 'none'} onValueChange={handleDanceChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a dance (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Dance</SelectItem>
                    {dances.length === 0 && !dancesLoading ? (
                      <SelectItem value="no-data" disabled>No dances available</SelectItem>
                    ) : (
                      dances.map((dance) => (
                        <SelectItem key={dance.id} value={dance.id}>
                          {dance.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={handleClose}
            disabled={isLoading || isDataLoading}
          >
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button 
            onClick={handleCreate}
            disabled={isLoading || isDataLoading}
          >
            <Plus className="h-4 w-4 mr-2" />
            {isLoading ? 'Creating...' : isDataLoading ? 'Loading...' : 'Create Card'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
