
import { useForm } from "react-hook-form"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useAction } from "@/features/activities/hooks/use-action"
import { ActionModal, Action } from "@/types/action"
import { useEffect } from "react"
import { toast } from "sonner"

interface CreateActionModalProps {
  isOpen: boolean
  onClose: () => void
  editAction?: Action | null
  mode?: 'create' | 'edit'
}

export function CreateActionModal({
  isOpen,
  onClose,
  editAction = null,
  mode = 'create'
}: CreateActionModalProps) {
  const { useCreateAction, useUpdateAction } = useAction()
  const createActionMutation = useCreateAction()
  const updateActionMutation = useUpdateAction()

  const isEditMode = mode === 'edit' && editAction

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<ActionModal>({
    defaultValues: {
      code: "",
      name: "",
      description: "",
      duration: 60,
      status: 1,
      canInterrupt: true,
      icon: ""
    }
  })

  // Update form when editAction changes
  useEffect(() => {
    if (isEditMode && editAction) {
      reset({
        robotModelId: "6e4e14b3-b073-4491-ab2a-2bf315b3259f",
        code: editAction.code,
        name: editAction.name,
        description: editAction.description,
        duration: editAction.duration,
        status: editAction.status,
        canInterrupt: editAction.canInterrupt,
        icon: editAction.icon
      })
    } else {
      reset({
        code: "",
        name: "",
        description: "",
        duration: 60,
        status: 1,
        canInterrupt: true,
        icon: ""
      })
    }
  }, [editAction, isEditMode, reset])

  const canInterrupt = watch("canInterrupt")
  const status = watch("status")

  const onSubmit = async (data: ActionModal) => {
    try {
      if (isEditMode && editAction) {
        await updateActionMutation.mutateAsync({ id: editAction.id, data })
        toast.success("Action updated successfully!")
      } else {
        await createActionMutation.mutateAsync(data)
        toast.success("Action created successfully!")
      }
      reset()
      onClose()
    } catch (error) {
      console.error("Error saving action:", error)
      toast.error(`Failed to ${isEditMode ? 'update' : 'create'} action. Please try again.`)
    }
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isEditMode ? 'Chỉnh sửa hành động' : 'Tạo hành động mới'}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? 'Cập nhật thông tin cho hành động.'
              : 'Nhập thông tin để tạo hành động mới.'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="code" className="text-sm font-medium">
              Mã hành động *
            </Label>
            <Input
              id="code"
              {...register("code", {
                required: "Vui lòng nhập mã hành động",
                minLength: { value: 2, message: "Mã hành động phải có ít nhất 2 ký tự" }
              })}
              placeholder="Nhập mã hành động"
              className={errors.code ? "border-red-500" : ""}
            />
            {errors.code && (
              <p className="text-sm text-red-500">{errors.code.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Tên hành động *
            </Label>
            <Input
              id="name"
              {...register("name", {
                required: "Vui lòng nhập tên hành động",
                minLength: { value: 2, message: "Tên hành động phải có ít nhất 2 ký tự" }
              })}
              placeholder="Nhập tên hành động"
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Mô tả
            </Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Nhập mô tả cho hành động"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="icon" className="text-sm font-medium">
              Icon
            </Label>
            <Textarea
              id="icon"
              {...register("icon")}
              placeholder="Nhập icon (nếu có)"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration" className="text-sm font-medium">
              Thời lượng (giây) *
            </Label>
            <Input
              id="duration"
              type="number"
              {...register("duration", {
                required: "Vui lòng nhập thời lượng",
                min: { value: 1, message: "Thời lượng tối thiểu là 1 giây" },
                valueAsNumber: true
              })}
              placeholder="60"
              className={errors.duration ? "border-red-500" : ""}
            />
            {errors.duration && (
              <p className="text-sm text-red-500">{errors.duration.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="status" className="text-sm font-medium">
              Trạng thái
            </Label>
            <Select
              value={status.toString()}
              onValueChange={(value) => setValue("status", parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Kích hoạt
                  </span>
                </SelectItem>
                <SelectItem value="0">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    Không kích hoạt
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-3">
            <Switch
              id="canInterrupt"
              checked={canInterrupt}
              onCheckedChange={(checked) => setValue("canInterrupt", checked)}
              disabled={isSubmitting}
            />
            <Label
              htmlFor="canInterrupt"
              className="text-sm font-medium cursor-pointer select-none"
            >
              Có thể ngắt giữa chừng
            </Label>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="red"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Đóng
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {isSubmitting
                ? (isEditMode ? 'Đang cập nhật...' : 'Đang tạo...')
                : (isEditMode ? 'Cập nhật' : 'Tạo mới')
              }
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
