import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  FlatList,
  ImageBackground
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

export default function TrackOrder() {
  return (
    <View style={{flex:1,}}>
      <ImageBackground source={require('../../assets/croping/Map3x.png')}
style={{flex:1}}
      >

<View style={{backgroundColor:'#FFFFFF',
width:'100%',
position: 'absolute',borderTopRightRadius:40,borderTopLeftRadius:40,
bottom:0,}}>
  <View style={{height:133,width:133,
    alignSelf:'center',
    top:-40,

    alignItems:'center',
    justifyContent:'center',
    borderRadius:66.5,backgroundColor:'#FFF'}}>
<Image  source={require('../../assets/images/dp.jpeg')} 
 style={{height:100,width:100,borderRadius:50}} />
  </View>
  
  <View style={{position: 'absolute',top:20,left:20}}>
    <Image  source={require('../../assets/croping/Call3x.png')} style={{height:80,width:80}}/>
  </View>
  <View style={{alignSelf:'center',marginTop:-25}}>
    <Text style={{fontSize:20,fontWeight:'700',color:'#352C48',lineHeight:30}}>Kaylynn Stanton</Text>
  
  </View>
  <View style={{alignSelf:'center'}}>
  
    <Text style={{fontSize:12,fontWeight:'500',color:'#352C48',lineHeight:18}}>15 min 1.5km Free Delivery</Text>
  </View>


  <View style={{paddingHorizontal:45,
  marginTop:15,justifyContent:'space-between',
  flexDirection:'row',alignItems:'center'}}>
<View style={{flexDirection:'row',alignItems:'center'}}>
  <View>
  <Image  source={require('../../assets/croping/Pin3x.png')} style={{height:24,width:24}}/>
  </View>
  <View style={{marginLeft:10}}>
  <Text style={{fontSize:15,lineHeight:22,fontWeight:'700',color:'#352C48'}}>9 Dunstan Road
</Text>
  <Text style={{fontSize:10,color:'#000',lineHeight:15,fontWeight:'500'}}> Delivery address
</Text>
</View>
</View>
<View style={{flexDirection:'row',alignItems:'center'}}>
  <View>
  <Image  source={require('../../assets/croping/Pin3x.png')} style={{height:24,width:24}}/>
  </View>
  <View style={{marginLeft:10}}>
  <Text style={{fontSize:15,lineHeight:22,fontWeight:'700',color:'#352C48'}}>9 Dunstan Road
</Text>
  <Text style={{fontSize:10,color:'#000',lineHeight:15,fontWeight:'500'}}> Delivery me
</Text>
</View>
</View>

  </View>
<TouchableOpacity style={{backgroundColor:'#352C48',
height:60,alignItems:'center',justifyContent:'center',borderRadius:30,
marginHorizontal:25,marginTop:23}}>
  <Text style={{color:'#FFF',fontSize:17,fontWeight:'600',lineHeight:25}}>More Details</Text>
</TouchableOpacity>
<View  style={{height:hp(2)}} />
</View>
      </ImageBackground>
     
    </View>
  )
}