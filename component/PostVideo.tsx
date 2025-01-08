import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions, ActivityIndicator, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Video, ResizeMode } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';

const SCREEN_WIDTH = Dimensions.get('window').width;
const VIDEO_SIZE = SCREEN_WIDTH / 3;

interface PostVideoProps {
  videoUrl: string;
  postId: string;
}

const PostVideo = ({ videoUrl, postId }: PostVideoProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => router.push({ pathname: '/ReelDetail', params: { postId: postId } })}
    >
      <Video
        source={{ uri: videoUrl }}
        style={styles.video}
        resizeMode={ResizeMode.COVER}
        shouldPlay={false}
        isMuted={true}
        useNativeControls={false}
        isLooping={false}
        onLoad={() => {
          setIsLoading(false);
          setHasError(false);
        }}
        onError={(error) => {
          console.warn('Video loading error:', error);
          setIsLoading(false);
          setHasError(true);
        }}
      />
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color="white" />
        </View>
      )}
      {hasError && (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={24} color="#666" />
        </View>
      )}
      <View style={styles.playIconContainer}>
        <Ionicons name="play" size={24} color="white" />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: VIDEO_SIZE,
    height: VIDEO_SIZE * 1.2,
    padding: 2,
    position: 'relative',
    backgroundColor: '#111',
  },
  video: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    backgroundColor: '#111',
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  errorContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111',
  },
  playIconContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -12 }, { translateY: -12 }],
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 8,
  },
});

export default PostVideo;
