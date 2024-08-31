import { View, Text,ScrollView,FlatList,TouchableOpacity,Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { get_top_rated_restaurants } from '../../redux/feature/featuresSlice';
import Loading from '../../configs/Loader';
import ProfileHeader from './ProfileHeader';
import Pin from '../../assets/sgv/Pin.svg';
import Clock from '../../assets/sgv/Clock.svg';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
  } from 'react-native-responsive-screen';
import { styles } from '../../configs/Styles';
import FavAdd from '../../assets/sgv/addFav.svg';
import Fav from '../../assets/sgv/Favorites.svg';
import Ratting from '../../configs/Ratting';
import ScreenNameEnum from '../../routes/screenName.enum';
import Searchbar from '../../configs/Searchbar';
export default function getTopRatedRestaurants() {

  const UserData = useSelector(state => state.feature?.getProfile);
    const navigation = useNavigation();
    const isLoading = useSelector(state => state.feature.isLoading);
    const getTopRated_restaurants = useSelector(state => state.feature.getTopRated_restaurants) || [];
    const user = useSelector(state => state.auth.userData);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredCategories, setFilteredCategories] = useState(getTopRated_restaurants);

    const dispatch = useDispatch()

    const handleSearch = (text) => {


      setSearchTerm(text);
      if (text) {
          const filtered = getTopRated_restaurants.filter((item) =>
              item?.res_name.toLowerCase().includes(text?.toLowerCase())
          );
          setFilteredCategories(filtered);
      } else {
          setFilteredCategories(getTopRated_restaurants);
      }
  };
  useEffect(() => {
    setFilteredCategories(getTopRated_restaurants);
}, [getTopRated_restaurants]);

    useEffect(() => {
        get_MyRestaurant();
    }, [user]);

    const get_MyRestaurant = async () => {
        try {


            const params = {
                
                token: user?.token
            };
            await dispatch(get_top_rated_restaurants(params)).then(res=>{
              setFilteredCategories(getTopRated_restaurants)
            })
        } catch (err) {
            console.log(err);
        }
    };


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
      height:hp(32)
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
              {item.res_description?.substring(0, 20)}
            </Text>
            
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

  return (
    <View style={{ flex: 1, backgroundColor: '#FFF', paddingHorizontal: 10 }}>
    <ScrollView showsVerticalScrollIndicator={false}>
        {isLoading ? <Loading /> : null}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ width: '90%' }}>
                <ProfileHeader name={'Restaurants'} />
            </View>

        </View>
        <View style={{ marginTop: 5 }}>
                    <Searchbar
                        placeholder={'Search dishes, restaurants'}
                      
                        onSearchTxt={handleSearch}
                        searchText={searchTerm}
                    />
                </View>
        <View style={{ marginTop: hp(3), flex: 1 }}>
            {filteredCategories.length > 0 ? (
                <FlatList
                    data={filteredCategories}
                    numColumns={2}
                    renderItem={TopRateRestaurant}

                />
            ) : (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ color: '#777777', fontSize: 12, fontWeight: '500' }}>
                        No Restaurant Found
                    </Text>
                </View>
            )}
        </View>
    </ScrollView>
</View>
  )
}