# File Upload System Documentation

## Overview

A comprehensive file upload system with image cropping capabilities built for the cybercrime platform. The system includes reusable components and API routes for handling file uploads with client-side image cropping.

## Components

### 1. FileUploadTemplate

**Location:** `components/upload/file-upload-template.tsx`

A reusable template component for file uploads with drag-and-drop support.

#### Features
- Drag and drop file upload
- File size validation
- File type filtering
- Multiple file support
- Custom children rendering
- Error handling

#### Props
```typescript
interface FileUploadConfig {
  accept?: string;           // File types (e.g., "image/*", ".pdf")
  maxSize?: number;          // Max size in bytes (default: 5MB)
  multiple?: boolean;        // Allow multiple files
  onFileSelect?: (files: File[]) => void;
  onFileRemove?: (index: number) => void;
  disabled?: boolean;
}
```

#### Usage Example
```tsx
import { FileUploadTemplate } from "@/components/upload/file-upload-template";

const [files, setFiles] = useState<File[]>([]);

<FileUploadTemplate
  files={files}
  accept="image/*"
  maxSize={5 * 1024 * 1024}
  multiple={false}
  onFileSelect={(newFiles) => setFiles(newFiles)}
  onFileRemove={(index) => setFiles(files.filter((_, i) => i !== index))}
/>
```

### 2. ImageCropDialog

**Location:** `components/upload/image-crop-dialog.tsx`

A dialog component for cropping images with zoom controls using `react-easy-crop`.

#### Features
- Interactive image cropping
- Zoom controls with slider
- Aspect ratio customization
- Circular or rectangular crop shapes
- Returns cropped image as Blob

#### Props
```typescript
interface ImageCropDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageUrl: string;
  onCropComplete: (croppedBlob: Blob) => void;
  aspect?: number;           // Aspect ratio (default: 1)
  cropShape?: "rect" | "round"; // Crop shape (default: "round")
}
```

#### Usage Example
```tsx
import { ImageCropDialog } from "@/components/upload/image-crop-dialog";

const [cropDialogOpen, setCropDialogOpen] = useState(false);
const [imageUrl, setImageUrl] = useState("");

<ImageCropDialog
  open={cropDialogOpen}
  onOpenChange={setCropDialogOpen}
  imageUrl={imageUrl}
  onCropComplete={(blob) => {
    // Handle cropped blob
    console.log("Cropped image:", blob);
  }}
  aspect={1}
  cropShape="round"
/>
```

### 3. ProfilePictureUpload

**Location:** `components/upload/profile-picture-upload.tsx`

A specialized component for profile picture uploads with built-in cropping and upload functionality.

#### Features
- Avatar preview
- File selection with validation
- Automatic image cropping
- Upload to server
- Loading states
- Error handling with toast notifications

#### Props
```typescript
interface ProfilePictureUploadProps {
  currentImageUrl?: string;  // Current profile picture URL
  userInitials?: string;     // Fallback initials
  onUploadComplete?: (imagePath: string) => void;
  disabled?: boolean;
  accountId: string;         // Required for upload
}
```

#### Usage Example
```tsx
import { ProfilePictureUpload } from "@/components/upload/profile-picture-upload";

<ProfilePictureUpload
  currentImageUrl={user.profilePicture}
  userInitials="JD"
  onUploadComplete={(path) => {
    console.log("New profile picture:", path);
    // Update user profile in database
  }}
  accountId={user.accountId}
/>
```

## API Routes

### Upload Profile Picture

**Endpoint:** `POST /api/upload/profile-picture`

Handles profile picture uploads and saves them to the file system.

#### Request
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body:
  - `file`: The image file (Blob/File)
  - `accountId`: User's account ID

#### Response
```json
{
  "success": true,
  "path": "/uploads/profile-pictures/profile_123_1234567890.jpg",
  "url": "/uploads/profile-pictures/profile_123_1234567890.jpg",
  "fileName": "profile_123_1234567890.jpg"
}
```

