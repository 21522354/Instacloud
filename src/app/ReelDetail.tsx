import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  ScrollView,
} from 'react-native';
import { AntDesign, Ionicons, FontAwesome } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { HostNamePostService } from '@/config/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Video } from 'expo-av';
import CommentModal from '../../component/CommentComponent/CommentModal';

const SCREEN_WIDTH = Dimensions.get('window').width;

const ReelDetail = () => {
  const [reel, setReel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const { postId } = useLocalSearchParams();
  const router = useRouter();

  useEffect(() => {
    const fetchReel = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        const response = await fetch(`${HostNamePostService}/api/posts/${postId}`);
        const data = await response.json();
        setReel(data);
        setLikeCount(data.numberOfLike || 0);
      } catch (error) {
        console.error('Error fetching reel:', error);
      } finally {
        setLoading(false);
      }
    };

    if (postId) {
      fetchReel();
    }
  }, [postId]);

  const toggleLike = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const response = await fetch(`${HostNamePostService}/api/posts/likePost`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId: reel.postId,
          userId,
        }),
      });

      if (response.ok) {
        setIsLiked(!isLiked);
        setLikeCount(likeCount + (isLiked ? -1 : 1));
      } else {
        console.error('Failed to toggle like');
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const openCommentModal = () => {
    setModalVisible(true);
  };

  const closeCommentModal = () => {
    setModalVisible(false);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  if (!reel) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Reel not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <AntDesign name="arrowleft" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reel</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Video Player */}
        <View style={styles.videoContainer}>
          <Video
            source={{ uri: reel.imageAndVideo[0] }}
            style={styles.video}
            shouldPlay={isPlaying}
            isLooping
            resizeMode="cover"
            useNativeControls
          />
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <View style={styles.actionIcons}>
            <TouchableOpacity style={styles.iconWithText} onPress={toggleLike}>
              <AntDesign name={isLiked ? "heart" : "hearto"} size={24} color={isLiked ? "#ff2d55" : "white"} />
              <Text style={styles.iconText}>{likeCount}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconWithText} onPress={openCommentModal}>
              <FontAwesome name="comment-o" size={24} color="white" />
              <Text style={styles.iconText}>{reel.numberOfComment}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* User Info and Description */}
        <View style={styles.infoContainer}>

          <Text style={styles.description}>{reel.postTitle}</Text>

        </View>
      </ScrollView>

      {/* Comment Modal */}
      <CommentModal
        postId={reel.postId}
        visible={modalVisible}
        onClose={closeCommentModal}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#333',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  videoContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH * 16/9,
    backgroundColor: '#111',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#333',
  },
  actionIcons: {
    flexDirection: 'row',
    gap: 15,
  },
  iconWithText: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  iconText: {
    color: 'white',
    marginLeft: 5,
  },
  infoContainer: {
    padding: 16,
  },
  userInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  username: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  timestamp: {
    color: '#666',
    fontSize: 14,
  },
  description: {
    color: 'white',
    fontSize: 16,
    marginBottom: 12,
  },
  hashtagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  hashtag: {
    color: '#2196F3',
    marginRight: 8,
    marginBottom: 4,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default ReelDetail;
