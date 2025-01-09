import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HostNameStoryService } from '@/config/config';

export default function EditStory() {
  const { imageUrl } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const [brightness, setBrightness] = useState(0);
  const [filter, setFilter] = useState('none');

  const createStory = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const response = await fetch(`${HostNameStoryService}/api/stories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          image: imageUrl,
          sound: 'abcd',
          isSaved: false
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create story');
      }

      router.push('/home');
    } catch (error) {
      console.error('Error creating story:', error);
      throw error;
    }
  };

  const handleCreate = async () => {
    setLoading(true);
    try {
      await createStory();
    } catch (error) {
      console.error('Error in story creation:', error);
      // You might want to show an error message to the user here
    } finally {
      setLoading(false);
    }
  };

  const adjustBrightness = (direction: 'up' | 'down') => {
    setBrightness(prev => {
      const newValue = direction === 'up' ? prev + 10 : prev - 10;
      return Math.max(-100, Math.min(100, newValue));
    });
  };

  const toggleFilter = () => {
    setFilter(prev => prev === 'none' ? 'grayscale' : 'none');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>Edit Story</Text>
        <TouchableOpacity 
          onPress={handleCreate}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#0095f6" />
          ) : (
            <Text style={styles.createButton}>Create</Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: imageUrl as string }} 
          style={[
            styles.image,
            { opacity: 1 + brightness / 100 },
            filter === 'grayscale' && styles.grayscale
          ]} 
        />
      </View>

      <View style={styles.toolsContainer}>
        <TouchableOpacity 
          style={styles.tool} 
          onPress={() => adjustBrightness('up')}
        >
          <Ionicons name="sunny" size={24} color="white" />
          <Text style={styles.toolText}>Brightness +</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.tool} 
          onPress={() => adjustBrightness('down')}
        >
          <Ionicons name="moon" size={24} color="white" />
          <Text style={styles.toolText}>Brightness -</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.tool} 
          onPress={toggleFilter}
        >
          <Ionicons name="color-filter" size={24} color="white" />
          <Text style={styles.toolText}>
            {filter === 'none' ? 'Add Filter' : 'Remove Filter'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  createButton: {
    color: '#0095f6',
    fontWeight: 'bold',
    fontSize: 16,
  },
  imageContainer: {
    flex: 1,
    padding: 20,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  grayscale: {
    filter: 'grayscale(100%)',
  },
  toolsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  tool: {
    alignItems: 'center',
  },
  toolText: {
    color: 'white',
    marginTop: 8,
  },
});
