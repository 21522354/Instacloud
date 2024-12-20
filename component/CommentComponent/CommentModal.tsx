import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import CommentItem from './CommentItem'; 
import AntDesign from '@expo/vector-icons/AntDesign';

const CommentModal = ({ postId, visible, onClose }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    if (postId && visible) {
      fetchComments();
    }
  }, [postId, visible]);

  const sampleComments = [
    {
      id: '1',
      userId: '101',
      avatar: 'https://ispacedanang.edu.vn/wp-content/uploads/2024/05/hinh-anh-dep-ve-hoc-sinh-cap-3-1.jpg',
      nickName: 'JohnDoe',
      comment: 'This is the first comment.',
      isLiked: false,
      timeStamp: '6 hours',
    },
    {
      id: '2',
      userId: '102',
      avatar: 'https://ispacedanang.edu.vn/wp-content/uploads/2024/05/hinh-anh-dep-ve-hoc-sinh-cap-3-1.jpg',
      nickName: 'JaneSmith',
      comment: 'I love this post!',
      isLiked: true,
      timeStamp: '6 hours',
    },
    {
      id: '3',
      userId: '103',
      avatar: 'https://ispacedanang.edu.vn/wp-content/uploads/2024/05/hinh-anh-dep-ve-hoc-sinh-cap-3-1.jpg',
      nickName: 'AlexKing',
      comment: 'Amazing content!',
      isLiked: false,
      timeStamp: '6 hours',
    },
  ];

  const fetchComments = async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setComments(sampleComments);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendComment = () => {
    if (newComment.trim()) {
      // Here you can add API call to post the comment
      alert('Sending comment:'+ newComment);
      setNewComment(''); // Clear input after sending
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.close}>
            <Text style={styles.modalTitle}>Comments</Text>
            <TouchableOpacity onPress={onClose} style={styles.iconContainer}>
              <AntDesign name="close" size={30} color="white" />
            </TouchableOpacity>
          </View>

          {loading ? (
            <ActivityIndicator size="large" color="#2196F3" />
          ) : comments.length === 0 ? (
            <Text style={styles.noComments}>No comments found</Text>
          ) : (
            <View style={styles.commentsList}>
              {comments.map((item) => (
                <CommentItem
                  key={item.id}
                  userId={item.userId}
                  avatar={item.avatar}
                  nickName={item.nickName}
                  comment={item.comment}
                  isLiked={item.isLiked}
                  timeStamp={item.timeStamp}
                />
              ))}
            </View>
          )}

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Add a comment..."
              placeholderTextColor="#888"
              value={newComment}
              onChangeText={setNewComment}
              multiline
            />
            <TouchableOpacity 
              style={styles.sendButton}
              onPress={handleSendComment}
            >
              <AntDesign name="arrowup" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)', 
  },
  modalContent: {
    height: Dimensions.get('window').height * 0.74,
    backgroundColor: '#212121',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 10,
    paddingBottom: 60,
  },
  commentsList: {
    paddingBottom: 12,
    alignItems: 'flex-start',
    flex: 1,
  },
  noComments: {
    fontSize: 16,
    fontStyle: 'italic',
    color: 'gray',
    textAlign: 'center',
    marginTop: 20,
  },
  closeButton: {
    backgroundColor: '#212121',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  close: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#212121',
    paddingHorizontal: 10,
    paddingVertical: 5,
    position: 'relative',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  iconContainer: {
    position: 'absolute',
    right: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#333',
    backgroundColor: '#212121',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  input: {
    flex: 1,
    backgroundColor: '#333',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    color: 'white',
    marginRight: 10,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#2196F3',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CommentModal;
