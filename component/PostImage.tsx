import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { HostNamePostService } from 'src/config/config';

const SCREEN_WIDTH = Dimensions.get('window').width;
const IMAGE_SIZE = SCREEN_WIDTH / 3; // Chiều ngang bằng 1/3 chiều ngang màn hình

const PostImage = ({ imageUrl, postId }) => {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => router.push({ pathname: '/PostDetail', params: { postId: postId } })} // Điều hướng tới chi tiết bài post
    >
      <Image source={{ uri: imageUrl }} style={styles.image} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE * 1.2, // Chiều dọc lớn hơn chiều ngang một chút
    padding: 2, // Khoảng cách giữa các hình ảnh
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8, // Tùy chọn: làm bo góc ảnh
  },
});

export default PostImage;
