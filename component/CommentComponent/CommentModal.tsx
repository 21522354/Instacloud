import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  TextInput,
  ScrollView,
} from 'react-native';
import CommentItem from './CommentItem'; 
import AntDesign from '@expo/vector-icons/AntDesign';
import { HostNamePostService } from 'src/config/config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CommentModal = ({ postId, visible, onClose }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [replyToCommentId, setReplyToCommentId] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (postId && visible) {
      fetchComments();
    }
  }, [postId, visible]);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${HostNamePostService}/api/posts/${postId}/comments`);
      const commentsData = await response.json();
      setComments(commentsData);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendComment = async () => {
    if (newComment.trim()) {
      try {
        const userId = await AsyncStorage.getItem('userId');
        const endpoint = replyToCommentId
          ? `${HostNamePostService}/api/posts/replyComment`
          : `${HostNamePostService}/api/posts/commentPost`;

        const body = replyToCommentId
          ? {
              commentId: replyToCommentId,
              postId,
              userId,
              message: newComment,
            }
          : {
              postId,
              userId,
              message: newComment,
            };

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        });

        if (response.ok) {
          setNewComment(''); // Clear input after sending
          setReplyToCommentId(null); // Reset reply state
          fetchComments(); // Refresh comments
        } else {
          console.error('Failed to post comment');
        }
      } catch (error) {
        console.error('Error posting comment:', error);
      }
    }
  };

  const handleReply = (commentId) => {
    setReplyToCommentId(commentId);
    inputRef.current.focus();
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
            <ScrollView contentContainerStyle={styles.commentsList}>
              {comments.map((item) => (
                <CommentItem
                  replyComment={item.replyComment}
                  key={item.commentId}
                  userId={item.userId}
                  avatar={item.avatar}
                  nickName={item.name}
                  comment={item.message}
                  isLiked={false} // Assuming initial like status is false
                  timeStamp="Just now" // Placeholder for timestamp
                  numberOfLike={item.numberOfLike} // Pass number of likes
                  commentId={item.commentId}
                  onReply={handleReply}
                />
              ))}
            </ScrollView>
          )}

          <View style={styles.inputContainer}>
            <TextInput
              ref={inputRef}
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
    flexGrow: 1,
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
