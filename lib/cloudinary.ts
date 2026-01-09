// Utility functions for handling image uploads and Cloudinary integration

export const validateImageFile = (file: File): { isValid: boolean; error?: string } => {
  // Check file type
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  if (!validTypes.includes(file.type)) {
    return {
      isValid: false,
      error: 'Invalid file type. Please upload JPEG, PNG, or WebP images only.'
    }
  }

  // Check file size (5MB limit)
  const maxSize = 5 * 1024 * 1024 // 5MB in bytes
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: 'File size too large. Please upload images under 5MB.'
    }
  }

  return { isValid: true }
}

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result)
      } else {
        reject(new Error('Failed to convert file to base64'))
      }
    }
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'))
    }
    
    reader.readAsDataURL(file)
  })
}

export const getCloudinaryImageUrl = (publicId: string, transformations?: string): string => {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  
  if (!cloudName) {
    console.warn('Cloudinary cloud name not configured')
    return ''
  }
  
  const baseUrl = `https://res.cloudinary.com/${cloudName}/image/upload`
  
  if (transformations) {
    return `${baseUrl}/${transformations}/${publicId}`
  }
  
  return `${baseUrl}/${publicId}`
}

export const uploadToCloudinary = async (base64Image: string): Promise<{ url: string; publicId: string }> => {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
  
  if (!cloudName || !uploadPreset) {
    throw new Error('Cloudinary configuration missing')
  }
  
  const formData = new FormData()
  formData.append('file', base64Image)
  formData.append('upload_preset', uploadPreset)
  
  try {
    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: formData,
    })
    
    if (!response.ok) {
      throw new Error('Failed to upload image to Cloudinary')
    }
    
    const data = await response.json()
    
    return {
      url: data.secure_url,
      publicId: data.public_id,
    }
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error)
    throw new Error('Failed to upload image')
  }
}

export const deleteFromCloudinary = async (publicId: string): Promise<boolean> => {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  const apiKey = process.env.CLOUDINARY_API_KEY
  const apiSecret = process.env.CLOUDINARY_API_SECRET
  
  if (!cloudName || !apiKey || !apiSecret) {
    console.warn('Cloudinary configuration missing for deletion')
    return false
  }
  
  try {
    // Note: For security reasons, deletion should typically be handled on the server-side
    // This is a placeholder function that would need proper implementation
    console.warn('Image deletion should be implemented on the server-side for security')
    return true
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error)
    return false
  }
}