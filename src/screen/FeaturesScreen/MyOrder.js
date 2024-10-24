import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Star from '../../assets/sgv/star.svg';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {styles} from '../../configs/Styles';
import Pin from '../../assets/sgv/Pin.svg';
import Clock from '../../assets/sgv/Clock.svg';
import ProfileHeader from './ProfileHeader';
import { useNavigation } from '@react-navigation/native';
import ScreenNameEnum from '../../routes/screenName.enum';

export default function MyOrder() {
  const [chooseBtn, setChooseBtn] = useState(true);
  const navigation = useNavigation()
  const renderItem = ({item}) => (
    <View
      onPress={() => {
        //navigation.navigate(ScreenNameEnum.RESTAURANT_DETAILS);
      }}
      style={[
        styles.shadow,
        {
          borderRadius: 10,

          alignSelf: 'center',
          backgroundColor: '#FFFFFF',
          marginVertical: 10,
         padding:15,
          width: '95%',
         paddingHorizontal:5
        },
      ]}>
      <View style={{flexDirection: 'row', marginTop:5,
      alignItems: 'center',}}>
        <View
          style={{
            height: 100,
            marginLeft:5,
            width: 100,
          
           
          }}>
          <Image
            source={item.img}
            style={{
              height:100,
              width: 100,
            
              borderRadius:50,

              borderColor: '#7756FC',
            }}
            resizeMode="contain"
          />
        </View>

        <View style={{ marginLeft: 15,width:'65%',}}>
        
          <View style={{alignSelf:'flex-end',paddingHorizontal:15}}>
          <Text
              style={{
                color: '#9E9E9E',
                fontSize: 12,
                lineHeight:18,
                fontWeight: '400',
                marginTop: 5,
              }}>
               Order.{item.orderno}
            </Text>
          </View>
        <Text
              style={{
                color: '#E79B3F',
                fontSize: 20,
                lineHeight:30,
                fontWeight: '700',
                
                
              }}>
              £{item.Price}
            </Text>
            <View style={{flexDirection:'row',alignItems:'center'}}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: '700',
              lineHeight: 30,
              color: '#000000',
            }}>
            {item.name}
          </Text>
          <TouchableOpacity style={{marginLeft:10}}>
            <Image source={require('../../assets/croping/edit3x.png')} style={{height:24,width:24}} />
          </TouchableOpacity>
          </View>
          <Text
            style={{
              color: '#352C48',
              fontSize: 12,
              lineHeight: 18,
              fontWeight: '500',
            }}>
            {item.Details}
          </Text>
        </View>

    
     
      </View>


      <View
          style={{
           marginTop:20,
            alignItems: 'center',
            justifyContent: 'space-between',
            flexDirection: 'row',
            paddingHorizontal:40
          }}>
          <TouchableOpacity
           
            onPress={() => {
             navigation.navigate(ScreenNameEnum.TRACK_ORDER)
            }}
            style={[{
              backgroundColor: chooseBtn ? '#7756FC' : '#FFF',
              borderRadius: 30,
              alignItems: 'center',
              justifyContent: 'center',
              width: wp('30%'),
              height:38,
            },styles.shadow]} >
            <Text
              style={{
                fontSize: 12,
                lineHeight:18,
                fontWeight:'500',
                color: chooseBtn ? '#FFFFFF' : '#352C48',
              }}>
             Track Order
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
           
            onPress={() => {
              setChooseBtn(true);
            }}
            style={[{
              backgroundColor: chooseBtn ? '#FFF':'#7756FC' ,
              borderRadius: 30,
              alignItems: 'center',
              justifyContent: 'center',
              width: wp('30%'),
              height:38,
            },styles.shadow]}>
            <Text
              style={{
                fontSize: 12,
                lineHeight:18,
                fontWeight:'500',
                color: chooseBtn ? '#352C48':'#FFFFFF' ,
              }}>
            Cancel
            </Text>
          </TouchableOpacity>
        
        </View>

    </View>
  );
  return (
    <SafeAreaView style={{ backgroundColor: '#fff', flex: 1 }}>
    <StatusBar backgroundColor={'#fff'} />
    <View style={{paddingHorizontal:15,backgroundColor:'#FFF'}}>
      <ScrollView showsVerticalScrollIndicator={false} >
     <View>
      <ProfileHeader
      Dwidth={'25%'}
      name={'My Order'}/>
     </View>
     <View
          style={{
            height: hp(10),
            alignItems: 'center',
            justifyContent: 'space-between',
            flexDirection: 'row',
          }}>
          <TouchableOpacity
            disabled={chooseBtn}
            onPress={() => {
              setChooseBtn(true);
            }}
            style={{
              backgroundColor: chooseBtn ? '#7756FC' : '#FFF',
              borderRadius: 30,
              alignItems: 'center',
              justifyContent: 'center',
              width: wp('45%'),
              height: 47,
            }}>
            <Text
              style={{
                fontSize: 16,
                lineHeight: 27,
                fontWeight:chooseBtn ? '500':'700',
                color: chooseBtn ? '#FFFFFF' : '#352C48',
              }}>
             Ruuning Order
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            disabled={!chooseBtn}
            onPress={() => {
              setChooseBtn(false);
            }}
            style={{
              backgroundColor: chooseBtn ? '#FFF' : '#7756FC',
              borderRadius: 30,
              alignItems: 'center',
              justifyContent: 'center',

              width: wp('45%'),
              height: 47,
            }}>
            <Text
              style={{
                fontSize: 16,
                lineHeight: 27,
                fontWeight:chooseBtn ? '700':'500',
                color: chooseBtn ? '#352C48' : '#FFFFFF',
              }}>
             Past Order
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{marginTop:10}}>
     <FlatList
            showsVerticalScrollIndicator={false}
            data={Order}
            renderItem={renderItem}
            keyExtractor={item => item.id}
          />
      
      
      
        </View>
        </ScrollView>
    </View>
    </SafeAreaView>
  )
}

const Order = [
  {
    id: '1',
    name: 'Pizza',
    Details: '15 min 1.5km Free Delivery',
    img: require('../../assets/images/Image-12.png'),
    Price: '$20.00',
    orderno:'14523652'
  },
  {
    id: '2',
    name: 'Hot Dog',
    Details: '15 min 1.5km Free Delivery',
    Price: '$08.00',
    img: require('../../assets/images/Image-16.png'),
    orderno:'14523652'
  },
  {
    id: '3',
    Price: '$10.00',
    name: 'Chicken Roosted',
    Details: '15 min 1.5km Free Delivery',
    img: require('../../assets/images/Image-20.png'),
    orderno:'14523652'
  },
  
];
