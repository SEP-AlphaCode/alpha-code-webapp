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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useExpression } from "@/hooks/use-expression"
import { ExpressionModal, Expression } from "@/types/expression"
import { useEffect } from "react"
import { toast } from "sonner"
import { useAdminTranslation } from "@/lib/i18n/hooks/use-translation"

interface CreateExpressionModalProps {
  isOpen: boolean
  onClose: () => void
  editExpression?: Expression | null
  mode?: 'create' | 'edit'
}

export function CreateExpressionModal({
  isOpen,
  onClose,
  editExpression = null,
  mode = 'create'
}: CreateExpressionModalProps) {
  const { t } = useAdminTranslation()
  const { useCreateExpression, useUpdateExpression } = useExpression()
  const createExpressionMutation = useCreateExpression()
  const updateExpressionMutation = useUpdateExpression()

  const isEditMode = mode === 'edit' && editExpression

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<ExpressionModal>({
    defaultValues: {
      code: "",
      name: "",
      imageUrl: "",
      status: 1,
    }
  })

  // Update form when editExpression changes
  useEffect(() => {
    if (isEditMode && editExpression) {
      reset({
        code: editExpression.code,
        name: editExpression.name,
        imageUrl: editExpression.imageUrl,
        status: editExpression.status,
      })
    } else {
      reset({
        code: "",
        name: "",
        imageUrl: "",
        status: 1,
      })
    }
  }, [editExpression, isEditMode, reset])

  const status = watch("status")

  const onSubmit = async (data: ExpressionModal) => {
    try {
      if (isEditMode && editExpression) {
        await updateExpressionMutation.mutateAsync({ id: editExpression.id, data })
        toast.success("Expression updated successfully!")
      } else {
        await createExpressionMutation.mutateAsync(data)
        toast.success("Expression created successfully!")
      }
      reset()
      onClose()
    } catch (error) {
      console.error("Error saving expression:", error)
      toast.error(`Failed to ${isEditMode ? 'update' : 'create'} expression. Please try again.`)
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
            {isEditMode ? t('expressionManagement.editTitle') : t('expressionManagement.createTitle')}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? t('expressionManagement.editDescription')
              : t('expressionManagement.createDescription')
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="code" className="text-sm font-medium">
              {t('expressionManagement.fields.code')} *
            </Label>
            <Input
              id="code"
              {...register("code", {
                required: t('validation.codeRequired'),
                minLength: { value: 2, message: t('validation.codeMinLength') }
              })}
              placeholder={t('expressionManagement.placeholders.code')}
              className={errors.code ? "border-red-500" : ""}
            />
            {errors.code && (
              <p className="text-sm text-red-500">{errors.code.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              {t('expressionManagement.fields.name')} *
            </Label>
            <Input
              id="name"
              {...register("name", {
                required: t('validation.nameRequired'),
                minLength: { value: 2, message: t('validation.nameMinLength') }
              })}
              placeholder={t('expressionManagement.placeholders.name')}
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrl" className="text-sm font-medium">
              {t('common.image')} URL
            </Label>
            <Input
              id="imageUrl"
              type="url"
              {...register("imageUrl", {
                pattern: {
                  value: /^https?:\/\/.+/,
                  message: t('validation.invalidUrl')
                }
              })}
              placeholder={t('expressionManagement.placeholders.imageUrl')}
              className={errors.imageUrl ? "border-red-500" : ""}
            />
            {errors.imageUrl && (
              <p className="text-sm text-red-500">{errors.imageUrl.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="status" className="text-sm font-medium">
              {t('expressionManagement.fields.status')}
            </Label>
            <Select
              value={status.toString()}
              onValueChange={(value) => setValue("status", parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('expressionManagement.placeholders.status')} />
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
