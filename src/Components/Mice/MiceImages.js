import { baseurl } from '../../Api/Baseurl';

/**
 * Get the correct image URL for MICE images
 * @param {string} type - The type of image (main, freeflow, packages, clients, venues, gallery, events)
 * @param {string} filename - The filename of the image
 * @returns {string} The complete image URL
 */
export const getImageUrl = (type, filename) => {
  if (!filename) return '/placeholder-image.png';
  
  const basePath = `${baseurl}/uploads/mice`;
  
  switch (type) {
    case 'main':
      return `${basePath}/main/${filename}`;
    case 'freeflow':
      return `${basePath}/freeflow/${filename}`;
    case 'packages':
      return `${basePath}/packages/${filename}`;
    case 'clients':
      return `${basePath}/clients/${filename}`;
    case 'venues':
      return `${basePath}/venues/${filename}`;
    case 'gallery':
      return `${basePath}/gallery/${filename}`;
    case 'events':
      return `${basePath}/events/${filename}`;
    default:
      return '/placeholder-image.png';
  }
};

/**
 * Handle image change for single image upload
 * @param {File} file - The selected file
 * @param {Function} setFormFunction - The state setter function
 * @param {Object} currentForm - The current form state
 * @param {string} imageField - The field name for the image (default: 'image')
 * @param {string} previewField - The field name for the preview (default: 'imagePreview')
 * @param {Function} setError - Error setter function
 */
export const handleSingleImageChange = (file, setFormFunction, currentForm, imageField = 'image', previewField = 'imagePreview', setError) => {
  if (file) {
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('File size should be less than 10MB');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormFunction({
        ...currentForm,
        [imageField]: file,
        [previewField]: reader.result
      });
      setError('');
    };
    reader.readAsDataURL(file);
  }
};

/**
 * Handle multiple images change
 * @param {FileList} files - The selected files
 * @param {Function} setFormFunction - The state setter function
 * @param {Object} currentForm - The current form state
 * @param {Function} setError - Error setter function
 */
export const handleMultipleImagesChange = (files, setFormFunction, currentForm, setError) => {
  const fileArray = Array.from(files);
  const validFiles = [];
  const newPreviews = [];
  
  fileArray.forEach(file => {
    if (file.type.startsWith('image/') && file.size <= 10 * 1024 * 1024) {
      validFiles.push(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result);
        if (newPreviews.length === validFiles.length) {
          setFormFunction({
            ...currentForm,
            images: [...currentForm.images, ...validFiles],
            imagePreviews: [...currentForm.imagePreviews, ...newPreviews]
          });
          setError('');
        }
      };
      reader.readAsDataURL(file);
    } else {
      setError('Some files were skipped: Only images under 10MB are allowed');
    }
  });
};

/**
 * Remove an image from multiple images form
 * @param {number} index - The index to remove
 * @param {Function} setFormFunction - The state setter function
 * @param {Object} currentForm - The current form state
 */
export const removeImage = (index, setFormFunction, currentForm) => {
  const updatedImages = currentForm.images.filter((_, i) => i !== index);
  const updatedPreviews = currentForm.imagePreviews.filter((_, i) => i !== index);
  setFormFunction({
    ...currentForm,
    images: updatedImages,
    imagePreviews: updatedPreviews
  });
};