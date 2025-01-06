import "../global.css";
import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="login" options={{headerShown:false}} />
      <Stack.Screen name="signup" options={{headerShown:false}} />
      <Stack.Screen name="(tabs)" options={{headerShown:false}} />
      <Stack.Screen name="PostDetail" options={{headerShown:false}} />
      <Stack.Screen name="index" options={{headerShown:false}} />
      <Stack.Screen name="UserDetail" options={{
        headerShown: true,
        headerTitle: 'User Detail',
        headerTintColor: 'white', // Màu trắng cho icon quay lại
        headerTitleStyle: { color: 'white' }, // Màu trắng cho tiêu đề
        headerStyle: { backgroundColor: 'black' } // Màu nền tiêu đề
      }}/>
    </Stack>
  )
}
