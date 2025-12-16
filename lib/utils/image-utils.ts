/**
 * Converts Google Drive view links to direct image URLs
 * Supports various Google Drive URL formats:
 * - https://drive.google.com/file/d/FILE_ID/view
 * - https://drive.google.com/open?id=FILE_ID
 * - https://drive.google.com/uc?id=FILE_ID
 */
export function convertGoogleDriveUrl(url: string): string {
  if (!url || typeof url !== 'string') {
    return url || '/placeholder.png';
  }

  // If it's already a direct image URL or not a Google Drive URL, return as is
  if (!url.includes('drive.google.com')) {
    return url;
  }

  try {
    // Extract file ID from various Google Drive URL formats
    let fileId: string | null = null;

    // Format 1: https://drive.google.com/file/d/FILE_ID/view
    const fileIdMatch1 = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (fileIdMatch1) {
      fileId = fileIdMatch1[1];
    }

    // Format 2: https://drive.google.com/open?id=FILE_ID
    if (!fileId) {
      const urlObj = new URL(url);
      fileId = urlObj.searchParams.get('id');
    }

    // Format 3: https://drive.google.com/uc?id=FILE_ID
    if (!fileId) {
      const urlObj = new URL(url);
      fileId = urlObj.searchParams.get('id');
    }

    // Format 4: https://drive.google.com/uc?export=view&id=FILE_ID (already converted)
    if (url.includes('export=view')) {
      return url; // Already a direct link
    }

    // If we found a file ID, convert to direct image URL
    if (fileId) {
      return `https://drive.google.com/uc?export=view&id=${fileId}`;
    }

    // If we can't extract file ID, return original URL
    return url;
  } catch (error) {
    console.error('Error converting Google Drive URL:', error);
    return url;
  }
}

/**
 * Processes image URLs, handling Google Drive links and redirects
 */
export function processImageUrl(url: string): string {
  if (!url || typeof url !== 'string') {
    return '/placeholder.png';
  }

  let processedUrl = url;

  // Handle Google redirect URLs (from Google search results)
  if (processedUrl.includes('www.google.com')) {
    try {
      const urlObj = new URL(processedUrl);
      const urlParam = urlObj.searchParams.get('url');
      if (urlParam) {
        processedUrl = decodeURIComponent(urlParam);
        // If it's a casinobankingmethods.com link, use placeholder
        if (processedUrl.includes('casinobankingmethods.com')) {
          return '/placeholder.png';
        }
      }
    } catch (e) {
      console.error('Error parsing Google redirect URL:', e);
    }
  }

  // Handle imgurl parameter (older Google redirect format)
  if (processedUrl.includes('imgurl=')) {
    try {
      const urlParams = new URLSearchParams(new URL(processedUrl).search);
      const imgUrl = urlParams.get('imgurl');
      if (imgUrl) {
        processedUrl = decodeURIComponent(imgUrl);
      }
    } catch (e) {
      console.error('Error parsing image URL:', e);
    }
  }

  // Convert Google Drive URLs to direct image links
  if (processedUrl.includes('drive.google.com')) {
    processedUrl = convertGoogleDriveUrl(processedUrl);
  }

  return processedUrl || '/placeholder.png';
}

