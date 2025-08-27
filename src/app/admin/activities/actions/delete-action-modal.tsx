"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"
import { useAppSelector, useAppDispatch } from "@/store/hooks"
import { closeModal } from "@/store/slices/uiSlice"
import { useAction } from "@/hooks/use-action"
import { setDeleting } from "@/store/slices/actionSlice"
import { toast } from "react-toastify"


export function DeleteActionModal() {
    const dispatch = useAppDispatch()

    const { useDeleteAction } = useAction()
    const deleteActionMutation = useDeleteAction()

    // Get state from Redux using modal system
    const actionModal = useAppSelector((state) => state.ui.modals['action'] || { isOpen: false, mode: null, data: null })
    const { isDeleting } = useAppSelector((state) => state.action)

    const isOpen = actionModal.isOpen && actionModal.mode === 'delete'
    const currentAction = actionModal.data

    const onClose = () => {
        dispatch(closeModal('action'))
    }

    const handleConfirmDelete = async () => {
        if (!actionModal.data) return

        try {
            dispatch(setDeleting(true))
            await deleteActionMutation.mutateAsync(actionModal.data.id)
            toast.success("Action deleted successfully!")
            dispatch(closeModal('action'))
        } catch (error) {
            console.error("Error deleting action:", error)
            toast.error("Failed to delete action. Please try again.")
        } finally {
            dispatch(setDeleting(false))
        }
    }

    if (!currentAction) return null

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-red-600">
                        <AlertTriangle className="h-5 w-5" />
                        Delete Action
                    </DialogTitle>
                    <DialogDescription className="text-left">
                        Are you sure you want to delete this action? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>

                <div className="bg-gray-50 p-4 rounded-md space-y-2">
                    <div className="text-sm">
                        <span className="font-medium text-gray-700">ID:</span>
                        <span className="ml-2 text-gray-900">{currentAction.id}</span>
                    </div>
                    <div className="text-sm">
                        <span className="font-medium text-gray-700">Action Name:</span>
                        <span className="ml-2 text-gray-900">{currentAction.name}</span>
                    </div>
                    <div className="text-sm">
                        <span className="font-medium text-gray-700">Description:</span>
                        <span className="ml-2 text-gray-900">{currentAction.description || "No description"}</span>
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        disabled={isDeleting}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={handleConfirmDelete}
                        disabled={isDeleting}
                        className="bg-red-600 hover:bg-red-700"
                    >
                        {isDeleting ? "Deleting..." : "Delete Action"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
