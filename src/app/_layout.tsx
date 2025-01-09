import "../global.css";
import { Stack } from "expo-router";
import { SignalRProvider } from "../contexts/SignalRContext";

export default function Layout() {
  return (
    <SignalRProvider>
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
        <Stack.Screen name="Followers" options={{
          headerShown: true,
          headerTitle: 'Followers',
          headerTintColor: 'white', // Màu trắng cho icon quay lại
          headerTitleStyle: { color: 'white' }, // Màu trắng cho tiêu đề
          headerStyle: { backgroundColor: 'black' } // Màu nền tiêu đề
        }}/>
        <Stack.Screen name="Following" options={{
          headerShown: true,
          headerTitle: 'Following',
          headerTintColor: 'white', // Màu trắng cho icon quay lại
          headerTitleStyle: { color: 'white' }, // Màu trắng cho tiêu đề
          headerStyle: { backgroundColor: 'black' } // Màu nền tiêu đề
        }}/>
        <Stack.Screen name="Notifications" options={{
          headerShown: true,
          headerTitle: 'Notifications',
          headerTintColor: 'white', // Màu trắng cho icon quay lại
          headerTitleStyle: { color: 'white' }, // Màu trắng cho tiêu đề
          headerStyle: { backgroundColor: 'black' } // Màu nền tiêu đề
        }}/>
         <Stack.Screen name="ChatRooms" options={{
          headerShown: true,
          headerTitle: 'ChatRooms',
          headerTintColor: 'white', // Màu trắng cho icon quay lại
          headerTitleStyle: { color: 'white' }, // Màu trắng cho tiêu đề
          headerStyle: { backgroundColor: 'black' } // Màu nền tiêu đề
        }}/>
        <Stack.Screen name="ChatRoomMessage" options={{
          headerShown: false,
          headerTitle: 'ChatRooms',
          headerTintColor: 'white', // Màu trắng cho icon quay lại
          headerTitleStyle: { color: 'white' }, // Màu trắng cho tiêu đề
          headerStyle: { backgroundColor: 'black' } // Màu nền tiêu đề
        }}/>
        <Stack.Screen name="selectImages" options={{
          headerShown: false,
          headerTitle: 'ChatRooms',
          headerTintColor: 'white', // Màu trắng cho icon quay lại
          headerTitleStyle: { color: 'white' }, // Màu trắng cho tiêu đề
          headerStyle: { backgroundColor: 'black' } // Màu nền tiêu đề
        }}/>
        <Stack.Screen name="createPost" options={{
          headerShown: false,
          headerTitle: 'selectImages',
          headerTintColor: 'white', // Màu trắng cho icon quay lại
          headerTitleStyle: { color: 'white' }, // Màu trắng cho tiêu đề
          headerStyle: { backgroundColor: 'black' } // Màu nền tiêu đề
        }}/>
        <Stack.Screen name="selectVideo" options={{
          headerShown: false,
          headerTitle: 'selectVideo',
          headerTintColor: 'white', // Màu trắng cho icon quay lại
          headerTitleStyle: { color: 'white' }, // Màu trắng cho tiêu đề
          headerStyle: { backgroundColor: 'black' } // Màu nền tiêu đề
        }}/>
        <Stack.Screen name="createReel" options={{
          headerShown: false,
          headerTitle: 'createReel',
          headerTintColor: 'white', // Màu trắng cho icon quay lại
          headerTitleStyle: { color: 'white' }, // Màu trắng cho tiêu đề
          headerStyle: { backgroundColor: 'black' } // Màu nền tiêu đề
        }}/>
        <Stack.Screen name="ReelDetail" options={{
          headerShown: false,
          headerTitle: 'ReelDetail',
          headerTintColor: 'white', // Màu trắng cho icon quay lại
          headerTitleStyle: { color: 'white' }, // Màu trắng cho tiêu đề
          headerStyle: { backgroundColor: 'black' } // Màu nền tiêu đề
        }}/>
        <Stack.Screen name="createStory" options={{
          headerShown: false,
          headerTitle: 'createStory',
          headerTintColor: 'white', // Màu trắng cho icon quay lại
          headerTitleStyle: { color: 'white' }, // Màu trắng cho tiêu đề
          headerStyle: { backgroundColor: 'black' } // Màu nền tiêu đề
        }}/>
        <Stack.Screen name="editStory" options={{
          headerShown: false,
          headerTitle: 'editStory',
          headerTintColor: 'white', // Màu trắng cho icon quay lại
          headerTitleStyle: { color: 'white' }, // Màu trắng cho tiêu đề
          headerStyle: { backgroundColor: 'black' } // Màu nền tiêu đề
        }}/>
      </Stack>
      
    </SignalRProvider>
  )
}
