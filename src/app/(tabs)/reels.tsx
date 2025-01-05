import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Dimensions,
  StyleSheet,
  FlatList,
  TouchableWithoutFeedback,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { ResizeMode, Video } from 'expo-av';
import User from 'component/UserComponent/User';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import CommentModal from 'component/CommentComponent/CommentModal';
import { HostNamePostService } from 'src/config/config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Reels = () => {
  const videoRefs = useRef([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [data, setData] = useState([]);
  const [pausedVideoIndex, setPausedVideoIndex] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [videoStatus, setVideoStatus] = useState({});
  const [userId, setUserId] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        if (storedUserId) {
          setUserId(storedUserId);
          fetchReels(storedUserId, 1);
        }
      } catch (error) {
        console.error('Error retrieving userId:', error);
      }
    };

    fetchUserId();
  }, []);

  const fetchReels = async (userId, page) => {
    try {
      const response = await fetch(`${HostNamePostService}/api/posts/reels/${userId}?page=${page}`);
      const reelsData = await response.json();
      setData((prevData) => [...prevData, ...reelsData]);
    } catch (error) {
      console.error('Error fetching reels:', error);
    } finally {
      setLoadingMore(false);
    }
  };

  const loadMoreReels = () => {
    if (!loadingMore) {
      setLoadingMore(true);
      setPage((prevPage) => {
        const nextPage = prevPage + 1;
        fetchReels(userId, nextPage);
        return nextPage;
      });
    }
  };

  const toggleLike = async (index) => {
    const postId = data[index].postId;
    try {
      const response = await fetch(`${HostNamePostService}/api/posts/likePost`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ postId, userId }),
      });

      if (response.ok) {
        const updatedData = [...data];
        updatedData[index].isLike = !updatedData[index].isLike;
        updatedData[index].numberOfLike += updatedData[index].isLike ? 1 : -1;
        setData(updatedData);
      } else {
        console.error('Failed to update like status');
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedPostId(null);
  };

  const openModal = (postId) => {
    setSelectedPostId(postId);
    setModalVisible(true);
  };

  const handlePress = async (index) => {
    const video = videoRefs.current[index];
    const status = await video.getStatusAsync();
    if (status.isPlaying) {
      video.pauseAsync();
      setPausedVideoIndex(index);
    } else {
      video.playAsync();
      setPausedVideoIndex(null);
    }
  };

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      const index = viewableItems[0].index;
      setCurrentIndex(index);
    }
  }).current;

  const renderItem = ({ item, index }) => (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={() => handlePress(index)}>
        <Video
          ref={(ref) => (videoRefs.current[index] = ref)}
          source={{ uri: item.imageAndVideo[0] }}
          style={styles.video}
          resizeMode={ResizeMode.COVER}
          shouldPlay={index === currentIndex}
          isLooping
          useNativeControls={false}
          onPlaybackStatusUpdate={(status) => {
            if (status.isLoaded) {
              setVideoStatus((prev) => ({
                ...prev,
                [index]: {
                  currentTime: status.positionMillis,
                  duration: status.durationMillis,
                },
              }));
            }
          }}
        />
      </TouchableWithoutFeedback>

      {videoStatus[index] && (
        <View style={styles.progressBarContainer}>
          <View
            style={[
              styles.progressBar,
              {
                width: `${
                  (videoStatus[index].currentTime / videoStatus[index].duration) * 100
                }%`,
              },
            ]}
          />
          <Text style={styles.progressText}>
            {new Date(videoStatus[index].currentTime).toISOString().substr(14, 5)} /{' '}
            {new Date(videoStatus[index].duration).toISOString().substr(14, 5)}
          </Text>
        </View>
      )}

      {pausedVideoIndex === index && (
        <View style={styles.playIconContainer}>
          <AntDesign name="playcircleo" size={60} color="white" style={{ opacity: 0.6 }} />
        </View>
      )}

      <View className="absolute right-2 top-1/2 flex-col">
        <TouchableOpacity onPress={() => toggleLike(index)}>
          <AntDesign name={item.isLike ? 'heart' : 'hearto'} size={40} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-sm text-center">{item.numberOfLike}</Text>
        <TouchableOpacity onPress={() => openModal(item.postId)}>
          <FontAwesome className="mt-4" name="commenting-o" size={40} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-sm text-center">{item.numberOfComment}</Text>
      </View>

      <View style={styles.userContainer}>
        <User
          userId={item.userId}
          avatar={item.avatar}
          nickName={item.nickName}
        />
        <Text className="text-white text-sm ms-6 mt-4">{item.postTitle}</Text>
      </View>
      <CommentModal
        postId={selectedPostId}
        visible={modalVisible}
        onClose={closeModal}
      />
    </View>
  );

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.postId}
      renderItem={renderItem}
      pagingEnabled
      horizontal={false}
      showsVerticalScrollIndicator={false}
      snapToInterval={Dimensions.get('window').height}
      snapToAlignment="start"
      decelerationRate="fast"
      onViewableItemsChanged={onViewableItemsChanged}
      viewabilityConfig={{
        itemVisiblePercentThreshold: 50,
      }}
      onEndReached={loadMoreReels}
      onEndReachedThreshold={0.5}
      ListFooterComponent={loadingMore ? <ActivityIndicator size="large" color="#2196F3" /> : null}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    backgroundColor: 'black',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  playIconContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -25 }, { translateY: -25 }],
    zIndex: 10,
  },
  userContainer: {
    position: 'absolute',
    left: 20,
    bottom: 70,
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  progressBarContainer: {
    position: 'absolute',
    bottom: 50,
    left: 1,
    right: 1,
    height: 5,
    backgroundColor: '#555',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#ffff',
  },
  progressText: {
    color: 'white',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 5,
  },
});

export default Reels;
