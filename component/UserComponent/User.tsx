import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import UserAvatar from './UserAvatar';
import UserNickname from './UserNickname';


const User = ({ userId, avatar, nickName }) => {
  return (
    <View style={styles.container}>
      <UserAvatar avatar={avatar} userId={userId}></UserAvatar>
      <UserNickname nickName={nickName} userId={userId}></UserNickname>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default User;
