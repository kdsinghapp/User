import {View, Text, Image, TextInput, TouchableOpacity, Alert, ScrollView, SafeAreaView, StatusBar} from 'react-native';
import React, { useState } from 'react';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {
  NavigationHelpersContext,
  useNavigation,
} from '@react-navigation/native';
import TextInputField from '../configs/TextInput';
import Loading from '../configs/Loader';
import { styles } from '../configs/Styles';
import { useDispatch, useSelector } from 'react-redux';
import { CreateNewPassword } from '../redux/feature/authSlice';




export default function CreatePassword({route}) {
const {identity} = route.params


  const [ConfirmPassword, setConfirmPassword] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigation = useNavigation();
  const isLoading = useSelector(state => state.auth.isLoading);
  const dispatch =  useDispatch()
  const handlePassText = value => {
    setPassword(value);
  };
  const handleCPassText = value => {
    setConfirmPassword(value);
  };

  const validatePassword = password => {
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    return passwordRegex.test(password);
  };

  const createNewPassword =()=>{

    if(password === ConfirmPassword ){
if(validatePassword(password)){
   setError('')
    const params = {
      data: {
        identity:identity.identity, 
        password:password,
        otp:identity.otp
        
      },
      navigation: navigation,


    };
    dispatch(CreateNewPassword(params))
  }
  else{
   
    setError('Password must be at least 8 characters long and include at least one special character and one number')
      
  }

  }
  else{
    setError('')
    Alert.alert(
      'Password',
      'Password and confirm password does not match.',
     
    );
  }
  }
  return (
    <SafeAreaView style={{ backgroundColor: '#fff', flex: 1 }}>
    <StatusBar backgroundColor={'#fff'} />
    <View style={{flex: 1, backgroundColor: '#fff', paddingHorizontal: 10}}>
     
     {isLoading ? <Loading /> : null}
     <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{flex:1}}>
     
      <TouchableOpacity
        onPress={() => {
          navigation.goBack();
        }}>
        <Image
          source={require('../assets/croping/Back-Navs2x.png')}
          style={{height: 32, width: 32}}
        />
      </TouchableOpacity>
      <View style={{marginTop: 15}}>
        <View style={{height: hp(9)}}>
          <View>
            <Text
              style={{
                fontSize: 22,
                fontWeight: '700',
                color: '#000000',
                lineHeight: 36,
              }}>Create New Password
            </Text>
          </View>
          <View style={{width:'85%',}}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: '400',
                color: '#9DB2BF',
                lineHeight: 24,
              }}>
              Your new password must be different from previous used passwords.
            </Text>
          </View>
        </View>

        <View style={{marginTop:hp(6),}}>
        <TextInputField 
         onChangeText={handlePassText}
         hide={true}
        firstLogo={true} name={'New Password'} placeholder={'Password'}    img={require('../assets/croping/Lock3x.png')} showEye={true} />
        <TextInputField 
         hide={true}
          onChangeText={handleCPassText}
        firstLogo={true} name={'New Confirm Password'} placeholder={'Confirm Password'}    img={require('../assets/croping/Lock3x.png')} showEye={true} />
        </View>
      </View>
      <View style={{height:hp(5),paddingHorizontal:5}}> 
{error!= '' && <Text style={{fontSize:12,color:'red',fontWeight:'400'}}>{error}</Text>}
      </View>
    
      </ScrollView>
      <TouchableOpacity

      onPress={()=>{
        createNewPassword();
      }}
        style={[styles.tabBtn,{position:'absolute',bottom:10}]}>
        <Text
          style={{
            fontWeight: '600',
            fontSize: 17,
            color: '#FFFFFF',
            lineHeight: 25.5,
            marginLeft: 10,
          }}>
          Save
        </Text>
      </TouchableOpacity>

    </View>
    </SafeAreaView>
  );
}
