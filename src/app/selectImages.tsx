import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Dimensions, Platform } from 'react-native'
import React, { useState, useEffect } from 'react'
import * as ImagePicker from 'expo-image-picker'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { uploadToImgur } from '../utils/imgur'
import { Alert } from 'react-native'

const { width } = Dimensions.get('window')
const imageSize = width / 3 - 2

const SelectImages = () => {
  const [selectedImages, setSelectedImages] = useState<string[]>([])

  const pickImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
    })

    if (!result.canceled) {
      const newImages = result.assets.map(asset => asset.uri)
      setSelectedImages(prev => [...prev, ...newImages])
    }
  }

  useEffect(() => {
    pickImages()
  }, [])

  const renderItem = ({ item }: { item: string }) => (
    <View style={styles.imageContainer}>
      <Image 
        source={{ uri: item }} 
        style={styles.image}
        resizeMode="cover"
      />
      <TouchableOpacity 
        style={styles.removeButton}
        onPress={() => setSelectedImages(prev => prev.filter(img => img !== item))}
      >
        <Ionicons name="close-circle" size={24} color="white" />
      </TouchableOpacity>
    </View>
  )

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Select Photos</Text>
        <TouchableOpacity 
          style={[styles.nextButton, !selectedImages.length && styles.nextButtonDisabled]}
          disabled={!selectedImages.length}
          onPress={async () => {
            try {
              // Show loading indicator or disable button while uploading
              const uploadedLinks = await Promise.all(
                selectedImages.map(uri => uploadToImgur(uri))
              );
              console.log('Uploaded Images:', uploadedLinks);
              const imageString = encodeURIComponent(JSON.stringify(uploadedLinks));
              router.push(`/createPost?images=${imageString}`);
            } catch (error) {
              console.error('Error uploading images:', error);
              // Show error message to user
              Alert.alert('Error', 'Failed to upload images. Please try again.');
            }
          }}
        >
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={selectedImages}
        renderItem={renderItem}
        numColumns={3}
        keyExtractor={(item) => item}
        contentContainerStyle={styles.imageList}
      />

      <TouchableOpacity style={styles.addButton} onPress={pickImages}>
        <Ionicons name="add" size={24} color="white" />
        <Text style={styles.addButtonText}>Add More Photos</Text>
      </TouchableOpacity>
    </View>
  )
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
    paddingTop: 60,
    borderBottomWidth: 0.5,
    borderBottomColor: '#333',
  },
  headerText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  nextButton: {
    backgroundColor: '#0095f6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  nextButtonDisabled: {
    opacity: 0.5,
  },
  nextButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  imageList: {
    padding: 1,
  },
  imageContainer: {
    margin: 1,
  },
  image: {
    width: imageSize,
    height: imageSize,
  },
  removeButton: {
    position: 'absolute',
    top: 4,
    right: 4,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#111',
    padding: 16,
    margin: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  addButtonText: {
    color: 'white',
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
  },
})

export default SelectImages
