import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';

type UserProps = {
  userId: string;
  avatar: string;
  nickName: string;
  onAvatarPress?: () => void; // Sự kiện nhấn vào avatar
};

const User = ({ userId, avatar, nickName, onAvatarPress }: UserProps) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => onAvatarPress()}>
        <Image source={{ uri: avatar }} style={styles.avatar} />
      </TouchableOpacity>
      <Text style={styles.nickName}>{nickName}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25, // Tạo hình tròn
    marginRight: 10,
  },
  nickName: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default User;
