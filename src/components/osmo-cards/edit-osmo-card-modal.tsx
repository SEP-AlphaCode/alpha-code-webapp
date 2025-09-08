import React, { useState, useEffect } from 'react';
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
import { Save, X, Palette, Activity, Music, Zap, Smile } from 'lucide-react';
import { OsmoCard } from '@/types/osmo-card';

interface EditOsmoCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (cardId: string, updatedData: Partial<OsmoCard>) => void;
  card: OsmoCard | null;
  isLoading?: boolean;
}

interface FormData {
  name: string;
  color: string;
  status: number;
  actionId: string;
  actionName: string;
  expressionId: string;
  expressionName: string;
  danceId: string;
  danceName: string;
}

export default function EditOsmoCardModal({ 
  isOpen, 
  onClose, 
  onSave, 
  card, 
  isLoading = false 
}: EditOsmoCardModalProps) {
  const [formData, setFormData] = useState<FormData>({
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

  const [errors, setErrors] = useState<Partial<FormData>>({});

  // Available options (trong thực tế, có thể fetch từ API)
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

  // Mock data - trong thực tế sẽ fetch từ API
  const actionOptions = [
    { id: '1', name: 'Move Forward' },
    { id: '2', name: 'Turn Left' },
    { id: '3', name: 'Turn Right' },
    { id: '4', name: 'Stop' }
  ];

  const expressionOptions = [
    { id: '1', name: 'Happy' },
    { id: '2', name: 'Sad' },
    { id: '3', name: 'Angry' },
    { id: '4', name: 'Surprised' }
  ];

  const danceOptions = [
    { id: '1', name: 'Robot Dance' },
    { id: '2', name: 'Wave Dance' },
    { id: '3', name: 'Spin Dance' },
    { id: '4', name: 'Happy Dance' }
  ];

  // Initialize form data when card changes
  useEffect(() => {
    if (card) {
      setFormData({
        name: card.name || '',
        color: card.color || '',
        status: card.status || 1,
        actionId: card.actionId || '',
        actionName: card.actionName || '',
        expressionId: card.expressionId || '',
        expressionName: card.expressionName || '',
        danceId: card.danceId || '',
        danceName: card.danceName || ''
      });
      setErrors({});
    }
  }, [card]);

  const handleInputChange = (field: keyof FormData, value: string | number) => {
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
    const selectedAction = actionOptions.find(action => action.id === actionId);
    setFormData(prev => ({
      ...prev,
      actionId: actionId === 'none' ? '' : actionId,
      actionName: actionId === 'none' ? '' : (selectedAction?.name || '')
    }));
  };

  const handleExpressionChange = (expressionId: string) => {
    const selectedExpression = expressionOptions.find(expr => expr.id === expressionId);
    setFormData(prev => ({
      ...prev,
      expressionId: expressionId === 'none' ? '' : expressionId,
      expressionName: expressionId === 'none' ? '' : (selectedExpression?.name || '')
    }));
  };

  const handleDanceChange = (danceId: string) => {
    const selectedDance = danceOptions.find(dance => dance.id === danceId);
    setFormData(prev => ({
      ...prev,
      danceId: danceId === 'none' ? '' : danceId,
      danceName: danceId === 'none' ? '' : (selectedDance?.name || '')
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Card name is required';
    }

    if (!formData.color) {
      newErrors.color = 'Color is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!card || !validateForm()) return;

    const updatedData = {
      name: formData.name,
      color: formData.color,
      status: formData.status,
      actionId: formData.actionId,
      actionName: formData.actionName,
      expressionId: formData.expressionId,
      expressionName: formData.expressionName,
      danceId: formData.danceId,
      danceName: formData.danceName
    };

    onSave(card.id, updatedData);
  };

  const handleClose = () => {
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

  if (!card) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-blue-500 text-white">
              <Activity className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Edit Osmo Card</h2>
              <p className="text-sm text-gray-500">Update card information and activities</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
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
            
            <div className="space-y-4">
              {/* Action */}
              <div className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center space-x-2">
                  <Zap className="h-4 w-4 text-red-500" />
                  <Label className="text-base font-medium">Action</Label>
                </div>
                <Select value={formData.actionId || 'none'} onValueChange={handleActionChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Action</SelectItem>
                    {actionOptions.map((action) => (
                      <SelectItem key={action.id} value={action.id}>
                        {action.name}
                      </SelectItem>
                    ))}
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
                    <SelectValue placeholder="Select an expression" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Expression</SelectItem>
                    {expressionOptions.map((expression) => (
                      <SelectItem key={expression.id} value={expression.id}>
                        {expression.name}
                      </SelectItem>
                    ))}
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
                    <SelectValue placeholder="Select a dance" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Dance</SelectItem>
                    {danceOptions.map((dance) => (
                      <SelectItem key={dance.id} value={dance.id}>
                        {dance.name}
                      </SelectItem>
                    ))}
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
            disabled={isLoading}
          >
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={isLoading}
          >
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
