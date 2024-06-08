import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import Star from '../../assets/sgv/star.svg';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { styles } from '../../configs/Styles';
import Pin from '../../assets/sgv/Pin.svg';
import Clock from '../../assets/sgv/Clock.svg';
import { useDispatch, useSelector } from 'react-redux';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { get_FavoriteList } from '../../redux/feature/featuresSlice';
import ScreenNameEnum from '../../routes/screenName.enum';
import FavAdd from '../../assets/sgv/addFav.svg';
import Fav from '../../assets/sgv/Favorites.svg';
export default function Favorites() {
  const [chooseBtn, setChooseBtn] = useState(true);
  const dispatch = useDispatch();
  const isFocuss = useIsFocused();
  const user = useSelector(state => state.auth.userData);
  const FavoriteList = useSelector(state => state.feature?.FavoriteList);
  const navigation = useNavigation()
  const params = {
    token: user.token
  }


  useEffect(() => {
    dispatch(get_FavoriteList(params));
  }, [isFocuss, user]);

  const Restaurant = ({ item }) => (
    <TouchableOpacity
      onPress={() => {

        navigation.navigate(ScreenNameEnum.RESTAURANT_DETAILS, { res_id:item.restorent_data.res_id });
      }}
      style={[
        styles.shadow,
        {

          borderRadius: 10,
          backgroundColor: '#FFFFFF',
          marginHorizontal: 5,
          width: wp(90),
          height: hp(45),
          marginVertical: 10


        },
      ]}>
      
         <TouchableOpacity 
            
            style={{ width: '15%',alignSelf:'flex-end',right:-23,top:5,position:'absolute' }}>
             <FavAdd />
            </TouchableOpacity>
      <View
        style={{
          height: '62%',
          marginTop: 5,
          width: '100%',
          padding: 5
        }}>
        <Image
          source={{ uri: item.restorent_data?.res_image }}
          style={{
            height: '100%',
            width: '100%',
            borderRadius: 15,

            borderColor: '#7756FC',
          }}
          resizeMode="contain"
        />

        <View
          style={{
            position: 'absolute',
            borderRadius: 30,
            backgroundColor: '#FFF',
            alignItems: 'center',
            paddingHorizontal: 10,
            height: 25,
            bottom: 35,
            left: 20,
            flexDirection: 'row',
          }}>
          <Star width={15} height={15} />
          <Text
            style={{
              fontSize: 12,

              marginLeft: 5,
              fontWeight: '700',
              lineHeight: 18,
              color: '#352C48',
            }}>
            {item.restorent_data?.res_average_rating} ({item.res_rating_count} Review)
          </Text>
        </View>
      </View>

      <View style={{ marginHorizontal: 10, marginTop: 10 }}>
        <Text
          style={{
            fontSize: 14,
            fontWeight: '700',
            lineHeight: 21,
            color: '#000000',
          }}>
          {item.restorent_data?.res_name}
        </Text>
        <Text
          style={{
            color: '#9DB2BF',
            fontSize: 12,
            lineHeight: 18,
            fontWeight: '400',
          }}>
          {item.restorent_data?.res_description}
        </Text>
        <View style={{ flexDirection: 'row', marginTop: 5 }}>
          <Pin height={20} width={20} />
          <Text
            style={{
              color: '#9DB2BF',
              marginLeft: 5,
              fontSize: 12,
              lineHeight: 18,
              fontWeight: '400',
            }}>
            {item.restorent_data?.res_address}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', marginTop: 5 }}>
          <Clock height={20} width={20} />
          <Text
            style={{
              color: '#9DB2BF',
              marginLeft: 5,
              fontSize: 12,
              lineHeight: 18,
              fontWeight: '400',
            }}>
            {item.restorent_data?.res_updated_at}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );


  const FOODS = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
       
          navigation.navigate(ScreenNameEnum.DISH_INFORMATION, { item: item?.dish_data })
      
      }}
      style={[
        styles.shadow,
        {
          borderRadius: 10,

          alignSelf: 'center',
          backgroundColor: '#FFFFFF',
          marginVertical: 10,
          padding: 10,
          width: '95%',
          justifyContent: 'center',
        },
      ]}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View
          style={{
            height: 100,
            marginLeft: 5,
            width: 100,
          }}>
          <Image
            source={{ uri: item.dish_data?.restaurant_dish_image }}
            style={{
              height: '100%',
              width: '100%',
              borderRadius: 15,

              borderColor: '#7756FC',
            }}
          
          />
        </View>

        <View style={{ marginLeft: 10 }}>
          <View style={{ width: '82%', }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: '700',
                lineHeight: 30,
                color: '#000000',
              }}>
              {item.dish_data?.restaurant_dish_name}
            </Text>
            <Text
              style={{
                color: '#9DB2BF',
                fontSize: 10,
                lineHeight: 15,
                fontWeight: '400',
              }}>
              {item.dish_data?.restaurant_dish_description}
            </Text>
          </View>

          <View style={{
            flexDirection: 'row',
            width: '82%', marginTop: 5,
            justifyContent: 'space-between'
          }}>
            <Text
              style={{
                color: '#E79B3F',
                fontSize: 14,
                lineHeight: 21,
                fontWeight: '700',
                marginTop: 5,
              }}>
              {item.dish_data?.restaurant_dish_price}
            </Text>
            <TouchableOpacity 
            
            style={{ width: '15%' }}>
             <FavAdd />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{ paddingHorizontal: 15, flex: 1, backgroundColor: '#FFFFFF' }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ marginTop: 20 }}>
          <Text
            style={{
              fontWeight: '700',
              fontSize: 20,
              lineHeight: 30,
              color: '#000',
            }}>
            Favorites
          </Text>
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
                fontSize: 18,
                lineHeight: 27,
                fontWeight: '500',
                color: chooseBtn ? '#FFFFFF' : '#352C48',
              }}>
              Foods
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
                fontSize: 18,
                lineHeight: 27,
                fontWeight: '500',
                color: chooseBtn ? '#352C48' : '#FFFFFF',
              }}>
              Restaurant
            </Text>
          </TouchableOpacity>
        </View>
        {!chooseBtn && FavoriteList && <FlatList
          showsVerticalScrollIndicator={false}
          data={FavoriteList?.restaurants}
          renderItem={Restaurant}

        />
        }
        <View style={{ marginTop: 10, flex: 1 }}>
          {chooseBtn && FavoriteList && <FlatList
            showsVerticalScrollIndicator={false}
            data={FavoriteList?.dishes}
            renderItem={FOODS}

          />
          }

        </View>
      </ScrollView>
    </View>
  );
}

const FOODS_DATA = [
  {
    id: '1',
    name: 'Pizza',
    Details: 'Lemon Juice Fresh is valuable to stock for cooking, cleaning',
    img: require('../../assets/images/Image-12.png'),
    Price: '$08.00',
  },
  {
    id: '2',
    name: 'Hot Dog',
    Details: 'Lemon Juice Fresh is valuable to stock for cooking, cleaning',
    Price: '$08.00',
    img: require('../../assets/images/Image-16.png'),
  },
  {
    id: '3',
    Price: '$08.00',
    name: 'Chicken Roosted',
    Details: 'Lemon Juice Fresh is valuable to stock for cooking, cleaning',
    img: require('../../assets/images/Image-20.png'),
  },
  {
    id: '4',
    Price: '$08.00',
    name: 'Pizza',
    Details: 'Lemon Juice Fresh is valuable to stock for cooking, cleaning',
    img: require('../../assets/images/Image-12.png'),
  },
];
