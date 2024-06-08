import { View, Text,Image, ScrollView, TouchableOpacity, Platform, PermissionsAndroid } from 'react-native'
import React from 'react'
import Loading from '../configs/Loader';
import { styles } from '../configs/Styles';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import ScreenNameEnum from '../routes/screenName.enum';
import Geolocation from 'react-native-geolocation-service';
export default function AskLocation() {

    const isLoading =false
    const navigation = useNavigation()

    const requestLocationPermission = async () => {
      if (Platform.OS === 'ios') {
          Geolocation.requestAuthorization('whenInUse');
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
                  navigation.navigate(ScreenNameEnum.BOTTOM_TAB)
              } else {
                  console.log('Location permission denied');
              }
          } catch (err) {
              console.warn(err);
          }
      }
  };
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
        style={styles.tabBtn}>
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
      <TouchableOpacity
   style={{alignSelf:'center',height:hp(5),marginTop:20}}
      onPress={()=>{
        navigation.navigate(ScreenNameEnum.LOCATION_SCREEN)
      }}
      >
        <Text
          style={{
            fontWeight: '600',
            fontSize: 17,
            color: '#352C48',
            lineHeight: 25.5,
            marginLeft: 10,
          }}>
    Inter Location Manually
        </Text>
      </TouchableOpacity>
    

    </View>
  )
}