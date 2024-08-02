import {
  View,
  Text,
  Platform,
  Image,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  FlatList,
  PermissionsAndroid,
  StyleSheet,
  Alert,
  ImageBackground,
} from 'react-native';
import notifee, { AndroidImportance } from '@notifee/react-native';


import React, { useEffect, useState } from 'react';
import messaging from '@react-native-firebase/messaging';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Down from '../../assets/sgv/down.svg';
import Searchbar from '../../configs/Searchbar';
import Star from '../../assets/sgv/star.svg';
import Pin from '../../assets/sgv/Pin.svg';
import Clock from '../../assets/sgv/Clock.svg';
import { styles } from '../../configs/Styles';
import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native';
import ScreenNameEnum from '../../routes/screenName.enum';
import PopularDishList from '../../configs/PopularDishList';
import Search_Restaurants from './SearchRestaurant';
import Navigate from '../../assets/sgv/Navigate.svg';
import Search from '../../assets/sgv/OrangeSearch.svg';
import OrangePin from '../../assets/sgv/OrangePin.svg';
import { SliderBox } from 'react-native-image-slider-box';
import { Add_FavoriteList, get_HomeDashBoard, get_Profile, get_RestauRantDetails } from '../../redux/feature/featuresSlice';
import { useDispatch, useSelector } from 'react-redux';
import Loading from '../../configs/Loader';
import FavAdd from '../../assets/sgv/addFav.svg';
import Fav from '../../assets/sgv/Favorites.svg';
import Geolocation from 'react-native-geolocation-service';
import Ratting from '../../configs/Ratting';
import { getCurrentLocation, locationPermission } from '../../configs/helperFunction';
import { notificationListener, requestUserPermission } from './NotificationComponent';
import { useLocation } from '../../configs/LocationContext';


