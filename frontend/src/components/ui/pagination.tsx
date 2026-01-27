import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "../../lib/utils"
import { Button } from "./button"

export interface PaginationProps {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
    className?: string
}

export function Pagination({
    currentPage,
    totalPages,
    onPageChange,
    className,
}: PaginationProps) {
    const maxVisiblePages = 7

    const getPageNumbers = () => {
        if (totalPages <= maxVisiblePages) {
            return Array.from({ length: totalPages }, (_, i) => i + 1)
        }

        const pages: (number | string)[] = []

        if (currentPage <= 4) {
            // Show first 5 pages, then ellipsis, then last page
            for (let i = 1; i <= 5; i++) pages.push(i)
            pages.push('...')
            pages.push(totalPages)
        } else if (currentPage >= totalPages - 3) {
            // Show first page, ellipsis, then last 5 pages
            pages.push(1)
            pages.push('...')
            for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i)
        } else {
            // Show first, ellipsis, current-1, current, current+1, ellipsis, last
            pages.push(1)
            pages.push('...')
            pages.push(currentPage - 1)
            pages.push(currentPage)
            pages.push(currentPage + 1)
            pages.push('...')
            pages.push(totalPages)
        }

        return pages
    }

    const pages = getPageNumbers()

    return (
        <div className={cn("flex items-center justify-center gap-1", className)}>
            <Button
                variant="ghost"
                size="icon"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="h-8 w-8"
            >
                <ChevronLeft className="h-4 w-4" />
            </Button>

            {pages.map((page, index) => {
                if (page === '...') {
                    return (
                        <span
                            key={`ellipsis-${index}`}
                            className="flex h-8 w-8 items-center justify-center text-sm text-gray-500"
                        >
                            ...
                        </span>
                    )
                }

                const pageNum = page as number
                const isActive = pageNum === currentPage

                return (
                    <button
                        key={pageNum}
                        onClick={() => onPageChange(pageNum)}
                        className={cn(
                            "h-8 w-8 rounded-md text-sm font-medium transition-colors",
                            isActive
                                ? "bg-primary-600 text-white"
                                : "text-gray-700 hover:bg-gray-100"
                        )}
                    >
                        {pageNum}
                    </button>
                )
            })}

            <Button
                variant="ghost"
                size="icon"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="h-8 w-8"
            >
                <ChevronRight className="h-4 w-4" />
            </Button>
        </div>
    )
}
