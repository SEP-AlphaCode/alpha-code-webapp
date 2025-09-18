
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
import { useAction } from "@/hooks/use-action"
import { ActionModal, Action } from "@/types/action"
import { useEffect } from "react"
import { toast } from "sonner"
import { useAdminTranslation } from "@/lib/i18n/hooks/use-translation"

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
  const { t, isLoading: translationsLoading } = useAdminTranslation()
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
        {!translationsLoading && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {isEditMode ? t('actionManagement.editTitle') : t('actionManagement.createTitle')}
              </DialogTitle>
              <DialogDescription>
                {isEditMode
                  ? t('actionManagement.editDescription')
                  : t('actionManagement.createDescription')
                }
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
            <Label htmlFor="code" className="text-sm font-medium">
              {t('actionManagement.fields.code')} *
            </Label>
            <Input
              id="code"
              {...register("code", {
                required: t('validation.codeRequired'),
                minLength: { value: 2, message: t('validation.codeMinLength') }
              })}
              placeholder={t('actionManagement.placeholders.code')}
              className={errors.code ? "border-red-500" : ""}
            />
            {errors.code && (
              <p className="text-sm text-red-500">{errors.code.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              {t('actionManagement.fields.name')} *
            </Label>
            <Input
              id="name"
              {...register("name", {
                required: t('validation.nameRequired'),
                minLength: { value: 2, message: t('validation.nameMinLength') }
              })}
              placeholder={t('actionManagement.placeholders.name')}
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              {t('actionManagement.fields.description')}
            </Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder={t('actionManagement.placeholders.description')}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="icon" className="text-sm font-medium">
              {t('actionManagement.fields.icon')}
            </Label>
            <Textarea
              id="icon"
              {...register("icon")}
              placeholder={t('actionManagement.placeholders.icon')}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration" className="text-sm font-medium">
              Duration (seconds) *
            </Label>
            <Input
              id="duration"
              type="number"
              {...register("duration", {
                required: "Duration is required",
                min: { value: 1, message: "Duration must be at least 1 second" },
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
              Status
            </Label>
            <Select
              value={status.toString()}
              onValueChange={(value) => setValue("status", parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('common.selectStatus')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    {t('common.active')}
                  </span>
                </SelectItem>
                <SelectItem value="0">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    {t('common.inactive')}
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
              {t('actionManagement.fields.canInterrupt')}
            </Label>
          </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="red"
                  onClick={handleClose}
                  disabled={isSubmitting}
                >
                  {t('common.close')}
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  {isSubmitting
                    ? (isEditMode ? t('common.updating') : t('common.creating'))
                    : (isEditMode ? t('common.update') : t('common.create'))
                  }
                </Button>
              </DialogFooter>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
