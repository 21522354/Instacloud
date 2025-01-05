import { StyleSheet, Text, View, TouchableOpacity, Animated } from 'react-native'
import React, { useState, useRef } from 'react'
import UserAvatar from 'component/UserComponent/UserAvatar';
import UserNickname from 'component/UserComponent/UserNickname';
import { AntDesign } from '@expo/vector-icons';
import { HostNamePostService } from 'src/config/config';

const CommentItem = ({ userId, avatar, nickName, comment, isLiked, timeStamp, numberOfLike, commentId, replyComment, onReply }) => {
    const [liked, setLiked] = useState(isLiked);
    const [likeCount, setLikeCount] = useState(numberOfLike);
    const [showReplies, setShowReplies] = useState(false);
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const handleLikePress = async () => {
        // Optimistically update the UI
        setLiked(!liked);
        setLikeCount(likeCount + (liked ? -1 : 1));

        try {
            const response = await fetch(`${HostNamePostService}/api/posts/likeComment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ commentId }),
            });

            if (!response.ok) {
                // Revert the UI changes if the API call fails
                setLiked(liked);
                setLikeCount(likeCount);
                console.error('Failed to update like status');
            }
        } catch (error) {
            // Revert the UI changes if there's an error
            setLiked(liked);
            setLikeCount(likeCount);
            console.error('Error toggling like:', error);
        }
    };

    const handleReplyPress = () => {
        Animated.sequence([
            Animated.timing(scaleAnim, {
                toValue: 0.95,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
            }),
        ]).start(() => onReply(commentId));
    };

    return (
      <View>
        <View style={styles.commentItem}>
          <UserAvatar avatar={avatar} userId={userId} />
          <View style={styles.commentContent}>
            <View style={styles.headerRow}>
              <UserNickname nickName={nickName} userId={userId} />
              <Text style={styles.timeStamp}>{timeStamp}</Text>
            </View>
            <Text style={styles.commentText}>{comment}</Text>
            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
              <TouchableOpacity onPress={handleReplyPress}>
                <Text style={styles.replyText}>Reply to this comment</Text>
              </TouchableOpacity>
            </Animated.View>
            {replyComment.length > 0 && !showReplies && (
              <TouchableOpacity onPress={() => setShowReplies(true)}>
                <Text style={styles.showMoreText}>
                  See {replyComment.length} {replyComment.length > 1 ? 'replies' : 'reply'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.likeContainer}>
            <TouchableOpacity 
              style={styles.likeButton}
              onPress={handleLikePress}
            >
              <AntDesign 
                name={liked ? "heart" : "hearto"} 
                size={25} 
                color={liked ? "white" : "white"} 
              />
            </TouchableOpacity>
            <Text style={styles.likeCount}>{likeCount}</Text>
          </View>
        </View>

        {showReplies && replyComment.map((reply) => (
          <View key={reply.commentId} style={styles.replyContainer}>
            <CommentItem
              userId={reply.userId}
              avatar={reply.avatar}
              nickName={reply.name}
              comment={reply.message}
              isLiked={false} // Assuming initial like status is false
              timeStamp="Just now" // Placeholder for timestamp
              numberOfLike={reply.numberOfLike}
              commentId={reply.commentId}
              replyComment={reply.replyComment}
              onReply={onReply}
            />
          </View>
        ))}
      </View>
    );
    
  };

export default CommentItem

const styles = StyleSheet.create({
    commentItem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      backgroundColor: '#212121',
      width: '100%',
      padding: 10,
      marginBottom: 5,
    },
    commentContent: {
      flexDirection: 'column',
      alignItems: 'flex-start',
      flex: 1,
    },
    commentText: {
      color: 'white',
      fontSize: 16,
      fontWeight: '300',
    },
    likeContainer: {
      alignItems: 'center',
      marginLeft: 10,
      marginTop: 15,
    },
    likeButton: {
      justifyContent: 'center',
    },
    likeCount: {
      color: 'white',
      fontSize: 14,
      marginTop: 5,
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    timeStamp: {
      color: '#888',
      fontSize: 12,
    },
    replyText: {
      color: '#888',
      fontSize: 14,
      marginTop: 5,
    },
    showMoreText: {
      color: '#2196F3',
      fontSize: 14,
      marginTop: 5,
    },
    replyContainer: {
      marginLeft: 40, // Indent replies
      marginTop: 5,
    },
  });