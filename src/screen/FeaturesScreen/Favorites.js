import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Platform,
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
import Ratting from '../../configs/Ratting';

export default function Favorites() {
  const [chooseBtn, setChooseBtn] = useState(true);
  const dispatch = useDispatch();
  const isFocussed = useIsFocused();
  const user = useSelector(state => state.auth.userData);
  const FavoriteList = useSelector(state => state.feature?.FavoriteList);
  const UserData = useSelector(state => state.feature?.getProfile);
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
  const toRadians = (degree) => {
    return degree * (Math.PI / 180);
  }
  
  const haversineDistance = (coords1, coords2, unit = 'miles') => {
    const R = unit === 'miles' ? 3958.8 : 6371; // Radius of the Earth in miles or kilometers
    const lat1 = toRadians(coords1.latitude);
    const lon1 = toRadians(coords1.longitude);
    const lat2 = toRadians(coords2.latitude);
    const lon2 = toRadians(coords2.longitude);
  
    const dlat = lat2 - lat1;
    const dlon = lon2 - lon1;
  
    const a = Math.sin(dlat / 2) * Math.sin(dlat / 2) +
              Math.cos(lat1) * Math.cos(lat2) *
              Math.sin(dlon / 2) * Math.sin(dlon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
    const distance = R * c;
    return distance;
  }

const Restaurant = ({ item }) => {
    const myLocation = {
      latitude: UserData?.lat,
      longitude: UserData?.long
    };
    
    const restaurantLocation = {
      latitude: item?.restorent_data.res_latitude, 
      longitude: item?.restorent_data.res_longitude
    };
    const distance = haversineDistance(myLocation, restaurantLocation);

    return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate(ScreenNameEnum.RESTAURANT_DETAILS, { res_id: item.restorent_data.res_id });
      }}
      style={[
        styles.shadow,
        {
          paddingHorizontal: 5,
          marginHorizontal: 5,
          borderRadius: 10,
          backgroundColor: '#FFFFFF',
          width: wp(45),
          paddingVertical: 10,
          paddingBottom: 30,
          marginVertical: 10,
          height: hp(35)
        },
      ]}>

      <View
        style={{
          height: '50%',
          marginTop: 5,
          width: '100%',
        }}>
        <Image
          source={{ uri: item.restorent_data.res_image }}
          style={{
            height: '100%',
            width: '100%',
            borderRadius: 5,
          }}
          resizeMode='cover'
        />
      </View>

      <View style={{ marginTop: 5 }}>
        <Text
          style={{
            fontSize: 14,
            fontWeight: '700',
            lineHeight: 21,
            color: '#000000',
          }}>
          {item.restorent_data.res_name?.substring(0, 30)}
        </Text>
        <Text
          style={{
            color: '#9DB2BF',
            fontSize: 10,
            lineHeight: 18,
            fontWeight: '400',
          }}>
          {item.restorent_data.res_description?.substring(0,40)}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            marginTop: 5,


          }}>
          <Pin height={20} width={20} style={{ marginTop: 0 }} />
          <Text
            style={{
              color: '#9DB2BF',
              marginLeft: 5,
              fontSize: 10,
              lineHeight: 18,
              fontWeight: '400',

            }}>
            {item.restorent_data.res_address?.substring(0, 25)}
          </Text>
        </View>
        <View style={{
          flexDirection: 'row',

          marginVertical: 5, alignItems: 'center',
        }}>

          <Ratting Ratting={item.restorent_data.res_average_rating} />
          <Text style={{ fontSize: 10, fontWeight: '600', color: '#000', marginLeft: 5 }}>{item.restorent_data.res_average_rating} ({item.restorent_data.res_rating_count} )</Text>
        </View>



        <View
          style={{ flexDirection: 'row', marginTop: 5, alignItems: 'center' }}>
          <Clock height={20} width={20} />
          <Text
            style={{
              color: '#9DB2BF',
              marginLeft: 5,
              fontSize: 12,
              lineHeight: 18,
              fontWeight: '400',
            }}>
      {distance.toFixed(2)} miles.
          </Text>
        </View>
      </View>
      <TouchableOpacity
        disabled={item.fav}
        onPress={() => {
          delete_favorite(item.resfav_id);
        }}
        style={{ alignSelf: 'flex-end', marginTop: 10, position: 'absolute', bottom: 10, right: 10 }}>
         <FavAdd /> 
      </TouchableOpacity>
    </TouchableOpacity>
  )}

  const FOODS = ({ item }) => (
    <TouchableOpacity

      onPress={() => {
        navigation.navigate(ScreenNameEnum.DISH_INFORMATION, { item: item })
      }}
      style={[
        styles.shadow,
        {

          borderRadius: 10,
          marginVertical: 10,
          alignSelf: 'center',
          backgroundColor: '#FFFFFF',
          marginHorizontal: 10,
          width: wp(40),
          justifyContent: 'center',
          alignItems: 'center'
        },
      ]}>

      <View style={{
        marginTop: 5, paddingBottom: 10,

      }}>
        <Image
          resizeMode='cover'
          source={{ uri: item.dish_data.restaurant_dish_image }}
          style={{
            height: hp(11),
            width: wp(35),
            borderRadius: 15,
            borderColor: '#7756FC',
          }}
        />
      </View>
      <TouchableOpacity
        disabled={item.fav}
        onPress={() => {
          delete_favorite(item.resfav_id);
        }}


        style={{ alignSelf: 'flex-end', position: 'absolute', bottom: 10, right: 5 }}>
    <FavAdd height={22} />
      </TouchableOpacity>

      {/* <View style={{flexDirection:'row',marginVertical:5,alignItems:'center',
      marginLeft:-20}}>

      <Ratting  Ratting={item.restaurant_dish_rating}/>
      <Text style={{fontSize:10,fontWeight:'600',color:'#000',marginLeft:5}}>{item.restaurant_dish_rating}</Text>
      </View> */}

      <View style={{width:'80%'}}>

          <View style={{ }}>
            <Text
              style={{
                fontSize: 12,
                fontWeight: '700',
                lineHeight:14,
                color: '#000000',

              }}>
              {item.dish_data.restaurant_dish_name?.substring(0, 12)}
            </Text>

            {/* {props.showPlusIcon && <Plus height={25} width={25} />} */}
          </View>
          <View style={{}}>

            <Text
              style={{
                fontSize: 12,

                fontWeight: '700',
                lineHeight: 18,
                color: '#000',
              }}>
              Price: £{item.dish_data.restaurant_dish_price}
            </Text>
           
          </View>
          <Text
            style={{
              color: '#9DB2BF',
              fontSize: 12,
              lineHeight: 14,
              fontWeight: '500',
              marginVertical: 8,
            }}>
            {item.dish_data.restaurant_dish_preapare_time?.substring(0, 2)} min
          </Text>
     
      </View>
    </TouchableOpacity>
  );


  console.log('FavoriteList?.restaurants',FavoriteList?.restaurants);
  return (
    <View style={styles.container}>
     {Platform.OS === 'ios' ? (
          <View style={{height:40}} />
        ) : (
          <View style={{height: 10}} />
        )}
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
            numColumns={2}
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

    shadowColor: "#000",
shadowOffset: {
	width: 0,
	height: 2,
},
shadowOpacity: 0.25,
shadowRadius: 3.84,

elevation: 5,
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
    height: hp(45),
    marginVertical: 10,
    paddingVertical:20
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
