import {
  View,
  Text,
  ScrollView,
  Image,
  FlatList,
  TouchableOpacity,
  TextInput,
  ImageBackground,
  StyleSheet,
  Linking,
  Alert,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { heightPercentageToDP as hp, widthPercentageToDP } from 'react-native-responsive-screen';

import Star from '../../assets/sgv/star.svg';
import BStar from '../../assets/sgv/StarBlack.svg';
import DarkStar from '../../assets/sgv/darkStar.svg';
import BlackPin from '../../assets/sgv/BlackPin.svg';
import PopularDishList from '../../configs/PopularDishList';
import RestaurantItemList from '../../configs/RestaurantItemList';
import ReviewList from '../../configs/ReviewList';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { get_RestauRantDetails } from '../../redux/feature/featuresSlice';
import Loading from '../../configs/Loader';
import RestaurantTime from './RestaurantTime';
import RestaurantReview from './Review';
import ScreenNameEnum from '../../routes/screenName.enum';
import ProfileHeader from './ProfileHeader';
import useBackHandler from '../../configs/useBackHandler';
export default function RestaurantDetails({ route }) {
  const [showData, setShowData] = useState('Products');
  const { res_id } = route.params;
  const navigation = useNavigation();
  const RestauRantDetails = useSelector(state => state.feature.ResturantDetails);
  const isLoading = useSelector(state => state.feature.isLoading);
  const user = useSelector(state => state.auth.userData);
  const dispatch = useDispatch();
  const isFocuss = useIsFocused();
  useBackHandler(navigation, 'Details');

  const params = {
    data: {
      restaurant_id: res_id,
    },
    token: user.token,
  };
  useEffect(() => {
    dispatch(get_RestauRantDetails(params));
  }, [isFocuss, res_id]);



  const location = RestauRantDetails?.restaurant
  const openGoogleMaps = () => {
    // Get the latitude and longitude
    const lat = RestauRantDetails?.restaurant?.res_latitude;
    const long = RestauRantDetails?.restaurant?.res_longitude;

    // Check if lat and long are available
    if (!lat || !long) {
      Alert.alert('Error', 'Location data is not available');
      return;
    }

    // Google Maps URL with latitude and longitude
    const url = `https://www.google.com/maps/search/?api=1&query=${lat},${long}`;

    // Check if the device can open Google Maps
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          Linking.openURL(url);  // Open Google Maps
        } else {
          Alert.alert('Error', 'Google Maps is not available');
        }
      })
      .catch((err) => console.error('Error opening Google Maps:', err));
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        setShowData(item.name);
      }}
      style={[
        item.name === showData && styles.shadow,
        {
          justifyContent: 'center',
          alignItems: 'center',
          alignSelf: 'center',
          backgroundColor: item.name === showData ? '#7756FC' : '#FFF',
          height: 45,
          borderRadius: 30,
          width: widthPercentageToDP(28),

          marginLeft: 10,
        },
      ]}>
      <Text
        style={{
          fontSize: 16,
          fontWeight: '500',

          lineHeight: 27,
          color: item.name === showData ? '#fff' : '#000',
        }}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );
  const RenderContactDetails = ({ item, index }) => (
    <View
      style={{
        backgroundColor: '#F9F9F9',
        borderRadius: 15,
        alignItems: 'center',
        marginVertical: 10,
        height: 60,
        flexDirection: 'row',
      }}>
      <View>
        <Image source={item.logo} style={{ height: 60, width: 60 }} />
      </View>
      <View style={{ marginLeft: 10, width: '80%' }}>
        <Text
          style={{
            color: '#7756FC',
            fontSize: 16,
            fontWeight: '700',
            lineHeight: 24,
          }}>
          {item.titile}
        </Text>
        <Text
          style={{
            color: '#666666',
            fontSize: 12,
            fontWeight: '400',
            lineHeight: 18,
          }}>
          {index == 0 && RestauRantDetails.restaurant.res_address}
          {index == 1 && RestauRantDetails.restaurant.res_mobile}
          {index == 2 && RestauRantDetails.restaurant.res_email}
        </Text>
      </View>
    </View>
  );


  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {isLoading ? <Loading /> : null}
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={{ width: '90%' }}>
          <ProfileHeader name={'Restaurant Details'} />
        </View>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>


        <ImageBackground
          source={{ uri: RestauRantDetails?.restaurant?.res_image }}
          style={{ height: hp(28) }}>

        </ImageBackground>



        <View style={{ height: hp(10), paddingHorizontal: 10 }}>
          <Text
            style={{
              fontWeight: '700',
              lineHeight: 30,
              fontSize: 20,
              color: '#000',
            }}>
            {RestauRantDetails?.restaurant?.res_name}
          </Text>

          <View
            style={{
              flexDirection: 'row',

              height: hp(5),
            }}>
            <Image
              style={{ height: 25, width: 25 }}
              source={require('../../assets/croping/Pin2x.png')}
            />
            <Text
              style={{
                fontWeight: '500',
                marginLeft: 10,
                lineHeight: 18,
                fontSize: 12,
                color: '#000',
              }}>
              {RestauRantDetails?.restaurant?.res_address}
            </Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginLeft: 10,

              width: '35%',
            }}>
            <FlatList
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              data={StarData}
              renderItem={({ item, index }) => (
                <>
                  {index < Number(RestauRantDetails?.restaurant?.res_average_rating) ? (
                    <Star height={20} width={20} marginLeft={5} />
                  ) : (
                    <BStar height={20} width={20} marginLeft={5} />
                  )}
                </>
              )}
            />
          </View>

          <Text
            style={{
              fontSize: 12,
              lineHeight: 14,
              marginLeft: 5,
              fontWeight: '700',
              color: '#000',
            }}>
            {RestauRantDetails?.restaurant?.res_average_rating?.toFixed(1)}
          </Text>
        </View>




        <View
          style={{ flex: 1, backgroundColor: '#fff', paddingHorizontal: 10 }}>
          <View style={{ height: hp(10), justifyContent: 'center' }}>
            <FlatList
              data={data}
              renderItem={renderItem}
              scrollEnabled={false}
              horizontal={true}
              showsHorizontalScrollIndicator={false} // Optional: hide horizontal scroll indicator
            />
          </View>
          <View style={{ flex: 1 }}>
            {showData == 'Products' && (
              <View style={{ flex: 1 }}>
                <View
                  style={{
                    marginTop: 10,

                    paddingHorizontal: 10,

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

                  {/* <TouchableOpacity style={{width: '15%'}}>
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
                <View
                  style={{ flex: 1, backgroundColor: '#fff', paddingHorizontal: 10 }}>
                  {RestauRantDetails?.popular_items && <PopularDishList data={res_id} home={false} />}
                </View>

                <View style={{ marginTop: 10 }}>
                  <RestaurantItemList
                    data={res_id}
                  />

                </View>
              </View>
            )}



            {showData == 'Review' && (

              <>
                <View
                  style={{
                    marginTop: 10,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: 5,
                  }}>
                  <View style={{ flexDirection: 'row' }}>
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: '700',
                        color: '#101010',
                        lineHeight: 27,
                      }}>
                      Review
                    </Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginLeft: 10,

                        width: '45%',
                      }}>
                      <FlatList
                        horizontal={true}
                        data={StarData}
                        showsHorizontalScrollIndicator={false}
                        renderItem={({ item, index }) => (
                          <>
                            {index <
                              RestauRantDetails?.restaurant
                                .res_average_rating ? (
                              <Star height={20} width={20} marginLeft={5} />
                            ) : (
                              <BStar
                                height={20}
                                width={20}
                                marginLeft={5}
                              />
                            )}
                          </>
                        )}
                      />

                    </View>
                    <View style={{ justifyContent: 'center', marginLeft: 10, flexDirection: 'row', alignItems: 'center' }}>
                      <Text
                        style={{
                          fontSize: 12,
                          lineHeight: 18,
                          marginLeft: 10,
                          fontWeight: '700',
                          color: '#000',
                        }}>
                        {RestauRantDetails?.restaurant
                          .res_average_rating?.toFixed(1)}
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          lineHeight: 18,
                          marginLeft: 10,
                          fontWeight: '700',
                          color: '#000',
                        }}>
                        {`(${RestauRantDetails?.review.length})`}
                      </Text>
                    </View>
                  </View>

                </View>

                <View
                  style={{ marginTop: 10, paddingVertical: 10, padding: 5 }}>
                  <ReviewList data={RestauRantDetails?.review} />
                </View>
                <View
                  style={{ alignItems: 'center', paddingVertical: hp(2) }}>
                  <View style={{ alignSelf: 'center' }}>
                    <Text
                      style={{
                        fontSize: 14,
                        lineHeight: 21,
                        fontWeight: '400',
                        color: '#677294',
                      }}>
                      Click on the stars to leave your rating. The more
                    </Text>
                  </View>
                  <View style={{ alignSelf: 'center' }}>
                    <Text
                      style={{
                        fontSize: 14,
                        lineHeight: 21,
                        fontWeight: '400',
                        color: '#677294',
                      }}>
                      stars, the better the experience.
                    </Text>
                  </View>

                </View>
                <RestaurantReview restaurant={RestauRantDetails?.restaurant} />



                <View style={{ height: hp(40) }} />
              </>
            )}



            {showData == 'Information' && (
              <>
                <View
                  style={{
                    paddingHorizontal: 15,
                    paddingVertical: 5,

                    height: hp(10)
                  }}>
                  <Text
                    style={{
                      fontSize: 20,
                      lineHeight: 30,
                      fontWeight: '700',
                      color: '#000',
                    }}>
                    {RestauRantDetails?.restaurant.res_name}
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      lineHeight: 18,
                      fontWeight: '400',
                      color: '#6A6A6A',
                    }}>
                    {RestauRantDetails?.restaurant.res_description}
                  </Text>
                </View>


                <View
                  style={{
                    justifyContent: 'center',
                    paddingHorizontal: 15,
                    marginTop: 20

                  }}>
                  <Text style={styles.closedDay}>Closed on: {RestauRantDetails?.restaurant.res_weekly_closed}</Text>

                  <Text
                    style={{
                      fontSize: 20,
                      lineHeight: 30,
                      fontWeight: '800',
                      color: '#000',
                    }}>
                    Restaurant timing
                  </Text>
                </View>
                <RestaurantTime restaurant={RestauRantDetails?.restaurant} />
                <View
                  style={{
                    marginVertical: 10,
                    marginTop: 10,
                    justifyContent: 'center',
                    paddingHorizontal: 15,
                  }}>
                  <Text
                    style={{
                      fontSize: 20,
                      lineHeight: 30,
                      fontWeight: '800',
                      color: '#000',
                    }}>
                    Contact Details
                  </Text>
                </View>

                <View
                  style={{
                    paddingHorizontal: 15,
                    marginVertical: 10,
                    padding: 5,
                  }}>
                  <FlatList
                    data={ContactDetails}
                    renderItem={RenderContactDetails}
                    // keyExtractor={item => item.id}
                    showsVerticalScrollIndicator={false}
                  />
                </View>
                {location?.lat && location?.lon && <>
                  <View
                    style={{
                      paddingHorizontal: 15,
                      marginVertical: 15,
                      flexDirection: 'row',
                    }}>
                    <BlackPin />
                    <Text
                      style={{
                        fontSize: 14,
                        lineHeight: 21,
                        fontWeight: '600',
                        color: '#000',
                        marginLeft: 10,
                      }}>
                      Location
                    </Text>
                  </View>
                  <View

                    style={{ height: hp(15), paddingHorizontal: 20 }}>
                    <Image
                      source={require('../../assets/croping/Map3x.png')}
                      resizeMode="cover"
                      style={{
                        height: '100%',
                        width: '100%',
                        borderRadius: 10,
                      }}
                    />
                    <TouchableOpacity
                      style={{
                        position: 'absolute', alignSelf: 'center', top: '45%', backgroundColor: '#f0f0f0', padding: 8, borderRadius: 10, paddingHorizontal: 15
                      }}
                      onPress={() => {

                        openGoogleMaps()
                        // navigation.navigate(ScreenNameEnum.MAP_SCREEN, { item: { ...location, address: RestauRantDetails?.restaurant?.res_address, name: RestauRantDetails?.restaurant?.res_name } })
                      }}
                    >

                      <Text style={{ color: '#7756fc', fontWeight: '600', fontSize: 16 }}>Open</Text>
                    </TouchableOpacity>
                  </View>
                </>
                }
              </>
            )}
          </View>

        </View>
        <View style={{ height: hp(5), backgroundColor: '#fff' }} />
      </ScrollView>

    </View>
  );
}


const styles = StyleSheet.create({
  closedDay: {
    fontSize: 16,
    color: '#E74C3C',
    marginVertical: 10,

  },
})
const data = [
  { id: 1, name: 'Products', },
  { id: 2, name: 'Review' },
  { id: 3, name: 'Information' },
];
const StarData = [{ id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }, { id: '5' }];

const ContactDetails = [
  {
    id: '1',
    titile: 'Location',
    Details: 'Alice Springs NT 0870, Australia',
    logo: require('../../assets/croping/Location_ContactDetails.png'),
  },
  {
    id: '2',
    titile: 'Contact',
    Details: '865478596321',
    logo: require('../../assets/croping/Contact2x.png'),
  },
  {
    id: '3',
    titile: 'Email',
    Details: 'hashim@gmail.com',
    logo: require('../../assets/croping/Mail2x.png'),
  },
];
