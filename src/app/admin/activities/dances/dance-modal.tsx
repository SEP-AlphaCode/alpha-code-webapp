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
  const { useCreateDance, useUpdateDance } = useDance()
  const createDanceMutation = useCreateDance()
  const updateDanceMutation = useUpdateDance()

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
        toast.success("Dance updated successfully!")
      } else {
        await createDanceMutation.mutateAsync(data)
        toast.success("Dance created successfully!")
      }
      reset()
      onClose()
    } catch (error) {
      console.error("Error saving dance:", error)
      toast.error(`Failed to ${isEditMode ? 'update' : 'create'} dance. Please try again.`)
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
            {isEditMode ? 'Edit Dance' : 'Create New Dance'}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? 'Update the dance details below.'
              : 'Create a new dance for the robot system. Fill in the details below.'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="code" className="text-sm font-medium">
              Dance Code *
            </Label>
            <Input
              id="code"
              {...register("code", {
                required: "Dance code is required",
                minLength: { value: 2, message: "Code must be at least 2 characters" }
              })}
              placeholder="Enter dance code"
              className={errors.code ? "border-red-500" : ""}
            />
            {errors.code && (
              <p className="text-sm text-red-500">{errors.code.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Dance Name *
            </Label>
            <Input
              id="name"
              {...register("name", {
                required: "Dance name is required",
                minLength: { value: 2, message: "Name must be at least 2 characters" }
              })}
              placeholder="Enter dance name"
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Description
            </Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Enter dance description"
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
                : (isEditMode ? "Update Dance" : "Create Dance")
              }
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
