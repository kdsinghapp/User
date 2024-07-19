import { AppRegistry, Platform } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';

// Request permissions on iOS
if (Platform.OS === 'ios') {
  PushNotificationIOS.requestPermissions().then(
    (data) => {
      console.log('PushNotificationIOS.requestPermissions', data);
    },
    (data) => {
      console.log('PushNotificationIOS.requestPermissions failed', data);
    }
  );
}

// Background message handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Background Message Received:', remoteMessage);
  const { data } = remoteMessage;
  showLocalNotification(data);
});

const showLocalNotification = (value) => {
  PushNotification.createChannel({
    channelId: 'Love.eats.channel',
    channelName: 'Loveeats',
    channelDescription: 'A channel to categorise your notifications',
    playSound: true,
    soundName: 'default',
    importance: 4,
    vibrate: true,
  });

  PushNotification.localNotification({
    channelId: 'Love.eats.channel',
    title: value.title || 'Default Title',
    message: value.body || 'Default Message',
    playSound: true,
    soundName: 'default',
    priority: 'high',
  });
};

// Configure PushNotification
PushNotification.configure({
  onRegister: function (token) {
    console.log('TOKEN:', token);
  },
  onNotification: function (notification) {
    console.log('NOTIFICATION:', notification);
    notification.finish(PushNotificationIOS.FetchResult.NoData);
  },
  permissions: {
    alert: true,
    badge: true,
    sound: true,
  },
  popInitialNotification: true,
  requestPermissions: Platform.OS === 'ios',
});

AppRegistry.registerComponent(appName, () => App);
