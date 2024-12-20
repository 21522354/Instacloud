import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import UserAvatar from 'component/UserComponent/UserAvatar';
import UserNickname from 'component/UserComponent/UserNickname';
import { AntDesign } from '@expo/vector-icons';

const CommentItem = ({ userId, avatar, nickName, comment, isLiked, timeStamp }) => {
    const [liked, setLiked] = useState(isLiked);

    const handleLikePress = () => {
        setLiked(prev => !prev);
        // Here you can add API call or callback to parent component if needed
    };

    return (
      <View style={styles.commentItem}>
        <UserAvatar avatar={avatar} userId={userId} />
        <View style={styles.commentContent}>
          <View style={styles.headerRow}>
            <UserNickname nickName={nickName} userId={userId} />
            <Text style={styles.timeStamp}>{timeStamp}</Text>
          </View>
          <Text style={styles.commentText}>{comment}</Text>
          <Text style={styles.replyText}>Reply to this comment</Text>
        </View>
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
      </View>
    );
    
  };

export default CommentItem

const styles = StyleSheet.create({
    commentItem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      backgroundColor: '#212121',
      width: '100%', // Đảm bảo chiếm hết chiều rộng
      padding: 10,
      marginBottom: 5,
    },
    commentContent: {
      flexDirection: 'column',
      alignItems: 'flex-start',
      flex: 1,
    },
    commentText: {
      color: 'white', // Đổi từ text-white vì nền là trắng
      fontSize: 16,
      fontWeight: '300',
    },
    likeButton: {
      marginLeft: 10,
      marginTop: 15,
      justifyContent: 'center',
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
  });