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
import { Action } from "@/types/action"
import { AlertTriangle } from "lucide-react"

interface DeleteActionModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    action: Action | null
    isDeleting?: boolean
}

export function DeleteActionModal({
    isOpen,
    onClose,
    onConfirm,
    action,
    isDeleting = false
}: DeleteActionModalProps) {
    if (!action) return null

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
                        <span className="ml-2 text-gray-900">{action.id}</span>
                    </div>
                    <div className="text-sm">
                        <span className="font-medium text-gray-700">Action Name:</span>
                        <span className="ml-2 text-gray-900">{action.name}</span>
                    </div>
                    <div className="text-sm">
                        <span className="font-medium text-gray-700">Description:</span>
                        <span className="ml-2 text-gray-900">{action.description || "No description"}</span>
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
                        onClick={onConfirm}
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
