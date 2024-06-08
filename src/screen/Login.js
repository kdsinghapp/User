import {
  View,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import React, {useState} from 'react';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {styles} from '../configs/Styles';
import TextInputField from '../configs/TextInput';
import GLogo from '../assets/sgv/googleLogo.svg';
import {ScreenContainer} from 'react-native-screens';
import ScreenNameEnum from '../routes/screenName.enum';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {login} from '../redux/feature/authSlice';
import {CountryPicker} from 'react-native-country-codes-picker';
import Loading from '../configs/Loader';
export default function Login() {
  const [identity, setIdentity] = useState();
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [countryCode, setCountryCode] = useState('');
  const [code, setCode] = useState('');

  const dispatch = useDispatch();
  const isLoading = useSelector(state => state.auth.isLoading);

  const [Number, setNumber] = useState(false);

  const isFocus = useIsFocused();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const numberRegex = /^[0-9]+$/;
  const stringRegex = /^[a-zA-Z\s]*$/;
  const navigation = useNavigation();

  const handleIdentityText = value => {
    setIdentity(value);
if(identity == ''){
  setNumber(false);
}



    if (numberRegex.test(identity)) {
     
      setNumber(true);
    } else if (emailRegex.test(identity)) {
      setNumber(false);
    } else if (stringRegex.test(identity)) {
      setNumber(false);
    }
  };
  const handlePassText = value => {
    setPassword(value);
  };
  const setCountry = value => {
    setShow(true);
  };

  const Login = () => {

    if(password.length < 8) {return Alert.alert(
      'Password',
      'The password field must be at least 8 characters.',
    );
  }
  else{
    if (identity != '' && password != '' ) {
      if (emailRegex.test(identity)) {

        console.log('Login with Email');
        const passwordWithoutSpaces = password.replace(/\s/g, '');

        const params = {
          data: {
            identity: identity,
  
            password: passwordWithoutSpaces,
          },
          navigation: navigation,
        };
 
        dispatch(login(params));
      }
      
      else if (numberRegex.test(identity)) {
        console.log('Login with Mobile ');
        if(code =='') return Alert.alert(
          'Country Code Empty',
          'Please Select Country Code.',
        );
        const passwordWithoutSpaces = password.replace(/\s/g, '');

        const params = {
          data: {
            identity: code+'-'+identity,
            password: passwordWithoutSpaces,
          },
          navigation: navigation,
        };

       dispatch(login(params));
      }
   
      else {
        Alert.alert(
          'Invalid Input',
          'Please enter a valid email address or number.',
        );
      }
    } else {
      Alert.alert('Require', 'email or number password field empty');
    }
  }
  };


  return (
    <View style={{flex: 1}}>
      {isLoading ? <Loading /> : null}
      <Image
        source={require('../assets/images/Image.png')}
        style={{height: hp(26), width: '100%'}}
      />

      <View
        style={{
          backgroundColor: '#FFF',

          marginTop: hp(-5),
          padding: 15,
          flex: 1,
          borderTopLeftRadius: 25,
          borderTopRightRadius: 25,
        }}>
        <View>
          <Text style={styles.txtHeading}>Login</Text>
          <Text style={styles.txtsubHeading}>
            Enter your email and password
          </Text>
        </View>

        <View style={{marginTop: 10, paddingVertical: hp(2)}}>
          <TextInputField
            County={Number}
            countryCode={countryCode}
            PickCountry={setCountry}
            onChangeText={handleIdentityText}
            placeholder={'Email Address / Mobile number'}
            firstLogo={true}
            img={Number?require('../assets/croping/Phone3x.png'):require('../assets/croping/Emal3x.png')}
          />

          <TextInputField
            onChangeText={handlePassText}
            placeholder={'Password'}
            firstLogo={true}
            showEye={true}
            img={require('../assets/croping/Lock3x.png')}
          />

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

          <TouchableOpacity
            onPress={() => {
              navigation.navigate(ScreenNameEnum.PASSWORD_RESET);
            }}
            style={{
              alignSelf: 'center',
              marginTop: 20,
              borderBottomWidth: 0.5,
              borderColor: '#7756FC',
            }}>
            <Text
              style={{
                color: '#7756FC',
                fontSize: 12,
                fontWeight: '500',
                lineHeight: 18,
              }}>
              Forgot your password?
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={() => {
            Login();
          }}
          style={Styles.btn}>
          <Text
            style={{
              color: '#FFF',
              fontSize: 17,
              fontWeight: '700',
              lineHeight: 21,
            }}>
            Login
          </Text>
        </TouchableOpacity>

        <View style={{alignItems: 'center'}}>
          <View
            style={{
              height: hp(5),
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 10,
              alignSelf: 'center',

              justifyContent: 'center',
            }}>
            <Text style={{fontSize: 16, lineHeight: 24, color: '#0000000'}}>
              Don’t have an account?{' '}
            </Text>
            <TouchableOpacity
              style={{}}
              onPress={() => {
                navigation.navigate(ScreenNameEnum.SIGNUP_SCREEN);
              }}>
              <Text
                style={{
                  fontSize: 16,
                  lineHeight: 24,
                  color: '#6D6EEC',
                  fontWeight: '700',
                }}>
                {' '}
                Sign up
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{marginVertical: 10, justifyContent: 'center'}}>
            <Text
              style={{
                fontSize: 16,
                lineHeight: 22,
                fontWeight: '500',
                color: '#000000',
              }}>
              OR
            </Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => {}}
          style={{
            position: 'absolute',
            bottom: 8,
            height: 60,
            alignSelf: 'center',
            width: '98%',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 15,
            borderRadius: 15,
            marginTop: 20,
            flexDirection: 'row',
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 1,
            },
            shadowOpacity: 0.25,
            shadowRadius: 2,

            elevation: 5,
            backgroundColor: '#fff',
            marginHorizontal: 5,
          }}>
          <GLogo width={24} height={24} />
          <Text
            style={{
              fontWeight: '600',
              fontSize: 16,
              color: '#000000',
              lineHeight: 19.09,
              marginLeft: 10,
            }}>
            Login with Google
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const Styles = StyleSheet.create({
  btn: {
    alignSelf: 'center',
    backgroundColor: '#352C48',
    height: 60,
    width: '100%',
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    borderBottomWidth: 0.5,
    borderColor: '#7756FC',
  },
});
