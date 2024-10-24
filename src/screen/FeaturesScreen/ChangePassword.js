import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import React, { useState } from 'react';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { styles } from '../../configs/Styles';
import ProfileHeader from './ProfileHeader';
import TextInputField from '../../configs/TextInputField';
import { useDispatch, useSelector } from 'react-redux';
import { tokens } from 'react-native-paper/lib/typescript/styles/themes/v3/tokens';
import { create_new_password } from '../../redux/feature/featuresSlice';
import Loading from '../../configs/Loader';

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const user = useSelector(state => state.auth.userData);
  const isLoading = useSelector(state => state.feature.isLoading);
  const [confirmPassword, setConfirmPassword] = useState('');
  const dispatch = useDispatch()
  const handleCurrentPasswordChange = (text) => {
    setCurrentPassword(text);
  };

  const handleNewPasswordChange = (text) => {
    setNewPassword(text);
  };

  const handleConfirmPasswordChange = (text) => {
    setConfirmPassword(text);
  };

  const handleSave = () => {

    const params = {
      password: newPassword,
      c_password: confirmPassword,
      old_password: currentPassword,
      token: user?.token
    }

    dispatch(create_new_password(params))
  };

  return (
    <SafeAreaView style={{ backgroundColor: '#fff', flex: 1 }}>
    <StatusBar backgroundColor={'#fff'} />
    <View style={{ flex: 1, backgroundColor: '#FFF', paddingHorizontal: 15 }}>
      {isLoading ?<Loading />:null}
      <ProfileHeader name={'Change Password'} Dwidth={'40%'} />
      <View style={{ marginTop: 20 }}>
        <TextInputField
          hide={true}
          onChangeText={handleCurrentPasswordChange}
          isFocus={true}
          name={'Current Password'}
          placeholder={'Current Password'}
          firstLogo={false}
          showEye={true}
          txtColor={'#7756FC'}
        />
      </View>
      <View style={{ marginTop: 10 }}>
        <TextInputField
          hide={true}
          onChangeText={handleNewPasswordChange}
          isFocus={true}
          name={'New Password'}
          placeholder={'New Password'}
          firstLogo={false}
          showEye={true}
          txtColor={'#7756FC'}
        />
      </View>
      <View style={{ marginTop: 10 }}>
        <TextInputField
          hide={true}
          onChangeText={handleConfirmPasswordChange}
          isFocus={true}
          name={'Confirm Password'}
          placeholder={'Confirm Password'}
          firstLogo={false}
          showEye={true}
          txtColor={'#7756FC'}
        />
      </View>
      <TouchableOpacity
        style={[styles.tabBtn, { position: 'absolute', bottom: 30 }]}
        onPress={handleSave}
      >
        <Text
          style={{
            fontWeight: '600',
            fontSize: 17,
            color: '#CBC3E3',
            lineHeight: 25.5,
            marginLeft: 10,
          }}
        >
          Save
        </Text>
      </TouchableOpacity>
    </View>
    </SafeAreaView>
  );
}
