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
import { useDance } from "@/hooks/use-dance"
import { DanceModal, Dance } from "@/types/dance"
import { useEffect } from "react"
import { toast } from "sonner"
import { useAdminTranslation } from "@/lib/i18n/hooks/use-translation"

interface CreateDanceModalProps {
  isOpen: boolean
  onClose: () => void
  editDance?: Dance | null
  mode?: 'create' | 'edit'
}

export function CreateDanceModal({
  isOpen,
  onClose,
  editDance = null,
  mode = 'create'
}: CreateDanceModalProps) {
  const { t, isLoading } = useAdminTranslation()
  const { useCreateDance, useUpdateDance } = useDance()
  const createDanceMutation = useCreateDance()
  const updateDanceMutation = useUpdateDance()

  if (isLoading) return null

  const isEditMode = mode === 'edit' && editDance

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<DanceModal>({
    defaultValues: {
      code: "",
      name: "",
      description: "",
      duration: 60,
      status: 1,
    }
  })

  // Update form when editDance changes
  useEffect(() => {
    if (isEditMode && editDance) {
      reset({
        code: editDance.code,
        name: editDance.name,
        description: editDance.description,
        duration: editDance.duration,
        status: editDance.status,
      })
    } else {
      reset({
        code: "",
        name: "",
        description: "",
        duration: 60,
        status: 1,
      })
    }
  }, [editDance, isEditMode, reset])

  const status = watch("status")

  const onSubmit = async (data: DanceModal) => {
    try {
      if (isEditMode && editDance) {
        await updateDanceMutation.mutateAsync({ id: editDance.id, data })
        toast.success(t('common.success'))
      } else {
        await createDanceMutation.mutateAsync(data)
        toast.success(t('common.success'))
      }
      reset()
      onClose()
    } catch (error) {
      console.error("Error saving dance:", error)
      toast.error(t('common.error'))
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
            {isEditMode ? t('danceManagement.editTitle') : t('danceManagement.createTitle')}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? t('danceManagement.editDescription')
              : t('danceManagement.createDescription')
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="code" className="text-sm font-medium">
              {t('danceManagement.fields.code')} *
            </Label>
            <Input
              id="code"
              {...register("code", {
                required: t('validation.codeRequired'),
                minLength: { value: 2, message: t('validation.codeMinLength') }
              })}
              placeholder={t('danceManagement.placeholders.code')}
              className={errors.code ? "border-red-500" : ""}
            />
            {errors.code && (
              <p className="text-sm text-red-500">{errors.code.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              {t('danceManagement.fields.name')} *
            </Label>
            <Input
              id="name"
              {...register("name", {
                required: t('validation.nameRequired'),
                minLength: { value: 2, message: t('validation.nameMinLength') }
              })}
              placeholder={t('danceManagement.placeholders.name')}
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              {t('danceManagement.fields.description')}
            </Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder={t('danceManagement.placeholders.description')}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration" className="text-sm font-medium">
              {t('danceManagement.fields.duration')} ({t('common.seconds')}) *
            </Label>
            <Input
              id="duration"
              type="number"
              {...register("duration", {
                required: t('validation.durationRequired'),
                min: { value: 1, message: t('validation.durationMinValue') },
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
              {t('danceManagement.fields.status')}
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

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              {t('common.cancel')}
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
      </DialogContent>
    </Dialog>
  )
}
