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
          borderColor: props.isFocus ? '#6D6EEC' : '#EBEBEB',
          height: 60,
          borderRadius: 15,
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        {props.firstLogo && (
          <View
            style={{
              marginLeft: 10,
              justifyContent: 'center',
              alignItems: 'center',
              width: '10%',
            }}>
            <Image
              source={props.img}
              style={{width: 25, height: 25, color: '6D6EEC'}}
            />
          </View>
        )}
        <View
          style={{
            overflow: 'hidden',
            width: props.showEye ? '72%' : '85%',
            marginLeft: props.firstLogo ? 0 : 15,

            height: 50,
          }}>
          <View style={{height: 18}}>
            <Text
              style={{
                color:props.txtColor?props.txtColor:'#9DB2BF',
                fontWeight: '500',
                fontSize: 14,
              }}>
              {' '}
              {props.name}
            </Text>
          </View>

          <View style={{height: 38, width: '80%'}}>
            <TextInput
            
              placeholderTextColor="#000"
              style={{
                color: '#000000',
                fontWeight: '500',
                fontSize: 14,
              }}
              onChangeText={onChangeText}
              value={text}
              placeholder={props.placeholder}
              secureTextEntry={showPassword}
              maxLength={props.maxLength}
              keyboardType={props.type}
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
              source={require('../assets/croping/HidePassword3x.png')}
              style={{width: 24, height: 24, color: '#EBEBEB'}}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
