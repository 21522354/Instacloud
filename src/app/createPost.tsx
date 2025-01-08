import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, ScrollView, Dimensions } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { router, useLocalSearchParams } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { HostNamePostService } from '@/config/config'

const { width } = Dimensions.get('window')
const previewSize = width / 4 - 4

const CreatePost = () => {
  const params = useLocalSearchParams()
  const [images, setImages] = useState<string[]>([])
  const [title, setTitle] = useState('')

  useEffect(() => {
    if (params.images) {
      try {
        const decodedImages = JSON.parse(decodeURIComponent(params.images as string)) as string[]
        console.log('Received Imgur links:', decodedImages)
        setImages(decodedImages)
      } catch (error) {
        console.error('Error parsing images:', error)
      }
    }
  }, [params.images])

  const handlePost = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        console.error('User ID not found');
        return;
      }

      const response = await fetch(`${HostNamePostService}/api/posts/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          postTitle: title,
          imageAndVideo: images,
          listHagtag: [],
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create post');
      }

      console.log('Post created successfully');
      router.replace('/(tabs)/home');
    } catch (error) {
      console.error('Error creating post:', error);
    }
  }

  const renderMainImage = () => {
    if (images.length > 0) {
      return (
        <View style={styles.mainImageContainer}>
          <Image 
            source={{ uri: images[0] }}
            style={styles.mainImage}
            resizeMode="cover"
          />
        </View>
      )
    }
    return null
  }

  const renderAdditionalImages = () => {
    if (images.length > 1) {
      return images.slice(1).map((uri, index) => (
        <View key={index} style={styles.previewContainer}>
          <Image 
            source={{ uri }}
            style={styles.previewImage}
            resizeMode="cover"
          />
        </View>
      ))
    }
    return null
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>New Post</Text>
        <TouchableOpacity 
          style={[styles.postButton, !title.trim() && styles.postButtonDisabled]}
          disabled={!title.trim()}
          onPress={handlePost}
        >
          <Text style={styles.postButtonText}>Share</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {renderMainImage()}
        
        <View style={styles.titleContainer}>
          <TextInput
            style={styles.titleInput}
            placeholder="Write a caption..."
            placeholderTextColor="#666"
            multiline
            value={title}
            onChangeText={setTitle}
          />
        </View>

        {images.length > 1 && (
          <View style={styles.additionalImages}>
            <Text style={styles.sectionTitle}>Additional Photos</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.previewScroll}>
              {renderAdditionalImages()}
            </ScrollView>
          </View>
        )}
      </ScrollView>
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
  postButton: {
    backgroundColor: '#0095f6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  postButtonDisabled: {
    opacity: 0.5,
  },
  postButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  mainImageContainer: {
    width: width,
    height: width,
    backgroundColor: '#111',
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  titleContainer: {
    marginTop: 16,
    marginHorizontal: 16,
    backgroundColor: '#111',
    borderRadius: 12,
    padding: 16,
  },
  titleInput: {
    color: 'white',
    fontSize: 16,
    minHeight: 100,
  },
  additionalImages: {
    padding: 16,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  previewScroll: {
    flexDirection: 'row',
  },
  previewContainer: {
    marginRight: 8,
    backgroundColor: '#111',
    borderRadius: 8,
    overflow: 'hidden',
  },
  previewImage: {
    width: previewSize,
    height: previewSize,
  },
})

export default CreatePost
