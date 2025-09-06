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
import { toast } from "react-toastify"
import { useEffect } from "react"

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
            {isEditMode ? 'Edit Expression' : 'Create New Expression'}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? 'Update the expression details below.'
              : 'Create a new expression for the robot system. Fill in the details below.'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="code" className="text-sm font-medium">
              Expression Code *
            </Label>
            <Input
              id="code"
              {...register("code", {
                required: "Expression code is required",
                minLength: { value: 2, message: "Code must be at least 2 characters" }
              })}
              placeholder="Enter expression code"
              className={errors.code ? "border-red-500" : ""}
            />
            {errors.code && (
              <p className="text-sm text-red-500">{errors.code.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Expression Name *
            </Label>
            <Input
              id="name"
              {...register("name", {
                required: "Expression name is required",
                minLength: { value: 2, message: "Name must be at least 2 characters" }
              })}
              placeholder="Enter expression name"
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrl" className="text-sm font-medium">
              Image URL
            </Label>
            <Input
              id="imageUrl"
              type="url"
              {...register("imageUrl", {
                pattern: {
                  value: /^https?:\/\/.+/,
                  message: "Please enter a valid URL starting with http:// or https://"
                }
              })}
              placeholder="https://example.com/image.jpg"
              className={errors.imageUrl ? "border-red-500" : ""}
            />
            {errors.imageUrl && (
              <p className="text-sm text-red-500">{errors.imageUrl.message}</p>
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
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Active
                  </span>
                </SelectItem>
                <SelectItem value="0">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    Inactive
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
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {isSubmitting
                ? (isEditMode ? "Updating..." : "Creating...")
                : (isEditMode ? "Update Expression" : "Create Expression")
              }
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
