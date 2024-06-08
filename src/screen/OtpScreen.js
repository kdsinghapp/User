import {View, Text, Image, TouchableOpacity, Platform, StyleSheet,ScrollView} from 'react-native';
import React ,{useState}from 'react';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {useNavigation} from '@react-navigation/native';
import { CodeField, Cursor, useBlurOnFulfill, useClearByFocusCell } from
    'react-native-confirmation-code-field';
import Loading from '../configs/Loader';
import ScreenNameEnum from '../routes/screenName.enum';
import { useDispatch, useSelector } from 'react-redux';
import { validOtp } from '../redux/feature/authSlice';

export default function OtpScreen({route}) {
const {identity } = route.params
const isLoading = useSelector(state => state.auth.isLoading);

  const navigation = useNavigation();
  const [value, setValue] = useState('');
  const ref = useBlurOnFulfill({value, cellCount:4});

  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  const dispatch = useDispatch();
  console.log(identity,value);

  const ValidOtp =()=>{

    const params = {
      data: {
        identity:identity, 
        otp:value
        
      },
      navigation: navigation,
    };
    dispatch(validOtp(params))
  }



  return (
    <View style={{flex: 1, paddingHorizontal: 10, backgroundColor: '#fff'}}>
       {isLoading ? <Loading /> : null}
      {Platform.OS === 'ios' ?<View style={{height: 68}} />: <View style={{height:10}} />}
      <ScrollView showsVerticalScrollIndicator={false}>
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
              fontSize:22,
              lineHeight: 24,
              color: '#000000',
            }}>
           Check your mail or check your cell phone
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
         Please put the 4 digits sent to you
          </Text>
        </View>
      </View>
     <View
   style={{height:hp(10),width:'50%',marginTop:20}} >
       <CodeField
        ref={ref}
        {...props}
     
        value={value}
        onChangeText={setValue}
        cellCount={4}
        rootStyle={{}}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        renderCell={({index, symbol, isFocused}) => (
          <View style={{backgroundColor:'#E9E9E9',borderRadius:15,}}>


          <Text
            key={index}
            style={[styles.cell, isFocused && styles.focusCell]}
            onLayout={getCellOnLayoutHandler(index)}>
            {symbol || (isFocused ? <Cursor/> : null)}
          </Text>
          </View>
        )}
      />
    </View>
    <View style={{alignItems:'center',justifyContent:'center',height:hp(30)}}>
<Image   source={require('../assets/croping/I-23x.png')} 
resizeMode='contain'
style={{height:'80%',width:'80%'}}/>
</View>
</ScrollView>
      <TouchableOpacity

onPress={()=>{
  ValidOtp()

}}
style={{
          backgroundColor: '#1D0B38',
          alignItems: 'center',
          height:60,
          borderRadius:60,
       position:'absolute',
       bottom:10,
     
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

    </View>
  );
}


const styles = StyleSheet.create({


  codeFieldRoot: {marginTop: 20,},
  cell: {
    width: 40,
    height: 40,
    lineHeight: 38,
    fontSize: 24,
    borderWidth: 2,
    borderColor: '#E9E9E9',
    textAlign: 'center',
    borderRadius:10,
   // backgroundColor:'#E9E9E9',
    
  },
  focusCell: {
    borderColor: '#6D6EEC',
    borderRadius:10,
   
  },
});



