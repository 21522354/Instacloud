import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native'
import React from 'react'

const UserAvatar = ({userId, avatar}) => {
  return (
    <TouchableOpacity onPress={() => alert(`This user has id is ${userId}`)}>
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