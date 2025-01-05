import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'

const UserNickname = ({userId, nickName}) => {
  return (
    <TouchableOpacity onPress={() => alert(`This user has id ${userId}`)}>
        <Text  className='font-bold text-lg text-white'>{nickName}</Text>
    </TouchableOpacity>
  )
}

export default UserNickname
