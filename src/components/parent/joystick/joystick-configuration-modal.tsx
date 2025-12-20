'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, Save, Gamepad2, Settings } from 'lucide-react';
import { toast } from 'sonner';
import { useRobotActions } from '@/hooks/use-robot-action';
import { useDance } from '@/hooks/use-robot-dance';
import { useExpression } from '@/features/activities/hooks/use-expression';
import { useSkill } from '@/features/activities/hooks/use-skill';
import { useExtendedActions } from '@/features/activities/hooks/use-extended-actions';
import { useJoystick } from '@/features/activities/hooks/use-joystick';
import { Joystick } from '@/types/joystick';
import { Action } from '@/types/action';
import { Dance } from '@/types/dance';
import { Expression } from '@/types/expression';
import { Skill } from '@/types/skill';
import { ExtendedAction } from '@/types/extended-action';
import { RobotAction } from '@/types/robot';
import { getUserInfoFromToken } from '@/utils/tokenUtils';
import { useRobotStore } from '@/hooks/use-robot-store';

type ButtonName = 'A' | 'B' | 'X' | 'Y';

type ActionType = 'action' | 'dance' | 'expression' | 'skill' | 'extendedaction';

interface JoystickConfigurationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  existingJoysticks?: Joystick[];
}

interface ButtonConfig {
  buttonCode: ButtonName;
  actionType: ActionType;
  actionId: string;
  actionCode: string;
  actionName: string;
}

