export const HostNamePostService = 'http://192.168.1.6:32679'; 
export const HostNameUserService = 'http://192.168.1.6:32678'; 
export const HostNameNotificationService = 'http://192.168.1.6:32681'; 
export const HostNameChatService = 'http://192.168.1.6:32682';
export const HostNameStoryService = 'http://192.168.1.6:32680';

// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getStorage } from 'firebase/storage'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyBsbJ_otcXtjyHs7GVrimilpb_JosodNcc',
  authDomain: 'netflixo-movie-app.firebaseapp.com',
  projectId: 'netflixo-movie-app',
  storageBucket: 'netflixo-movie-app.appspot.com',
  messagingSenderId: '776623523431',
  appId: '1:776623523431:web:c50f97a08386bf7e4cb6c2',
  measurementId: 'G-K1ZG58RSSE'
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
export const storage = getStorage(app) // Storage