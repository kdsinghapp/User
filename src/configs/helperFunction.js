import AsyncStorage from '@react-native-async-storage/async-storage';
import {PermissionsAndroid, Platform} from 'react-native';
import Geolocation from 'react-native-geolocation-service';

export const getCurrentLocation = () =>
  new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      position => {
        const cords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          heading: position?.coords?.heading,
        };
        console;
        resolve(cords);
      },
      error => {
        reject(error.message);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  });

  export const locationPermission = async () => {
    const permissionKey = 'locationPermission';
  
    try {
      const storedPermission = await AsyncStorage.getItem(permissionKey);
  
      if (storedPermission === 'denied') {
        return Promise.reject('Location Permission denied previously');
      }
  
      if (Platform.OS === 'ios') {
        const permissionStatus = await Geolocation.requestAuthorization('whenInUse');
        if (permissionStatus === 'granted') {
          await AsyncStorage.setItem(permissionKey, 'granted');
          return 'granted';
        } else {
          await AsyncStorage.setItem(permissionKey, 'denied');
          return Promise.reject('Permission not granted');
        }
      }
  
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
  
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        await AsyncStorage.setItem(permissionKey, 'granted');
        return 'granted';
      } else {
        await AsyncStorage.setItem(permissionKey, 'denied');
        return Promise.reject('Location Permission denied');
      }
    } catch (error) {
      console.log('Ask Location permission error: ', error);
      return Promise.reject(error);
    }
  };