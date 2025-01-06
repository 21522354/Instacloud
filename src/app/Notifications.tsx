import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { HostNameNotificationService } from '@/config/config';
import { useRouter, useLocalSearchParams } from 'expo-router';
import NotificationItem from '../../component/NotificationItem'; // Đảm bảo rằng đường dẫn tới NotificationItem là đúng

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const router = useRouter();
  const { userId } = useLocalSearchParams();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch(`${HostNameNotificationService}/api/notifications/${userId}`);
        const data = await response.json();
        setNotifications(data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, [userId]);

  const renderItem = ({ item }) => (
    <NotificationItem
      userId={item.userId}
      name={item.name}
      avatar={item.avatar}
      message={item.message}
      postId={item.postId}
      commentId={item.commentId}
      storyId={item.storyId}
      eventType={item.eventType}
      createdDate={item.createdDate}
    />
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={notifications}
        renderItem={renderItem}
        keyExtractor={(item) => item.userId + item.postId} // Sử dụng kết hợp userId và postId làm key
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    margin: 16,
  },
});

export default Notifications;
