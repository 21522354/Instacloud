import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native'
import React from 'react'
import { useRouter, useLocalSearchParams } from 'expo-router';

const UserAvatar = ({userId, avatar}) => {
  const router = useRouter();
  return (
    <TouchableOpacity onPress={() => {
      router.push({ pathname: '/UserDetail', params: { userId : userId } });
    }}>
        <Image source={{ uri: avatar }} style={styles.avatar} />
    </TouchableOpacity>
  )
}

export default UserAvatar

const styles = StyleSheet.create({
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25, // Tạo hình tròn
        marginRight: 10,
      }
})