import {View, Text} from 'react-native';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import RegistrationRoutes from './RegistrationRoutes';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {persistor, store} from '../redux/Store';
import Toast from 'react-native-toast-message';
import toastConfig from '../configs/customToast';
import messaging from '@react-native-firebase/messaging';
import PushNotification from "react-native-push-notification"
import { notificationListener, requestUserPermission } from '../screen/FeaturesScreen/NotificationComponent';

export default function AppNavigator() {

  React.useEffect(() => {
    notificationListener();
    requestUserPermission();
  }, []);


  
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <GestureHandlerRootView style={{flex: 1}}>
          <NavigationContainer>
            <RegistrationRoutes />
            <Toast config={toastConfig} />
      
          </NavigationContainer>
        </GestureHandlerRootView>
      </PersistGate>
    </Provider>
  );
}
