import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Platform, TextInput, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Video } from 'expo-av';
import { uploadAvatar } from '@/utils/firebaseFunction';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HostNamePostService } from '@/config/config';

const { width } = Dimensions.get('window');

interface VideoAsset {
  uri: string;
  type?: string;
  name?: string;
}

const SelectVideo = () => {
  const [selectedVideo, setSelectedVideo] = useState<VideoAsset | null>(null);
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const pickVideo = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      quality: 1,
      videoMaxDuration: 60,
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      const videoAsset: VideoAsset = {
        uri: asset.uri,
        type: 'video/mp4',
        name: asset.uri.split('/').pop() || 'video.mp4'
      };
      setSelectedVideo(videoAsset);
      console.log('Selected video:', videoAsset);
    }
  };

  useEffect(() => {
    pickVideo();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Create Reel</Text>
        <TouchableOpacity
          style={[styles.nextButton, (!selectedVideo || !title || isLoading) && styles.nextButtonDisabled]}
          disabled={!selectedVideo || !title || isLoading}
          onPress={async () => {
            if (selectedVideo) {
              setIsLoading(true);
              const userId = await AsyncStorage.getItem('userId');
              uploadAvatar(selectedVideo).then(async (url) => {
                try {
                  const response = await fetch(`${HostNamePostService}/api/posts/create/reel`, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      userId: userId,
                      postTitle: title,
                      video: url,
                      listHagtag: []
                    })
                  });
                  
                  if (response.ok) {
                    console.log('Reel created successfully');
                    router.replace('/(tabs)/home');
                  } else {
                    console.error('Failed to create reel');
                  }
                } catch (error) {
                  console.error('Error creating reel:', error);
                } finally {
                  setIsLoading(false);
                }
              }).catch((error) => {
                console.error('Error uploading video:', error);
                setIsLoading(false);
              });
            }
          }}
        >
          {isLoading ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <Text style={styles.nextButtonText}>Create</Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {isLoading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator color="white" size="large" />
            <Text style={styles.loadingText}>Creating reel...</Text>
          </View>
        )}
        <View style={styles.videoContainer}>
          {selectedVideo ? (
            <Video
              source={{ uri: selectedVideo.uri }}
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

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.titleInput}
            placeholder="Enter reel title"
            placeholderTextColor="#666"
            value={title}
            onChangeText={setTitle}
          />
          
          <TouchableOpacity style={styles.addButton} onPress={pickVideo}>
            <Ionicons name="videocam" size={24} color="white" />
            <Text style={styles.addButtonText}>Choose Different Video</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

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
  content: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  videoContainer: {
    height: width,
    backgroundColor: '#111',
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: width,
    height: width,
  },
  inputContainer: {
    padding: 16,
    gap: 16,
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
  titleInput: {
    backgroundColor: '#222',
    color: 'white',
    padding: 16,
    fontSize: 16,
    borderRadius: 8,
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
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#222',
    borderRadius: 8,
    gap: 8,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  loadingText: {
    color: 'white',
    marginTop: 12,
    fontSize: 16,
  },
});

export default SelectVideo;
