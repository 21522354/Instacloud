import React, { useEffect, useRef, useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import MessageBubble from '../../component/MessageBubble';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HostNameChatService } from '@/config/config';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import { useSignalR } from '../contexts/SignalRContext';
import * as ImagePicker from 'expo-image-picker';

const ChatRoomMessage = () => {
  const router = useRouter();
  const { chatRoomId, name, avatar, userFriendId } = useLocalSearchParams(); // Lấy `chatRoomId` từ URL params
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const [myId, setMyId] = useState(null);
  const { connection } = useSignalR();

  useEffect(() => {
    // Lấy ID người dùng hiện tại từ AsyncStorage
    const fetchUserId = async () => {
      const userId = await AsyncStorage.getItem('userId');
      setMyId(userId);
    };

    fetchUserId();
  }, []);

  useEffect(() => {
    if (connection) {
      // Listen for new messages
      connection.on('ReceiveNotification', (message) => {
        console.log('Received message:', message);
        fetchMessages();
      });

      return () => {
        // Leave the chat room group when component unmounts
        connection.off('ReceiveNotification');
      };
    }
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await fetch(`${HostNameChatService}/api/chat/chatRooms/${chatRoomId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    // Gọi API khi component mount
    fetchMessages();
  }, [chatRoomId]);

  const handleSendMessage = async () => {
    if (newMessage.trim() === '') return;  // Kiểm tra nếu tin nhắn trống
  
    const messageData = {
      userSendId: myId, // userId từ AsyncStorage
      userReceiveId: userFriendId, // userFriendId (có thể lấy từ tham số hoặc state)
      message: newMessage, // Tin nhắn từ input
    };

    try {
      // Gửi yêu cầu POST đến API gửi tin nhắn
      const response = await fetch(`${HostNameChatService}/api/chat/sendText`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messageData),
      });
  
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
  
      // Sau khi gửi tin nhắn thành công, gọi lại fetchMessages để lấy tin nhắn mới nhất
      setNewMessage(''); // Xóa tin nhắn đã gửi từ input
      fetchMessages();   // Lấy tin nhắn mới nhất từ API
  
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleBack = () => {
    router.back(); // Quay lại trang trước đó
  };

  const pickImage = async () => {
    // Request permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }

    // Pick multiple images
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
      base64: true,
    });

    if (!result.canceled && result.assets.length > 0) {
      try {
        console.log('Uploading images to Imgur...');
        // Upload each image to Imgur and collect links
        const mediaLinks = await Promise.all(
          result.assets.map(async (asset) => {
            // Create form data for Imgur upload
            const formData = new FormData();
            formData.append('image', asset.base64);

            // Upload to Imgur
            const imgurResponse = await fetch('https://api.imgur.com/3/image', {
              method: 'POST',
              body: formData,
              headers: {
                'Authorization': 'Client-ID 546c25a59c58ad7',
              },
            });

            if (!imgurResponse.ok) {
              const errorData = await imgurResponse.text();
              console.error('Imgur upload failed:', errorData);
              throw new Error(`Failed to upload to Imgur: ${errorData}`);
            }

            const imgurData = await imgurResponse.json();
            console.log('Imgur upload successful:', imgurData.data.link);
            return imgurData.data.link;
          })
        );

        console.log('All images uploaded to Imgur. Media links:', mediaLinks);

        // Send media links to chat API
        const chatMediaPayload = {
          userSendId: myId,
          userReceiveId: userFriendId,
          Images: mediaLinks,
        };
        
        console.log('Sending to chat API:', chatMediaPayload);
        
        const chatMediaResponse = await fetch(`${HostNameChatService}/api/chat/sendMedia`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(chatMediaPayload),
        });

        // Refresh messages after sending
        fetchMessages();
      } catch (error) {
        console.error('Error processing images:', error);
        if (error.response) {
          console.error('Response data:', await error.response.text());
        }
        alert('Failed to send images. Please try again.');
      }
    }
  };

  if (loading || myId === null) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        {/* Nút Back */}
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Image
            source={require('../assets/icons/back-arrow.png')} // Thay thế bằng icon mũi tên quay lại của bạn
            style={styles.backIcon}
          />
        </TouchableOpacity>

        <Image
          source={{ uri: Array.isArray(avatar) ? avatar[0] : avatar }} // Kiểm tra nếu avatar là mảng, chỉ lấy phần tử đầu tiên
          style={styles.avatar}
        />

        <View>
          <Text style={styles.headerTitle}>{name}</Text>
          <Text style={styles.headerSubtitle}>Active now</Text>
        </View>
      </View>

      {/* Chat Messages */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.chatMessageId}
        renderItem={({ item }) => (
          <View
            style={[
              styles.messageContainer,
              item.userSendId === myId ? styles.messageRight : styles.messageLeft,
            ]}
          >
            <MessageBubble
              message={item}
              isOwn={item.userSendId === myId}
            />
          </View>
        )}
        contentContainerStyle={styles.messagesContainer}
        ref={messagesEndRef}
        onContentSizeChange={() => messagesEndRef.current?.scrollToEnd({ animated: true })}
      />

      {/* Message Input */}
      <View style={styles.inputContainer}>
        <TouchableOpacity onPress={pickImage}>
          <Image
            source={{ uri: 'https://img.icons8.com/?size=100&id=OJrV9fuCjUj0&format=png&color=000000' }}
            style={styles.icon}
          />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={newMessage}
          onChangeText={setNewMessage}
          onSubmitEditing={handleSendMessage}
        />
        <TouchableOpacity onPress={handleSendMessage} style={styles.sendButton}>
          <FontAwesome name="send-o" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'black',
  },
  backButton: {
    marginRight: 16,
  },
  backIcon: {
    width: 24,
    height: 24,
    tintColor: '#fff',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
  },
  messagesContainer: {
    padding: 16,
  },
  messageContainer: {
    marginBottom: 10,
    flexDirection: 'row',
  },
  messageRight: {
    alignSelf: 'flex-end',
    backgroundColor: 'black', // Màu nền cho tin nhắn của người dùng
  },
  messageLeft: {
    alignSelf: 'flex-start',
    backgroundColor: 'black', // Màu nền cho tin nhắn của người khác
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderTopWidth: 1,
    borderColor: '#ccc',
  },
  input: {
    flex: 1,
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    marginHorizontal: 8,
  },
  sendButton: {
    padding: 8,
    backgroundColor: '#4a90e2',
    borderRadius: 20,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  icon: {
    width: 24,
    height: 24,
  },
});

export default ChatRoomMessage;
