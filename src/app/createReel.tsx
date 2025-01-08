import { View, Text, StyleSheet, TextInput, TouchableOpacity, Dimensions, Platform } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { router, useLocalSearchParams } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Video } from 'expo-av'
import { HostNamePostService } from '@/config/config'

const { width } = Dimensions.get('window')

const CreateReel = () => {
  const params = useLocalSearchParams()
  const [videoUrl, setVideoUrl] = useState<string>('')
  const [title, setTitle] = useState('')

  useEffect(() => {
    if (params.video) {
      try {
        const decodedVideo = JSON.parse(decodeURIComponent(params.video as string)) as string
        console.log('Received video:', decodedVideo)
        setVideoUrl(decodedVideo)
      } catch (error) {
        console.error('Error parsing video:', error)
      }
    }
  }, [params.video])

  const handlePost = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId')
      if (!userId) {
        console.error('User ID not found')
        return
      }

      const response = await fetch(`${HostNamePostService}/api/posts/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          postTitle: title,
          imageAndVideo: [videoUrl],
          listHagtag: [],
          isReel: true,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create reel')
      }

      console.log('Reel created successfully')
      router.replace('/(tabs)/reels')
    } catch (error) {
      console.error('Error creating reel:', error)
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>New Reel</Text>
        <TouchableOpacity 
          style={[styles.postButton, !title.trim() && styles.postButtonDisabled]}
          disabled={!title.trim()}
          onPress={handlePost}
        >
          <Text style={styles.postButtonText}>Share</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.videoContainer}>
          {videoUrl ? (
            <Video
              source={{ uri: videoUrl }}
              style={styles.video}
              resizeMode="cover"
              shouldPlay={true}
              isLooping={true}
              isMuted={true}
            />
          ) : null}
        </View>
        
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
      </View>
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
    paddingTop: Platform.OS === 'ios' ? 60 : 16,
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
    borderRadius: 4,
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
  videoContainer: {
    width: width,
    height: width * 16 / 9,
    backgroundColor: '#111',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  titleContainer: {
    padding: 16,
  },
  titleInput: {
    color: 'white',
    fontSize: 16,
    minHeight: 100,
  },
})

export default CreateReel
