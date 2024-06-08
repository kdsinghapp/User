import {
  View,
  Text,
  ScrollView,
  Image,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { styles } from '../configs/Styles';
import Star from '../assets/sgv/star.svg';
import Plus from '../assets/sgv/Plus.svg';
import Clock from '../assets/sgv/Clock.svg';
import { useNavigation } from '@react-navigation/native';
import ScreenNameEnum from '../routes/screenName.enum';
import FavAdd from '../assets/sgv/addFav.svg';
import Fav from '../assets/sgv/Favorites.svg';
import { useDispatch, useSelector } from 'react-redux';
import { Add_FavoriteList, get_RestauRantDetails } from '../redux/feature/featuresSlice';
export default function PopularDishList({ ...props }) {
  const user = useSelector(state => state.auth.userData);
  const navigation = useNavigation()
  const dispatch = useDispatch()
  const RestauRantDetails = useSelector(state => state.feature.ResturantDetails);


  const add_favrate = (id) => {


    try {
      const params = {
        fav_id: id,
        fav_type: 'Dish',
        token: user?.token
      }


      dispatch(Add_FavoriteList(params)).then(res => {
        const params = {
          data: {
            restaurant_id: props.data,
          },
        }
        dispatch(get_RestauRantDetails(params));
      })
    }
    catch (err) {
      console.log('RestaurantItemList', err);
    }

  }
  const PopularDishes = ({ item }) => (
    <TouchableOpacity

      onPress={() => {
        navigation.navigate(ScreenNameEnum.DISH_INFORMATION, { item: item })
      }}
      style={[
        styles.shadow,
        {
          padding: 10,
          borderRadius: 10,
          marginVertical: 10,
          alignSelf: 'center',
          backgroundColor: '#FFFFFF',
          marginHorizontal: 10,
        },
      ]}>

      <View style={{ marginTop: 10 }}>
        <Image
          source={{ uri: item.restaurant_dish_image }}
          style={{
            height: hp(15),
            width: wp(35),
            borderRadius: 15,

            borderColor: '#7756FC',
          }}
        />
      </View>
      <TouchableOpacity
        disabled={item.fav}
        onPress={() => {
          add_favrate(item.restaurant_dish_id)
        }}


        style={{ alignSelf: 'flex-end', position: 'absolute', }}>
        {item.fav ? <FavAdd height={20} /> : <Fav height={20} />}
      </TouchableOpacity>

      <View
        style={{
          marginTop: 5,
          flexDirection: 'row',
        }}>
        <Star width={15} height={15} />

      </View>

      <View style={{ flexDirection: 'row' }}>
        <View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: '700',
                lineHeight: 21,
                color: '#000000',
              }}>
              {item.restaurant_dish_name}
            </Text>
            <Text
              style={{
                fontSize: 12,
                marginLeft: 5,
                fontWeight: '700',
                lineHeight: 18,
                color: '#000',
              }}>
              price :- {item.restaurant_dish_price}
            </Text>
            {props.showPlusIcon && <Plus height={20} width={20} />}
          </View>
          <Text
            style={{
              color: '#9DB2BF',
              fontSize: 12,
              lineHeight: 18,
              fontWeight: '400',
            }}>
            {item.restaurant_dish_preapare_time?.substring(0, 2)} min 1.5km Free Delivery
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
  return (
    <View>
      <FlatList
        data={props.home?props.data:RestauRantDetails?.popular_items}
        renderItem={PopularDishes}

        horizontal={true}
        showsHorizontalScrollIndicator={false} // Optional: hide horizontal scroll indicator
      />
    </View>
  )
}

