/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';

messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log("Background Message Received:", remoteMessage);
    const { data } = remoteMessage;
    showLocalNotification(data);
});

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
        title: value.title || 'Default Title',
        message: value.body || 'Default Message',
        playSound: true,
        soundName: 'default',
        priority: 'high',
    });
};

AppRegistry.registerComponent(appName, () => App);
