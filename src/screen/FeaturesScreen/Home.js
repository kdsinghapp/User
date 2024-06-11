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
} from 'react-native';
import React, { useEffect, useState } from 'react';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import Down from '../../assets/sgv/down.svg';
import Searchbar from '../../configs/Searchbar';
import Star from '../../assets/sgv/star.svg';
import Pin from '../../assets/sgv/Pin.svg';
import Clock from '../../assets/sgv/Clock.svg';
import { styles } from '../../configs/Styles';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import ScreenNameEnum from '../../routes/screenName.enum';
import PopularDishList from '../../configs/PopularDishList';
import Search_Restaurants from './SearchRestaurant';
import Navigate from '../../assets/sgv/Navigate.svg';
import Search from '../../assets/sgv/OrangeSearch.svg';
import OrangePin from '../../assets/sgv/OrangePin.svg';
import { SliderBox } from 'react-native-image-slider-box';
import { Add_FavoriteList, get_HomeDashBoard, get_RestauRantDetails } from '../../redux/feature/featuresSlice';
import { useDispatch, useSelector } from 'react-redux';
import Loading from '../../configs/Loader';
import FavAdd from '../../assets/sgv/addFav.svg';
import Fav from '../../assets/sgv/Favorites.svg';
import Geolocation from 'react-native-geolocation-service';
import Ratting from '../../configs/Ratting';
export default function Home() {
  const [ShowSearch, setShowSearch] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const isLoading = useSelector(state => state.feature.isLoading);
  const DashBoardData = useSelector(state => state.feature.DashboardList);
  const user = useSelector(state => state.auth.userData);
  const [origin, setOrigin] = useState({ latitude: 22.701384, longitude: 75.867401 });
  const [locationName, setLocationName] = useState('');

  useEffect(() => {
    getLiveLocation()
  }, [user])
  const add_favrate = (id) => {


    try {
      const params = {
        fav_id: id,
        fav_type: 'Restaurant',
        token: user?.token
      }


      dispatch(Add_FavoriteList(params)).then(res => {
        const params = {
          data: {
            token: user?.token,
          },
        }
        dispatch(get_HomeDashBoard(params));
      })
    }
    catch (err) {
      console.log('RestaurantItemList', err);
    }

  }
  const getLiveLocation = () => {
    Geolocation.getCurrentPosition(
      async (position) => {
        console.log(position);
        const { latitude, longitude } = position.coords;
        setOrigin({ latitude, longitude });

        try {
          const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyADzwSBu_YTmqWZj7ys5kp5UcFDG9FQPVY`);
          const responseData = await response.json();

          console.log(responseData, 'responseData');

          if (responseData.results && responseData.results.length > 0) {
            // Extracting the main location from the address components
            const mainLocation = responseData.results[0].address_components.find(component =>
              component.types.includes('locality') || component.types.includes('administrative_area_level_1')
            );
            setLocationName(mainLocation ? mainLocation.long_name : 'Unknown location');

            // Extracting x-goog-maps-metro-area header
            const metroArea = response.headers.map['x-goog-maps-metro-area'];
            console.log('Metro Area:', metroArea);
          } else {
            setLocationName('Unknown location');
          }
        } catch (error) {
          console.error('Geocoding error:', error.message);
          setLocationName('Error retrieving location');
        }
      },
      (error) => {
        console.error(error);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };
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
          width:90,
          borderRadius: 10,
          marginVertical:10

        },
      ]}>
      <Image
        source={{ uri: item.rescat_image }}
        style={{
          height: 70,
          width:90,
          borderRadius: 10,

          borderWidth: 2,

        }}
      />
      <Text
        style={{
          fontSize: 12,
          fontWeight: '600',
          marginLeft: 10,
          lineHeight: 18,
          color: '#352C48',
          marginTop:5
        }}>
        {item.rescat_name?.substring(0, 20)}
      </Text>
    </TouchableOpacity>
  );

  const TopRateRestaurant = ({ item }) => (
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
          width: widthPercentageToDP(45),
          height: hp(40),
          marginVertical: 10,
        },
      ]}>
      <TouchableOpacity
      disabled={item.fav}
        onPress={() => {
          add_favrate(item.res_id)
        }}
        style={{ alignSelf: 'flex-end', marginTop: 10 }}>
        {item.fav ? <FavAdd /> : <Fav />}
      </TouchableOpacity>
      <View
        style={{
          height: '40%',
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
        />
      </View>
      <View style={{flexDirection:'row',marginVertical:5,alignItems:'center',marginLeft:-6}}>

<Ratting  Ratting={item.res_average_rating}/>
<Text style={{fontSize:10,fontWeight:'600',color:'#000',marginLeft:5}}>{item.res_average_rating} ({item.res_rating_count} )</Text>
</View>
      <View style={{}}>
        <Text
          style={{
            fontSize: 14,
            fontWeight: '700',
            lineHeight: 21,
            color: '#000000',
          }}>
          {item.res_name}
        </Text>
        <Text
          style={{
            color: '#9DB2BF',
            fontSize: 12,
            lineHeight: 18,
            fontWeight: '400',
          }}>
          {item.res_description?.substring(0, 50)}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            marginTop: 10,

            paddingRight: 10,
          }}>
          <Pin height={20} width={20} style={{ marginTop: 0 }} />
          <Text
            style={{
              color: '#9DB2BF',
              marginLeft: 5,
              fontSize: 10,
              lineHeight: 18,
              fontWeight: '400',
              paddingHorizontal: 5
            }}>
            {item.res_address?.substring(0, 25)}
          </Text>
        </View>
        <View
          style={{ flexDirection: 'row', marginTop: 5, alignItems: 'center' }}>
          <Clock height={20} width={20} />
          <Text
            style={{
              color: '#9DB2BF',
              marginLeft: 5,
              fontSize: 10,
              lineHeight: 18,
              fontWeight: '400',
            }}>
            15 min 1.5km. Free Delivery
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

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
              <View style={{}}>
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
                    {locationName == '' ? 'fetching..' : locationName}
                  </Text>

                  <Down width={24} height={24} />
                </View>
              </View>
              <View>
                <TouchableOpacity
                onPress={()=>{
                  navigation.navigate(ScreenNameEnum.MsgNotification)
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
                style={{ borderRadius: 30, height: hp(25), width: '92%' }}
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
                Categories
              </Text>

              <View style={{ width: '15%' }}>

              </View>
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
              
              onPress={()=>{
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
                 onPress={()=>{
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
            <View style={{ marginTop: 10 }}>
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
          <>
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
          </>
        )}
      </ScrollView>
    </View>
  );
}




const LocationData = [{ id: '1', location: 'Indore' }];

const Styles = StyleSheet.create({
  smallTxt: { fontSize: 10, fontWeight: '700', lineHeight: 14, color: '#777777' },
});

