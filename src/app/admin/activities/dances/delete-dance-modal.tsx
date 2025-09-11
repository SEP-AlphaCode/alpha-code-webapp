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
import { Dance } from "@/types/dance"
import { AlertTriangle } from "lucide-react"
import { useAdminTranslation } from "@/lib/i18n/hooks/use-translation"

interface DeleteDanceModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    dance: Dance | null
    isDeleting?: boolean
}

export function DeleteDanceModal({
    isOpen,
    onClose,
    onConfirm,
    dance,
    isDeleting = false
}: DeleteDanceModalProps) {
    const { t, isLoading } = useAdminTranslation()
    if (isLoading) return null
    if (!dance) return null

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-red-600">
                        <AlertTriangle className="h-5 w-5" />
                        {t('danceManagement.deleteTitle')}
                    </DialogTitle>
                    <DialogDescription className="text-left">
                        {t('danceManagement.deleteConfirm')}
                    </DialogDescription>
                </DialogHeader>

                <div className="bg-gray-50 p-4 rounded-md space-y-2">
                    <div className="text-sm">
                        <span className="font-medium text-gray-700">ID:</span>
                        <span className="ml-2 text-gray-900">{dance.id}</span>
                    </div>
                    <div className="text-sm">
                        <span className="font-medium text-gray-700">{t('danceManagement.fields.name')}:</span>
                        <span className="ml-2 text-gray-900">{dance.name}</span>
                    </div>
                    <div className="text-sm">
                        <span className="font-medium text-gray-700">{t('danceManagement.fields.description')}:</span>
                        <span className="ml-2 text-gray-900">{dance.description || t('common.noProvided')}</span>
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        disabled={isDeleting}
                    >
                        {t('common.cancel')}
                    </Button>
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={onConfirm}
                        disabled={isDeleting}
                        className="bg-red-600 hover:bg-red-700"
                    >
                        {isDeleting ? t('common.deleting') : t('danceManagement.deleteTitle')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
