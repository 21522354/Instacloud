import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity, FlatList } from 'react-native';
import PostImage from '../../component/PostImage';
import PostVideo from '../../component/PostVideo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HostNamePostService, HostNameUserService } from '@/config/config';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const SCREEN_WIDTH = Dimensions.get('window').width;

const UserDetail = () => {
  const [userProfile, setUserProfile] = useState({});
  const [posts, setPosts] = useState([]);
  const [reels, setReels] = useState([]);
  const [numberOfFollowers, setNumberOfFollowers] = useState(0);
  const [numberOfFollowing, setNumberOfFollowing] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [myId, setMyId] = useState('');
  const [activeTab, setActiveTab] = useState('posts');
  const router = useRouter();
  const { userId } = useLocalSearchParams();

  useEffect(() => {
    const fetchUserId = async () => {
      const id = await AsyncStorage.getItem("userId");
      setMyId(id);
    };

    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`${HostNameUserService}/api/users/${userId}`);
        const data = await response.json();
        setUserProfile(data);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    const fetchFollowers = async () => {
      try {
        const response = await fetch(`${HostNameUserService}/api/users/followers/${userId}`);
        const data = await response.json();
        const myId = await AsyncStorage.getItem("userId");
        setIsFollowing(data.some(follower => follower.userId === myId));
        setNumberOfFollowers(data.length);
      } catch (error) {
        console.error('Error fetching followers:', error);
      }
    };

    const fetchFollowing = async () => {
      try {
        const response = await fetch(`${HostNameUserService}/api/users/following/${userId}`);
        const data = await response.json();
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

    const fetchReels = async () => {
      try {
        const response = await fetch(`${HostNamePostService}/api/posts/personalPage/reels/${userId}`);
        const data = await response.json();
        setReels(data);
      } catch (error) {
        console.error('Error fetching reels:', error);
      }
    };

    fetchUserId();
    fetchUserProfile();
    fetchFollowers();
    fetchFollowing();
    fetchPosts();
    fetchReels();
  }, []);

  const handleFollow = async () => {
    try {
      const endpoint = isFollowing
        ? `${HostNameUserService}/api/users/unFollow`
        : `${HostNameUserService}/api/users/follow`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          selfId: myId,
          userFollowId: userId,
        }),
      });

      if (response.ok) {
        setIsFollowing(!isFollowing);
      } else {
        console.error('Error following/unfollowing user:', response.statusText);
      }
    } catch (error) {
      console.error('Error following/unfollowing user:', error);
    }
  };

  const handleFollowersPress = () => {
    router.push({ pathname: '/Followers', params: { userId: userId } });
  };

  const handleFollowingPress = () => {
    router.push({ pathname: '/Following', params: { userId: userId } });
  };

  const renderContent = () => {
    const data = activeTab === 'posts' ? posts : reels;
    return (
      <FlatList
        data={data}
        renderItem={({ item }) =>
          activeTab === 'posts' ? (
            <PostImage imageUrl={item.imageAndVideo[0]} postId={item.postId} />
          ) : (
            <PostVideo videoUrl={item.imageAndVideo[0]} postId={item.postId} />
          )
        }
        keyExtractor={(item) => item.postId}
        numColumns={3}
        contentContainerStyle={styles.gridContainer}
      />
    );
  };

  return (
    <View style={styles.outerContainer}>
      <View style={styles.container}>
        <View style={styles.leftContainer}>
          <Image source={{ uri: userProfile.avatar }} style={styles.avatar} />
          <View style={styles.userInfo}>
            <Text style={styles.fullName}>{userProfile.fullName}</Text>
            <Text style={styles.nickName}>@{userProfile.nickName}</Text>
          </View>
        </View>

        <View style={styles.rightContainer}>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{posts.length + reels.length}</Text>
              <Text style={styles.statLabel}>Posts</Text>
            </View>
            <TouchableOpacity style={styles.statItem} onPress={handleFollowersPress}>
              <Text style={styles.statNumber}>{numberOfFollowers}</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.statItem} onPress={handleFollowingPress}>
              <Text style={styles.statNumber}>{numberOfFollowing}</Text>
              <Text style={styles.statLabel}>Following</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={[styles.button, isFollowing && styles.followingButton]}
              onPress={handleFollow}
            >
              <Text style={[styles.buttonText, isFollowing && styles.followingButtonText]}>
                {isFollowing ? 'Following' : 'Follow'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Chat</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'posts' && styles.activeTab]}
          onPress={() => setActiveTab('posts')}
        >
          <Ionicons
            name="grid-outline"
            size={24}
            color={activeTab === 'posts' ? '#fff' : '#666'}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'reels' && styles.activeTab]}
          onPress={() => setActiveTab('reels')}
        >
          <Ionicons
            name="play-circle-outline"
            size={24}
            color={activeTab === 'reels' ? '#fff' : '#666'}
          />
        </TouchableOpacity>
      </View>

      {/* Content */}
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  container: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'flex-start',
    backgroundColor: '#000',
  },
  leftContainer: {
    alignItems: 'center',
    marginRight: 16,
  },
  rightContainer: {
    flex: 1,
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
    color: '#fff',
  },
  nickName: {
    fontSize: 14,
    color: '#fff',
  },
  statsContainer: {
    marginTop: 30,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  statItem: {
    alignItems: 'center',
    marginRight: 20,
  },
  statNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  statLabel: {
    fontSize: 12,
    color: '#fff',
  },
  buttonsContainer: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 10,
  },
  button: {
    flex: 1,
    backgroundColor: '#1a73e8',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  followingButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#1a73e8',
  },
  followingButtonText: {
    color: '#1a73e8',
  },
  tabContainer: {
    flexDirection: 'row',
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: '#333',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#fff',
  },
  gridContainer: {
    marginTop: 10,
    backgroundColor: 'black',
  },
});

export default UserDetail;
