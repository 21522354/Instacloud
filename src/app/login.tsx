import Button from "component/Button";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Alert,
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HostNameUserService } from 'src/config/config';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  const handleLogin = async () => {
    try {
      console.log("Login into the server");
      const response = await fetch(`${HostNameUserService}/api/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        await AsyncStorage.setItem('userId', data.userId);
        router.replace("/home");
      } else {
        Alert.alert('Login Failed', 'Please check your credentials and try again.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      Alert.alert('Error', 'An error occurred during login. Please try again later.');
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
        onChangeText={(text) => setEmail(text)}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        className="w-11/12 h-12 border border-gray-300 rounded-lg mb-6 px-3 text-lg bg-gray-100"
        placeholder="Password"
        value={password}
        onChangeText={(text) => setPassword(text)}
        secureTextEntry={true}
      />
      <TouchableOpacity
        className="w-11/12 h-12 bg-sky-500 rounded-lg flex items-center justify-center"
        onPress={handleLogin}
      >
        <Text className="text-white text-lg font-bold">Log in</Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="w-11/12 h-12 mt-4 bg-gray-300 rounded-lg flex items-center justify-center"
        onPress={() => router.push("/signup")}
      >
        <Text className="text-black text-lg font-bold">Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}
