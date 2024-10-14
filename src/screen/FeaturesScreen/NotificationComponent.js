import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PushNotification from 'react-native-push-notification';

export async function requestUserPermission() {

try {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Notification permission granted');
    return true;
  } else {
    console.log('Notification permission denied');
    return false;
  }
} catch (error) {
  console.error('Error requesting notification permission:', error);
  return false;
}
}


export const notificationListener = async () => {
  messaging().onNotificationOpenedApp(remoteMessage => {
    let parsedMain = remoteMessage?.data
    console.log("valueIndex notification", parsedMain)
    showLocalNotification(parsedMain)
  });

  messaging().onMessage(async remoteMessage => {
    let parsedMain = remoteMessage?.data
    console.log("valueIndex notification", parsedMain)
    showLocalNotification(parsedMain)
  });

  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        let parsedMain = remoteMessage?.data
        console.log("valueIndex notification", parsedMain)
        showLocalNotification(parsedMain)
      }
    });
};

const showLocalNotification = (value) => {
 
  PushNotification.createChannel({
    channelId: "Love.eats.channel",
    channelName: 'Loveeats',
    channelDescription: 'A channel to categorise your notifications',
    playSound: true,
    soundName: 'default',
    importance: 4,
    vibrate: true,
  });
  PushNotification.localNotification({
    channelId: "Love.eats.channel",
    title: value?.title,
    message: value?.body,
    playSound: true,
    soundName: 'default',
    priority: 'high',
  });
};
