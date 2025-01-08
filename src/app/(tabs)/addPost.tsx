import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'

const { width } = Dimensions.get('window')

const addPost = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Create New</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => router.push('/selectImages')}
        >
          <View style={styles.iconContainer}>
            <Ionicons name="images" size={24} color="white" />
          </View>
          <View style={styles.buttonTextContainer}>
            <Text style={styles.buttonText}>Create Post</Text>
            <Text style={styles.buttonSubText}>Share photos and videos</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => router.push('/selectVideo')}>
          <View style={styles.iconContainer}>
            <Ionicons name="videocam" size={24} color="white" />
          </View>
          <View style={styles.buttonTextContainer}>
            <Text style={styles.buttonText}>Create Reel</Text>
            <Text style={styles.buttonSubText}>Create short videos</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => console.log('Create Story')}>
          <View style={styles.iconContainer}>
            <Ionicons name="add-circle" size={24} color="white" />
          </View>
          <View style={styles.buttonTextContainer}>
            <Text style={styles.buttonText}>Create Story</Text>
            <Text style={styles.buttonSubText}>Share moments that disappear</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#666" />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: '#333',
  },
  headerText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  buttonContainer: {
    paddingTop: 20,
    gap: 10,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111',
    padding: 15,
    marginHorizontal: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0095f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonTextContainer: {
    flex: 1,
    marginLeft: 15,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonSubText: {
    color: '#666',
    fontSize: 13,
    marginTop: 2,
  },
});

export default addPost