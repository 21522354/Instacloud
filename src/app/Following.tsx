import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { HostNameUserService } from '@/config/config';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import User from 'component/UserComponent/User';

const Following = () => {
  const [followers, setFollowers] = useState([]);
  const router = useRouter();
  const { userId } = useLocalSearchParams();

  useEffect(() => {
    const fetchFollowers = async () => {
      try {
        const response = await fetch(`${HostNameUserService}/api/users/following/${userId}`);
        const data = await response.json();
        setFollowers(data);
      } catch (error) {
        console.error('Error fetching followers:', error);
      }
    };

    fetchFollowers();
  }, [userId]);

  const renderItem = ({ item }) => (
    <View style={styles.userContainer}>
      <Text style={styles.userName}>{item.userName}</Text>
      <User userId={item.userId} avatar={item.avatar} nickName={item.nickName}></User>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={followers}
        renderItem={renderItem}
        keyExtractor={(item) => item.userId}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'flex-start'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    margin: 16,
  },
  userContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  userName: {
    fontSize: 18,
  },
});

export default Following;