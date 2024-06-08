import {
  View,
  Text,
  ScrollView,
  Image,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {styles} from '../configs/Styles';
import Star from '../assets/sgv/star.svg';
import Plus from '../assets/sgv/Plus.svg';
import Fav from '../assets/sgv/Favorites.svg';

export default function ReviewList({...props}) {

  console.log('ReviewList',props.data);
  const RenderReviewList = ({item}) => {
    
    return(
   
    <View
      style={[
        styles.shadow,
        {
          paddingHorizontal:10,
         

          backgroundColor: '#FFFFFF',
          marginHorizontal: 5,
         paddingVertical:10,
          marginVertical: 5,
          borderRadius:5
        },
      ]}>
      <View style={{flexDirection: 'row'}}>
        <View style={{height: 45, width: 45,}}>
          <Image
            source={{uri:item.images}}
            style={{
              height: 40,
              width: 40,
              borderRadius: 20,

              borderColor: '#7756FC',
            }}
            resizeMode='cover'
          />
        </View>

        <View
          style={{
            
            paddingVertical: 5,
            marginLeft: 10,
            width: '82%',
          
          }}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: '700',
                lineHeight: 24,
                color: '#000000',
              }}>
              {item.full_name}
            </Text>
            <View
              style={{
                borderWidth:1,
                borderColor: '#E79B3F',
                alignItems: 'center',
                justifyContent: 'center',
                paddingHorizontal:5,
                borderRadius:10,
                width:'20%',
                justifyContent:'space-between',
                paddingHorizontal:14,
                flexDirection: 'row',
              }}>
              <Text
                style={{
                  fontSize: 12,
                
                  fontWeight: '600',
                  lineHeight: 24,
                  color: '#E79B3F',
                }}>
              {item.resrev_rating}
              </Text>
              <Star />
            </View>
          </View>
        </View>
      </View>
      <View style={{marginTop:5,marginHorizontal:5}}>
        <Text style={{fontSize:10,fontWeight:'400',lineHeight:15,color:'#677294'}}>{item.resrev_review_text}</Text>
      </View>
    </View>
  );
              }
  return (
    <View>
      <FlatList
        data={props.data}
        renderItem={RenderReviewList}
        keyExtractor={item => item.id}
        showsHorizontalScrollIndicator={false} // Optional: hide horizontal scroll indicator
      />
    </View>
  );
}

