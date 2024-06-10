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
    widthPercentageToDP,
  } from 'react-native-responsive-screen';
import { styles } from '../../configs/Styles';
import FavAdd from '../../assets/sgv/addFav.svg';
import Fav from '../../assets/sgv/Favorites.svg';
import Ratting from '../../configs/Ratting';
import ScreenNameEnum from '../../routes/screenName.enum';
export default function getTopRatedRestaurants() {


    const navigation = useNavigation();
    const isLoading = useSelector(state => state.feature.isLoading);
    const getTopRated_restaurants = useSelector(state => state.feature.getTopRated_restaurants) || [];
    const user = useSelector(state => state.auth.userData);
    const [loading, setLoading] = useState(true);

    const dispatch = useDispatch()



    useEffect(() => {
        get_MyRestaurant();
    }, [user]);

    const get_MyRestaurant = async () => {
        try {


            const params = {
                
                token: user?.token
            };
            await dispatch(get_top_rated_restaurants(params));
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

  return (
    <View style={{ flex: 1, backgroundColor: '#FFF', paddingHorizontal: 10 }}>
    <ScrollView showsVerticalScrollIndicator={false}>
        {isLoading ? <Loading /> : null}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ width: '90%' }}>
                <ProfileHeader name={'Restaurants'} />
            </View>

        </View>
        <View style={{ marginTop: hp(3), flex: 1 }}>
            {getTopRated_restaurants.length > 0 ? (
                <FlatList
                    data={getTopRated_restaurants}
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