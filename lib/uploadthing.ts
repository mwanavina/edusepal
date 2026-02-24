import { createUploadthing, type FileRouter } from 'uploadthing/next'
import { UploadThingError } from 'uploadthing/server'

const f = createUploadthing()

export const ourFileRouter = {
  courseImage: f({
    image: { maxFileSize: '4MB', maxFileCount: 1 },
  })
    .middleware(async () => {
      // TODO: Add auth check when Clerk is configured
      // const { userId } = auth()
      // if (!userId) throw new UploadThingError('Unauthorized')
      return {}
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log('File uploaded:', file.url)
      return { uploadedBy: 'instructor', url: file.url }
    }),

  courseMaterial: f({
    pdf: { maxFileSize: '16MB' },
    image: { maxFileSize: '4MB' },
    video: { maxFileSize: '128MB' },
  })
    .middleware(async () => {
      // TODO: Add auth check when Clerk is configured
      return {}
    })
    .onUploadComplete(async ({ file }) => {
      console.log('Material uploaded:', file.url)
      return { url: file.url, size: file.size }
    }),

  avatar: f({
    image: { maxFileSize: '2MB', maxFileCount: 1 },
  })
    .middleware(async () => {
      // TODO: Add auth check when Clerk is configured
      return {}
    })
    .onUploadComplete(async ({ file }) => {
      console.log('Avatar uploaded:', file.url)
      return { url: file.url }
    }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
