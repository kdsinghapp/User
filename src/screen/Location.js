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
} from 'react-native';
import React from 'react';
import Loading from '../configs/Loader';
import {styles} from '../configs/Styles';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import ScreenNameEnum from '../routes/screenName.enum';
import Searchbar from '../configs/Searchbar';

export default function Location() {

  
  const isLoading = false;

const navigation =useNavigation();



    const renderItem = ({ item }) => {
        return(
      <View style={{ paddingVertical: 10,height:hp(8),
       marginHorizontal:15,
      flexDirection:'row',alignItems:'center',
      borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
     <View>
        <Image 
        
        style={{height:25,width:25}} resizeMode='contain'
        source={require('../assets/croping/Indore2x.png')}/>
     </View>

     <View style={{width:'80%',marginLeft:10}}>
        <Text style={{fontWeight:'500',lineHeight:15,fontSize:14,color:'#777777'}}>{item.location}</Text>
     </View>
      </View>
        )
    }

    const FooterComponent = () => {
        
        return(
        <View style={{  paddingVertical:10,marginHorizontal:15, marginTop: hp(3), flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
          <View>
            <Image
              style={{ height: 20, width: 20 }}
              resizeMode='contain'
              source={require('../assets/croping/search2x.png')} />
          </View>
          <View style={{ width: '80%', marginLeft: 10 }}>
            <Text style={{ fontWeight: '500', lineHeight: 15, fontSize: 14, color: '#777777' }}>Nearby</Text>
          </View>
        </View>
      );
    }

  return (
    <View style={{flex: 1, paddingHorizontal: 10, backgroundColor: '#fff'}}>
      {isLoading ? <Loading /> : null}
      {Platform.OS === 'ios' ? (
        <View style={{height: 68}} />
      ) : (
        <View style={{height:30}} />
      )}
      <ScrollView showsVerticalScrollIndicator={false}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}>
          <Image
            source={require('../assets/croping/Back-Navs2x.png')}
            style={{height: 32, width: 32}}
          />
        </TouchableOpacity>
      <View style={{height:hp(10),
        marginTop:hp(3),
        justifyContent:'center'}}>
        <Searchbar placeholder={'Search for a place or activity'}  />

      </View>
        <View
          style={{
            height: hp(5),
            marginHorizontal: 10,
            alignItems: 'center',
            marginTop: 10,
            flexDirection: 'row',
          }}>
          <Image
            style={{height: 30, width: 30}}
            source={require('../assets/croping/Nearby2x.png')}
          />
          <Text
            style={{
              fontSize: 14,
              marginLeft: 14,
              color: '#777777',
              fontWeight: '500',
            }}>
            Nearby
          </Text>
        </View>

        <View style={{marginTop: 20, flex: 1}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginHorizontal: 15,
            }}>
            <View>
              <Text style={Styles.smallTxt}>Recent Searches</Text>
            </View>
            <View>
              <Text style={Styles.smallTxt}>Clear</Text>
            </View>
          </View>

          <View style={{marginTop:20,height:hp(53),
            
            }}>
          <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={item => item.id}
      ListFooterComponent={FooterComponent}
    />


          </View>
        </View>
        <TouchableOpacity

onPress={()=>{
  navigation.navigate(ScreenNameEnum.BOTTOM_TAB)
}}
  style={styles.tabBtn}>
  <Text
    style={{
      fontWeight: '600',
      fontSize: 17,
      color: '#FFFFFF',
      lineHeight: 25.5,
      marginLeft: 10,
    }}>
 Next
  </Text>
</TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const Styles = StyleSheet.create({
  smallTxt: {fontSize: 10, fontWeight: '700', lineHeight: 14, color: '#777777'},
});




const data = [
    { id: '1', location: 'Indore' },
    
  ];