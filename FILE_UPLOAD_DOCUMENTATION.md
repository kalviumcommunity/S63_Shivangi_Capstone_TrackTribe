# File Upload Functionality Documentation

## Overview
This document describes the file upload functionality implemented for party cover images in the TrackTribe application.

## Features

### Frontend (React)
- **File Upload UI**: Drag and drop interface with file browser fallback
- **Image Preview**: Shows selected image before upload
- **File Validation**: 
  - Accepted formats: JPEG, PNG, GIF, WebP
  - Maximum file size: 5MB
  - Real-time validation with error messages
- **Memory Management**: Automatic cleanup of object URLs to prevent memory leaks

### Backend (Node.js/Express)
- **Multer Integration**: Handles multipart/form-data uploads
- **File Storage**: Local filesystem storage with organized directory structure
- **File Validation**: Server-side validation for file type and size
- **Error Handling**: Comprehensive error handling with cleanup on failure
- **RESTful API**: Standard endpoints for upload, retrieve, and delete operations

## API Endpoints

### Create Party with Cover Image
```
POST /api/parties
Content-Type: multipart/form-data

Form Data:
- name: string (required)
- genre: string (required) 
- privacy: string (public|private)
- password: string (required if private)
- description: string
- initialPlaylist: string
- coverImage: file (optional)
```

### Get Party Cover Image
```
GET /api/parties/:id/cover
Returns: Image file with appropriate Content-Type header
```

### Delete Party Cover Image
```
DELETE /api/parties/:id/cover
Returns: JSON success/error response
```

## File Storage Structure
```
server/
├── uploads/
│   └── party-covers/
│       ├── party-cover-1640995200000-123456789.jpg
│       ├── party-cover-1640995300000-987654321.png
│       └── ...
```

## Security Considerations

### Implemented
- File type validation (whitelist approach)
- File size limits (5MB maximum)
- Unique filename generation to prevent conflicts
- Server-side validation redundancy

### Recommendations for Production
- Implement user authentication and authorization
- Add rate limiting for upload endpoints
- Use cloud storage (AWS S3, Azure Blob) instead of local filesystem
- Add virus scanning for uploaded files
- Implement image optimization/resizing
- Add CSRF protection
- Use Content Security Policy headers

## Usage Examples

### Frontend Component Usage
```jsx
import PartyCard from '../Components/PartyCard';

// Example party object with cover image
const party = {
  id: '507f1f77bcf86cd799439011',
  name: 'Summer Vibes Party',
  genre: 'Electronic',
  privacy: 'public',
  description: 'Join us for an amazing night of electronic music!',
  coverImage: {
    filename: 'party-cover-1640995200000-123456789.jpg',
    originalName: 'summer-party.jpg'
  }
};

<PartyCard party={party} />
```

### File Upload in Form
The file upload is automatically handled in the HostPartyPage component when the form is submitted.

## Error Handling

### Frontend
- File type validation with user-friendly messages
- File size validation before upload
- Network error handling with fallback messages
- Image preview error handling with fallbacks

### Backend
- Multer error handling for file size and type
- Database operation error handling
- File system error handling
- Automatic cleanup on failure

## Testing the Functionality

1. **Start the server**:
   ```bash
   cd server
   npm start
   ```

2. **Start the client**:
   ```bash
   cd client
   npm run dev
   ```

3. **Test the upload**:
   - Navigate to the "Host Your Party" page
   - Fill in the party details
   - Upload a cover image (drag & drop or click to browse)
   - Submit the form
   - Check that the party is created with the cover image

4. **Verify file storage**:
   - Check the `server/uploads/party-covers/` directory
   - Verify the uploaded file exists with a unique filename

## Future Enhancements

1. **Image Processing**:
   - Automatic image resizing and optimization
   - Multiple image sizes (thumbnail, medium, large)
   - Image format conversion

2. **Cloud Storage Integration**:
   - AWS S3 or Azure Blob Storage
   - CDN integration for faster image delivery

3. **Advanced Features**:
   - Image cropping interface
   - Multiple image upload support
   - Image effects and filters

4. **Performance Optimizations**:
   - Lazy loading for images
   - Progressive image loading
   - Caching strategies
