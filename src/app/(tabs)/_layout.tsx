import React from 'react'
import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import Entypo from '@expo/vector-icons/Entypo';
import Octicons from '@expo/vector-icons/Octicons';
import Feather from '@expo/vector-icons/Feather';

const TabLayout = () => {
    return (
        <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#ffff',
          headerStyle: {
            backgroundColor: '#25292e',
          },
          headerShown: false,
          headerShadowVisible: false,
          headerTintColor: 'white',
          tabBarStyle:{
            backgroundColor: 'black',
          },
          tabBarShowLabel: false,
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: 'none',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? 'home-sharp' : 'home-outline'} color={color} size={24} />
            ),
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            title: 'none',
            tabBarIcon: ({ color, focused }) => (
              <Entypo name={focused ? 'magnifying-glass' : 'magnifying-glass'} color={color} size={24} />
            ),
          }}
        />
        <Tabs.Screen
          name="addPost"
          options={{
            title: 'none',
            tabBarIcon: ({ color, focused }) => (
              <Octicons name={focused ? 'diff-added' : 'diff-added'} color={color} size={24} />
            ),
          }}
        />
        <Tabs.Screen
          name="reels"
          options={{
            title: 'none',
            tabBarIcon: ({ color, focused }) => (
              <Entypo name={focused ? 'video' : 'video'} color={color} size={24} />
            ),
          }}
        />
        <Tabs.Screen
          name="user"
          options={{
            title: 'none',
            tabBarIcon: ({ color, focused }) => (
              <Feather name={focused ? 'user' : 'user'} color={color} size={24} />
            ),
          }}
        />
      </Tabs>
      );
}

export default TabLayout