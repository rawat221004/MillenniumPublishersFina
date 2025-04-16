import imageCompression from 'browser-image-compression'

// Function to compress image files
export async function compressImage(file: File) {
  try {
    const options = {
      maxSizeMB: 1, // Maximum file size in MB
      maxWidthOrHeight: 1920, // Maximum width/height in pixels
      useWebWorker: true
    }
    
    return await imageCompression(file, options)
  } catch (error) {
    console.error('Error compressing image:', error)
    return file // Return original file if compression fails
  }
}

// Function to determine file type and process accordingly
export async function processFile(file: File) {
  // Check if file is an image
  if (file.type.startsWith('image/')) {
    return await compressImage(file)
  }
  
  // For PDF, txt and other document types
  // We're not compressing these as it could affect document integrity
  // But you could implement PDF compression libraries here if needed
  return file
}