export default function JoystickConfigurationModal({
  isOpen,
  onClose,
  onSuccess,
  existingJoysticks = [],
}: JoystickConfigurationModalProps) {
  const [selectedButton, setSelectedButton] = useState<ButtonName>('A');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<ActionType>('action');
  const [isSaving, setIsSaving] = useState(false);
  const [buttonConfigs, setButtonConfigs] = useState<Record<ButtonName, ButtonConfig | null>>({
    A: null,
    B: null,
    X: null,
    Y: null,
  });

  // Pagination states - fetch 20 items mỗi lần
  const [actionPage, setActionPage] = useState(1);
  const [dancePage, setDancePage] = useState(1);
  const [expressionPage, setExpressionPage] = useState(1);
  const [skillPage, setSkillPage] = useState(1);
  const [extendedActionPage, setExtendedActionPage] = useState(1);
  
  // Accumulated data từ các page
  const [accumulatedActions, setAccumulatedActions] = useState<RobotAction[]>([]);
  const [accumulatedDances, setAccumulatedDances] = useState<Dance[]>([]);
  const [accumulatedExpressions, setAccumulatedExpressions] = useState<Expression[]>([]);
  const [accumulatedSkills, setAccumulatedSkills] = useState<Skill[]>([]);
  const [accumulatedExtendedActions, setAccumulatedExtendedActions] = useState<ExtendedAction[]>([]);
  
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const pageSize = 20;

  // Get selected robot
  const { selectedRobot } = useRobotStore();
  const robotModelId = selectedRobot?.robotModelId || '';

  // Debug: Log robot info
  useEffect(() => {
    console.log('🤖 Selected Robot:', selectedRobot);
    console.log('🎯 Robot Model ID:', robotModelId);
  }, [selectedRobot, robotModelId]);

  // API hooks - sử dụng robotModelId từ robot đã chọn
  const { useGetPagedDances } = useDance();
  const { useGetPagedExpressions } = useExpression();
  const { useGetPagedSkills } = useSkill();
  const { useGetPagedExtendedActions } = useExtendedActions();
  const { useCreateJoystick, useUpdateJoystick } = useJoystick();

  // React Query mutations
  const createJoystickMutation = useCreateJoystick();
  const updateJoystickMutation = useUpdateJoystick();

  // Fetch dữ liệu theo page (20 items mỗi lần)
  const { data: actionsData, isLoading: actionsLoading, isFetching: actionsFetching } = useRobotActions(actionPage, pageSize, searchTerm, robotModelId);
  const { data: dancesData, isLoading: dancesLoading, isFetching: dancesFetching } = useGetPagedDances(dancePage, pageSize, searchTerm);
  const { data: expressionsData, isLoading: expressionsLoading, isFetching: expressionsFetching } = useGetPagedExpressions(expressionPage, pageSize, searchTerm);
  const { data: skillsData, isLoading: skillsLoading, isFetching: skillsFetching } = useGetPagedSkills(skillPage, pageSize, searchTerm, robotModelId);
  const { data: extendedActionsData, isLoading: extendedActionsLoading, isFetching: extendedActionsFetching } = useGetPagedExtendedActions(extendedActionPage, pageSize, searchTerm, robotModelId);

  // Debug: Log API data
  useEffect(() => {
    console.log('📊 API Data:', {
      actions: actionsData,
      dances: dancesData,
      expressions: expressionsData,
      skills: skillsData,
      extendedActions: extendedActionsData
    });
    console.log('⏳ Loading States:', {
      actionsLoading,
      dancesLoading,
      expressionsLoading,
      skillsLoading,
      extendedActionsLoading
    });
  }, [actionsData, dancesData, expressionsData, skillsData, extendedActionsData, 
      actionsLoading, dancesLoading, expressionsLoading, skillsLoading, extendedActionsLoading]);

  // Accumulate data khi fetch xong
  useEffect(() => {
    if (actionsData?.data) {
      setAccumulatedActions(prev => {
        // Reset nếu là page 1
        if (actionPage === 1) return actionsData.data;
        // Thêm vào data cũ, loại bỏ duplicate
        const newData = actionsData.data.filter(item => !prev.some(p => p.id === item.id));
        return [...prev, ...newData];
      });
    }
  }, [actionsData, actionPage]);

  useEffect(() => {
    if (dancesData?.data) {
      setAccumulatedDances(prev => {
        if (dancePage === 1) return dancesData.data;
        const newData = dancesData.data.filter(item => !prev.some(p => p.id === item.id));
        return [...prev, ...newData];
      });
    }
  }, [dancesData, dancePage]);

  useEffect(() => {
    if (expressionsData?.data) {
      setAccumulatedExpressions(prev => {
        if (expressionPage === 1) return expressionsData.data;
        const newData = expressionsData.data.filter(item => !prev.some(p => p.id === item.id));
        return [...prev, ...newData];
      });
    }
  }, [expressionsData, expressionPage]);

  useEffect(() => {
    if (skillsData?.data) {
      setAccumulatedSkills(prev => {
        if (skillPage === 1) return skillsData.data;
        const newData = skillsData.data.filter(item => !prev.some(p => p.id === item.id));
        return [...prev, ...newData];
      });
    }
  }, [skillsData, skillPage]);

  useEffect(() => {
    if (extendedActionsData?.data) {
      setAccumulatedExtendedActions(prev => {
        if (extendedActionPage === 1) return extendedActionsData.data;
        const newData = extendedActionsData.data.filter(item => !prev.some(p => p.id === item.id));
        return [...prev, ...newData];
      });
    }
  }, [extendedActionsData, extendedActionPage]);

  const actions = accumulatedActions;
  const dances = accumulatedDances;
  const expressions = accumulatedExpressions;
  const skills = accumulatedSkills;
  const extendedActions = accumulatedExtendedActions;

  // Lấy total_count từ API response
  const totalActions = actionsData?.total_count || 0;
  const totalDances = dancesData?.total_count || 0;
  const totalExpressions = expressionsData?.total_count || 0;
  const totalSkills = skillsData?.total_count || 0;
  const totalExtendedActions = extendedActionsData?.total_count || 0;

  // Debug: Log accumulated data
  useEffect(() => {
    console.log('📦 Accumulated Data:', {
      actions: actions.length,
      dances: dances.length,
      expressions: expressions.length,
      skills: skills.length,
      extendedActions: extendedActions.length
    });
    console.log('🔢 Total Count từ API:', {
      totalActions,
      totalDances,
      totalExpressions,
      totalSkills,
      totalExtendedActions
    });
  }, [actions, dances, expressions, skills, extendedActions, 
      totalActions, totalDances, totalExpressions, totalSkills, totalExtendedActions]);

  // Check if có thể load thêm dựa vào has_next
  const hasMoreActions = actionsData?.has_next || false;
  const hasMoreDances = dancesData?.has_next || false;
  const hasMoreExpressions = expressionsData?.has_next || false;
  const hasMoreSkills = skillsData?.has_next || false;
  const hasMoreExtendedActions = extendedActionsData?.has_next || false;

  // Reset pagination và accumulated data khi thay đổi search hoặc tab
  useEffect(() => {
    setActionPage(1);
    setDancePage(1);
    setExpressionPage(1);
    setSkillPage(1);
    setExtendedActionPage(1);
    setAccumulatedActions([]);
    setAccumulatedDances([]);
    setAccumulatedExpressions([]);
    setAccumulatedSkills([]);
    setAccumulatedExtendedActions([]);
  }, [searchTerm]);

  // Handle scroll event để load thêm items
  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current || isLoadingMore) return;

    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;

    // Khi scroll đến 80% thì load thêm (fetch page tiếp theo)
    if (scrollPercentage > 0.8) {
      let hasMore = false;
      let isFetching = false;

      switch (activeTab) {
        case 'action':
          hasMore = hasMoreActions;
          isFetching = actionsFetching;
          break;
        case 'dance':
          hasMore = hasMoreDances;
          isFetching = dancesFetching;
          break;
        case 'expression':
          hasMore = hasMoreExpressions;
          isFetching = expressionsFetching;
          break;
        case 'skill':
          hasMore = hasMoreSkills;
          isFetching = skillsFetching;
          break;
        case 'extendedaction':
          hasMore = hasMoreExtendedActions;
          isFetching = extendedActionsFetching;
          break;
      }

      // Chỉ load thêm nếu còn data và không đang fetch
      if (hasMore && !isFetching) {
        setIsLoadingMore(true);
        
        // Tăng page number để fetch page tiếp theo
        switch (activeTab) {
          case 'action':
            setActionPage(prev => prev + 1);
            break;
          case 'dance':
            setDancePage(prev => prev + 1);
            break;
          case 'expression':
            setExpressionPage(prev => prev + 1);
            break;
          case 'skill':
            setSkillPage(prev => prev + 1);
            break;
          case 'extendedaction':
            setExtendedActionPage(prev => prev + 1);
            break;
        }

        // Reset loading state sau khi fetch xong
        setTimeout(() => setIsLoadingMore(false), 500);
      }
    }
  }, [activeTab, hasMoreActions, hasMoreDances, hasMoreExpressions, hasMoreSkills, hasMoreExtendedActions, 
      actionsFetching, dancesFetching, expressionsFetching, skillsFetching, extendedActionsFetching, isLoadingMore]);

  // Attach scroll listener
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
      return () => scrollContainer.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  // Sync existing joystick configurations with local state when modal opens
  useEffect(() => {
    if (isOpen && existingJoysticks.length > 0) {
      const configs: Record<ButtonName, ButtonConfig | null> = {
        A: null,
        B: null,
        X: null,
        Y: null,
      };

      existingJoysticks.forEach(joystick => {
        const buttonCode = joystick.buttonCode as ButtonName;
        if (buttonCode in configs) {
          // Determine action type and create config
          let actionType: ActionType;
          let actionId: string;
          let actionCode: string;
          let actionName: string;

          if (joystick.actionId && joystick.actionCode && joystick.actionName) {
            actionType = 'action';
            actionId = joystick.actionId;
            actionCode = joystick.actionCode;
            actionName = joystick.actionName;
          } else if (joystick.danceId && joystick.danceCode && joystick.danceName) {
            actionType = 'dance';
            actionId = joystick.danceId;
            actionCode = joystick.danceCode;
            actionName = joystick.danceName;
          } else if (joystick.expressionId && joystick.expressionCode && joystick.expressionName) {
            actionType = 'expression';
            actionId = joystick.expressionId;
            actionCode = joystick.expressionCode;
            actionName = joystick.expressionName;
          } else if (joystick.skillId && joystick.skillCode && joystick.skillName) {
            actionType = 'skill';
            actionId = joystick.skillId;
            actionCode = joystick.skillCode;
            actionName = joystick.skillName;
          } else if (joystick.extendedActionId && joystick.extendedActionCode && joystick.extendedActionName) {
            actionType = 'extendedaction';
            actionId = joystick.extendedActionId;
            actionCode = joystick.extendedActionCode;
            actionName = joystick.extendedActionName;
          } else {
            return; // Skip if no valid action found
          }

          configs[buttonCode] = {
            buttonCode,
            actionType,
            actionId,
            actionCode,
            actionName,
          };
        }
      });

      setButtonConfigs(configs);
    } else if (isOpen) {
      // Reset configs when modal opens with no existing data
      setButtonConfigs({
        A: null,
        B: null,
        X: null,
        Y: null,
      });
    }

    // Reset search and selected button when modal opens
    if (isOpen) {
      setSelectedButton('A');
      setSearchTerm('');
      setActiveTab('action');
    }
  }, [isOpen, existingJoysticks]);

  const buttonLabels: Record<ButtonName, { icon: string; label: string; color: string }> = {
    A: { icon: '🟡', label: 'A Button', color: 'bg-yellow-500' },
    B: { icon: '🔴', label: 'B Button', color: 'bg-red-500' },
    X: { icon: '🔵', label: 'X Button', color: 'bg-blue-500' },
    Y: { icon: '🟢', label: 'Y Button', color: 'bg-green-500' },
  };

  // Get current user accountId from token
  const getCurrentUserAccountId = (): string => {
    if (typeof window !== 'undefined') {
      const accessToken = sessionStorage.getItem('accessToken');
      if (accessToken) {
        const userInfo = getUserInfoFromToken(accessToken);
        return userInfo?.id || '';
      }
    }
    return '';
  };

  const handleAssignAction = (item: RobotAction | Action | Dance | Expression | Skill | ExtendedAction, type: ActionType) => {
    const config: ButtonConfig = {
      buttonCode: selectedButton,
      actionType: type,
      actionId: item.id,
      actionCode: item.code,
      actionName: item.name,
    };

    setButtonConfigs(prev => ({
      ...prev,
      [selectedButton]: config,
    }));
  };

  const handleSaveConfiguration = async () => {
    if (isSaving) return;

    setIsSaving(true);
    const accountId = getCurrentUserAccountId();

    if (!accountId) {
      toast.error('Không thể lấy thông tin tài khoản. Vui lòng đăng nhập lại!');
      setIsSaving(false);
      return;
    }

    try {
      const configs = Object.values(buttonConfigs).filter(Boolean) as ButtonConfig[];

      if (configs.length === 0) {
        console.warn('No actions assigned to buttons');
        setIsSaving(false);
        return;
      }

      // Validate each config before sending
      for (const config of configs) {
        if (!config.actionId || !config.actionCode || !config.actionName) {
          console.error(`Invalid config for button ${config.buttonCode}:`, config);
          setIsSaving(false);
          return;
        }
      }


      for (const config of configs) {
        console.log('🎮 Processing config:', config);

        // Map action type to correct backend type
        const getBackendType = (actionType: ActionType): string => {
          switch (actionType) {
            case 'action':
            case 'dance':
              return 'action';
            case 'expression':
              return 'expression';
            case 'skill':
              return 'skill_helper';
            case 'extendedaction':
              return 'extended_action';
            default:
              return 'action';
          }
        };

        const joystickData: Omit<Joystick, 'id' | 'createdDate' | 'lastUpdate'> = {
          accountId: accountId,
          robotId: selectedRobot?.id || '',
          buttonCode: config.buttonCode.toString(),
          type: getBackendType(config.actionType),
          status: 1,

          // Action fields
          actionId: config.actionType === 'action' ? config.actionId : null,
          actionCode: config.actionType === 'action' ? config.actionCode : null,
          actionName: config.actionType === 'action' ? config.actionName : null,

          // Dance fields
          danceId: config.actionType === 'dance' ? config.actionId : null,
          danceCode: config.actionType === 'dance' ? config.actionCode : null,
          danceName: config.actionType === 'dance' ? config.actionName : null,

          // Expression fields
          expressionId: config.actionType === 'expression' ? config.actionId : null,
          expressionCode: config.actionType === 'expression' ? config.actionCode : null,
          expressionName: config.actionType === 'expression' ? config.actionName : null,

          // Extended action fields
          extendedActionId: config.actionType === 'extendedaction' ? config.actionId : null,
          extendedActionCode: config.actionType === 'extendedaction' ? config.actionCode : null,
          extendedActionName: config.actionType === 'extendedaction' ? config.actionName : null,

          // Skill fields
          skillId: config.actionType === 'skill' ? config.actionId : null,
          skillCode: config.actionType === 'skill' ? config.actionCode : null,
          skillName: config.actionType === 'skill' ? config.actionName : null,
        };

        const existingConfig = existingJoysticks.find(
          joystick => {
            const buttonCodeToCompare = config.buttonCode.toString();
            console.log(`Comparing: "${joystick.buttonCode}" === "${buttonCodeToCompare}"`, joystick.buttonCode === buttonCodeToCompare);
            return joystick.buttonCode === buttonCodeToCompare;
          }
        );

        if (existingConfig) {
          await updateJoystickMutation.mutateAsync({ id: existingConfig.id, joystickData });
        } else {
          await createJoystickMutation.mutateAsync(joystickData);
        }
      }

      toast.success('Cấu hình joystick đã được lưu thành công!');
      onSuccess?.();
      onClose();
    } catch (error) {
      let errorMessage = 'Có lỗi xảy ra khi lưu cấu hình!';

      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as {
          response?: {
            status?: number;
            data?: { message?: string };
          }
        };

        if (axiosError.response?.status === 400) {
          errorMessage = 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại thông tin!';
        } else if (axiosError.response?.status === 401) {
          errorMessage = 'Bạn cần đăng nhập lại!';
        } else if (axiosError.response?.status === 403) {
          errorMessage = 'Bạn không có quyền thực hiện hành động này!';
        } else if (axiosError.response?.status === 429) {
          errorMessage = 'Quá nhiều yêu cầu! Vui lòng thử lại sau ít phút.';
          setTimeout(() => {
            if (!isSaving) {
              handleSaveConfiguration();
            }
          }, 2000);
        } else if (axiosError.response?.data?.message) {
          errorMessage = axiosError.response.data.message;
        }
      }

      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const renderActionGrid = (items: (RobotAction | Action | Dance | Expression | Skill | ExtendedAction)[], type: ActionType) => {
    // Kiểm tra xem có đang loading không
    const isCurrentlyLoading = () => {
      switch (type) {
        case 'action': return actionsLoading || actionsFetching;
        case 'dance': return dancesLoading || dancesFetching;
        case 'expression': return expressionsLoading || expressionsFetching;
        case 'skill': return skillsLoading || skillsFetching;
        case 'extendedaction': return extendedActionsLoading || extendedActionsFetching;
        default: return false;
      }
    };

    const hasMore = () => {
      switch (type) {
        case 'action': return hasMoreActions;
        case 'dance': return hasMoreDances;
        case 'expression': return hasMoreExpressions;
        case 'skill': return hasMoreSkills;
        case 'extendedaction': return hasMoreExtendedActions;
        default: return false;
      }
    };

    return (
      <div 
        ref={scrollContainerRef}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 max-h-[400px] overflow-y-auto scrollbar-hide p-2"
      >
        {items.map((item) => (
          <Card
            key={item.id}
            className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-blue-400 hover:scale-105 group min-h-[100px] flex flex-col items-center justify-center p-4"
            onClick={() => handleAssignAction(item, type)}
          >
            <div className="max-w-[70vh] flex flex-col items-center gap-3 text-center">
              {/* Icon from API field */}
              <div className="text-3xl flex items-center justify-center">
                {type === 'expression'
                  ? (item as Expression).imageUrl
                    ? <Image
                      src={(item as Expression).imageUrl}
                      alt={item.name}
                      width={48}
                      height={48}
                      className="w-12 h-12 object-cover rounded-full"
                    />
                    : '😊'
                  : type === 'skill'
                    ? (item as Skill).icon || '🎯'
                    : type === 'extendedaction'
                      ? (item as ExtendedAction).icon || '⚡'
                      : (item as Action).icon || (type === 'action' ? '🎯' : '')
                }
              </div>

              <div className="text-sm font-bold text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-2">
                {item.name}
              </div>
            </div>
          </Card>
        ))}
        
        {/* Loading indicator khi đang fetch thêm */}
        {isCurrentlyLoading() && items.length > 0 && (
          <div className="col-span-full flex justify-center py-4">
            <div className="text-sm text-gray-500 flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500"></div>
              Đang tải thêm...
            </div>
          </div>
        )}

        {/* Message khi đã hết data */}
        {!hasMore() && items.length > 0 && (
          <div className="col-span-full flex justify-center py-2">
            <div className="text-xs text-gray-400">Đã hiển thị tất cả</div>
          </div>
        )}
      </div>
    );
  };

  const getCurrentItems = () => {
    switch (activeTab) {
      case 'action':
        return { items: actions, type: 'action' as ActionType };
      case 'dance':
        return { items: dances, type: 'dance' as ActionType };
      case 'expression':
        return { items: expressions, type: 'expression' as ActionType };
      case 'skill':
        return { items: skills, type: 'skill' as ActionType };
      case 'extendedaction':
        return { items: extendedActions, type: 'extendedaction' as ActionType };
      default:
        return { items: actions, type: 'action' as ActionType };
    }
  };

  const { items, type } = getCurrentItems();

  // Kiểm tra nếu chưa chọn robot
  const isRobotSelected = !!selectedRobot && !!robotModelId;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className=" !w-[70vw] !max-w-none h-[90vh] flex flex-col scrollbar-hide">
        <DialogHeader className="pb-4 border-b flex-shrink-0">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Settings className="w-5 h-5 text-blue-600" />
            </div>
            Cấu hình Joystick
          </DialogTitle>
          <DialogDescription className="text-gray-600 text-sm">
            Gán hành động cho các nút của tay cầm. Chọn nút và sau đó chọn hành động tương ứng.
          </DialogDescription>
        </DialogHeader>

        {/* Warning nếu chưa chọn robot */}
        {!isRobotSelected && (
          <div className="mx-6 mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="text-2xl">⚠️</div>
              <div>
                <div className="font-semibold text-yellow-800">Chưa chọn robot</div>
                <div className="text-sm text-yellow-700">Vui lòng chọn robot trước khi cấu hình joystick</div>
              </div>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <div className="space-y-6 p-6">
            {/* Top Row - Current Button Selection */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-3">
                  Chọn hành động cho nút:
                  <div className="flex items-center justify-center bg-blue-50 px-3 py-2 rounded-lg border border-blue-200">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-lg font-bold ${buttonLabels[selectedButton].color} shadow-sm`}>
                      {selectedButton}
                    </div>
                  </div>
                </h3>
              </div>
              <Button
                onClick={handleSaveConfiguration}
                disabled={isSaving}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? 'Đang lưu...' : 'Lưu cấu hình'}
              </Button>
            </div>

            {/* Middle Row - Button Selection (Horizontal Layout) */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Gamepad2 className="w-4 h-4 text-purple-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-800">Chọn nút</h3>
              </div>

              <div className="flex justify-center gap-6">
                {(Object.keys(buttonLabels) as ButtonName[]).map((button) => {
                  const buttonInfo = buttonLabels[button];
                  const isSelected = selectedButton === button;
                  const isAssigned = buttonConfigs[button];

                  return (
                    <div
                      key={button}
                      className={`relative flex flex-col items-center cursor-pointer transition-all duration-200 hover:scale-110 ${isSelected ? 'scale-110' : ''
                        }`}
                      onClick={() => setSelectedButton(button)}
                    >
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold ${buttonInfo.color} shadow-lg transition-all duration-200 ${isSelected
                        ? 'ring-4 ring-blue-400 shadow-xl'
                        : 'hover:shadow-xl'
                        }`}>
                        {button}
                      </div>

                      {/* Assignment indicator */}
                      {isAssigned && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Show assigned action for selected button */}
              {buttonConfigs[selectedButton] && (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 text-center">
                  <div className="text-sm text-gray-600 mb-1">Hành động đã gán:</div>
                  <div className="font-semibold text-blue-700">{buttonConfigs[selectedButton]?.actionName}</div>
                  <div className="text-xs text-gray-500 mt-1 uppercase tracking-wide">{buttonConfigs[selectedButton]?.actionType}</div>
                </div>
              )}
            </div>

            {/* Bottom Row - Action Selection */}
            <div className="space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Tìm kiếm hành động..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 py-2 text-sm border-2 border-gray-200 rounded-lg focus:border-blue-400 transition-colors"
                />
              </div>

              {/* Enhanced Tabs */}
              <div className="w-full">
                <div className="flex bg-gray-100 rounded-lg p-1 shadow-inner">
                  {[
                    { key: 'action', label: 'Hành động', icon: '🎯', count: totalActions },
                    { key: 'dance', label: 'Điệu nhảy', icon: '💃', count: totalDances },
                    { key: 'expression', label: 'Biểu cảm', icon: '😊', count: totalExpressions },
                    { key: 'skill', label: 'Kỹ năng', icon: '🎯', count: totalSkills },
                    { key: 'extendedaction', label: 'Hành động mở rộng', icon: '⚡', count: totalExtendedActions },
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key as ActionType)}
                      className={`flex-1 px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${activeTab === tab.key
                        ? 'bg-white text-blue-600 shadow-md ring-1 ring-blue-200'
                        : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                        }`}
                    >
                      <span className="text-base">{tab.icon}</span>
                      <span>{tab.label}</span>
                      <Badge variant="outline" className="text-xs px-2 py-0">
                        {tab.count}
                      </Badge>
                    </button>
                  ))}
                </div>

                <div className="mt-4">
                  {items.length > 0 ? (
                    renderActionGrid(items, type)
                  ) : (
                    <div className="text-center py-12">
                      <div className="text-5xl mb-4">🔍</div>
                      <h3 className="text-lg font-semibold text-gray-600 mb-2">
                        Không tìm thấy {
                          activeTab === 'action' ? 'hành động' :
                            activeTab === 'dance' ? 'điệu nhảy' :
                              activeTab === 'expression' ? 'biểu cảm' :
                                activeTab === 'skill' ? 'kỹ năng' :
                                  'hành động mở rộng'
                        } nào
                      </h3>
                      <p className="text-gray-500 text-sm">Thử thay đổi từ khóa tìm kiếm</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}