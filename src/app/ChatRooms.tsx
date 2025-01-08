import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import ChatRoomItem from '../../component/ChatRoomItem'; // Import component ChatRoomItem
import { HostNameChatService } from '@/config/config'; // Import HostName từ config
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useSignalR } from '../contexts/SignalRContext';

const ChatRooms = ({ navigation, route }) => {
  const [searchInput, setSearchInput] = useState('');
  const [selectedChat, setSelectedChat] = useState(null);
  const [chatRooms, setChatRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { connection } = useSignalR();

  // Hàm gọi API lấy danh sách phòng chat
  const fetchChatRooms = async () => {
    setLoading(true);
    setError(null);
    try {
      const userId = await AsyncStorage.getItem('userId');
      const response = await fetch(
        `${HostNameChatService}/api/chat/users/${userId}/chatRooms`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch chat rooms.');
      }

      const data = await response.json();
      setChatRooms(data); // Giả sử API trả về mảng các phòng chat
    } catch (err) {
      setError('Failed to load chat rooms. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChatRooms();
  }, []);

  useEffect(() => {
    if (connection) {
      // Listen for new messages
      connection.on('ReceiveNotification', (message) => {
        console.log('Received message:', message);
        fetchChatRooms();
      });

      return () => {
        // Leave the chat room group when component unmounts
        connection.off('ReceiveNotification');
      };
    }
  }, []);

  const filteredChatRooms = chatRooms.filter((room) =>
    room.name.toLowerCase().includes(searchInput.toLowerCase())
  );

  const fetchMessages = (chatRoomId, name, avatar, userFriendId) => {
    router.push({ pathname: '/ChatRoomMessage', params: { chatRoomId: chatRoomId, name : name, avatar : avatar, userFriendId : userFriendId } })
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#6C63FF" />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <>
          {/* Ô tìm kiếm */}
          <TextInput
            style={styles.searchInput}
            placeholder="Search..."
            placeholderTextColor="#999"
            value={searchInput}
            onChangeText={setSearchInput}
          />

          {/* Danh sách phòng chat */}
          <FlatList
            data={filteredChatRooms}
            keyExtractor={(item) => item.chatRoomId.toString()}
            renderItem={({ item }) => (
              <ChatRoomItem
                friendAvatarLink={item.avatar}
                friendName={item.name}
                lastMessage={item.lastMessage}
                selected={selectedChat?.chatRoomId === item.chatRoomId}
                onClick={() => {
                  setSelectedChat(item);
                  fetchMessages(item.chatRoomId, item.name, item.avatar, item.userId);
                }}
              />
            )}
            showsVerticalScrollIndicator={false}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    padding: 16,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  searchInput: {
    width: '100%',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f9f9f9',
    marginBottom: 16,
  },
});

export default ChatRooms;