export default function Home() {
  const [ShowSearch, setShowSearch] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const isLoading = useSelector(state => state.feature.isLoading);
  const DashBoardData = useSelector(state => state.feature.DashboardList);
  const UserData = useSelector(state => state.feature?.getProfile);
  const user = useSelector(state => state.auth.userData);
  const { locationName, setLocationName } = useLocation(); // Get locationName and setLocationName from context

 
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

  const searchDataByName = query => {
    const lowercaseQuery = query.toLowerCase();
    const filteredData = DashBoardData?.top_rated_restaurants.filter(item =>
      item.res_name.toLowerCase().includes(lowercaseQuery),
    );
    return filteredData;
  };
  const LocationItem = ({ item }) => {
    return (
      <View
        style={{
          paddingVertical: 10,
          height: hp(8),
          marginHorizontal: 15,
          flexDirection: 'row',
          alignItems: 'center',
          borderBottomWidth: 1,
          borderBottomColor: '#ccc',
        }}>
        <View>
          <OrangePin />
        </View>

        <View style={{ width: '80%', marginLeft: 10 }}>
          <Text
            style={{
              fontWeight: '500',
              lineHeight: 15,
              fontSize: 14,
              color: '#777777',
            }}>
            {item.location}
          </Text>
        </View>
      </View>
    );
  };

  const FooterComponent = () => {
    return (
      <View
        style={{
          paddingVertical: 10,
          marginHorizontal: 15,
          marginTop: hp(3),
          flexDirection: 'row',
          alignItems: 'center',
          borderBottomWidth: 1,
          borderBottomColor: '#ccc',
        }}>
        <View>
          <Search />
        </View>
        <View style={{ width: '80%', marginLeft: 10 }}>
          <Text
            style={{
              fontWeight: '500',
              lineHeight: 15,
              fontSize: 14,
              color: '#777777',
            }}>
            Nearby
          </Text>
        </View>
      </View>
    );
  };
  const setSearch = () => {
    setShowSearch(true);
  };
  const navigation = useNavigation();
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
          paddingBottom:10,

        },
      ]}>
      <Image
        source={{ uri: item.rescat_image }}
        style={{
          height: 70,
          width: 90,
          borderRadius: 10,

        }}
      />
      <Text
        style={{
          fontSize: 10,
          fontWeight: '600',
          marginLeft: 10,
          lineHeight: 18,
          color: '#352C48',
          marginTop: 5
        }}>
        {item.rescat_name?.substring(0, 20)}
      </Text>
    </TouchableOpacity>
  );

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
  height:hp(35)
        },
      ]}>

      <View
        style={{
          height: '50%',
          marginTop: 5,
          width: '100%',
        }}>
        <Image
          source={{ uri: item.res_image }}
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
          {item.res_name?.substring(0, 30)}
        </Text>
        <Text
          style={{
            color: '#9DB2BF',
            fontSize: 10,
            lineHeight: 18,
            fontWeight: '400',
          }}>
          {item.res_description?.substring(0, 40)}
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
            {item.res_address?.substring(0, 25)}
          </Text>
        </View>
        <View style={{
          flexDirection: 'row',

          marginVertical: 5, alignItems: 'center',
        }}>

          <Ratting Ratting={item.res_average_rating} />
          <Text style={{ fontSize: 10, fontWeight: '600', color: '#000', marginLeft: 5 }}>{item.res_average_rating} ({item.res_rating_count} )</Text>
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
        style={{ alignSelf: 'flex-end', marginTop: 10, position: 'absolute', bottom: 10, right: 10 }}>
        {item.fav ? <FavAdd /> : <Fav />}
      </TouchableOpacity>
    </TouchableOpacity>
  )}

  const SearchTxt = txt => {
    if (txt == '') {
      setSearchResults(DashBoardData?.top_rated_restaurants);
      setShowSearch(false);
    } else {
      const results = searchDataByName(txt);
      setSearchResults(results);
      setShowSearch(true);
    }
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
  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };
  return (
    <View style={{ flex: 1, backgroundColor: '#fff', paddingHorizontal: 10 }}>
      {isLoading ? <Loading /> : null}
      {Platform.OS === 'ios' ? (
        <View style={{ height: 10 }} />
      ) : (
        <View style={{ height: 0 }} />
      )}
      <ScrollView showsVerticalScrollIndicator={false}>
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
            <View style={{ marginTop: 20 }}>
              {images && <SliderBox
            
     
                images={images}

                style={{ borderRadius: 15, height: hp(20), width: '92%', }}
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
                autoplayInterval={3000}
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

              <TouchableOpacity
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
            </View>

            <FlatList
              data={DashBoardData?.categories}
              renderItem={renderItem}
              keyExtractor={item => item.id}
              horizontal={true}
              showsHorizontalScrollIndicator={false} // Optional: hide horizontal scroll indicator
            />


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

              <TouchableOpacity

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
              </TouchableOpacity>
            </View>
            <View style={{ paddingVertical: 15 }}>
              <PopularDishList data={DashBoardData?.popular_dishes} home={true} />
            </View>
            {!ShowSearch && (
              <View style={{ flex: 1 }}>
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
               Coupons For You
              </Text>
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
                      renderItem={({item}) => {
                        const randomColor = getRandomColor();
                        return (   <TouchableOpacity

                       onPress={()=>{
                        navigation.navigate(ScreenNameEnum.CART_STACK);
                       }}
                          style={{ width: wp(30),
                            alignItems:'center',justifyContent:'center',
                            height: hp(18), marginRight:10 }}
                          >
<Image source={require('../../assets/croping/offerBg.png')} 
resizeMode='contain'
style={{height:'100%',width:'100%',}}
/>
<View style={{position:'absolute',justifyContent:'center',alignItems:'center'}}>
<Image source={{uri:item.ban_image}} 

style={{height:45,width:45,borderRadius:22.5,}}
/>
  <Text style={{fontSize:10,   color: randomColor || '#000',fontWeight:'600',marginTop:10}} >-{item.ban_name?.toUpperCase()}-</Text>
  <Text style={{fontSize:14,   color: randomColor || '#000',fontWeight:'800',textAlign:'center',marginTop:5}} >{item.ban_description?.toUpperCase()}</Text>
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

              <TouchableOpacity
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
              </TouchableOpacity>
            </View>
            <View style={{ marginTop: 10,paddingVertical:10,flex:1 }}>
              <FlatList
                data={DashBoardData?.top_rated_restaurants}
                scrollEnabled={false}
                numColumns={2}
                renderItem={TopRateRestaurant}
                showsVerticalScrollIndicator={false}
              />
            </View>
          </View>
        )}

        {ShowSearch && (
          <TouchableOpacity
          onPress={()=>{
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

                  <View style={{ marginTop: 20, height: hp(60) }}>
                    <FlatList
                      data={LocationData}
                      renderItem={LocationItem}
                      keyExtractor={item => item.id}
                      ListFooterComponent={FooterComponent}
                    />
                  </View>
                </View>
              </>
            )}

            {searchResults !== 0 && (
              <>
                <FlatList
                  data={searchResults}
                  numColumns={2}
                  renderItem={TopRateRestaurant}
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



