import React, { useState } from 'react';
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import { HostNamePostService } from 'src/config/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CommentModal from 'component/CommentComponent/CommentModal';

const PostItem = ({ post }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.numberOfLike);
  const [modalVisible, setModalVisible] = useState(false);

  const handleViewableItemsChanged = ({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  };

  const toggleLike = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const response = await fetch(`${HostNamePostService}/api/posts/likePost`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId: post.postId,
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: post.avatar }} style={styles.avatar} />
        <View style={styles.userInfo}>
          <Text style={styles.nickName}>{post.nickName}</Text>
          <Text style={styles.createdDate}>{new Date(post.createdDate).toLocaleDateString()}</Text>
        </View>
        <TouchableOpacity>
          <AntDesign name="ellipsis1" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={post.imageAndVideo}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View>
            <Image source={{ uri: item }} style={styles.postImage} />
            <View style={styles.imageIndex}>
              <Text style={styles.imageIndexText}>
                {currentIndex + 1} / {post.imageAndVideo.length}
              </Text>
            </View>
          </View>
        )}
        pagingEnabled
        onViewableItemsChanged={handleViewableItemsChanged}
        viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
      />

      <View style={styles.actions}>
        <View style={styles.actionIcons}>
          <TouchableOpacity style={styles.iconWithText} onPress={toggleLike}>
            <AntDesign name={isLiked ? "heart" : "hearto"} size={24} color="white" />
            <Text style={styles.iconText}>{likeCount}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconWithText} onPress={openCommentModal}>
            <FontAwesome name="comment-o" size={24} color="white" />
            <Text style={styles.iconText}>{post.numberOfComment}</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity>
          <AntDesign name="book" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.postDetails}>
        <Text style={styles.postTitle}>{post.postTitle}</Text>
      </View>

      <CommentModal
        postId={post.postId}
        visible={modalVisible}
        onClose={closeCommentModal}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  userInfo: {
    flex: 1,
    marginLeft: 10,
  },
  nickName: {
    color: 'white',
    fontWeight: 'bold',
  },
  createdDate: {
    color: '#888',
    fontSize: 12,
  },
  postImage: {
    width: Dimensions.get('window').width,
    height: 300,
  },
  imageIndex: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 10,
    padding: 5,
  },
  imageIndexText: {
    color: 'white',
    fontSize: 14,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
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
  postDetails: {
    paddingHorizontal: 10,
  },
  postTitle: {
    color: 'white',
    marginVertical: 5,
  },
});

export default PostItem; 