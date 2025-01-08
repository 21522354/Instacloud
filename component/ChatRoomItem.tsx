import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';

interface ChatRoomItemProps {
  friendAvatarLink: string;
  friendName: string;
  lastMessage: string;
  selected: boolean;
  onClick: () => void;
}

const ChatRoomItem = ({
  friendAvatarLink,
  friendName,
  lastMessage,
  selected,
  onClick,
}: ChatRoomItemProps) => {
  return (
    <TouchableOpacity
      onPress={onClick}
      style={[
        styles.container,
        selected ? styles.selectedContainer : styles.defaultContainer,
      ]}
    >
      <View style={styles.content}>
        {/* Avatar */}
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: friendAvatarLink }}
            style={[
              styles.avatar,
              selected ? styles.selectedAvatar : styles.defaultAvatar,
            ]}
          />
          <View style={styles.statusIndicator} />
        </View>

        {/* Info */}
        <View style={styles.infoContainer}>
          <View style={styles.header}>
            <Text
              style={[
                styles.friendName,
                selected ? styles.selectedFriendName : styles.defaultFriendName,
              ]}
              numberOfLines={1}
            >
              {friendName}
            </Text>
          </View>

          <Text
            style={[
              styles.lastMessage,
              selected ? styles.selectedLastMessage : styles.defaultLastMessage,
            ]}
            numberOfLines={1}
          >
            {lastMessage}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const SCREEN_WIDTH = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    padding: 12,
    borderRadius: 16,
    marginBottom: 8,
    width: SCREEN_WIDTH - 32,
    alignSelf: 'center',
  },
  defaultContainer: {
    backgroundColor: 'transparent',
  },
  selectedContainer: {
    backgroundColor: 'rgba(0, 128, 0, 0.1)',
    borderLeftWidth: 4,
    borderLeftColor: 'green',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  defaultAvatar: {
    borderWidth: 2,
    borderColor: 'lightgray',
  },
  selectedAvatar: {
    borderWidth: 2,
    borderColor: 'green',
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 10,
    height: 10,
    backgroundColor: 'green',
    borderRadius: 5,
    borderWidth: 2,
    borderColor: 'white',
  },
  infoContainer: {
    flex: 1,
    minWidth: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  friendName: {
    fontSize: 16,
    fontWeight: '500',
  },
  defaultFriendName: {
    color: 'gray',
  },
  selectedFriendName: {
    color: 'green',
  },
  timestamp: {
    fontSize: 12,
    color: 'gray',
  },
  lastMessage: {
    fontSize: 14,
  },
  defaultLastMessage: {
    color: 'gray',
  },
  selectedLastMessage: {
    color: 'green',
  },
});

export default ChatRoomItem;
