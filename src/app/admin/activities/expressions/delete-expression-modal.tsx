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
import { Expression } from "@/types/expression"
import { AlertTriangle } from "lucide-react"
import { useAdminTranslation } from "@/lib/i18n/hooks/use-translation"

interface DeleteExpressionModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    expression: Expression | null
    isDeleting?: boolean
}

export function DeleteExpressionModal({
    isOpen,
    onClose,
    onConfirm,
    expression,
    isDeleting = false
}: DeleteExpressionModalProps) {
    const { t } = useAdminTranslation()
    
    if (!expression) return null

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-red-600">
                        <AlertTriangle className="h-5 w-5" />
                        {t('expressionManagement.deleteTitle')}
                    </DialogTitle>
                    <DialogDescription className="text-left">
                        {t('expressionManagement.deleteConfirm')}
                    </DialogDescription>
                </DialogHeader>

                <div className="bg-gray-50 p-4 rounded-md space-y-2">
                    <div className="text-sm">
                        <span className="font-medium text-gray-700">ID:</span>
                        <span className="ml-2 text-gray-900">{expression.id}</span>
                    </div>
                    <div className="text-sm">
                        <span className="font-medium text-gray-700">{t('expressionManagement.fields.name')}:</span>
                        <span className="ml-2 text-gray-900">{expression.name}</span>
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
                        {isDeleting ? t('common.deleting') : t('common.delete')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
