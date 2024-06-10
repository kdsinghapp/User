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
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';

import Star from '../../assets/sgv/star.svg';
import BStar from '../../assets/sgv/StarBlack.svg';
import DarkStar from '../../assets/sgv/darkStar.svg';
import BlackPin from '../../assets/sgv/BlackPin.svg';
import PopularDishList from '../../configs/PopularDishList';
import RestaurantItemList from '../../configs/RestaurantItemList';
import ReviewList from '../../configs/ReviewList';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {get_RestauRantDetails} from '../../redux/feature/featuresSlice';
import Loading from '../../configs/Loader';
import RestaurantTime from './RestaurantTime';
import RestaurantReview from './Review';
export default function RestaurantDetails({route}) {
  const [showData, setShowData] = useState('Products');
  const {res_id} = route.params;
  const navigation = useNavigation();
  const RestauRantDetails = useSelector(  state => state.feature.ResturantDetails);
  const isLoading = useSelector(state => state.feature.isLoading);
  const user = useSelector(state => state.auth.userData);
  const dispatch = useDispatch();
  const isFocuss = useIsFocused();


  const params = {
    data: {
      restaurant_id: res_id,
    },
    token: user.token,
  };
  useEffect(() => {
    dispatch(get_RestauRantDetails(params));
  }, [isFocuss, res_id]);


  console.log(RestauRantDetails);


  const renderItem = ({item}) => (
    <TouchableOpacity
      onPress={() => {
        setShowData(item.name);
      }}
      style={[
        item.name === showData && styles.shadow  ,
        {
          justifyContent: 'center',
          alignItems: 'center',
          alignSelf: 'center',
          backgroundColor: item.name === showData ? '#7756FC' : '#FFF',
          height: 45,
          borderRadius: 30,
          width: 120,

          marginLeft: 10,
        },
      ]}>
      <Text
        style={{
          fontSize: 18,
          fontWeight: '500',

          lineHeight: 27,
          color: item.name === showData ? '#fff' : '#000',
        }}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );
  const RenderContactDetails = ({item, index}) => (
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
        <Image source={item.logo} style={{height: 60, width: 60}} />
      </View>
      <View style={{marginLeft: 10}}>
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
    <View style={{flex: 1}}>
      {isLoading ? <Loading /> : null}
   
        <ScrollView showsVerticalScrollIndicator={false}>
          <ImageBackground
            source={{uri: RestauRantDetails?.restaurant?.res_image}}
            style={{height: hp(28)}}>
            <View
              style={{
                height: hp(12),
                justifyContent: 'center',
                paddingHorizontal: 20,
              }}>
              <TouchableOpacity
                onPress={() => {
                  navigation.goBack();
                }}>
                <Image
                  source={require('../../assets/croping/Back-Navs2x.png')}
                  style={{height: 32, width: 32}}
                />
              </TouchableOpacity>
            </View>

            <View style={{height: hp(10), paddingHorizontal: 20}}>
              <Text
                style={{
                  fontWeight: '700',
                  lineHeight: 30,
                  fontSize: 20,
                  color: '#FFF',
                }}>
                {RestauRantDetails?.restaurant?.res_name}
              </Text>

              <View
                style={{
                  flexDirection: 'row',

                  height: hp(5),
                }}>
                <Image
                  style={{height: 25, width: 25}}
                  source={require('../../assets/croping/Pin2x.png')}
                />
                <Text
                  style={{
                    fontWeight: '500',
                    marginLeft: 10,
                    lineHeight: 18,
                    fontSize: 12,
                    color: '#FFF',
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

                  width: '33%',
                }}>
                <FlatList
                  horizontal={true}
                  data={StarData}
                  renderItem={({item, index}) => (
                    <>
                      {index + 1 < RestauRantDetails?.restaurant?.res_average_rating ? (
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
                  lineHeight: 18,
                  marginLeft: 10,
                  fontWeight: '700',
                  color: '#FFF',
                }}>
                {RestauRantDetails?.restaurant?.res_average_rating}
              </Text>
            </View>
          </ImageBackground>

          <View
            style={{flex: 1, backgroundColor: '#fff', paddingHorizontal: 10}}>
            <View style={{height: hp(10), justifyContent: 'center'}}>
              <FlatList
                data={data}
                renderItem={renderItem}
                scrollEnabled={false}
                horizontal={true}
                showsHorizontalScrollIndicator={false} // Optional: hide horizontal scroll indicator
              />
            </View>
            {showData == 'Products' && (
              <>
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
                <View style={{marginTop: 10}}>
                {RestauRantDetails?.popular_items &&  <PopularDishList data={res_id}  home={false}/> }
                </View>

                <View style={{marginTop: 10}}>
                <RestaurantItemList
                    data={res_id}
                  />
          
                </View>
              </>
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
                      <View style={{flexDirection: 'row'}}>
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
                            renderItem={({item, index}) => (
                              <>
                                {index + 1 <
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
                        <View style={{justifyContent: 'center',marginLeft:10}}>
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
                      style={{marginTop: 10, paddingVertical: 10, padding: 5}}>
                  <ReviewList data={RestauRantDetails?.review} /> 
                    </View>
                    <View
                      style={{alignItems: 'center', paddingVertical: hp(2)}}>
                      <View style={{alignSelf: 'center'}}>
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
                      <View style={{alignSelf: 'center'}}>
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
                    <RestaurantReview  restaurant={RestauRantDetails?.restaurant}/>


               
                    <View style={{height: hp(40)}} />
                  </>
                )}
          
           
              
                {showData == 'Information' && (
                  <>
                    <View
                      style={{
                        paddingHorizontal: 15,
                        paddingVertical:5,
                      
                        height:hp(10)
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
                      <Text style={styles.closedDay}>Closed on: {RestauRantDetails?.restaurant.res_weekly_closed}</Text>
                    </View>


                    <View
                      style={{                      
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
                        Restaurant timing
                      </Text>
                    </View>
<RestaurantTime   restaurant={RestauRantDetails?.restaurant} />
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
                    <TouchableOpacity
                      style={{height: hp(15), paddingHorizontal: 20}}>
                      <Image
                        source={require('../../assets/croping/Map3x.png')}
                        resizeMode="cover"
                        style={{
                          height: '100%',
                          width: '100%',
                          borderRadius: 10,
                        }}
                      />
                    </TouchableOpacity>
                  </>
                )}
            
          
          </View>
          <View style={{height: hp(5), backgroundColor: '#fff'}} />
        </ScrollView>
   
    </View>
  );
}


const styles= StyleSheet.create({
  closedDay: {
    fontSize: 16,
    color: '#E74C3C',
    marginBottom: 20,
  },
})
const data = [
  {id: 1, name: 'Products',},
  {id: 2, name: 'Review'},
  {id: 3, name: 'Information'},
];
const StarData = [{id: '1'}, {id: '2'}, {id: '3'}, {id: '4'}, {id: '5'}];

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
