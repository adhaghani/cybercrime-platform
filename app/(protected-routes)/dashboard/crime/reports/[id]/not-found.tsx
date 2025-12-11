import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FileQuestion, ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 text-center">
      <div className="bg-muted rounded-full p-4">
        <FileQuestion className="h-10 w-10 text-muted-foreground" />
      </div>
      <h2 className="text-2xl font-bold tracking-tight">Crime Report Not Found</h2>
      <p className="text-muted-foreground max-w-sm">
        The crime report you are looking for does not exist or you do not have permission to view it.
      </p>
      <Button asChild variant="outline">
        <Link href="/dashboard/crime/reports">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Reports
        </Link>
      </Button>
    </div>
  )
}