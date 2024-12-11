import Button from "component/Button";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from "react-native";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  const handleLogin = () => {
    // Xử lý logic đăng nhập tại đây
    router.replace("/home");
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
      <Button label="Log in" onPress={handleLogin}></Button>
    </View>
  );
}
