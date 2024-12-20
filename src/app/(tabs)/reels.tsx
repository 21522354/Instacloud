import React, { useRef, useState } from 'react';
import {
  View,
  Dimensions,
  StyleSheet,
  FlatList,
  TouchableWithoutFeedback,
  Text,
  TouchableOpacity
} from 'react-native';
import { ResizeMode, Video } from 'expo-av';
import User from 'component/UserComponent/User'; // Đảm bảo đúng đường dẫn file User
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5'; // Thêm FontAwesome5 cho biểu tượng Play
import CommentModal from 'component/CommentComponent/CommentModal';

const Reels = () => {
  const videoData = [
    {
      postId: "06d9ab58-555a-4d04-b635-8901a26252c7",
      userId: "e0be4a36-67cd-4dd6-be48-8b800c3123d1",
      nickName: "nva_123",
      avatar: "https://ispacedanang.edu.vn/wp-content/uploads/2024/05/hinh-anh-dep-ve-hoc-sinh-cap-3-1.jpg",
      postTitle: "Post Title 1",
      createdDate: "2024-12-17T01:40:09.7500805",
      videoSource: "https://cdn.pixabay.com/video/2023/01/30/148594-794221537_tiny.mp4",
      listHagtags: [],
      numberOfLike: 5,
      numberOfComment: 10,
      numberOfShare: 0,
      isLike: true,
    },
    {
      postId: "06d9ab58-555a-4d04-b635-8901a26252c8",
      userId: "e0be4a36-67cd-4dd6-be48-8b800c3123d1",
      nickName: "nva_123",
      avatar: "https://ispacedanang.edu.vn/wp-content/uploads/2024/05/hinh-anh-dep-ve-hoc-sinh-cap-3-1.jpg",
      postTitle: "Post Title 2",
      createdDate: "2024-12-17T01:40:09.7500805",
      videoSource: "https://cdn.pixabay.com/video/2023/01/30/148594-794221537_tiny.mp4",
      listHagtags: [],
      numberOfLike: 5,
      numberOfComment: 10,
      numberOfShare: 0,
      isLike: false,
    },
    {
      postId: "06d9ab58-555a-4d04-b635-8901a26252c3",
      userId: "e0be4a36-67cd-4dd6-be48-8b800c3123d1",
      nickName: "nva_123",
      avatar: "https://ispacedanang.edu.vn/wp-content/uploads/2024/05/hinh-anh-dep-ve-hoc-sinh-cap-3-1.jpg",
      postTitle: "Post Title 3",
      createdDate: "2024-12-17T01:40:09.7500805",
      videoSource: "https://cdn.pixabay.com/video/2023/01/30/148594-794221537_tiny.mp4",
      listHagtags: [],
      numberOfLike: 5,
      numberOfComment: 10,
      numberOfShare: 0,
      isLike: false,
    },
  ];

  const videoRefs = useRef([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [data, setData] = useState(videoData); // State để lưu trữ dữ liệu video
  const [pausedVideoIndex, setPausedVideoIndex] = useState(null); // State lưu trữ video đang tạm dừng

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [videoStatus, setVideoStatus] = useState({});

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
      setPausedVideoIndex(index); // Set trạng thái pause cho video
    } else {
      video.playAsync();
      setPausedVideoIndex(null); // Đặt lại trạng thái khi video phát
    }
  };

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      const index = viewableItems[0].index;
      setCurrentIndex(index);
    }
  }).current;

  // Hàm toggle like status
  const toggleLike = (index) => {
    const updatedData = [...data];
    updatedData[index].isLike = !updatedData[index].isLike;
    setData(updatedData); // Cập nhật state
  };

  const renderItem = ({ item, index }) => (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={() => handlePress(index)}>
      <Video
          ref={(ref) => (videoRefs.current[index] = ref)}
          source={{ uri: item.videoSource }}
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


      {/* Biểu tượng Play khi video bị pause */}
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

      {/* User Component ở góc dưới bên trái */}
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
      data={data} // Sử dụng dữ liệu từ state
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
