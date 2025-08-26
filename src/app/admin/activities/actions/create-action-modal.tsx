
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
import { CreateAction } from "@/types/action"
import { toast } from "react-toastify"

interface CreateActionModalProps {
  isOpen: boolean
  onClose: () => void
}

export function CreateActionModal({ isOpen, onClose }: CreateActionModalProps) {
  const { useCreateAction } = useAction()
  const createActionMutation = useCreateAction()
  
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<CreateAction>({
    defaultValues: {
      name: "",
      description: "",
      duration: 60,
      status: 1,
      canInterrupt: true,
    }
  })

  const canInterrupt = watch("canInterrupt")
  const status = watch("status")

  const onSubmit = async (data: CreateAction) => {
    try {
      await createActionMutation.mutateAsync(data)
      toast.success("Action created successfully!")
      reset()
      onClose()
    } catch (error) {
      console.error("Error creating action:", error)
      toast.error("Failed to create action. Please try again.")
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
            Create New Action
          </DialogTitle>
          <DialogDescription>
            Create a new action for the robot system. Fill in the details below.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Action Name *
            </Label>
            <Input
              id="name"
              {...register("name", { 
                required: "Action name is required",
                minLength: { value: 2, message: "Name must be at least 2 characters" }
              })}
              placeholder="Enter action name"
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
              placeholder="Enter action description"
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
              Can be interrupted
            </Label>
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
              className="bg-green-600 hover:bg-green-700 hover:text-white"
            >
              {isSubmitting ? "Creating..." : "Create Action"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
