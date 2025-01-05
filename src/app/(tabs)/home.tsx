import React, { useState, useEffect } from "react";
import { View, FlatList, StyleSheet, ActivityIndicator, Text, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HostNamePostService } from 'src/config/config';
import PostItem from 'component/PostItem';
import { AntDesign, FontAwesome } from '@expo/vector-icons';

export default function Page() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        const response = await fetch(`${HostNamePostService}/api/posts/user/${userId}/feeds`);
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <View style={styles.container}>
      <Header />
      {loading ? (
        <ActivityIndicator size="large" color="#2196F3" />
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.postId}
          renderItem={({ item }) => <PostItem post={item} />}
        />
      )}
    </View>
  );
}

function Header() {
  const { top } = useSafeAreaInsets();
  return (
    <View style={[styles.header, { paddingTop: top, alignItems: 'center' }]}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 8, fontFamily: 'serif', color: 'white' }}>Instacloud</Text>
      <View style={styles.icons}>
        <TouchableOpacity style={styles.icon}>
          <AntDesign name="hearto" size={24} color="white" />
          <View style={styles.notificationDot} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.icon}>
          <FontAwesome name="send-o" size={24} color="white" />
          <View style={styles.notificationDot} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#000',
    paddingHorizontal: 16,
    height: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  icons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginLeft: 16,
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'red',
  },
});
