# Uploadthing Setup Guide

Uploadthing is now configured for file uploads in your EDUSEPAL platform.

## What's Included

1. **Core Configuration** (`lib/uploadthing.ts`)
   - Three file endpoints: `courseImage`, `courseMaterial`, `avatar`
   - File size limits configured per endpoint
   - Middleware ready for auth integration

2. **API Route** (`app/api/uploadthing/route.ts`)
   - Handles all upload requests from the client

3. **File Upload Component** (`components/file-upload.tsx`)
   - Reusable component for file uploads
   - Success/error states with visual feedback
   - Loading states and animations

## Setup Instructions

### 1. Create Uploadthing Account
- Go to [uploadthing.com](https://uploadthing.com)
- Sign up and create a new project
- Copy your API token

### 2. Add Environment Variable
Add to your `.env.local`:
```
UPLOADTHING_TOKEN=your_token_here
```

### 3. Install Dependencies
```bash
pnpm install
```

## Usage Example

### In Course Creation Form
```tsx
import { FileUpload } from '@/components/file-upload'

<FileUpload
  endpoint="courseImage"
  label="Upload Course Image"
  onUploadComplete={(file) => {
    setFormData(prev => ({
      ...prev,
      imageUrl: file.url
    }))
  }}
/>
```

### Available Endpoints

1. **courseImage**
   - Max size: 4MB
   - Type: Image only
   - Use: Course thumbnails/covers

2. **courseMaterial**
   - Max size: 16MB (PDF), 4MB (Image), 128MB (Video)
   - Types: PDF, Image, Video
   - Use: Course materials and resources

3. **avatar**
   - Max size: 2MB
   - Type: Image only
   - Use: User profile pictures

## Integration with Create Course

To integrate with the course creation form:

1. Import the `FileUpload` component
2. Add a file upload field in the form
3. Store the uploaded file URL in your form state
4. Save the URL to the database along with course data

## Security Notes

- Uploaded files are stored securely on Uploadthing's servers
- Auth checks are ready to be enabled when Clerk is configured
- File type validation happens both client and server-side
- Files are automatically cleaned up based on your Uploadthing settings

## Troubleshooting

- **"UPLOADTHING_TOKEN not found"**: Make sure to add the token to `.env.local`
- **Upload fails**: Check file size and type are within limits
- **CORS errors**: This is handled automatically by Uploadthing
- **Component not rendering**: Ensure `@uploadthing/react` is properly installed

## Next Steps

1. Add UPLOADTHING_TOKEN to your environment variables
2. Integrate FileUpload component into course creation form
3. Test file upload functionality
4. Enable auth middleware when Clerk is configured
