import {View, Text, Image} from 'react-native';
import React, {useEffect} from 'react';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import ScreenNameEnum from '../routes/screenName.enum';

export default function WELCOME_SCREEN() {
  const navigation = useNavigation();

  const isLogOut = useSelector(state => state.auth.isLogOut);
  const isLogin = useSelector(state => state.auth.isLogin);

  const isFoucs = useIsFocused();
  console.log('================splash screen====================');
  const checkLogout = () => {
    if ((!isLogOut && !isLogin) || (isLogOut && !isLogin)) {
      console.log('================Login====================');
      navigation.navigate(ScreenNameEnum.LOGIN_SCREEN);
    }
    if (!isLogOut && isLogin) {
      console.log('================HomeTab====================');

      navigation.navigate(ScreenNameEnum.BOTTOM_TAB);
    }
  };
  useEffect(() => {
    checkLogout();
  }, [isFoucs, isLogOut]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Image
        source={require('../assets/croping/Logo3x.png')}
        style={{height: 200, width: 200}}
        resizeMode="contain"
      />
    </View>
  );
}
