import { router, useRouter } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

// Hàm định dạng ngày giờ
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', options);
};

const NotificationItem = ({ userId, name, avatar, message, postId, commentId, storyId, eventType, createdDate }) => {
  const router = useRouter();
  return (
    <TouchableOpacity style={styles.container} onPress={() => {
        router.push({ pathname: '/PostDetail', params: { postId: postId } })
    }}>
      <Image source={{ uri: avatar }} style={styles.avatar} />
      <View style={styles.textContainer}>
        <Text style={styles.message}>{message}</Text>
        <Text style={styles.date}>{formatDate(createdDate)}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  message: {
    fontSize: 16,
    color: 'white',
  },
  date: {
    fontSize: 14, // Nhỏ hơn một chút so với message
    color: '#999', // Màu nhạt hơn để dễ đọc
  },
});

export default NotificationItem;
