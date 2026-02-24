'use client'

import { useState } from 'react'
import { UploadButton } from '@uploadthing/react'
import { OurFileRouter } from '@/lib/uploadthing'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Upload, X, CheckCircle, AlertCircle } from 'lucide-react'

interface FileUploadProps {
  endpoint: keyof OurFileRouter
  onUploadComplete?: (file: { url: string; name: string; size?: number }) => void
  onError?: (error: Error) => void
  className?: string
  label?: string
}

export function FileUpload({
  endpoint,
  onUploadComplete,
  onError,
  className = '',
  label = 'Upload File',
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<{ url: string; name: string } | null>(null)
  const [error, setError] = useState<string | null>(null)

  return (
    <div className={className}>
      {!uploadedFile ? (
        <Card className="p-6 border-2 border-dashed border-border hover:border-primary/50 transition-colors">
          <UploadButton
            endpoint={endpoint}
            onBeforeUploadBegin={(files) => {
              setIsUploading(true)
              setError(null)
              return files
            }}
            onClientUploadComplete={(res) => {
              setIsUploading(false)
              if (res?.[0]) {
                const file = res[0]
                setUploadedFile({
                  url: file.url,
                  name: file.name,
                })
                onUploadComplete?.({
                  url: file.url,
                  name: file.name,
                  size: file.size,
                })
              }
            }}
            onUploadError={(error: Error) => {
              setIsUploading(false)
              setError(error.message)
              onError?.(error)
            }}
            content={{
              button: () => (
                <Button
                  disabled={isUploading}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  {isUploading ? (
                    <>
                      <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      {label}
                    </>
                  )}
                </Button>
              ),
              allowedContent: () => (
                <p className="text-xs text-muted-foreground mt-2">
                  Maximum file size depends on file type
                </p>
              ),
            }}
          />
        </Card>
      ) : (
        <Card className="p-6 bg-green-50 dark:bg-green-950 border-2 border-green-200 dark:border-green-800">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3 flex-1">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-green-900 dark:text-green-100">Upload complete!</p>
                <p className="text-sm text-green-700 dark:text-green-200 break-all">{uploadedFile.name}</p>
              </div>
            </div>
            <button
              onClick={() => {
                setUploadedFile(null)
                setError(null)
              }}
              className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </Card>
      )}

      {error && (
        <Card className="p-4 mt-4 bg-red-50 dark:bg-red-950 border-2 border-red-200 dark:border-red-800">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-red-900 dark:text-red-100">Upload failed</p>
              <p className="text-sm text-red-700 dark:text-red-200">{error}</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
