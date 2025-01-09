import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { uploadToImgur } from '../utils/imgur';

export default function CreateStory() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [9, 16],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const handleNext = async () => {
    if (selectedImage) {
      setLoading(true);
      try {
        const imgurUrl = await uploadToImgur(selectedImage);
        router.push({
          pathname: '/editStory',
          params: { imageUrl: imgurUrl }
        });
      } catch (error) {
        console.error('Error uploading image:', error);
        // You might want to show an error message to the user here
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={28} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>New Story</Text>
        {loading ? (
          <ActivityIndicator color="#0095f6" />
        ) : (
          <TouchableOpacity 
            onPress={handleNext}
            style={[styles.nextButton, !selectedImage && styles.disabled]}
            disabled={!selectedImage}
          >
            <Text style={[styles.nextButtonText, !selectedImage && styles.disabledText]}>
              Next
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity 
        style={styles.imageContainer} 
        onPress={pickImage}
      >
        {selectedImage ? (
          <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
        ) : (
          <View style={styles.placeholder}>
            <Ionicons name="image-outline" size={48} color="white" />
            <Text style={styles.placeholderText}>Tap to select an image</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  nextButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
    backgroundColor: '#0095f6',
  },
  nextButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  disabled: {
    backgroundColor: '#0095f633',
  },
  disabledText: {
    color: '#ffffff77',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  selectedImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  placeholder: {
    alignItems: 'center',
  },
  placeholderText: {
    marginTop: 12,
    fontSize: 16,
    color: 'white',
  },
});
