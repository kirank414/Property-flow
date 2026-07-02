/**
 * Client-side utility for validating, resizing, and compressing images before upload.
 */
export function resizeAndCompressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    // 1. Validate image format
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      return reject(new Error('Invalid image type. Only JPEG, PNG, and WebP formats are supported.'));
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const maxW = 1920;
        const maxH = 1080;

        // 2. Automatically scale if larger than 1920x1080
        if (width > maxW || height > maxH) {
          const ratio = Math.min(maxW / width, maxH / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return reject(new Error('Could not initialize image processing context.'));
        }

        ctx.drawImage(img, 0, 0, width, height);

        // 3. Compress quality to ~80%
        // PNG is lossless, so quality parameter is ignored by browser.
        const compressedBase64 = canvas.toDataURL(file.type, 0.8);

        // 4. Limit uploads to 2 MB after compression
        const approximateSizeBytes = (compressedBase64.length * 3) / 4;
        if (approximateSizeBytes > 2 * 1024 * 1024) {
          return reject(new Error('Processed image exceeds the 2MB size limit. Please choose a smaller file.'));
        }

        resolve(compressedBase64);
      };
      img.onerror = () => {
        reject(new Error('Failed to load image for processing.'));
      };
      img.src = e.target?.result as string;
    };
    reader.onerror = () => {
      reject(new Error('Failed to read image file.'));
    };
    reader.readAsDataURL(file);
  });
}