#### Storage
- Files are stored in: `public/uploads/profile-pictures/`
- Naming format: `profile_{accountId}_{timestamp}.jpg`
- Public URL: `/uploads/profile-pictures/{fileName}`

## Implementation Example

### Complete Profile Picture Upload Flow

```tsx
"use client";

import { useState } from "react";
import { ProfilePictureUpload } from "@/components/upload/profile-picture-upload";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function ProfileEditPage() {
  const [avatarUrl, setAvatarUrl] = useState<string>();
  const accountId = "user-123";

  const handleSave = async () => {
    if (avatarUrl) {
      // Update user profile in database
      const response = await fetch(`/api/accounts/${accountId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          avatar_url: avatarUrl,
        }),
      });

      if (response.ok) {
        toast.success("Profile updated successfully");
      }
    }
  };

  return (
    <div className="space-y-6">
      <ProfilePictureUpload
        currentImageUrl="/uploads/profile-pictures/current.jpg"
        userInitials="JD"
        onUploadComplete={(path) => setAvatarUrl(path)}
        accountId={accountId}
      />
      
      <Button onClick={handleSave}>
        Save Changes
      </Button>
    </div>
  );
}
```

## File Structure

```
components/
  upload/
    file-upload-template.tsx      # Base file upload component
    image-crop-dialog.tsx          # Image cropping dialog
    profile-picture-upload.tsx     # Profile picture upload

app/
  api/
    upload/
      profile-picture/
        route.ts                   # Upload API endpoint

public/
  uploads/
    profile-pictures/              # Uploaded profile pictures
```

## Dependencies

- `react-easy-crop`: Image cropping functionality
- `@radix-ui/react-avatar`: Avatar component
- `@radix-ui/react-dialog`: Dialog component
- `@radix-ui/react-slider`: Zoom slider
- `lucide-react`: Icons
- `sonner`: Toast notifications

## Installation

```bash
npm install react-easy-crop
npx shadcn@latest add avatar dialog slider
```

## Configuration

### Maximum File Size
Default: 5MB

To change, update the `maxSize` prop in components or modify the validation in the upload API.

### Allowed File Types
Default: `image/*`

To restrict to specific types:
```tsx
<ProfilePictureUpload
  accept="image/jpeg,image/png,image/webp"
  // ... other props
/>
```

### Upload Directory
Default: `public/uploads/profile-pictures/`

To change, modify the path in `/app/api/upload/profile-picture/route.ts`:
```typescript
const uploadDir = join(process.cwd(), "public", "uploads", "your-directory");
```

## Error Handling

The system includes comprehensive error handling:

1. **Client-side validation:**
   - File type checking
   - File size validation
   - User-friendly error messages via toast

2. **Server-side validation:**
   - Missing file checks
   - Account ID validation
   - File system error handling

3. **User feedback:**
   - Loading states during upload
   - Success/error notifications
   - Visual feedback during cropping

## Best Practices

1. **File Size Limits:** Keep default at 5MB or lower for better performance
2. **Image Formats:** Recommend JPEG for profile pictures (smaller file size)
3. **Error Handling:** Always provide user feedback for upload status
4. **Cleanup:** The system automatically revokes object URLs to prevent memory leaks
5. **Security:** Validate file types and sizes on both client and server

## Future Enhancements

Potential improvements:
- Image optimization/compression before upload
- Cloud storage integration (AWS S3, Cloudinary)
- Multiple image uploads
- Batch processing
- Progress indicators for large files
- Image format conversion
- Thumbnail generation

## Troubleshooting

### Images not displaying
- Check that the upload directory exists
- Verify file permissions
- Ensure Next.js is serving static files from public directory

### Upload fails
- Check server logs for errors
- Verify account ID is being passed correctly
- Check file size limits
- Ensure directory has write permissions

### Cropping issues
- Verify `react-easy-crop` is installed correctly
- Check browser console for errors
- Ensure image URL is valid and accessible

## Support

For issues or questions, please refer to:
- Component source code documentation
- React Easy Crop: https://github.com/ValentinH/react-easy-crop
- Next.js file uploads: https://nextjs.org/docs/app/building-your-application/routing/route-handlers
