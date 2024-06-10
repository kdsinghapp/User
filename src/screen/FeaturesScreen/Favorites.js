import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import Star from '../../assets/sgv/star.svg';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { useDispatch, useSelector } from 'react-redux';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { delete_favorite_restaurant, get_FavoriteList } from '../../redux/feature/featuresSlice';
import ScreenNameEnum from '../../routes/screenName.enum';
import FavAdd from '../../assets/sgv/addFav.svg';
import Pin from '../../assets/sgv/Pin.svg';
import Clock from '../../assets/sgv/Clock.svg';

export default function Favorites() {
  const [chooseBtn, setChooseBtn] = useState(true);
  const dispatch = useDispatch();
  const isFocussed = useIsFocused();
  const user = useSelector(state => state.auth.userData);
  const FavoriteList = useSelector(state => state.feature?.FavoriteList);
  const navigation = useNavigation();
  const params = {
    token: user.token
  };

  useEffect(() => {
    dispatch(get_FavoriteList(params));
  }, [isFocussed, user]);

  const delete_favorite = (id) => {
    const data = new FormData();
    data.append('resfav_id', id);

    const params = {
      data: data,
      token: user?.token
    };

    dispatch(delete_favorite_restaurant(params)).then(res => {
      const params = {
        token: user.token
      };
      dispatch(get_FavoriteList(params));
    });
  };

  const Restaurant = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate(ScreenNameEnum.RESTAURANT_DETAILS, { res_id: item.restorent_data.res_id });
      }}
      style={[styles.shadow, styles.restaurantContainer]}
    >
      
      <View style={styles.restaurantImageContainer}>
        <Image
          source={{ uri: item.restorent_data?.res_image }}
          style={styles.restaurantImage}
          
        />
        <View style={styles.ratingContainer}>
          <Star width={15} height={15} />
          <Text style={styles.ratingText}>
            {item.restorent_data?.res_average_rating} ({item.res_rating_count} Reviews)
          </Text>
        </View>
      </View>
      <View style={styles.restaurantInfoContainer}>
        <Text style={styles.restaurantName}>{item.restorent_data?.res_name}</Text>
        <Text style={styles.restaurantDescription}>{item.restorent_data?.res_description}</Text>
        <View style={styles.iconTextContainer}>
          <Pin height={20} width={20} />
          <Text style={styles.iconText}>{item.restorent_data?.res_address}</Text>
        </View>
        <View style={styles.iconTextContainer}>
          <Clock height={20} width={20} />
          <Text style={styles.iconText}>{item.restorent_data?.res_updated_at}</Text>
        </View>
      </View>
      <TouchableOpacity 
        onPress={() => {
          delete_favorite(item.resfav_id);
        }}
        style={styles.favoriteIconContainer}
      >
        <FavAdd />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const FOODS = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate(ScreenNameEnum.DISH_INFORMATION, { item: item?.dish_data });
      }}
      style={[styles.shadow, styles.foodContainer]}
    >
      <View style={styles.foodImageContainer}>
        <Image
          source={{ uri: item.dish_data?.restaurant_dish_image }}
          style={styles.foodImage}
        />
      </View>
      <View style={styles.foodInfoContainer}>
        <View style={styles.foodTextContainer}>
          <Text style={styles.foodName}>{item.dish_data?.restaurant_dish_name}</Text>
          <Text style={styles.foodDescription}>{item.dish_data?.restaurant_dish_description}</Text>
        </View>
        <View style={styles.foodPriceContainer}>
          <Text style={styles.foodPrice}>{item.dish_data?.restaurant_dish_price}</Text>
          <TouchableOpacity 
            onPress={() => {
              delete_favorite(item.resfav_id);
            }}
            style={styles.favoriteIconContainer}
          >
            <FavAdd />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Favorites</Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            disabled={chooseBtn}
            onPress={() => {
              setChooseBtn(true);
            }}
            style={[styles.toggleButton, chooseBtn ? styles.activeButton : styles.inactiveButton]}
          >
            <Text style={[styles.buttonText, chooseBtn ? styles.activeButtonText : styles.inactiveButtonText]}>
              Foods
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            disabled={!chooseBtn}
            onPress={() => {
              setChooseBtn(false);
            }}
            style={[styles.toggleButton, !chooseBtn ? styles.activeButton : styles.inactiveButton]}
          >
            <Text style={[styles.buttonText, !chooseBtn ? styles.activeButtonText : styles.inactiveButtonText]}>
              Restaurant
            </Text>
          </TouchableOpacity>
        </View>
        {!chooseBtn && (
          <FlatList
            showsVerticalScrollIndicator={false}
            data={FavoriteList?.restaurants}
            renderItem={Restaurant}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No favorite restaurants found</Text>
              </View>
            }
          />
        )}
        <View style={styles.foodListContainer}>
          {chooseBtn && (
            <FlatList
              showsVerticalScrollIndicator={false}
              data={FavoriteList?.dishes}
              renderItem={FOODS}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No favorite foods found</Text>
                </View>
              }
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerContainer: {
    marginTop: 20,
  },
  headerText: {
    fontWeight: '700',
    fontSize: 20,
    lineHeight: 30,
    color: '#000',
  },
  buttonContainer: {
    height: hp(10),
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  toggleButton: {
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    width: wp('45%'),
    height: 47,
  },
  activeButton: {
    backgroundColor: '#7756FC',
  },
  inactiveButton: {
    backgroundColor: '#FFF',
  },
  buttonText: {
    fontSize: 18,
    lineHeight: 27,
    fontWeight: '500',
  },
  activeButtonText: {
    color: '#FFFFFF',
  },
  inactiveButtonText: {
    color: '#352C48',
  },
  shadow: {
    shadowColor: "#000",
shadowOffset: {
	width: 0,
	height: 2,
},
shadowOpacity: 0.25,
shadowRadius: 3.84,

elevation: 5,
  },
  restaurantContainer: {
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 5,
    width: wp(90),
    height: hp(40),
    marginVertical: 10,
  },
  favoriteIconContainer: {
    width: '15%',
    alignSelf: 'flex-end',
    right: -23,
    top: 5,
  },
  restaurantImageContainer: {
    height: '55%',
    marginTop: 5,
    width: '100%',
    padding: 5,
  },
  restaurantImage: {
    height: '100%',
    width: '100%',
    borderRadius: 15,
    borderColor: '#7756FC',
  },
  ratingContainer: {
    position: 'absolute',
    borderRadius: 30,
    backgroundColor: '#FFF',
    alignItems: 'center',
    paddingHorizontal: 10,
    height: 25,
    bottom:15,
    left: 20,
    flexDirection: 'row',
  },
  ratingText: {
    fontSize: 12,
    marginLeft: 5,
    fontWeight: '700',
    lineHeight: 18,
    color: '#352C48',
  },
  restaurantInfoContainer: {
    marginHorizontal: 10,
    marginTop: 10,

  },
  restaurantName: {
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 21,
    color: '#000000',
  },
  restaurantDescription: {
    color: '#9DB2BF',
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '400',
  },
  iconTextContainer: {
    flexDirection: 'row',
    marginTop: 5,
  },
  iconText: {
    color: '#9DB2BF',
    marginLeft: 5,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '400',
  },
  foodContainer: {
    borderRadius: 10,
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    flexDirection:'row',
    marginVertical: 10,
    padding: 10,
    marginHorizontal:20,
    paddingHorizontal:10,
    justifyContent: 'center',
  },
  foodImageContainer: {
    height:90,
    marginLeft:30,
    width:90,

  },
  foodImage: {
    height: '90%',
    width: '90%',
    borderRadius: 15,
    borderColor: '#7756FC',
  },
  foodInfoContainer: {
    marginLeft: 10,
  },
  foodTextContainer: {
    width: '82%',
  },
  foodName: {
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 30,
    color: '#000000',
  },
  foodDescription: {
    color: '#9DB2BF',
    fontSize: 10,
    lineHeight: 15,
    fontWeight: '400',
  },
  foodPriceContainer: {
    flexDirection: 'row',
    width: '82%',
    marginTop: 5,
    justifyContent: 'space-between',
  },
  foodPrice: {
    color: '#E79B3F',
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '700',
    marginTop: 5,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#9DB2BF',
  },
  foodListContainer: {
    marginTop: 10,
    flex: 1,
  },
});
