import {
    View,
    Text,
    TouchableOpacity,
    Image,
    ScrollView,
    Platform,
    TextInput,
    StyleSheet,
    FlatList,
    SafeAreaView,
    StatusBar,
  } from 'react-native';
  import React from 'react';

  import {styles} from '../../configs/Styles';
  import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
  import { useNavigation } from '@react-navigation/native';
import Navigate from '../../assets/sgv/Navigate.svg'
import Search from '../../assets/sgv/OrangeSearch.svg'
import Pin from '../../assets/sgv/OrangePin.svg'
import Loading from '../../configs/Loader';
import Searchbar from '../../configs/Searchbar';
import ScreenNameEnum from '../../routes/screenName.enum';
  
  export default function Search_Restaurants({...props}) {
  
    
    const isLoading = false;
  
  const navigation =useNavigation();
  
  
 
  

     
    return (
      <SafeAreaView style={{ backgroundColor: '#fff', flex: 1 }}>
      <StatusBar backgroundColor={'#fff'} />
      <View style={{flex: 1, paddingHorizontal: 10, backgroundColor: '#fff'}}>
        {isLoading ? <Loading /> : null}
       
        <ScrollView showsVerticalScrollIndicator={false}>
     
    
    
         
        </ScrollView>
        </View>
      </SafeAreaView>
    
    );
  }
  
  const Styles = StyleSheet.create({
    smallTxt: {fontSize: 10, fontWeight: '700', lineHeight: 14, color: '#777777'},
  });
  
  
  
