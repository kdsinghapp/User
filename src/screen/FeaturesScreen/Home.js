import {
  View,
  Text,
  Platform,
  Image,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  FlatList,
  StyleSheet,
  Alert,
  ImageBackground,
  BackHandler,
  RefreshControl,
  Dimensions,
  Pressable
} from 'react-native';


import React, { useEffect, useState } from 'react';

import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Down from '../../assets/sgv/down.svg';
import Searchbar from '../../configs/Searchbar';

import Clock from '../../assets/sgv/Clock.svg';
import { styles } from '../../configs/Styles';
import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native';
import ScreenNameEnum from '../../routes/screenName.enum';
import PopularDishList from '../../configs/PopularDishList';

import Navigate from '../../assets/sgv/Navigate.svg';
import { Add_FavoriteList, get_HomeDashBoard, get_Profile, get_RestauRantDetails, get_popular_dish, get_top_rated_restaurants } from '../../redux/feature/featuresSlice';
import { useDispatch, useSelector } from 'react-redux';

import FavAdd from '../../assets/sgv/addFav.svg';
import Fav from '../../assets/sgv/Favorites.svg';

import Ratting from '../../configs/Ratting';
import { getCurrentLocation, locationPermission } from '../../configs/helperFunction';
import { notificationListener, requestUserPermission } from './NotificationComponent';
import { useLocation } from '../../configs/LocationContext';
import FastImage from 'react-native-fast-image'
import useBackHandler from '../../configs/useBackHandler';
const { width } = Dimensions.get('window'); // Get the screen width
 import {SliderBox}  from 'react-native-image-slider-box'

