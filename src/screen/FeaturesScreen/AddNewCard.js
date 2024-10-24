import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  TextInput,
  SafeAreaView,
  StatusBar,
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

export default function AddNewCard() {
  return (
    <SafeAreaView style={{ backgroundColor: '#fff', flex: 1 }}>
    <StatusBar backgroundColor={'#fff'} />
    <View style={{flex:1,backgroundColor:'#FFF',paddingHorizontal:10}}>
      <ScrollView showsVerticalScrollIndicator={false} >
    <View>
       <ProfileHeader  name={'Add New Card'}  Dwidth={'40%'}/>
    </View>
    <View
          style={{
            height: hp(35),
          
            marginTop: 10,
            paddingHorizontal:5
          }}>
          <View>
            <Text
              style={{
                fontSize: 14,
                lineHeight: 21,
                marginTop: 5,
                fontWeight: '500',
                color: '#000000',
              }}>
              Card Number
            </Text>
          </View>
          <View
            style={{
              height: 50,
              backgroundColor: '#F8F8F8',
              marginTop: 10,
              borderRadius: 12,
              paddingHorizontal: 10,
              justifyContent: 'center',
            }}>
            <TextInput
              placeholder="Enter 12 digit card number"
              placeholderTextColor={'#979797'}
              style={{fontSize: 12, fontWeight: '400', lineHeight: 20}}
            />
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              height: hp(5),
              alignItems: 'center',
              marginTop: 5,
            }}>
            <View
              style={{
                width: '40%',
                paddingHorizontal: 10,
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  fontSize: 14,
                  lineHeight: 21,
                  marginTop: 5,
                  fontWeight: '500',
                  color: '#000000',
                }}>
                Valid Thru
              </Text>
            </View>


            <View
              style={{
                width: '32%',
                paddingHorizontal: 10,
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  fontSize: 14,
                  lineHeight: 21,
                  marginTop: 5,
                  fontWeight: '500',
                  color: '#000000',
                }}>
                CVV
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              height: hp(5),
              alignItems: 'center',
              marginTop: 5,
            }}>
                <View style={{width:'60%',flexDirection:'row',justifyContent:'space-between'}}>
            <View
              style={{
                width: '48%',
                paddingHorizontal: 10,
                justifyContent: 'center',
                alignItems:'center',
                backgroundColor:'#F8F8F8',
                borderRadius:12
              }}>
            <TextInput  placeholder='Month'  />
            </View>
            <View
              style={{
                width: '48%',
                paddingHorizontal: 10,
                justifyContent: 'center',
                alignItems:'center',
                backgroundColor:'#F8F8F8',
                borderRadius:12
              }}>
            <TextInput  placeholder='Year'  />
            </View>
            </View>
            <View style={{flexDirectionr:'row', width: '30%', backgroundColor:'#F8F8F8',borderRadius:12}}>


            <View
              style={{
             
                paddingHorizontal:15,
                justifyContent:'space-between',
                alignItems:'center',
                flexDirection:'row',
            
               
                
              }}>
                <View style={{width:'60%',}}>

            <TextInput  placeholder='CVV'/>
                </View>
            <TouchableOpacity>


            <Image source={require('../../assets/croping/HidePassword3x.png')}  style={{height:20,width:20}}/>
            </TouchableOpacity>
            </View>
            </View>


          
          </View>

          
          <View style={{marginTop: 10}}>
            <Text
              style={{
                fontSize: 14,
                lineHeight: 21,
                marginTop: 5,
                fontWeight: '500',
                color: '#000000',
              }}>
              Card Holder’s Name
            </Text>
          </View>
          <View
            style={{
              height: 50,
              backgroundColor: '#F8F8F8',
              marginTop: 10,
              borderRadius: 12,
              paddingHorizontal: 10,
              justifyContent: 'center',
            }}>
            <TextInput
              placeholder="Name on Card"
              placeholderTextColor={'#979797'}
              style={{fontSize: 12, fontWeight: '400', lineHeight: 20}}
            />
          </View>
        </View>
        </ScrollView>
        <TouchableOpacity

    
style={[styles.tabBtn,{position:'absolute',bottom:10}]}>
<Text
  style={{
    fontWeight: '600',
    fontSize: 17,
    color: '#FFF',
    lineHeight: 25.5,
    marginLeft: 10,
  }}>
  Save
</Text>
</TouchableOpacity>
   
    </View>
    </SafeAreaView>
  )
}