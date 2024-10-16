import {
  View,
  Text,
  ScrollView,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import React from 'react';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { styles } from '../configs/Styles';

import Plus from '../assets/sgv/Plus.svg';
import Clock from '../assets/sgv/Clock.svg';
import { useNavigation } from '@react-navigation/native';
import ScreenNameEnum from '../routes/screenName.enum';
import FavAdd from '../assets/sgv/addFav.svg';
import Fav from '../assets/sgv/Favorites.svg';
import { useDispatch, useSelector } from 'react-redux';
import { Add_FavoriteList, get_HomeDashBoard, get_RestauRantDetails } from '../redux/feature/featuresSlice';
import FastImage from 'react-native-fast-image'

import Ratting from './Ratting';
export default function PopularDishList({ ...props }) {
  const user = useSelector(state => state.auth.userData);
  const navigation = useNavigation()
  const dispatch = useDispatch()
  const RestauRantDetails = useSelector(state => state.feature.ResturantDetails);
  const DashBoardData = useSelector(state => state.feature.DashboardList);


  const add_favrate = (id) => {
    try {
      const params = {
        fav_id: id,
        fav_type: 'Dish',
        token: user?.token
      }
      dispatch(Add_FavoriteList(params)).then(async (res) => {

        if (props.home) {

          await call_dashboard()
        } else {

          const params = {
            data: {
              restaurant_id: props.data,
            },
          }
          dispatch(get_RestauRantDetails(params));
        }
      })
    }
    catch (err) {
      console.log('RestaurantItemList', err);
    }

  }

  const call_dashboard = async () => {

    const params = {

      token: user?.token,

    }
    await dispatch(get_HomeDashBoard(params));
  }


  function calculateDiscount(originalPrice, discountPercent) {
    const discountAmount = (originalPrice * discountPercent) / 100;
    const finalPrice = originalPrice - discountAmount;
    return finalPrice.toFixed(2); // To keep the final price with 2 decimal places
  }
  const PopularDishes = ({ item }) => (
    <TouchableOpacity

      onPress={() => {
        navigation.navigate(ScreenNameEnum.DISH_INFORMATION, { item: item })
      }}
      style={[
        styles.shadow,
        {

          borderRadius: 10,
          marginVertical: 10,

          backgroundColor: '#FFFFFF',
          marginHorizontal: 10,
          width: wp(35),
          justifyContent: 'center',
          alignItems: 'center'
        },
      ]}>

      <View style={{
        marginTop: 5, paddingBottom: 10,

      }}>
        {/* <Image
          resizeMode='cover'
          source={{ uri: item.restaurant_dish_image }}

        /> */}


        <FastImage
          style={{
            height: hp(12),
            width: wp(32),
            borderRadius: 15,
            borderColor: '#7756FC',
          }}
          source={{
            uri: item.restaurant_dish_image,

            priority: FastImage.priority.high,
          }}
          resizeMode={FastImage.resizeMode.cover}
        />
      </View>
      <TouchableOpacity
        disabled={item.fav}
        onPress={() => {
          add_favrate(item.restaurant_dish_id)
        }}


        style={{ alignSelf: 'flex-end', position: 'absolute', bottom: 10, right: 5 }}>
        {item.fav ? <FavAdd height={22} /> : <Fav height={20} />}
      </TouchableOpacity>



      <View style={{ width: '80%' }}>

        <View style={{}}>
          <Text
            style={{
              fontSize: 12,
              fontWeight: '700',
              lineHeight: 14,
              color: '#000000',

            }}>
            {item.restaurant_dish_name?.substring(0, 12)}
          </Text>

          {/* {props.showPlusIcon && <Plus height={25} width={25} />} */}
        </View>
        <View style={{}}>

          <View style={{ flexDirection: 'row', alignItems: 'center' }}>


            <Text
              style={{
                fontSize: 12,

                fontWeight: '700',
                lineHeight: 18,
                color: '#000',
              }}>
              Price: </Text>
            <Text
              style={[item?.restaurant_dish_offer > 0 && styles.line ,{
                fontSize: 12,

                fontWeight: '700',
                lineHeight: 18,
                color:item?.restaurant_dish_offer > 0? '#8c8d8f':'#000',
              
              }]}>
              £{Number(item.restaurant_dish_price)?.toFixed(2)}
            </Text>

          </View>
          {item?.restaurant_dish_offer > 0 &&
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>


            <Text
              style={{
                fontSize: 12,

                fontWeight: '700',
                lineHeight: 18,
                color: '#000',
              }}>
              Offer price: </Text>

         
              <Text
                style={{
                  fontSize: 12,

                  fontWeight: '700',
                  lineHeight: 18,
                  color: '#000',
                }}> 
                £{Number(calculateDiscount(item.restaurant_dish_price, item.restaurant_dish_offer))?.toFixed(2)}
              </Text>
          </View>
              }
          {props.showPlusIcon && <Plus height={20} width={20} />}
        </View>
        <Text
          style={{
            color: '#9DB2BF',
            fontSize: 12,
            lineHeight: 14,
            fontWeight: '500',
            marginVertical: 8,
          }}>
          {item.restaurant_dish_preapare_time?.substring(0, 2)} min
        </Text>

      </View>


      {item?.restaurant_dish_offer > 0 &&
        <View style={{ position: 'absolute', top: -7, right: -7 }}>
          <Image source={require('../assets/croping/redo.png')} style={{ height: 60, width: 60 }} />
        </View>

      }
    </TouchableOpacity>
  );

  const Dishes = props.home ? DashBoardData?.popular_dishes : RestauRantDetails?.popular_items
  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={Dishes}
        renderItem={PopularDishes}

        horizontal={true}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  )
}


