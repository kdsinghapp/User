import {
    View,
    Text,
    Image,
    ScrollView,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    TextInput,
  } from 'react-native';
  import React, {useEffect, useState} from 'react';
  import Address from '../../assets/sgv/Address.svg';
  import {RadioButton} from 'react-native-radio-buttons-group';
  import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
  } from 'react-native-responsive-screen';
  import {styles} from '../../configs/Styles';
  import DropDown from '../../assets/sgv/DropDown.svg';
  import BluePlus from '../../assets/sgv/BluePlus.svg';
import ProfileHeader from './ProfileHeader';
import { useNavigation } from '@react-navigation/native';
import ScreenNameEnum from '../../routes/screenName.enum';
export default function PaymnetCard() {

    const navigation = useNavigation()
  return (
    <View style={{flex:1,backgroundColor:'#FFF',paddingHorizontal:15}}>
     <View>
        <ProfileHeader  name={'Payment Card'}  Dwidth={'40%'}/>
     </View>

     <View style={{backgroundColor:'#F4F5F7',marginTop:35,
     flexDirection:'row',
    paddingHorizontal:20,
     alignItems:'center',
     height:hp(10),borderRadius:15}}>
<View style={{width:'100%',}}>
    <View>
        <Text style={{fontWeight:'700',fontSize:16,lineHeight:20,color:'#32343E'}}>Master Card</Text>
    </View>
    <View style={{flexDirection:'row'}}>
        <Image source={require('../../assets/croping/mastercard.png')} style={{height:18,width:28,backgroundColor:'#000',borderRadius:1}} resizeMode='contain'/>
        <Text style={{fontWeight:'700',fontSize:16,lineHeight:20,color:'#32343E'}}>*************436</Text>
    </View>
</View>
<View>
<DropDown />
</View>
     </View>

     <View style={{marginTop:20}}>
        <TouchableOpacity 
        
        onPress={()=>{
            navigation.navigate(ScreenNameEnum.ADDNEW_CARD)
        }}
        
        style={{flexDirection:'row',
        borderWidth:2,
        height:60,borderRadius:30,
        borderColor:'#F0F5FA',
        justifyContent:'center',alignItems:'center'}}>
            <BluePlus />
            <Text style={{fontSize:14,fontWeight:'700',marginLeft:10 ,lineHeight:16.84,color:'#7756FC'}}>ADD NEW</Text>
        </TouchableOpacity>
     </View>
    </View>
  )
}