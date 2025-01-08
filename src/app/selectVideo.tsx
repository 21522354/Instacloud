import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Platform } from 'react-native'
import React, { useState, useEffect } from 'react'
import * as ImagePicker from 'expo-image-picker'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { Video } from 'expo-av'
import { HostNamePostService } from '@/config/config'

const { width } = Dimensions.get('window')

const SelectVideo = () => {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null)

  const pickVideo = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      quality: 1,
      videoMaxDuration: 60, // Max 60 seconds for reels
    })

    if (!result.canceled) {
      setSelectedVideo(result.assets[0].uri)
      console.log('Selected video:', result.assets[0].uri)
    }
  }

  useEffect(() => {
    pickVideo()
  }, [])

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Create Reel</Text>
        <TouchableOpacity 
          style={[styles.nextButton, !selectedVideo && styles.nextButtonDisabled]}
          disabled={!selectedVideo}
          onPress={() => {
              const videoString = encodeURIComponent(JSON.stringify(selectedVideo))
          
            
          }}
        >
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.videoContainer}>
        {selectedVideo ? (
          <Video
            source={{ uri: selectedVideo }}
            style={styles.video}
            resizeMode="cover"
            shouldPlay={true}
            isLooping={true}
            isMuted={true}
          />
        ) : (
          <TouchableOpacity style={styles.placeholderContainer} onPress={pickVideo}>
            <Ionicons name="videocam" size={48} color="#666" />
            <Text style={styles.placeholderText}>Select a video for your reel</Text>
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity style={styles.addButton} onPress={pickVideo}>
        <Ionicons name="videocam" size={24} color="white" />
        <Text style={styles.addButtonText}>Choose Different Video</Text>
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
    paddingTop: Platform.OS === 'ios' ? 60 : 16,
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
    borderRadius: 4,
  },
  nextButtonDisabled: {
    opacity: 0.5,
  },
  nextButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  videoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111',
  },
  video: {
    width: width,
    height: width * 16 / 9,
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#666',
    marginTop: 16,
    fontSize: 16,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#222',
    gap: 8,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
})

export default SelectVideo
