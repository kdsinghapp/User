import {View, Text, Image, TouchableOpacity,Platform, TextInput, Alert,ScrollView, StyleSheet, SafeAreaView, StatusBar} from 'react-native';
import React, { useState } from 'react';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {useNavigation} from '@react-navigation/native';
import Loading from '../configs/Loader';
import ScreenNameEnum from '../routes/screenName.enum';
import { sendOtpRestPass } from '../redux/feature/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import {CountryPicker} from 'react-native-country-codes-picker';

export default function PasswordRest() {
  const navigation = useNavigation();

  const [Email,setEmail] = useState('')
  const [mobile, setMobile] = useState('')
  const isLoading = useSelector(state => state.auth.isLoading);
  const [show, setShow] = useState(false);
  const [countryCode, setCountryCode] = useState('');
  const [code, setCode] = useState('');
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const numberRegex = /^[0-9]+$/;
 
 
  const dispatch = useDispatch();

  const Submit = () => {
    if (Email != '' || mobile != '' ) {
      if (emailRegex.test(Email)) {

        console.log(' Email');
       

        const params = {
          data: {
            identity: Email,
  
           
          },
          navigation: navigation,
        };
 
        dispatch(sendOtpRestPass(params));
      }
      
      else if (numberRegex.test(mobile)) {
       
        if(code =='') return Alert.alert(
          'Country Code Empty',
          'Please Select Country Code.',
        );
       

        const params = {
          data: {
            identity: code+'-'+mobile,
           
          },
          navigation: navigation,
        };

       dispatch(sendOtpRestPass(params));
      }
   
      else {
        Alert.alert(
          'Invalid Input',
          'Please enter a valid email address or number.',
        );
      }
    } else {
      Alert.alert('Require', 'email or number field empty');
    }
  };
  return (
    <SafeAreaView style={{ backgroundColor: '#fff', flex: 1 }}>
    <StatusBar backgroundColor={'#fff'} />
    <View style={{flex: 1, paddingHorizontal: 10, backgroundColor: '#fff'}}>
    {isLoading ? <Loading /> : null}
   
    <ScrollView showsVerticalScrollIndicator={false} 
    
   >
      <TouchableOpacity
        onPress={() => {
          navigation.goBack();
        }}>
        <Image
          source={require('../assets/croping/Back-Navs2x.png')}
          style={{height: 32, width: 32}}
        />
      </TouchableOpacity>

      <View style={{height: hp(15), marginTop: 5}}>
        <View style={{marginTop: 25}}>
          <Text
            style={{
              fontWeight: '700',
              fontSize: 22,
              lineHeight: 24,
              color: '#000000',
            }}>
            Password Reset
          </Text>
        </View>
        <View style={{marginTop: 5}}>
          <Text
            style={{
              fontWeight: '400',
              fontSize: 14,
              lineHeight: 24,
              color: '#9DB2BF',
            
            }}>
          Please put your mobile number to reset your password
          </Text>
        </View>
      </View>
      {/* <View
        style={styles.tab}>
        <View style={{width:'25%',padding:5}}>
          <Image
            source={require('../assets/croping/Group3x3x.png')}
            style={{height:'100%',width:'100%'}}
            resizeMode='contain'
          />
        </View>
        <View style={{width:'60%', marginLeft: 30, height: 43}}>
          <View>
            <Text
              style={{
                fontSize: 16,
                lineHeight: 19.09,
                fontWeight: '700',
                color: '#000000',
              }}>
              SMS
            </Text>
          </View>
          <View style={{flexDirection:'row',alignItems:'center'}}>
            <TouchableOpacity
            onPress={()=>{
              setShow(true)
            }}
            >
              <Text style={{fontSize:16,fontWeight:'600',color:code!=''?'#000':'blue',marginRight:5}}>{code!=''?countryCode:'Code'}</Text>
            </TouchableOpacity>
            <TextInput
              style={{
                fontSize: 14,
                lineHeight: 19.09,
                fontWeight: '400',
                color: '#000',
                lineHeight:21
              }}   
              placeholder='Enter Mobile'
placeholderTextColor={'#000'}
              onChangeText={(txt)=>setMobile(txt)}
              value={mobile}
              />
            
       
          </View>
        </View>
        <CountryPicker
            show={show}
            // when picker button press you will get the country object with dial code
            pickerButtonOnPress={item => {
              setCountryCode(item.dial_code);
             setCode(item.code)
              setShow(false);
            }}
            popularCountries={['en', 'in', 'pl']}
            style={{
              // Styles for whole modal [View]
              modal: {
                height: 400,
              },
            }}
          />
      </View> */}
      <View
        style={styles.tab}>
    
        <View style={{width:'25%',padding:5}}>
          <Image
            source={require('../assets/croping/Email_Box3x.png')}
            style={{height:'100%',width:'100%'}}
            resizeMode='contain'
          />
        </View>
        <View style={{width:'60%', marginLeft: 30, height: 43}}>
          <View>
            <Text
              style={{
                fontSize: 16,
                lineHeight: 19.09,
                fontWeight: '700',
                color: '#000000',
              }}>
              Email
            </Text>
          </View>
          <View style={{}}>
            <TextInput
              style={{
                fontSize: 14,
                lineHeight: 19.09,
                fontWeight: '400',
                color: '#000',
                lineHeight:21
              }}   
              placeholder='Enter email'
              placeholderTextColor={'#000'}
              onChangeText={(txt)=>setEmail(txt)}
              value={Email}
              />
            
       
          </View>
        </View>
      </View>
      <View style={{height:hp(33),alignItems:'center',justifyContent:'center'}}>
<Image   source={require('../assets/croping/I_13x.png')} 
resizeMode='contain'
style={{height:'80%',width:'80%'}}/>
</View>
      <TouchableOpacity

onPress={()=>{
  Submit()

}}
style={{
          backgroundColor: '#1D0B38',
          alignItems: 'center',
          height:60,
          borderRadius:60,
       
     marginTop:40,
          width: '100%',
        
          alignSelf: 'center',
          justifyContent: 'center',
        }}>
        <Text
          style={{
            fontSize: 17,
            lineHeight: 25.5,
            fontWeight: '600',
            color: '#FFFFFF',
          }}>
          Submit
        </Text>
      </TouchableOpacity>
<View style={{height:hp(10)}} />
     
      </ScrollView>
    </View>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  tab:{
    marginHorizontal:10,
    
    marginTop:10,
    height: hp(15),
    padding:5,
    borderRadius: 10,
    shadowColor: '#000',
    backgroundColor: '#fff',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 1,
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 10,
  }
})