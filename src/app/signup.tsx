import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HostNameUserService } from 'src/config/config';

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [fullName, setFullName] = useState("");

  const router = useRouter();

  const handleSignup = async () => {
    if (!email || !password || !nickname || !fullName) {
      Alert.alert('Validation Error', 'All fields are required.');
      return;
    }

    try {
      const response = await fetch(`${HostNameUserService}/api/users/SignUp2`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, fullName, nickName: nickname }),
      });

      if (response.ok) {
        const data = await response.json();
        await AsyncStorage.setItem('userId', data.userId);
        Alert.alert('Signup Successful', 'Welcome to Instacloud!');
        router.replace("/home");
      } else {
        const errorMessage = await response.text();
        Alert.alert('Signup Failed', errorMessage);
      }
    } catch (error) {
      console.error('Error during signup:', error);
      Alert.alert('Error', 'An error occurred during signup. Please try again later.');
    }
  };

  return (
    <View className="flex-1 items-center justify-center bg-white px-4">
      <Text className="text-4xl font-bold mb-8 font-serif text-black">
        Instacloud
      </Text>
      <TextInput
        className="w-11/12 h-12 border border-gray-300 rounded-lg mb-4 px-3 text-lg bg-gray-100"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        className="w-11/12 h-12 border border-gray-300 rounded-lg mb-4 px-3 text-lg bg-gray-100"
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
      />
      <TextInput
        className="w-11/12 h-12 border border-gray-300 rounded-lg mb-4 px-3 text-lg bg-gray-100"
        placeholder="Nickname"
        value={nickname}
        onChangeText={setNickname}
      />
      <TextInput
        className="w-11/12 h-12 border border-gray-300 rounded-lg mb-6 px-3 text-lg bg-gray-100"
        placeholder="Full Name"
        value={fullName}
        onChangeText={setFullName}
      />
      <TouchableOpacity
        className="w-11/12 h-12 bg-sky-500 rounded-lg flex items-center justify-center"
        onPress={handleSignup}
      >
        <Text className="text-white text-lg font-bold">Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
} 