export default function Home() {
  const [refreshing, setRefreshing] = useState(false);

  const [ShowSearch, setShowSearch] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const isLoading = useSelector(state => state.feature.isLoading);
  const DashBoardData = useSelector(state => state.feature.DashboardList);
  const UserData = useSelector(state => state.feature?.getProfile);
  const user = useSelector(state => state.auth.userData);
  const { locationName, setLocationName } = useLocation(); // Get locationName and setLocationName from context
  const navigation = useNavigation();
  const PopularDish = useSelector(state => state.feature.PopularDish) || [];
  const getTopRated_restaurants = useSelector(state => state.feature.getTopRated_restaurants) || [];
  const [randomColor, setrandomColor] = useState('#000')
  useBackHandler(navigation, 'Home');

  useEffect(() => {
    const params = {
      token: user.token,
    };
    dispatch(get_Profile(params));
  }, [user]);
  React.useEffect(() => {
    notificationListener();

  }, []);

  const add_favrate = (id) => {


    try {
      const params = {
        fav_id: id,
        fav_type: 'Restaurant',
        token: user?.token
      }


      dispatch(Add_FavoriteList(params)).then(async (res) => {
        const params = {

          token: user?.token,

        }
        await dispatch(get_HomeDashBoard(params));
      })
    }
    catch (err) {
      console.log('RestaurantItemList', err);
    }

  }
  const onRefresh = () => {
    setRefreshing(true);
    // Simulate a network request or any async task
    setTimeout(() => {
      setRefreshing(false);
      // You can update your data here after refresh
    }, 2000); // 2 seconds delay for demonstration
  };

  useEffect(() => {
    // Set an interval to update the color every 2 seconds
    const interval = setInterval(() => {
      const newColor = getRandomColor();
      setrandomColor(newColor);
    }, 2000);

    // Listen for navigation events to clear the interval when navigating away
    const unsubscribe = navigation.addListener('blur', () => {
      clearInterval(interval);
    });

    // Cleanup the interval on component unmount and navigation unsubscribe
    return () => {
      clearInterval(interval);
      unsubscribe();
    };
  }, [navigation]);


  useEffect(() => {
    // Fetch live location and update locationName
    const fetchLiveLocation = async () => {
      const locPermissionDenied = await locationPermission();
      if (locPermissionDenied) {
        const { latitude, longitude } = await getCurrentLocation();


        const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.GOOGLE_MAPS_API_KEY}`;
        try {
          const res = await fetch(url);
          const json = await res.json();
          const city = findCityName(json);


          setLocationName(city);
        } catch (e) {
          console.log("Error fetching location:", e);
        }
      }
    };

    fetchLiveLocation();
  }, []);

  function findCityName(response) {
    const results = response.results;
    for (let i = 0; i < results.length; i++) {
      const addressComponents = results[i].address_components;
      for (let j = 0; j < addressComponents.length; j++) {
        const types = addressComponents[j].types;
        if (types.includes('locality') || types.includes('administrative_area_level_2')) {
          return addressComponents[j].long_name; // Return the city name
        }
      }
    }
    return null; // Return null if city name not found
  }

  useEffect(() => {
    get_Mydishes();
  }, [user]);

  const get_Mydishes = async () => {
    try {
      const params = {
        token: user?.token
      };

      await dispatch(get_popular_dish(params)).then(res => {
        // Set the filtered categories after 3 seconds

      });
    } catch (err) {
      console.log(err);
    }
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



  const setSearch = () => {
    setShowSearch(true);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity

      onPress={() => {
        navigation.navigate(ScreenNameEnum.CATEGORY_DISHES, { cat_id: item.rescat_id })
      }}
      style={[
        styles.shadow,
        {
          // justifyContent: 'center',
          // alignItems: 'center',
          backgroundColor: '#FFFFFF',
          marginHorizontal: 5,
          width: 90,
          borderRadius: 10,
          marginVertical: 10,
          paddingBottom: 10,

        },
      ]}>

      <FastImage
        style={{
          height: 70,
          width: 90,
          borderRadius: 10,

        }}
        source={{
          uri: item.rescat_image,

          priority: FastImage.priority.high,
        }}
        resizeMode={FastImage.resizeMode.cover}
      />


      <Text
        style={{
          fontSize: 10,
          fontWeight: '600',

          lineHeight: 12,
          color: '#352C48',
          marginTop: 5,
          textAlign: 'center'
        }}>
        {item.rescat_name?.substring(0, 20)}
      </Text>
    </TouchableOpacity>
  );
  function findGreatestDiscountCoupon(restaurant) {
    if (!restaurant.coupons || restaurant.coupons.length === 0) {
      return null; // No coupons available
    }

    let maxDiscountCoupon = restaurant.coupons[0]; // Start with the first coupon

    for (let i = 1; i < restaurant.coupons.length; i++) {
      if (parseFloat(restaurant.coupons[i].coupon_discount) > parseFloat(maxDiscountCoupon.coupon_discount)) {
        maxDiscountCoupon = restaurant.coupons[i];
      }
    }

    return maxDiscountCoupon;
  }

  const TopRateRestaurant = ({ item }) => {


    const myLocation = {
      latitude: UserData?.lat,
      longitude: UserData?.long
    };

    const restaurantLocation = {
      latitude: item?.res_latitude,
      longitude: item?.res_longitude
    };
    const distance = haversineDistance(myLocation, restaurantLocation);
    const greatestDiscountCoupon = findGreatestDiscountCoupon(item);
    console.log('item.res_image', greatestDiscountCoupon);
    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate(ScreenNameEnum.RESTAURANT_DETAILS, { res_id: item.res_id });
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
            height: hp(32)
          },
        ]}>

        <View
          style={{
            height: '50%',
            marginTop: 5,
            width: '100%',

          }}>

          <FastImage
            style={{
              height: '100%',
              width: '100%',
              borderRadius: 5,
            }}
            source={{
              uri: item.res_image != 'https://loveeatsdb.com/storage/app/restaurants/' ? item.res_image : 'https://www.generationsforpeace.org/wp-content/uploads/2018/03/empty-300x240.jpg',

              priority: FastImage.priority.high,
            }}
            resizeMode={FastImage.resizeMode.cover}
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
            {item.res_name?.substring(0, 30)}
          </Text>
          <Text
            style={{
              color: '#9DB2BF',
              fontSize: 10,
              lineHeight: 18,
              fontWeight: '400',
            }}>
            {item.res_description?.substring(0, 20)}
          </Text>

          <View style={{
            flexDirection: 'row',

            marginVertical: 5, alignItems: 'center',
          }}>

            <Ratting rating={item.res_average_rating} />
            <Text style={{ fontSize: 10, fontWeight: '600', color: '#000', marginLeft: 5 }}>{item.res_average_rating?.toFixed(1)} ({item.res_rating_count} )</Text>
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
            add_favrate(item.res_id)
          }}
          style={{ alignSelf: 'flex-end', marginTop: 10, position: 'absolute', bottom: greatestDiscountCoupon != null ? 40 : 10, right: 5 }}>
          {item.fav ? <FavAdd /> : <Fav />}
        </TouchableOpacity>
        {greatestDiscountCoupon != null &&
          <View style={{ position: 'absolute', top: -7, right: -7 }}>
            <Image source={require('../../assets/croping/redo.png')} style={{ height: 60, width: 60 }} />
          </View>
        }
        {greatestDiscountCoupon != null &&
          <View style={{
            backgroundColor: randomColor, position: 'absolute', bottom: 0, width: '106%', borderBottomRightRadius: 7, borderBottomLeftRadius: 7,
            zIndex: -1, height: 35,
            alignItems: 'center', justifyContent: 'center',
          }}>

            <Text style={{ fontSize: 18, color: '#fff', fontWeight: '800', marginTop: 5 }} >GET {greatestDiscountCoupon?.coupon_discount}% OFF</Text>

          </View>
        }
      </TouchableOpacity>
    )
  }
  const SearchData = ({ item }) => {

    const myLocation = {
      latitude: UserData?.lat,
      longitude: UserData?.long
    };

    const restaurantLocation = {
      latitude: item?.res_latitude ? item?.res_latitude : item?.res_data?.res_latitude,
      longitude: item?.res_longitude ? item?.res_longitude : item?.res_data?.res_longitude
    };
    const distance = haversineDistance(myLocation, restaurantLocation);

    return (
      <TouchableOpacity
        onPress={() => {

          if (item.res_id) {

            navigation.navigate(ScreenNameEnum.RESTAURANT_DETAILS, { res_id: item.res_id });
          } else {
            navigation.navigate(ScreenNameEnum.DISH_INFORMATION, { item: item })
          }
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
            height: hp(32)
          },
        ]}>

        <View
          style={{
            height: '50%',
            marginTop: 5,
            width: '100%',
          }}>

          <FastImage
            style={{
              height: '100%',
              width: '100%',
              borderRadius: 5,
            }}
            source={{
              uri: item?.restaurant_dish_name ? item.restaurant_dish_image : item.res_image,

              priority: FastImage.priority.high,
            }}
            resizeMode={FastImage.resizeMode.cover}
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
            {item?.restaurant_dish_name ? item.restaurant_dish_name : item.res_name?.substring(0, 30)}
          </Text>
          <Text
            style={{
              color: '#9DB2BF',
              fontSize: 10,
              lineHeight: 18,
              fontWeight: '400',
            }}>
            {item.res_description ? item.res_description?.substring(0, 20) : item.restaurant_dish_description?.substring(0, 20)}
          </Text>

          <View style={{
            flexDirection: 'row',

            marginVertical: 5, alignItems: 'center',
          }}>

            <Ratting Ratting={item.res_average_rating ? item.res_average_rating : item.restaurant_dish_rating} />
            <Text style={{ fontSize: 10, fontWeight: '600', color: '#000', marginLeft: 5 }}>{item.res_average_rating?.toFixed(1)} ({item.res_rating_count} )</Text>
          </View>




        </View>
        <TouchableOpacity
          disabled={item.fav}
          onPress={() => {
            add_favrate(item.res_id)
          }}
          style={{ alignSelf: 'flex-end', marginTop: 10, position: 'absolute', bottom: 10, right: 10 }}>
          {item.fav ? <FavAdd /> : <Fav />}
        </TouchableOpacity>
      </TouchableOpacity>
    )
  }

  const SearchTxt = (txt) => {

    // PopularDish
    // getTopRated_restaurants
    if (txt === '') {
      setSearchResults(DashBoardData?.top_rated_restaurants);
      setShowSearch(false);
    } else {
      const dishResults = searchDataByName(txt, PopularDish, 'restaurant_dish_name');
      const restaurantResults = searchDataByName(txt, getTopRated_restaurants, 'res_name');
      const combinedResults = [...dishResults, ...restaurantResults];

      setSearchResults(combinedResults);
      setShowSearch(true);
    }
  };

  const searchDataByName = (txt, data, key) => {
    if (!data) return [];
    return data.filter(item => item[key].toLowerCase().includes(txt.toLowerCase()));
  };



  const dispatch = useDispatch();
  const isFocuss = useIsFocused();
  const params = {
    token: user.token
  }
  useEffect(() => {
    dispatch(get_HomeDashBoard(params));
  }, [isFocuss]);
  const images = DashBoardData && DashBoardData?.banners?.map(banner => banner.ban_image)
  function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }


  useEffect(() => {
    get_MyRestaurant();
  }, [user]);





  const get_MyRestaurant = async () => {
    try {


      const params = {

        token: user?.token
      };
      await dispatch(get_top_rated_restaurants(params)).then(res => {

      })
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff', paddingHorizontal: 10 }}>
      {/* {isLoading ? <Loading /> : null} */}
      {Platform.OS === 'ios' ? (
        <View style={{ height: 10 }} />
      ) : (
        <View style={{ height: 0 }} />
      )}
      <ScrollView showsVerticalScrollIndicator={false} refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
        {!ShowSearch && (
          <>
            <View
              style={{
                height: hp(12),
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate(ScreenNameEnum.SelectLocation);
                }}
                style={{}}>
                <Text
                  style={{
                    fontWeight: '500',
                    fontSize: 12,
                    lineHeight: 18,
                    color: '#878787',
                  }}>
                  Current location
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 5,
                  }}>
                  <Image
                    style={{ height: 20, width: 20 }}
                    resizeMode="contain"
                    source={require('../../assets/croping/Pin3x.png')}
                  />
                  <Text
                    style={{
                      fontWeight: '500',
                      fontSize: 14,
                      lineHeight: 21,
                      color: '#101010',
                      marginLeft: 5,
                    }}>
                    {locationName ? locationName?.substring(0, 15) : 'Fetching..'}
                  </Text>

                  <Down width={24} height={24} />
                </View>
              </TouchableOpacity>
              <View>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate(ScreenNameEnum.MsgNotification)
                    // requestUserPermission()
                  }}
                >
                  <Image
                    source={require('../../assets/croping/Notification3x.png')}
                    resizeMode="contain"
                    style={{ height: 45, width: 45 }}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}
        {ShowSearch && (
          <View style={{ paddingHorizontal: 10 }}>
            {Platform.OS === 'ios' ? (
              <View style={{ height: 40 }} />
            ) : (
              <View style={{ height: 10 }} />
            )}
            <Text
              style={{
                fontWeight: '700',
                fontSize: 20,
                lineHeight: 30,
                color: '#000',
              }}>
              Search
            </Text>
          </View>
        )}

        <View style={{ marginTop: ShowSearch ? 20 : 0 }}>
          <Searchbar
            placeholder={'Search dishes, restaurants'}
            onSearchonFocus={setSearch}
            onSearchTxt={SearchTxt}
          />
        </View>
        {!ShowSearch && (
          <View style={{ flex: 1 }}>
            <View style={{ marginTop: 20, marginLeft: 7 }}>
              {images && <SliderBox

                resizeMode="cover"
                images={images}

                style={{
                  backgroundColor: '#f0f0f0',
                  borderRadius: 15, width: width * 0.92, height: (width * 0.92) * 9 / 16
                }} // Maintain 16:9 ratio
                onCurrentImagePressed={index =>
                  console.warn(`image ${index} pressed`)
                }
                currentImageEmitter={index =>
                  console.warn(`current pos is: ${index}`)
                }
                dotColor="green"
                dotStyle={{
                  width: 5,
                  height: 5,
                  borderRadius: 2.5,
                  marginLeft: -20,
                }}
                autoplay
                circleLoop
                autoplayInterval={5000}
              />
              }
            </View>

            <View
              style={{
                marginTop: 10,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: '700',
                  color: '#101010',
                  lineHeight: 27,
                }}>
                Popular Categories
              </Text>

               {DashBoardData?.categories?.length > 15 && <TouchableOpacity
                onPress={() => {
                  navigation.navigate(ScreenNameEnum.AllCategories)
                }}
                style={{ width: '15%' }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '500',
                    color: '#E79B3F',
                    lineHeight: 27,
                  }}>
                  See all
                </Text>
              </TouchableOpacity>
              }
            </View>

         {DashBoardData?.categories?.length > 0?   <FlatList
              data={DashBoardData?.categories?.slice(0, 15)}
              renderItem={renderItem}
              keyExtractor={item => item.id}
              horizontal={true}
              
              showsHorizontalScrollIndicator={false} // Optional: hide horizontal scroll indicator
          
              ListFooterComponent={() => (
                <Pressable 
                onPress={()=>{
                  navigation.navigate(ScreenNameEnum.AllCategories)
                }}
                style={[
                  styles.shadow,
                  {
                    // justifyContent: 'center',
                    // alignItems: 'center',
                    backgroundColor: '#f0f0f0',
                    marginHorizontal: 5,
                    width: 90,
                    height:120,
                    borderRadius: 10,
                    marginVertical: 10,
                    paddingBottom: 10,
                    alignItems:'center',
                    justifyContent:'center'
          
                  }]}
                  >
                  <Text style={{  color: '#E79B3F',fontWeight:'600',fontWeight:'600' }}>Click</Text> 
                  <Text style={{  color: '#E79B3F',fontWeight:'600',fontWeight:'600' }}>More</Text> 
                </Pressable>
              )}
          />:   <Text style={{ color: '#000', fontSize: 14, fontWeight: '500', textAlign: 'center', marginTop: 20 }}>No Popular Categories found</Text>
        
          
          }


            <View
              style={{
                marginTop: 10,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: '700',
                  color: '#101010',
                  lineHeight: 27,
                }}>
                Popular Dishes
              </Text>

              {DashBoardData?.popular_dishes?.length > 10 && <TouchableOpacity

                onPress={() => {
                  navigation.navigate(ScreenNameEnum.AllPopularDishes)
                }}
                style={{ width: '15%' }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '500',
                    color: '#E79B3F',
                    lineHeight: 27,
                  }}>
                  See all
                </Text>
              </TouchableOpacity>}
            </View>
            {DashBoardData?.popular_dishes?.length > 0 ?
              <View style={{ paddingVertical: 15 }}>
                <PopularDishList data={DashBoardData?.popular_dishes?.slice(0, 10)} home={true} />
              </View>
              : <Text style={{ color: '#000', fontSize: 14, fontWeight: '500', textAlign: 'center', marginTop: 20 }}>No Popular dishes found</Text>
            }
            {!ShowSearch && (
              <View style={{ flex: 1 }}>
                <View
                  style={{
                    marginTop: 10,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  {DashBoardData?.offer_banners.length > 0 &&
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: '700',
                        color: '#101010',
                        lineHeight: 27,
                      }}>
                      Coupons For You
                    </Text>
                  }
                  {/* <TouchableOpacity

                onPress={() => {
                  navigation.navigate(ScreenNameEnum.AllPopularDishes)
                }}
                style={{ width: '15%' }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '500',
                    color: '#E79B3F',
                    lineHeight: 27,
                  }}>
                  See all
                </Text>
              </TouchableOpacity> */}
                </View>
                <View style={{ marginTop: 20 }}>
                  {DashBoardData?.offer_banners &&

                    <FlatList
                      data={DashBoardData?.offer_banners}
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      renderItem={({ item }) => {
                        const randomColor = getRandomColor();
                        return (<TouchableOpacity

                          onPress={() => {
                            navigation.navigate(ScreenNameEnum.CART_STACK);
                          }}
                          style={{
                            width: wp(30),
                            alignItems: 'center', justifyContent: 'center',
                            height: hp(18), marginRight: 10
                          }}
                        >
                          <Image source={require('../../assets/croping/offerBg.png')}
                            resizeMode='contain'
                            style={{ height: '100%', width: '100%', }}
                          />
                          <View style={{ position: 'absolute', justifyContent: 'center', alignItems: 'center' }}>
                            <Image source={{ uri: item.ban_image }}

                              style={{ height: 45, width: 45, borderRadius: 22.5, }}
                            />
                            <Text style={{ fontSize: 10, color: randomColor || '#000', fontWeight: '600', marginTop: 10 }} >-{item.ban_name?.toUpperCase()}-</Text>
                            <Text style={{ fontSize: 14, color: randomColor || '#000', fontWeight: '800', textAlign: 'center', marginTop: 5 }} >{item.ban_description?.toUpperCase()}</Text>
                          </View>


                        </TouchableOpacity>)
                      }}
                    />
                  }
                </View>
              </View>
            )}
            <View
              style={{
                marginTop: 10,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: '700',
                  color: '#101010',
                  lineHeight: 27,
                }}>
                Top Rated Restaurant
              </Text>

              {DashBoardData?.top_rated_restaurants?.length > 10 && <TouchableOpacity
                onPress={() => {
                  navigation.navigate(ScreenNameEnum.getTopRatedRestaurants)
                }}
                style={{ width: '15%' }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '500',
                    color: '#E79B3F',
                    lineHeight: 27,
                  }}>
                  See all
                </Text>
              </TouchableOpacity>}
            </View>
            <View style={{ marginTop: 10, paddingVertical: 10, flex: 1 }}>
              {DashBoardData?.top_rated_restaurants?.length > 0 ? <FlatList
                data={DashBoardData?.top_rated_restaurants?.slice(0, 10)}
                scrollEnabled={false}
                numColumns={2}
                renderItem={TopRateRestaurant}
                showsVerticalScrollIndicator={false}
              />

                : <Text style={{ color: '#000', fontSize: 14, fontWeight: '500', textAlign: 'center', marginTop: 20 }}>No top  restaurants found</Text>
              }
            </View>
          </View>
        )}

        {ShowSearch && (
          <TouchableOpacity
            onPress={() => {
              setShowSearch(false)
            }}
          >
            {searchResults.length === 0 && (
              <>
                <View
                  style={{
                    height: hp(5),
                    marginHorizontal: 10,
                    alignItems: 'center',
                    marginTop: 10,
                    flexDirection: 'row',
                  }}>
                  <Navigate />
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

                <View style={{ marginTop: 20, flex: 1 }}>
                  {/* <View
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
                  </View> */}

                  {/* <View style={{ marginTop: 20, height: hp(60) }}>
                    <FlatList
                      data={LocationData}
                      renderItem={LocationItem}
                      keyExtractor={item => item.id}
                      ListFooterComponent={FooterComponent}
                    />
                  </View> */}
                </View>
              </>
            )}

            {searchResults !== 0 && (
              <>
                <FlatList
                  data={searchResults}
                  numColumns={2}
                  renderItem={SearchData}
                  keyExtractor={item => item.id}
                  showsHorizontalScrollIndicator={false} // Optional: hide horizontal scroll indicator
                />
              </>
            )}
          </TouchableOpacity>
        )}

      </ScrollView>
    </View>
  );
}




const LocationData = [{ id: '1', location: 'Indore' }];

const Styles = StyleSheet.create({
  smallTxt: { fontSize: 10, fontWeight: '700', lineHeight: 14, color: '#777777' },
});



