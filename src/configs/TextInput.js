import {View, Text, TextInput, Image, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';

export default function TextInputField({...props}) {
  const [text, setText] = useState('');
  const [showPassword, setShowPassword] = useState(props.hide);

  const PasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const onChangeText = value => {
    setText(value);
    if (props.onChangeText) {
      props.onChangeText(value);
    }
  };
  return (
    <View style={{height: hp(8), justifyContent: 'center', marginVertical: 5}}>
      <View
        style={{
          flexDirection: 'row',
          borderWidth: 2,
          borderColor: props.isFocus ? '#6D6EEC' : '#F7F8F8',
          height: 60,
          borderRadius: 40,
          alignItems: 'center',
          backgroundColor: '#F7F8F8',
          justifyContent: 'space-between',
        }}>
       
        {props.firstLogo && (
          <View
            style={{
              marginLeft: props.County ? 0 : 10,
              justifyContent: 'center',
              alignItems: 'center',
              width: '10%',
              
              marginLeft:props.County?2:0
            }}>
            <Image
              source={props.img}
              style={{width: 25, height: 25, color: '6D6EEC'}}
            />
          </View>
        )}
         {props.County && (
          <TouchableOpacity
            onPress={props.PickCountry}
            style={{
    
             justifyContent:'center',
          
           
            }}>
            <Text style={{fontSize: 14, fontWeight: '700',color:'blue',lineHeight:18}}>
              {props.countryCode==''?'Code':props.countryCode+'-'}
            </Text>
          </TouchableOpacity>
        )}
        <View
          style={{
            overflow: 'hidden',
            width: props.showEye ? '72%' :props.County?'85%': '90%',
            marginLeft: props.firstLogo ? 0 :  15,
           

            height: 50,
          }}>
          <View style={{width: '80%',paddingTop:1}}>
            <TextInput
              placeholderTextColor="#ADA4A5"
              style={{
                color: '#000000',
                fontWeight: '700',
                fontSize: 14,
                lineHeight: 18,
              }}
              onChangeText={onChangeText}
              value={text}
              placeholder={props.placeholder}
              secureTextEntry={showPassword}
              maxLength={props.maxLength}
            />
          </View>
        </View>
        {props.showEye && (
          <TouchableOpacity
            onPress={PasswordVisibility}
            style={{
              height: 42,
              width: 42,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Image
              source={require('../assets/croping/Hide-Password.png')}
              style={{width: 24, height: 24, color: '#EBEBEB'}}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
