import React, { useState, useEffect } from 'react';
import { View, Image, TouchableOpacity, Modal, Text, Dimensions, Pressable, ScrollView, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import axios from 'axios';
import { HostNameStoryService } from '../src/config/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

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

export const StoryViewer = ({ onRefresh, router }: { onRefresh?: () => void, router: any }) => {
  const [stories, setStories] = useState<UserStory[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserStory | null>(null);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const screenWidth = Dimensions.get('window').width;

  const fetchStories = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId'); 
      const response = await axios.get(`${HostNameStoryService}/api/stories/user/${userId}`);
      setStories(response.data);
      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error('Error fetching stories:', error);
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

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
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        style={styles.scrollView}
      >
        <TouchableOpacity
          onPress={() => router.push('/createStory')}
          style={styles.storyButton}
        >
          <View style={[styles.imageContainer, styles.createStoryContainer]}>
            <Ionicons name="add-circle" size={24} color="#0095f6" />
          </View>
          <Text style={styles.username}>Create Story</Text>
        </TouchableOpacity>
        {stories.map((user) => (
          <TouchableOpacity
            key={user.userId}
            onPress={() => handleStoryPress(user)}
            style={styles.storyButton}
          >
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: user.avatar }}
                style={styles.avatar}
                resizeMode="cover"
              />
            </View>
            <Text style={styles.username}>{user.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Story Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          {selectedUser && (
            <>
              {/* Header */}
              <View style={styles.modalHeader}>
                <Image
                  source={{ uri: selectedUser.avatar }}
                  style={styles.modalAvatar}
                />
                <Text style={styles.modalUsername}>{selectedUser.name}</Text>
                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  style={styles.closeButton}
                >
                  <AntDesign name="close" size={24} color="white" />
                </TouchableOpacity>
              </View>

              {/* Story Content */}
              <View style={styles.storyContent}>
                <Image
                  source={{ uri: selectedUser.listStory[currentStoryIndex].image }}
                  style={[styles.storyImage, { width: screenWidth, height: screenWidth * 1.77 }]}
                  resizeMode="contain"
                />

                {/* Navigation Controls */}
                <View style={styles.navigationContainer}>
                  <Pressable
                    onPress={handlePrevious}
                    style={styles.navigationButton}
                  />
                  <Pressable
                    onPress={handleNext}
                    style={styles.navigationButton}
                  />
                </View>

                {/* Progress Bar */}
                <View style={styles.progressContainer}>
                  {selectedUser.listStory.map((_, index) => (
                    <View
                      key={index}
                      style={styles.progressBar}
                    >
                      <View
                        style={[
                          styles.progressIndicator,
                          { width: index <= currentStoryIndex ? '100%' : '0%' }
                        ]}
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

const styles = StyleSheet.create({
  container: {
    height: 96,
    backgroundColor: '#1f2937',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  storyButton: {
    alignItems: 'center',
    marginRight: 16,
    justifyContent: 'center',
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: '#ec4899',
    padding: 2,
  },
  username: {
    fontSize: 12,
    marginTop: 4,
    color: 'white',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    position: 'absolute',
    top: 0,
    zIndex: 10,
    width: '100%',
  },
  modalAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  modalUsername: {
    color: 'white',
    marginLeft: 8,
  },
  closeButton: {
    marginLeft: 'auto',
  },
  storyContent: {
    flex: 1,
    justifyContent: 'center',
  },
  storyImage: {
    resizeMode: 'contain',
  },
  navigationContainer: {
    flexDirection: 'row',
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  navigationButton: {
    width: '50%',
    height: '100%',
  },
  progressContainer: {
    flexDirection: 'row',
    position: 'absolute',
    top: 48,
    width: '100%',
    paddingHorizontal: 8,
  },
  progressBar: {
    flex: 1,
    height: 2,
    backgroundColor: '#4b5563',
    marginHorizontal: 2,
  },
  progressIndicator: {
    height: '100%',
    backgroundColor: 'white',
  },
  createStoryContainer: {
    backgroundColor: '#1f2937',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
