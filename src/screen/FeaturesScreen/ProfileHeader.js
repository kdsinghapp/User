import { View, Text, Platform,TouchableOpacity,Image } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default function ProfileHeader({name,Dwidth}) {

    const navigation  = useNavigation();

  return (
    <View >
       
        <View
          style={{
           paddingBottom:hp(3),
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal:5, 
          }}>
          <TouchableOpacity
           style={{ width: 32, height: 32, justifyContent: 'center', alignItems: 'center' }} 
            onPress={() => {
              navigation.goBack();
            }}>
            <Image
              source={require('../../assets/croping/Back-Navs3x.png')}
              style={{height: 32, width: 32}}
            />
          </TouchableOpacity>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: '700',
                lineHeight: 27,
                color: '#000',
                textAlign: 'center' 
              }}>
             {name}
            </Text>
          </View>
          <View>

          </View>
        </View>
    </View>
  )
}