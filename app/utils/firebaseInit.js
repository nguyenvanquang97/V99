import firebase from '@react-native-firebase/app';
import messaging from '@react-native-firebase/messaging';
import { Platform } from 'react-native';

// Cấu hình Firebase cho Android và iOS
const firebaseConfig = Platform.select({
  android: {
    apiKey: "AIzaSyDuKF3u9mGCYpXMmZdbPdsaceeReQowpW4",
    projectId: "bbherb-98b6d",
    storageBucket: "bbherb-98b6d.firebasestorage.app",
    appId: "1:837655896323:android:22961c335cb1ef68ab4936",
    messagingSenderId: "837655896323",
    databaseURL: "https://bbherb-98b6d.firebaseio.com"
  },
  ios: {
    apiKey: "AIzaSyAEqpdVvlLKQ4Oi8FtpmY8sQuAIzWe1p9c",
    projectId: "bbherb-98b6d",
    storageBucket: "bbherb-98b6d.firebasestorage.app",
    appId: "1:837655896323:ios:0fd9a81b9f69c570ab4936",
    messagingSenderId: "837655896323",
    databaseURL: "https://bbherb-98b6d.firebaseio.com"
  }
});

let firebaseInitialized = false;

/**
 * Khởi tạo Firebase một cách rõ ràng để tránh lỗi "[runtime not ready]"
 * Lỗi này thường xảy ra khi Firebase chưa được khởi tạo đúng cách trước khi sử dụng
 */
export const initializeFirebase = async () => {
  if (firebaseInitialized) {
    return true;
  }
  try {
    console.log('Khởi tạo Firebase...');
    if (!firebase.apps.length) {
      await firebase.initializeApp(firebaseConfig);
    }
    
    // Sử dụng API mới theo hướng dẫn: https://rnfirebase.io/migrating-to-v22
    const fcmToken = await messaging().getToken();
    console.log('FCM Token hiện tại:', fcmToken);
    
    firebaseInitialized = true;
    return true;
  } catch (error) {
    console.error('Lỗi khởi tạo Firebase:', error);
    return false;
  }
};

/**
 * Kiểm tra trạng thái khởi tạo Firebase
 */
export const isFirebaseInitialized = () => {
  return firebaseInitialized;
};