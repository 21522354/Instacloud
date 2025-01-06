import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity, FlatList } from 'react-native';
import PostImage from '../../component/PostImage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HostNamePostService, HostNameUserService } from '@/config/config';
import { useRouter, useLocalSearchParams } from 'expo-router';

const SCREEN_WIDTH = Dimensions.get('window').width;

const UserDetail = () => {
  const [userProfile, setUserProfile] = useState({});
  const [posts, setPosts] = useState([]);
  const [numberOfFollowers, setNumberOfFollowers] = useState(0);
  const [numberOfFollowing, setNumberOfFollowing] = useState(0);
  const router = useRouter();
  const {userId} = useLocalSearchParams();

  const fetchUserProfile = async () => {
    try {
      const response = await fetch(`${HostNameUserService}/api/users/${userId}`);
      const data = await response.json();
      //console.log('User Profile Data:', data); // In ra dữ liệu phản hồi
      setUserProfile(data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const fetchFollowers = async () => {
    try {
      const response = await fetch(`${HostNameUserService}/api/users/followers/${userId}`);
      const data = await response.json();
      console.log(data);
      setNumberOfFollowers(data.length);
    } catch (error) {
      console.error('Error fetching followers:', error);
    }
  };

  const fetchFollowing = async () => {
    try {
      console.log("Go into fetch following");
      const response = await fetch(`${HostNameUserService}/api/users/following/${userId}`);
      const data = await response.json();
      console.log(data);
      setNumberOfFollowing(data.length);
    } catch (error) {
      console.error('Error fetching following:', error);
    }
  };

  const fetchPosts = async () => {
    try {
      const response = await fetch(`${HostNamePostService}/api/posts/personalPage/posts/${userId}`);
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  useEffect(() => {
    fetchUserProfile();
    fetchFollowers();
    fetchFollowing();
    fetchPosts();
  }, []);

  return (
    <View style={styles.outerContainer}>
      <View style={styles.container}>
        {/* Ảnh đại diện và thông tin tên */}
        <View style={styles.leftContainer}>
          {/* Ảnh đại diện */}
          <Image source={{ uri: userProfile.avatar }} style={styles.avatar} />

          {/* Thông tin tên */}
          <View style={styles.userInfo}>
            <Text style={styles.fullName}>{userProfile.fullName}</Text>
            <Text style={styles.nickName}>@{userProfile.nickName}</Text>
          </View>
        </View>

        <View style={styles.rightContainer}>
          {/* Thống kê */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{posts.length}</Text>
              <Text style={styles.statLabel}>Posts</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{numberOfFollowers}</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{numberOfFollowing}</Text>
              <Text style={styles.statLabel}>Following</Text>
            </View>
          </View>

          {/* Nút Follow và Chat */}
          <View style={styles.buttonsContainer}>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Follow</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Chat</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* FlatList */}
      <FlatList
        data={posts}
        renderItem={({ item }) => (
          <PostImage imageUrl={item.imageAndVideo[0]} postId={item.postId} />
        )}
        keyExtractor={(item) => item.postId}
        numColumns={3}
        contentContainerStyle={styles.gridContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    flexDirection: 'column', // Các phần tử nằm dọc
    backgroundColor: 'black',
  },
  container: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'flex-start', // Căn phần tử ở trên cùng
    backgroundColor: '#000', // Nền đen
  },
  leftContainer: {
    alignItems: 'center',
    marginRight: 16, // Khoảng cách bên phải để các thống kê không bị dính vào ảnh đại diện
  },
  rightContainer: {
    flex: 1, // Chiếm không gian còn lại
  },
  avatar: {
    width: SCREEN_WIDTH / 4,
    height: SCREEN_WIDTH / 4,
    borderRadius: SCREEN_WIDTH / 8,
    marginBottom: 8,
  },
  userInfo: {
    alignItems: 'center',
  },
  fullName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff', // Chữ trắng
  },
  nickName: {
    fontSize: 14,
    color: '#fff', // Chữ trắng
  },
  statsContainer: {
    marginTop: 30,
    flexDirection: 'row', // Căn phần tử thống kê nằm ngang
    alignItems: 'flex-start', // Căn thống kê ở trên cùng với avatar
  },
  statItem: {
    alignItems: 'center',
    marginRight: 20, // Khoảng cách giữa các phần tử thống kê
  },
  statNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff', // Chữ trắng
  },
  statLabel: {
    fontSize: 12,
    color: '#fff', // Chữ trắng
  },
  buttonsContainer: {
    flexDirection: 'row', // Các nút nằm ngang
    marginTop: 20,
  },
  button: {
    backgroundColor: '#1a73e8', // Màu nền nút
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 10, // Khoảng cách giữa các nút
  },
  buttonText: {
    color: '#fff', // Chữ nút trắng
    fontSize: 14,
    fontWeight: 'bold',
  },
  gridContainer: {
    marginTop: 10,
    backgroundColor: 'black',
  },
});

export default UserDetail;
