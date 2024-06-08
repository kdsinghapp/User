import React, {FunctionComponent, useEffect, useState} from 'react';


import { createNativeStackNavigator } from '@react-navigation/native-stack';

import _routes from '../routes/routes';
import ScreenNameEnum from '../routes/screenName.enum';

const Stack = createNativeStackNavigator();

const ProfileRoutes: FunctionComponent<any> = ({
  SceenName,
}: {
  SceenName?: ScreenNameEnum;
}) => {
 
  return  (
    <Stack.Navigator
      initialRouteName={SceenName}
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        
      }}>
      {_routes.PROFILE_ROUTE.map(screen => (
        <Stack.Screen
          key={screen.name}
          name={screen.name}
          component={screen.Component}
        />
      ))}

     
     
    </Stack.Navigator>
  ) 
};


export default ProfileRoutes;
