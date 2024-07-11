import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import React, {useState} from 'react';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {styles} from '../configs/Styles';
import TextInputField from '../configs/TextInput';
import CheckBox from 'react-native-check-box';
import ScreenNameEnum from '../routes/screenName.enum';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {CountryPicker} from 'react-native-country-codes-picker';
import {register} from '../redux/feature/RegisterSlice';
import Loading from '../configs/Loader';
import DatePicker from 'react-native-date-picker';

export default function SignUp() {
  const [isSelected, setSelection] = useState(false);
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);

  const [FullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [MobileNumber, setMobileNumber] = useState('');
  const [code, setCode] = useState('');
  const [Dob, setDob] = useState('');
  const [HomeTown, setHomeTown] = useState('');
  const [showDate, setShowDate] = useState(false);

  const navigation = useNavigation();
  const dispatch = useDispatch();
  const isLoading = useSelector(state => state.register.isLoading);
  const [error, setError] = useState('');
  const setCountry = value => {
    setShow(true);
  };
  const [Number, setNumber] = useState(false);
  const [show, setShow] = useState(false);
  const [countryCode, setCountryCode] = useState('');

  const validateEmail = email => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  const validatePassword = password => {
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    return passwordRegex.test(password);
  };

  const handleNameText = value => {
    setFullName(value);
  };
  const handleEmailText = value => {
    setEmail(value);
  };
  const handlePassText = value => {
    setPassword(value);
  };
  const handleCPassText = value => {
    setConfirmPassword(value);
  };
  const handleDobText = value => {
    setDob(value);
  };
  const handleHomeTownText = value => {
    setHomeTown(value);
  };
  const handleMobileText = value => {
    setMobileNumber(value);
    setNumber(true);
  };

  const Register = () => {
    if (!isSelected) {
      setError('Please accept Terms or Conditions');
    }
    if (!FullName || !email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!validatePassword(password)) {
      setError(
        'Password must contain at least 8 characters, including letters, at least one special character, and numbers.',
      );
      return;
    }

    if (password !== confirmPassword) {
      setError('Password and Confirm Password do not match.');
      return;
    }
    if (code == '') {
      setError('Please choose Country Code');
      return;
    }

    const params = {
      data: {
        full_name: FullName,
        email: email,
        mobile_number: MobileNumber,
        password: password,
        c_password: confirmPassword,
        country_code: code,
        date_of_birth: formate(date),
        home_town: HomeTown
      },
      navigation: navigation,
    };
    dispatch(register(params));
  };



  const formate = (dateString)=>{
    const dateObj = new Date(dateString);

// Extract day, month, and year
const day = dateObj.getUTCDate();
const month = dateObj.getUTCMonth() + 1; // Months are zero-indexed, so we add 1
const year = dateObj.getUTCFullYear();

// Format the date as DD/MM/YYYY
const formattedDate = `${day < 10 ? '0' + day : day}/${month < 10 ? '0' + month : month}/${year}`;
return formattedDate
  }
  return (
    <View style={{flex: 1}}>
       {isLoading ? <Loading /> : null}
      <ScrollView>
        <Image
          source={require('../assets/images/Image-36.png')}
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
            <Text style={styles.txtHeading}>Sign Up</Text>
            <Text style={styles.txtsubHeading}>
              Enter your email and password
            </Text>
          </View>

          <View style={{marginTop: 10, paddingBottom: hp(2)}}>
            <TextInputField
              placeholder={'Full Name'}
              onChangeText={handleNameText}
              firstLogo={true}
              type={'number-pad'}
              img={require('../assets/croping/Profile3x.png')}
            />
            <TextInputField
              placeholder={'Email'}
              onChangeText={handleEmailText}
              firstLogo={true}
           
              img={require('../assets/croping/Emal3x.png')}
            />
           <TouchableOpacity 
          onPress={() => setOpen(true)}
           style={{flexDirection:'row',
           paddingVertical:15,borderRadius:20,paddingHorizontal:10,
           alignItems:'center',backgroundColor:'#F7F8F8'}}>
<Image   source={require('../assets/croping/Dob.png')} 


style={{height:25,width:25}}/>
<Text style={{marginLeft:10,color:"#ADA4A5",     fontWeight: '700',}}>{new Date() == date?'DD/MM/YYYY':formate(date)}</Text>
           </TouchableOpacity>
      
      <TextInputField 
        img={require('../assets/croping/HomeUnactive3x.png')}
       
        onChangeText={handleHomeTownText}
    isFocus={false}  name={'Home Town'} placeholder={'Home Town'} firstLogo={true} showEye={false} /> 
       
            <TextInputField
              County={Number}
              countryCode={countryCode}
              PickCountry={setCountry}
              onChangeText={handleMobileText}
              placeholder={'Mobile Number'}
              maxLength={10}
              firstLogo={true}
              img={require('../assets/croping/Phone3x.png')}
            />

            <TextInputField
              placeholder={'Password'}
              onChangeText={handlePassText}
              firstLogo={true}
              showEye={true}
              img={require('../assets/croping/Lock3x.png')}
            />
            <TextInputField
              placeholder={'Confirm Password'}
              onChangeText={handleCPassText}
              firstLogo={true}
              showEye={true}
              img={require('../assets/croping/Lock3x.png')}
            />
          </View>

          <View style={{flexDirection: 'row'}}>
            <View
              style={{
                flexDirection: 'row',
                paddingTop: 2,
                height: 25,
                width: 25,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <CheckBox
                onClick={() => {
                  setSelection(isChecked => !isChecked);
                }}
                checkedCheckBoxColo={'#7756FC'}
                isChecked={isSelected}
                style={styles.checkbox}
              />
            </View>
            <View style={{marginLeft: 5}}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text
                  style={{
                    color: '#909090',
                    fontSize: 14,
                    lineHeight: 24,
                    fontWeight: '400',
                  }}>
                  I agree to the medidoc
                </Text>
                <TouchableOpacity style={{marginHorizontal: 5}}>
                  <Text
                    style={{
                      color: '#7756FC',
                      fontSize: 14,
                      fontWeight: '400',
                      lineHeight: 24,
                    }}>
                    Terms of Service
                  </Text>
                </TouchableOpacity>
                <Text
                  style={{
                    color: '#909090',
                    fontSize: 14,
                    lineHeight: 24,
                    fontWeight: '400',
                  }}>
                  and
                </Text>
              </View>
              <CountryPicker
                show={show}
                // when picker button press you will get the country object with dial code
                pickerButtonOnPress={item => {
                  setCountryCode(item.dial_code);
                  setShow(false);
                  setCode(item.code);
                }}
                style={{
                  // Styles for whole modal [View]
                  modal: {
                    height: 400,
                  },
                }}
              />
              <TouchableOpacity style={{}}>
                <Text
                  style={{
                    color: '#7756FC',
                    fontSize: 14,
                    fontWeight: '400',
                    lineHeight: 24,
                  }}>
                  Privacy Policy
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <Text
            style={{
              color: 'red',
              fontSize: 12,
              fontWeight: '400',
              marginTop: 20,
              marginLeft: 10,
            }}>
            {error}
          </Text>
          <View style={{alignItems: 'center'}}>
            <TouchableOpacity
              onPress={() => {
                Register();
              }}
              style={Styles.btn}>
              <Text
                style={{
                  color: '#FFF',
                  fontSize: 17,
                  fontWeight: '700',
                  lineHeight: 21,
                }}>
                Sign Up
              </Text>
            </TouchableOpacity>
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
                Alrady have an account?
              </Text>
              <TouchableOpacity
                style={{}}
                onPress={() => {
                  navigation.navigate(ScreenNameEnum.LOGIN_SCREEN);
                }}>
                <Text
                  style={{
                    fontSize: 16,
                    lineHeight: 24,
                    color: '#6D6EEC',
                    fontWeight: '700',
                  }}>
                  {' '}
                  Login
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
 
    
                 </ScrollView>
           
            <DatePicker
       modal={true}
        open={open}
        date={date}
        onConfirm={(date) => {
          setOpen(false)
          setDate(date)
        }}
        mode='date'
        onCancel={() => {
          setOpen(false)
        }}
      />
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
