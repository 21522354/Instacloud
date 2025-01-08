import { storage } from "@/config/config"
import { getDownloadURL, ref, uploadBytesResumable } from "@firebase/storage"
import * as FileSystem from 'expo-file-system'

interface FileAsset {
  uri: string;
  type?: string;
  name?: string;
}

export const uploadAvatar = async (file: FileAsset): Promise<string> => {
    if (!file || !file.uri) {
      throw new Error('No file to upload')
    }
  
    try {
      // Read the file as base64
      const response = await fetch(file.uri);
      const blob = await response.blob();

      // Create storage reference with unique name
      const fileName = file.name || file.uri.split('/').pop() || 'file';
      const storageRef = ref(storage, `avatars/${fileName}-${Date.now()}`);
      const uploadTask = uploadBytesResumable(storageRef, blob);
  
      // Return promise that resolves with download URL
      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          // Progress handler
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(`Upload is ${progress}% done`);
          },
          // Error handler
          (error) => {
            console.error('Upload failed:', error);
            reject(error);
          },
          // Complete handler
          async () => {
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              resolve(downloadURL);
            } catch (error) {
              console.error('Error getting download URL:', error);
              reject(error);
            }
          }
        );
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }