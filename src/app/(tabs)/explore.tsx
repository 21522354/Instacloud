import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  FlatList,
  Dimensions,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import PostImage from '../../../component/PostImage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HostNamePostService } from '@/config/config';
import { useFocusEffect } from 'expo-router';

const SCREEN_WIDTH = Dimensions.get('window').width;

const Explore = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const fetchPosts = async () => {
    setLoading(true);
    try {
      const userId = await AsyncStorage.getItem('userId');
      const response = await fetch(`${HostNamePostService}/api/posts/explore/${userId}`);
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);
  
  useFocusEffect(
    useCallback(() => {
      fetchPosts();
    }, [])
  );


  return (
    <SafeAreaView style={styles.container}>
      {/* Thanh tìm kiếm */}
      <View style={styles.searchBar}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search posts..."
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity
          style={styles.searchIcon}
          onPress={() => console.log('Search query:', searchQuery)}
        >
          <FontAwesome name="search" size={20} color="#888" />
        </TouchableOpacity>
      </View>

      {/* Lưới bài post */}
      <FlatList
        data={posts}
        renderItem={({ item }) => (
          <PostImage imageUrl={item.imageAndVideo[0]} postId={item.postId} />
        )}
        keyExtractor={(item) => item.postId}
        numColumns={3}
        contentContainerStyle={styles.gridContainer}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // Nền tối
  },
  searchBar: {
    flexDirection: 'row', // Đặt icon kính lúp cạnh TextInput
    alignItems: 'center',
    backgroundColor: '#1e1e1e',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  searchInput: {
    flex: 1,
    height: 40,
    backgroundColor: '#333',
    borderRadius: 8,
    paddingHorizontal: 10,
    color: '#fff',
  },
  searchIcon: {
    marginLeft: 10,
  },
  gridContainer: {
    paddingTop: 10,
    paddingHorizontal: 2,
  },
});

export default Explore;
