import React, { useState, useEffect } from 'react';
import { View, Image, TouchableOpacity, Modal, Text, Dimensions, Pressable } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import axios from 'axios';
import { HostNameStoryService } from '../src/config/config';

interface Story {
  storyId: string;
  image: string;
  sound: string;
  createdDate: string;
}

interface UserStory {
  userId: string;
  name: string;
  avatar: string;
  index: number;
  listStory: Story[];
}

export const StoryViewer = () => {
  const [stories, setStories] = useState<UserStory[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserStory | null>(null);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const screenWidth = Dimensions.get('window').width;

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      const userId = "your-user-id"; // Replace with actual user ID
      const response = await axios.get(`${HostNameStoryService}/api/stories/user/${userId}`);
      setStories(response.data);
    } catch (error) {
      console.error('Error fetching stories:', error);
    }
  };

  const handleStoryPress = (user: UserStory) => {
    setSelectedUser(user);
    setCurrentStoryIndex(0);
    setModalVisible(true);
  };

  const handleNext = () => {
    if (selectedUser && currentStoryIndex < selectedUser.listStory.length - 1) {
      setCurrentStoryIndex(prev => prev + 1);
    } else {
      // Move to next user's stories if available
      const currentUserIndex = stories.findIndex(user => user.userId === selectedUser?.userId);
      if (currentUserIndex < stories.length - 1) {
        setSelectedUser(stories[currentUserIndex + 1]);
        setCurrentStoryIndex(0);
      } else {
        setModalVisible(false);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(prev => prev - 1);
    } else {
      // Move to previous user's stories if available
      const currentUserIndex = stories.findIndex(user => user.userId === selectedUser?.userId);
      if (currentUserIndex > 0) {
        setSelectedUser(stories[currentUserIndex - 1]);
        setCurrentStoryIndex(stories[currentUserIndex - 1].listStory.length - 1);
      }
    }
  };

  return (
    <View className="mt-4">
      {/* Stories List */}
      <View className="flex-row px-4 space-x-4">
        {stories.map((user) => (
          <TouchableOpacity
            key={user.userId}
            onPress={() => handleStoryPress(user)}
            className="items-center"
          >
            <View className="w-16 h-16 rounded-full border-2 border-pink-500 p-0.5">
              <Image
                source={{ uri: user.avatar }}
                className="w-full h-full rounded-full"
              />
            </View>
            <Text className="text-xs mt-1">{user.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Story Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 bg-black">
          {selectedUser && (
            <>
              {/* Header */}
              <View className="flex-row items-center p-4 absolute top-0 z-10 w-full">
                <Image
                  source={{ uri: selectedUser.avatar }}
                  className="w-8 h-8 rounded-full"
                />
                <Text className="text-white ml-2">{selectedUser.name}</Text>
                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  className="ml-auto"
                >
                  <AntDesign name="close" size={24} color="white" />
                </TouchableOpacity>
              </View>

              {/* Story Content */}
              <View className="flex-1 justify-center">
                <Image
                  source={{ uri: selectedUser.listStory[currentStoryIndex].image }}
                  style={{ width: screenWidth, height: screenWidth * 1.77 }}
                  resizeMode="contain"
                />

                {/* Navigation Controls */}
                <View className="flex-row absolute w-full h-full">
                  <Pressable
                    onPress={handlePrevious}
                    className="w-1/2 h-full"
                  />
                  <Pressable
                    onPress={handleNext}
                    className="w-1/2 h-full"
                  />
                </View>

                {/* Progress Bar */}
                <View className="flex-row absolute top-12 w-full px-2">
                  {selectedUser.listStory.map((_, index) => (
                    <View
                      key={index}
                      className="flex-1 h-0.5 bg-gray-500 mx-0.5"
                    >
                      <View
                        className={`h-full bg-white ${
                          index <= currentStoryIndex ? 'w-full' : 'w-0'
                        }`}
                      />
                    </View>
                  ))}
                </View>
              </View>
            </>
          )}
        </View>
      </Modal>
    </View>
  );
};
