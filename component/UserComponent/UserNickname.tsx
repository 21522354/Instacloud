import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useRouter, useLocalSearchParams } from 'expo-router';

const UserNickname = ({userId, nickName}) => {
  const router = useRouter();
  return (
    <TouchableOpacity onPress={() => {
      router.push({ pathname: '/UserDetail', params: { userId : userId } });
    }}>
        <Text  className='font-bold text-lg text-white'>{nickName}</Text>
    </TouchableOpacity>
  )
}

export default UserNickname
