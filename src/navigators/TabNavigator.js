import { View, Text, Image,Keyboard ,Platform} from 'react-native'
import React, { useEffect, useState } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../screen/FeaturesScreen/Home';
import _routes from '../routes/routes';



const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      Platform.OS === 'android' ? 'keyboardDidShow' : 'keyboardWillShow',
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      Platform.OS === 'android' ? 'keyboardDidHide' : 'keyboardWillHide',
      () => {
        setKeyboardVisible(false);
      }
    );

    // Clean up listeners
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  return (
    <Tab.Navigator 
    screenOptions={{ headerShown: false,
    tabBarShowLabel:false,
   

  tabBarStyle:{
    display: isKeyboardVisible ? 'none' : 'flex',

   paddingTop:0,
height:65,


  }

  }}
    >


{_routes.BOTTOMTAB_ROUTE.map(screen => (
        <Tab.Screen
          key={screen.name}
          name={screen.name}
          component={screen.Component}
          options={{
            tabBarIcon: ({ focused, color, size }) => (<>
              <Image
                source={screen.logo} // Assuming you have imported icon for each screen
                style={{ width: 24, height: 24, tintColor:focused ? '#7756FC' : color  }} // Adjust size and style as needed
              />
              <Text style={{fontWeight:'600',color:'#777777',fontSize:10,marginTop:5}}>{screen.lable}</Text>
              </>
            ),
            tabBarLabel: screen.lable // Assuming you have label for each screen
          }}
        />
      ))}

     
     
    </Tab.Navigator>
  )
}