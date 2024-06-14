import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Modal,
  Platform,
  Settings,
  ScrollView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {useNavigation} from '@react-navigation/native';
import Loading from '../../configs/Loader';
import ScreenNameEnum from '../../routes/screenName.enum';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/feature/authSlice';



export default function Profile() {

  const dispatch = useDispatch()
  const [isVisible, setIsVisible] = useState(false);
const navigation = useNavigation()
const user = useSelector(state => state.auth.userData);
  
const isLoading = useSelector(state => state.auth.isLoading);
  
  const renderItem = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate(item.screen);
        }}
        style={{
      
          height:45,
          marginTop:5,
          flexDirection: 'row',
          justifyContent: 'space-between',
          //backgroundColor: '#FAFAFA',
          borderBottomWidth: 1,
          borderColor: '#E3E3E3',
          alignItems: 'center',
          paddingHorizontal:0,
        }}>
        <Text
          style={{
            color: '#777777',
            fontSize: 14,
            lineHeight:14,
            fontWeight: '400',
          }}>
          {item.name}
        </Text>

      
      </TouchableOpacity>
    );
  };

  const user_Logout = () => {
    setIsVisible(false);
    const params = {
     token:user?.token,
      navigation: navigation,
    };
    dispatch(logout(params));
  };


  return (
    <View style={{flex: 1, backgroundColor: '#fff', paddingHorizontal: 20}}>
      {isLoading ? <Loading /> : null}

      {Platform.OS === 'ios' ? (
        <View style={{height: 68}} />
      ) : (
        <View style={{height:5}} />
      )}
      <ScrollView showsVerticalScrollIndicator={false}>
      <View style={{height: hp(5),marginTop:10}}>
        <Text
          style={{
            fontSize: 20,
            color: '#000',
            lineHeight: 30,
            fontWeight: '700',
          }}>
          Profile
        </Text>
      </View>
      <View style={{height: hp(5),marginTop:10}}>
        <Text
          style={{
            fontSize: 20,
            color: '#000',
            lineHeight: 30,
            fontWeight: '700',
          }}>
         Account
        </Text>
      </View>

      <View style={{}}>
        <FlatList
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
          data={Account}
          renderItem={renderItem}
        />
       
      </View>
      <View style={{height: hp(5),marginTop:10}}>
        <Text
          style={{
            fontSize: 20,
            color: '#000',
            lineHeight: 30,
            fontWeight: '700',
          }}>
         Settings
        </Text>
      </View>

      <View style={{}}>
        <FlatList
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
          data={Setting}
          renderItem={renderItem}
        />
       
      </View>
      <View style={{height: hp(5),marginTop:10}}>
        <Text
          style={{
            fontSize: 20,
            color: '#000',
            lineHeight: 30,
            fontWeight: '700',
          }}>
         About
        </Text>
      </View>

      <View style={{}}>
        <FlatList
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
          data={About}
          renderItem={renderItem}
        />
       
      </View>
      <Modal visible={isVisible} animationType="slide" transparent={true}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}>
          <View
            style={{
              backgroundColor: 'white',

              borderRadius: 20,
              width: '90%',
              height: hp(35),
              padding: 10,
            }}>
            <TouchableOpacity
              onPress={() => {
                setIsVisible(false);
              }}
              style={{height: 25, width: 25, alignSelf: 'flex-start'}}>
              <Image
                source={require('../../assets/croping/Close.png')}
                style={{height: 24, width: 24}}
              />
            </TouchableOpacity>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: hp(20),
              }}>
              <Text
                style={{
                  fontWeight: '700',
                  fontSize: 24,
                  lineHeight: 36,
                  color: '#000',
                }}>
                Log Out?
              </Text>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                  marginTop: 20,
                }}>
                <View style={{height: hp(5)}}>
                  <Text
                    style={{
                      color: '#9DB2BF',
                      fontSize: 16,
                      lineHeight: 24,
                      fontWeight: '400',
                    }}>
                    Are you sure you want to log out?
                  </Text>
                </View>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => {
            user_Logout()
              }}
              style={{
                width: 225,
                alignSelf: 'center',
                backgroundColor: '#1D0B38',
                height: 45,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 30,
              }}>
              <Text
                style={{
                  fontWeight: '600',
                  fontSize: 12,
                  lineHeight: 18,
                  color: '#fff',
                }}>
                Log Out
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <TouchableOpacity
        onPress={() => {
          setIsVisible(true);
        }}
        style={{
         
          height: 59,
          marginTop: 15,
          //backgroundColor: '#FAFAFA',
         // alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text
          style={{
            color: '#FF0000',
            fontSize: 14,
            lineHeight: 21,
            fontWeight: '700',
          }}>
          Log Out
        </Text>
      </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const Account = [
  {
    name: 'Edit Profile',
   
    screen: ScreenNameEnum.EDIT_PROFILE
  },
  // {
  //   name: 'Payment Card',
   
  //   screen: ScreenNameEnum.PAYMENT_CARD
  // },
  {
    name: 'My Order',
   
    screen: ScreenNameEnum.BOOKING_SCREEN
  },
  {
    name: 'Addresses',
   
    screen: ScreenNameEnum.ADDRESS_SCREEN
  },
  {
    name: 'Change Password',
    
    screen: ScreenNameEnum.CHANGE_PASSWORD
  },
  {
    name: 'WishList',
   
    screen: ScreenNameEnum.FAVORITE_SCREEN
  },
  
];
const Setting = [
  {
    name: 'Notification',
   
    screen: ScreenNameEnum.NOTIFICATION_SCREEN
  },]

const About = [
  {
    name: 'Privacy Policy',
   
    screen: ScreenNameEnum.PRIVACY_POLICY,
  },
  {
    name: 'Terms And Conditions Of Use',
   
    screen: ScreenNameEnum.TERMS_CONDITIONS,
  },
  
  
];
