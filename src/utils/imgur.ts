const IMGUR_CLIENT_ID = '546c25a59c58ad7'; // Replace with your Imgur Client ID

export const uploadToImgur = async (imageUri: string): Promise<string> => {
  try {
    // Convert image URI to base64
    const response = await fetch(imageUri);
    const blob = await response.blob();
    const base64 = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });

    // Remove data URL prefix
    const base64Data = (base64 as string).split(',')[1];

    // Upload to Imgur
    const imgurResponse = await fetch('https://api.imgur.com/3/image', {
      method: 'POST',
      headers: {
        'Authorization': `Client-ID ${IMGUR_CLIENT_ID}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image: base64Data,
        type: 'base64',
      }),
    });

    const data = await imgurResponse.json();
    if (!data.success) {
      throw new Error(data.data.error);
    }

    return data.data.link;
  } catch (error) {
    console.error('Error uploading to Imgur:', error);
    throw error;
  }
};
