import { View, Text,Image, ScrollView, TouchableOpacity, Platform, PermissionsAndroid, Alert, Linking } from 'react-native'
import React, { useEffect } from 'react'
import Loading from '../configs/Loader';
import { styles } from '../configs/Styles';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import ScreenNameEnum from '../routes/screenName.enum';
import Geolocation from 'react-native-geolocation-service';
import messaging from '@react-native-firebase/messaging';
import { update_profile } from '../redux/feature/featuresSlice';
import { useDispatch, useSelector } from 'react-redux';
import { requestUserPermission } from './FeaturesScreen/NotificationComponent';

export default function AskLocation() {
  const user = useSelector(state => state.auth.userData);
    const isLoading =false
    const navigation = useNavigation()
    const dispatch = useDispatch();
  


    const showSettingsAlert = () => {
      Alert.alert(
          'Permission Required',
          'Location permission is required to use this feature. Please enable it in the app settings.',
          [
              {
                  text: 'Cancel',
                  style: 'cancel'
              },
              {
                  text: 'Open Settings',
                  onPress: () => {
                      // Open the app settings
                      if (Platform.OS === 'ios') {
                          Linking.openURL('app-settings:');
                      } else {
                          // For Android, use the package name to open settings
                          Linking.openSettings();
                      }
                  }
              }
          ],
          { cancelable: false }
      );
  };
    const requestLocationPermission = async () => {

  

  
      if (Platform.OS === 'ios') {
          const authStatus = await Geolocation.requestAuthorization('whenInUse');
          if (authStatus === 'granted' || authStatus === 'whenInUse') {
              console.log('You can use the location');
              navigation.navigate(ScreenNameEnum.BOTTOM_TAB);
          } else {
              console.log('Location permission denied');
              showSettingsAlert();
          }
      } else {
          try {
              const granted = await PermissionsAndroid.request(
                  PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                  {
                      title: 'Location Permission',
                      message: 'This app needs access to your location to show you directions.',
                      buttonNeutral: 'Ask Me Later',
                      buttonNegative: 'Cancel',
                      buttonPositive: 'OK',
                  }
              );
              if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                  console.log('You can use the location');
                  navigation.navigate(ScreenNameEnum.BOTTOM_TAB);
              } else if (granted === PermissionsAndroid.RESULTS.DENIED) {
                  console.log('Location permission denied');
                  Alert.alert(
                      'Permission Required',
                      'Location permission is required to use this feature. Please grant the permission.',
                      [
                          { text: 'Cancel', style: 'cancel' },
                          { text: 'Ask Again', onPress: () => requestLocationPermission() },
                      ],
                      { cancelable: false }
                  );
              } else if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
                  console.log('Location permission denied with "Never Ask Again"');
                  showSettingsAlert();
              }
          } catch (err) {
              console.warn(err);
          }
      }
  };



  useEffect(()=>{
    getToken()
  },[user])

  const getToken = async () => {
    try {
      const token = await messaging().getToken();
      console.log('FCM token:', token);
      send_token(token)
    } catch (error) {
      console.error('Error getting FCM token:', error);
    }
  };






  const send_token = async (token) => {
    const formData = new FormData();

    formData.append('device_token', token);


    const params = {

      data: formData,
      token: user?.token,
      msg:false
    };



    await dispatch(update_profile(params))
  }


  
  return (

          <View style={{flex: 1, paddingHorizontal: 15, backgroundColor: '#fff'}}>
    {isLoading ? <Loading /> : null}
    {Platform.OS === 'ios' ?<View style={{height: 68}} />:
     <View style={{height:20}} />}
  
      <TouchableOpacity
        onPress={() => {
          navigation.goBack();
        }}>
        <Image
          source={require('../assets/croping/Back-Navs2x.png')}
          style={{height: 32, width: 32}}
        />
      </TouchableOpacity>

      <View style={{alignItems:'center'}}>
        <Text style={styles.txtHeading}>What is Your Location?</Text>
    <Text style={styles.txtsubHeading}>Weyourbocation to slow evalu restaurant & </Text>
    <Text style={styles.txtsubHeading}>products</Text>
      </View>
      <View style={{height:hp(63),alignItems:'center',justifyContent:'center'}}>
<Image   source={require('../assets/croping/Location3x.png')} 
resizeMode='contain'
style={{height:'80%',width:'80%'}}/>
</View>
      <TouchableOpacity

      onPress={()=>{
        requestLocationPermission()
       
      }}
        style={[styles.tabBtn,{marginTop:hp(10)}]}>
        <Text
          style={{
            fontWeight: '600',
            fontSize: 17,
            color: '#FFFFFF',
            lineHeight: 25.5,
            marginLeft: 10,
          }}>
        Allow Location Access
        </Text>
      </TouchableOpacity>
    

    </View>
  )
}