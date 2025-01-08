import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const MessageBubble = ({ message, isOwn }) => {
  return (
    <View
      style={[
        styles.container,
        isOwn ? styles.ownMessageContainer : styles.otherMessageContainer,
      ]}
    >
      {/* Avatar của người gửi nếu không phải tin nhắn của chính mình */}
      {!isOwn && (
        <Image source={{ uri: message.avatar }} style={styles.avatar} />
      )}

      <View
        style={[
          styles.messageBubble,
          isOwn ? styles.ownMessageBubble : styles.otherMessageBubble,
        ]}
      >
        {message.type === 'Text' ? (
          <Text
            style={[
              styles.messageText,
              isOwn ? styles.ownMessageText : styles.otherMessageText,
            ]}
          >
            {message.message}
          </Text>
        ) : (
          <Image
            source={{ uri: message.mediaLink }}
            style={styles.media}
            resizeMode="cover"
          />
        )}
      </View>

      {/* Avatar của chính mình nếu là tin nhắn của mình */}
      {isOwn && (
        <Image source={{ uri: message.avatar }} style={styles.avatar} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginVertical: 4,
  },
  ownMessageContainer: {
    justifyContent: 'flex-end',
  },
  otherMessageContainer: {
    justifyContent: 'flex-start',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginHorizontal: 8,
  },
  messageBubble: {
    maxWidth: '75%',
    padding: 12,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  ownMessageBubble: {
    backgroundColor: '#6C63FF', // Gradient-like màu
    alignSelf: 'flex-end',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    borderTopLeftRadius: 16,
  },
  otherMessageBubble: {
    backgroundColor: '#E0E0E0',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    borderTopRightRadius: 16,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 18,
  },
  ownMessageText: {
    color: '#FFFFFF',
  },
  otherMessageText: {
    color: '#333333',
  },
  media: {
    width: 200,
    height: 150,
    borderRadius: 8,
  },
});

export default MessageBubble;
