import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  TextInput,
  Alert,
  PermissionsAndroid,
  ActivityIndicator,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import Address from '../../assets/sgv/Address.svg';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { RadioButton } from 'react-native-paper';
import { styles } from '../../configs/Styles';
import Door from '../../assets/sgv/door.svg';
import AddPlus from '../../assets/sgv/AddPlus.svg';
import { useDispatch, useSelector } from 'react-redux';
import { Payment_api, addres_list, apply_coupon, create_order, general_setting, get_Profile, get_coupon_list, get_order_data_by_id } from '../../redux/feature/featuresSlice';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import ScreenNameEnum from '../../routes/screenName.enum';
import { errorToast } from '../../configs/customToast';
import { current } from '@reduxjs/toolkit';
import Geolocation from '@react-native-community/geolocation';
import Loading from '../../configs/Loader';
import { WebView } from 'react-native-webview';
import { getCurrentLocation, locationPermission } from '../../configs/helperFunction';

export default function Payment() {
  const [selectedItemIndex, setSelectedItemIndex] = useState(null);
  const isLoading2 = useSelector(state => state.feature.isLoading);
  const cartItem = useSelector(state => state.feature.cartItem);
  const user = useSelector(state => state.auth.userData);
  const generalInfo = useSelector(state => state.feature.generalInfo);
  const coupon_list = useSelector(state => state.feature.coupon_list);
  const PayMentStatus = useSelector(state => state.feature.PayMentStatus);
  const CouponCodeData = useSelector(state => state.feature.CouponCodeData);
  const [totalBill, setTotalBill] = useState(0);
  const [CurrentLocation, setCurrentLocation] = useState({});
  const [CouponCode, setCouponCode] = useState(0);
  const [instruction, setInstruction] = useState('');
  const [PaymentMode, setPaymentMode] = useState('')
  const [Camount, setCamount] = useState('');
  const [selectedPayment, setselectedPayment] = useState('Cash on Delivery');
  const getProfile = useSelector(state => state.feature?.getProfile);
  const dispatch = useDispatch();
  const isFocuse = useIsFocused()
  const [checkoutUrl, setCheckoutUrl] = React.useState(null);
  const [isLoading, setIsLoading] = useState(false);



  useEffect(() => {
    const params = {
      token: user.token,
    };
    dispatch(get_Profile(params));
    dispatch(general_setting(params));
    dispatch(get_coupon_list(params));
  }, [user, isFocuse]);

  const navigation = useNavigation()
  useEffect(() => {

    let total = 0;
    cartItem?.forEach(item => {
      total += item.dish_data.restaurant_dish_price * item.quantity;
    });
    setTotalBill(total);
  }, [cartItem,]);

  const Apply_Coupon = () => {
    console.log(Camount < totalBill);
    if (CouponCode == '') return errorToast('Please enter Coupon Code')
    if (totalBill < Camount) {
      return errorToast(`Minimum order ${Camount} required to use this coupon`);
    }


    const params = {
      coupon_code: CouponCode,
      token: user?.token
    }

    dispatch(apply_coupon(params)).then(res => {
      setCouponCode('')
    })
  }

  const FoosItems = ({ item }) => {


    let totalvalue = item.dish_data.restaurant_dish_price * item.quantity

    return (
      <TouchableOpacity
        style={[
          styles.shadow,
          {
            paddingHorizontal: 10,
            borderRadius: 10,

            alignSelf: 'center',
            backgroundColor: '#FFFFFF',
            marginVertical: 10,
            padding: 10,
            width: '95%',
            justifyContent: 'center',
          },
        ]}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View
            style={{
              height: 73.41,
              marginTop: 5,
              width: 73.41,
            }}>
            <Image
              source={{ uri: item.dish_data.restaurant_dish_image }}
              style={{
                height: '100%',
                width: '100%',
                borderRadius: 15,

                borderColor: '#7756FC',
              }}
              resizeMode="contain"
            />
          </View>

          <View
            style={{
              width: '47%',

              marginLeft: 10,
              justifyContent: 'center',
            }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: '700',
                lineHeight: 24,
                color: '#000000',
              }}>
              {item.dish_data.restaurant_dish_name}
            </Text>
            <Text
              style={{
                color: '#9DB2BF',
                fontSize: 10,
                lineHeight: 15,
                fontWeight: '400',
              }}>
              {item.dish_data.restaurant_dish_description}
            </Text>
            <Text
              style={{
                color: '#181818',
                fontSize: 12,
                fontWeight: '500',
                lineHeight: 18,
              }}>
              Quantity ({item.quantity})
            </Text>

          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '25%',

              alignItems: 'center',
            }}>

            <Text
              style={{
                color: '#E79B3F',
                fontSize: 12,
                lineHeight: 27,
                fontWeight: '700',
              }}>
              total value {(item.dish_data.restaurant_dish_price * item.quantity)}
            </Text>

          </View>
        </View>
      </TouchableOpacity>
    );
  }

  const renderItemCoupon = ({ item }) => (

    <TouchableOpacity
      onPress={() => {
        setCouponCode(item.coupon_code,)
        setCamount(item.min_order_amount)
      }}
      style={{
        height: hp(8),
        backgroundColor: CouponCode == item.coupon_code ? '#d0f5da' : '#fff',
        paddingHorizontal: 10, marginTop: 10,
        borderRadius: 15, width: wp(90), marginLeft: 10, shadowColor: "#000",
        marginVertical: 10,
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
        flexDirection: 'row', alignItems: 'center'
      }}>
      <Image
        style={{ height: 30, width: 30 }}
        source={require('../../assets/croping/discount.png')}
      />
      <View style={{ marginLeft: 10 }}>
        <Text style={{ fontSize: 16, fontWeight: '600', color: '#000' }}>

          {item.description} ₹{item.min_order_amount}
        </Text>
        <Text style={{ fontSize: 11, fontWeight: '600', color: '#777777' }}>
          USE {item.coupon_code}| ON SELECT ITEMS
        </Text>
      </View>
      {CouponCode == item.coupon_code &&
        <Text style={{ marginLeft: '15%', color: '#777777', fontWeight: '700' }}>Coupon Apply</Text>

      }
    </TouchableOpacity>
  )

  const get_order = async sts => {
    try {
      const params = {
        data: {
          user_id: user?.user_data.id,
          status: "Pending",
        },
        token: user?.token,
      };
      await dispatch(get_order_data_by_id(params));

    } catch (err) {
      console.error(err);
    }
  };
  


  const Stripe_api = () => {
    let Total = (totalBill + generalInfo?.tax + generalInfo?.delivery_charge) - (CouponCodeData?.coupon_discount || 0);

    if (PaymentMode == 'Cash') {
      book_order()
    }
    else {
      let data = new FormData();
      data.append('price', Total);
      data.append('email', user.user_data?.email);
      const params = {
        data: data
      }

      dispatch(Payment_api(params)).then(res=>{

        setCheckoutUrl(PayMentStatus?.url)
      })
      
    }

  }



  const book_order = async () => {



    let Total = (totalBill + generalInfo?.tax + generalInfo?.delivery_charge) - (CouponCodeData?.coupon_discount || 0);

    try {
      let data = new FormData();
      data.append('user_id', user?.user_data?.id.toString());
      data.append('total_price', Total.toString());
      data.append('lat', CurrentLocation.latitude);
      data.append('long', CurrentLocation.longitude);
      data.append('restaurant_id', cartItem[0]?.dish_data.restaurant_dish_restaurant_id.toString());
      data.append('address_id', getProfile?.address_data.address_id.toString());
      data.append('tax_amount', generalInfo?.tax.toString());
      data.append('coupon_amount', (CouponCodeData?.coupon_discount || 0).toString());
      data.append('sub_total', totalBill.toString());
      data.append('coupon_code', CouponCodeData?.coupon_code?.toString() || '');
      data.append('delivery_charge', generalInfo?.delivery_charge.toString());

      cartItem.forEach((dish, index) => {
        const orderDetail = {
          dish_id: dish.dish_data.restaurant_dish_id,
          quantity: dish.quantity,
          price_per_unit: dish.dish_data.restaurant_dish_price,
          totalprice: dish.dish_data.restaurant_dish_price * dish.quantity,
          dish_name: dish.dish_data.restaurant_dish_name,
        };

        // Serialize the order detail to a JSON string
        const orderDetailString = JSON.stringify(orderDetail);

        // Append the serialized string to the FormData object
        data.append(`order_details[${index}]`, orderDetailString);
      });

      const params = {
        data: data,
        token: user?.token,
        navigation: navigation,
      };

      // Dispatch the create_order action
      await dispatch(create_order(params)).then(res => {
        // Call the get_order function after order creation
        get_order();
        navigation.goBack()
      });
    } catch (err) {
      console.log(err);
    }
  };

  const calculateTotal = (totalBill, deliveryCharge, tax, discount) => {
    const bill = Number(totalBill) || 0;
    const delivery = Number(deliveryCharge) || 0;
    const taxAmount = Number(tax) || 0;
    const couponDiscount = Number(discount) || 0;
    return (bill + delivery + taxAmount - couponDiscount).toFixed(2);
  };
  const totalAmount = calculateTotal(
    totalBill,
    generalInfo?.delivery_charge,
    generalInfo?.tax,
    CouponCodeData?.coupon_discount
  );
  const handleNavigationStateChange = (navState) => {
    if (navState.url.includes('success-stripe')) {
      Alert.alert('Payment Success', 'Your payment was successful!');
      book_order();
      setCheckoutUrl(null);
    } else if (navState.url.includes('cancel-stripe')) {
      Alert.alert('Payment Cancelled', 'Your payment was cancelled.');
      setCheckoutUrl(null);
    }
  };

  const handleError = (error) => {
    console.error('WebView Error:', error);
    Alert.alert('Error', 'Failed to load payment page. Please try again later.');
    setCheckoutUrl(null);
  };
  return (
    <View style={{ paddingHorizontal: 10, backgroundColor: '#FFF', flex: 1 }}>

      {isLoading2 ? <Loading /> : null}
      {isLoading ? <Loading /> : null}
      {checkoutUrl ? (
       <WebView
       source={{ uri: checkoutUrl }}
       onNavigationStateChange={handleNavigationStateChange}
       onLoadStart={() => setIsLoading(true)}
       onLoadEnd={() => setIsLoading(false)}
       onError={handleError}
       style={styles.webView}
     />
      ) :
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ marginTop: 20, paddingHorizontal: 15 }}>
            <Text
              style={{
                fontWeight: '700',
                fontSize: 20,
                lineHeight: 30,
                color: '#000',
              }}>
              Delivery Orders
            </Text>
          </View>
          <View style={{ marginTop: 20, paddingBottom: 10, }}>
            <FlatList
              showsVerticalScrollIndicator={false}
              data={cartItem}
              renderItem={FoosItems}

            />
          </View>
          <View style={{ marginVertical: 10, paddingVertical: 10 }}>
            <View style={Styles.bill}>
              <View style={{}}>
                <Text style={Styles.txt}>Sub Total</Text>
              </View>
              <View style={{}}>
                <Text style={Styles.txt}>{totalBill}</Text>
              </View>
            </View>
            <View style={Styles.bill}>
              <View style={{}}>
                <Text style={Styles.txt}>Taxes & Fees</Text>
              </View>
              <View style={{}}>
                <Text style={Styles.txt}>{generalInfo?.tax}</Text>
              </View>
            </View>
            <View style={Styles.bill}>
              <View style={{}}>
                <Text style={Styles.txt}>Delivery Fees</Text>
              </View>
              <View style={{}}>
                <Text style={Styles.txt}>{generalInfo?.delivery_charge}</Text>
              </View>
            </View>
            {CouponCodeData && <View style={Styles.bill}>
              <View style={{}}>
                <Text style={Styles.txt}>Coupon offer ({CouponCodeData?.coupon_code})</Text>
              </View>
              <View style={{}}>
                <Text style={Styles.txt}>- {CouponCodeData?.coupon_discount}</Text>
              </View>
            </View>}


            <View style={Styles.bill}>
              <View style={{}}>
                <Text style={Styles.total}>Total</Text>
              </View>
              <View style={Styles.total}>
                <Text style={Styles.total}>{totalAmount}</Text>
              </View>
            </View>
          </View>
          <Text style={{ fontSize: 16, marginLeft: 15, fontWeight: '500', color: '#ff969f' }}>Available Coupons</Text>
          {coupon_list && <FlatList
            data={coupon_list}
            horizontal
            showsHorizontalScrollIndicator={false}

            renderItem={renderItemCoupon}
            contentContainerStyle={styles.flatlistContent}
          />}
          <View style={{
            flexDirection: 'row',

            justifyContent: 'space-between',
            alignItems: 'center', paddingHorizontal: 15
          }}>
            <View>
              <Image
                source={require('../../assets/croping/coupons.png')}

                style={{ height: 25, width: 25 }}
              />

            </View>
            <View style={{ marginLeft: 10, width: '70%', }}>
              <TextInput
                placeholder='enter coupon code'
                style={{ fontSize: 14, fontWeight: '600', color: '#777777' }}
                value={CouponCode}
                onChangeText={(txt) => setCouponCode(txt)}
              />
            </View>
            <TouchableOpacity
              onPress={() => {
                Apply_Coupon()
              }}
              style={{
                borderWidth: 2,
                borderColor: '#7ac48e',

                paddingHorizontal: 10, borderRadius: 5, paddingVertical: 3
              }}>
              <Text style={{ color: '#7ac48e', fontWeight: '600', fontSize: 14 }}>Apply</Text>
            </TouchableOpacity>
          </View>

          <View
            style={{
              marginVertical: 10,
              justifyContent: 'center',
              paddingHorizontal: 15,
            }}>
            <Text
              style={{
                color: '#9DB2BF',
                fontSize: 14,
                fontWeight: '400',
                lineHeight: 21,
              }}>
              Deliver address{' '}
            </Text>
          </View>
          {getProfile?.address_data  ? <View
            style={{
              paddingHorizontal: 15,
              paddingBottom: 10,
              marginTop: 10,
            }}>
            <View style={{ flexDirection: 'row' }}>
              <View style={Styles.add}>
                <Address />
              </View>

              <View
                style={{ justifyContent: 'center', marginLeft: 10, width: '90%' }}>
                <Text
                  style={{
                    fontSize: 12,
                    lineHeight: 20,
                    fontWeight: '500',
                    color: '#000000',
                    width: '80%'
                  }}>
                  {getProfile?.address_data.full_name} {' '}
                  House No- {getProfile?.address_data.house_no} {' '}
                  {getProfile?.address_data.landmark}{' '}
                  {getProfile?.address_data.city}{' '}
                  {getProfile?.address_data.pincode}{' '}
                  ({getProfile?.address_data.state}){' '}
                  Mobile {getProfile?.address_data.mobile_number}{' '}
                </Text>
              </View>
            </View>

         
            <TouchableOpacity
              onPress={() => {
                navigation.navigate(ScreenNameEnum.ADDRESS_SCREEN)
              }}
              style={{ marginTop: 20 }}>
              <Text
                style={{
                  fontSize: 12,
                  borderBottomWidth: 0.5,
                  width: '28%',
                  borderColor: '#7756FC',
                  fontWeight: '400',
                  color: '#7756FC',
                  lineHeight: 19.98,
                }}>
                Another Location
              </Text>
            </TouchableOpacity>

          </View>
            : <TouchableOpacity
              onPress={() => {
                navigation.navigate(ScreenNameEnum.ADDRESS_SCREEN)
              }}
              style={{ marginTop: 20, marginLeft: 15 }}>
              <Text
                style={{
                  fontSize: 16,


                  borderColor: '#7756FC',
                  fontWeight: '400',
                  color: '#7756FC',
                  lineHeight: 19.98,
                }}>
                Add delivery address
              </Text>
            </TouchableOpacity>
          }
       
       
      

          <View style={{ marginTop: 20, marginHorizontal: 10 }}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: '400',
                color: '#9DB2BF',
                lineHeight: 21,
              }}>
              Instructions
            </Text>
          </View>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center', paddingHorizontal: 15
          }}>
            <View>
              <Image
                source={require('../../assets/croping/conversation.png')}

                style={{ height: 25, width: 25 }}
              />

            </View>
            <View style={{ marginLeft: 10, width: '90%' }}>
              <TextInput
                placeholder='add delivery instructions '

                value={instruction}
                onChangeText={(txt) => setInstruction(txt)}
              />
            </View>

          </View>
          <View style={{
            paddingHorizontal: 15, paddingBottom: 20,

            marginTop: 20
          }}>
            <View>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: '#000000',
                  lineHeight: 24,
                  marginTop: 5,
                }}>
                Payment Options
              </Text>
            </View>
            <View
              style={[
                styles.shadow,
                {
                  backgroundColor: '#fff',
                  padding: 10,
                  borderRadius: 10,
                  marginTop: 10,
                },
              ]}>
              <FlatList
                scrollEnabled={false}
                data={PaymentOption}
                renderItem={({ item, index }) => (
                  <TouchableOpacity

                    onPress={() => {
                      setselectedPayment(item.name)
                      setPaymentMode(item.mode)
                    }}
                    style={{
                      height: 36,
                      borderRadius: 8,
                      marginTop: 10,
                      paddingHorizontal: 10,
                      backgroundColor: selectedPayment == item.name ? '#c9f5d4' : '#F5F5F5',
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}>
                    <View>
                      <Image
                        source={item.logo}
                        style={{ height: 20, width: 20, marginRight: 10 }}
                        resizeMode="contain"
                      />
                    </View>
                    <View
                      style={{
                        justifyContent: 'center',
                        width: '82%',
                      }}>
                      <View>
                        <Text
                          style={{
                            fontSize: 12,

                            color: '#606060',
                            fontWeight: '500',
                          }}>
                          {item.name}
                        </Text>
                      </View>
                    </View>
                    <View
                      style={{ justifyContent: 'center', alignItems: 'center' }}>
                      <RadioButton
                        value={item.id}
                        status={item.name == selectedPayment ? 'checked' : 'unchecked'}


                      />
                    </View>
                  </TouchableOpacity>
                )}

              />
            </View>
          </View>
          {/* {selectedPayment === 'Card' && <>
        <View style={{ paddingHorizontal: 15 }}>
          <View>
            <Text
              style={{
                fontSize: 16,
                fontWeight: '600',
                color: '#000000',
                marginTop: 15,
              }}>
              Credit & Debit Cards
            </Text>
          </View>
          <View
            style={[
              styles.shadow,
              {
                backgroundColor: '#fff',
                padding: 10,
                borderRadius: 10,
                marginTop: 20,
              },
            ]}>
            <FlatList
              scrollEnabled={false}
              data={card}
              renderItem={({ item, index }) => (
                <View
                  style={{
                    height: 36,
                    borderRadius: 8,
                    marginTop: 10,
                    paddingHorizontal: 10,
                    backgroundColor: '#F5F5F5',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  <View>
                    <Image
                      source={item.logo}
                      style={{ height: 20, width: 32 }}
                      resizeMode="contain"
                    />
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      width: '70%',
                    }}>
                    <View>
                      <Text
                        style={{
                          fontSize: 12,
                          lineHeight: 15.18,
                          color: '#606060',
                          fontWeight: '400',
                        }}>
                        {item.name}
                      </Text>
                    </View>
                    <View>
                      <Text
                        style={{
                          fontSize: 12,
                          lineHeight: 15.18,
                          color: '#606060',
                          fontWeight: '400',
                        }}>
                        {item.cardNo}
                      </Text>
                    </View>
                  </View>

                  <RadioButton
                    selected={selectedItemIndex === index}
                    onPress={() => handleItemSelect(index)}
                    color="#6D6EEC"
                    borderSize={1}
                    size={20}
                    borderColor="#6D6EEC"
                    se
                  />
                </View>
              )}
              keyExtractor={item => item.id}
            />
            <View
              style={{
                flexDirection: 'row',
                marginTop: 20,
                alignItems: 'center',
              }}>
              <View
                style={{
                  backgroundColor: '#D2EAFF',
                  height: 35,
                  width: 35,
                  borderRadius: 10,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <AddPlus />
              </View>
              <View
                style={{
                  width: '80%',
                  justifyContent: 'center',
                  marginLeft: 10,
                }}>
                <Text
                  style={{
                    color: '#606060',
                    fontSize: 14,
                    lineHeight: 21,
                    fontWeight: '400',
                  }}>
                  Add New Card
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View
          style={{



            paddingHorizontal: 15,
            marginVertical: 10
          }}>
          <View>
            <Text
              style={{
                fontSize: 14,
                lineHeight: 21,
                marginTop: 5,
                fontWeight: '500',
                color: '#000000',
              }}>
              Card Number
            </Text>
          </View>
          <View
            style={{
              height: 50,
              backgroundColor: '#F8F8F8',
              marginTop: 10,
              borderRadius: 12,
              paddingHorizontal: 10,
              justifyContent: 'center',
            }}>
            <TextInput
              placeholder="Enter 12 digit card number"
              placeholderTextColor={'#979797'}
              style={{ fontSize: 12, fontWeight: '400', lineHeight: 20 }}
            />
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingVertical: 10,
              alignItems: 'center',
              marginTop: 5,
            }}>
            <View
              style={{
                width: '40%',
                paddingHorizontal: 10,
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  fontSize: 14,
                  lineHeight: 21,
                  marginTop: 5,
                  fontWeight: '500',
                  color: '#000000',
                }}>
                Valid Thru
              </Text>
            </View>


            <View
              style={{
                width: '40%',
                paddingHorizontal: 10,
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  fontSize: 14,
                  lineHeight: 21,
                  marginTop: 5,
                  fontWeight: '500',
                  color: '#000000',
                }}>
                CVV
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingVertical: 10,
              alignItems: 'center',
              marginTop: 5,
            }}>
            <View style={{ width: '60%', flexDirection: 'row', justifyContent: 'space-between' }}>
              <View
                style={{
                  width: '48%',
                  paddingHorizontal: 10,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#F8F8F8',
                  borderRadius: 12
                }}>
                <TextInput placeholder='Month' s />
              </View>
              <View
                style={{
                  width: '48%',
                  paddingHorizontal: 10,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#F8F8F8',
                  borderRadius: 12
                }}>
                <TextInput placeholder='Year' s />
              </View>
            </View>
            <View style={{ flexDirectionr: 'row', width: '30%', backgroundColor: '#F8F8F8', borderRadius: 12 }}>


              <View
                style={{

                  paddingHorizontal: 15,
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexDirection: 'row',



                }}>
                <View style={{ width: '60%', }}>

                  <TextInput placeholder='CVV' />
                </View>
                <TouchableOpacity>


                  <Image source={require('../../assets/croping/HidePassword3x.png')} style={{ height: 20, width: 20 }} />
                </TouchableOpacity>
              </View>
            </View>



          </View>


          <View style={{ marginTop: 10 }}>
            <Text
              style={{
                fontSize: 14,
                lineHeight: 21,
                marginTop: 5,
                fontWeight: '500',
                color: '#000000',
              }}>
              Card Holder’s Name
            </Text>
          </View>
          <View
            style={{
              height: 50,
              backgroundColor: '#F8F8F8',
              marginTop: 10,
              borderRadius: 12,
              paddingHorizontal: 10,
              justifyContent: 'center',
            }}>
            <TextInput
              placeholder="Name on Card"
              placeholderTextColor={'#979797'}
              style={{ fontSize: 12, fontWeight: '400', lineHeight: 20 }}
            />
          </View>
        </View>
      </>
      } */}
          <TouchableOpacity
            onPress={() => {
              Stripe_api()
            }}
            style={{
              borderWidth: 1,
              alignItems: 'center', justifyContent: 'center', borderRadius: 30,
              backgroundColor: '#352C48',
              height: 60
            }}>
            <Text style={{ fontSize: 17, fontWeight: '600', lineHeight: 25.5, color: '#FFF', }}>Finish Check Out</Text>
          </TouchableOpacity>
          <View style={{ height: hp(2) }} />
        </ScrollView>


      }

    </View>
  );
}
const card = [
  {
    cardNo: '**** **** **** 8395',
    name: 'Axis Bank',
    logo: require('../../assets/croping/mastercard2x.png'),
  },
  {
    cardNo: '**** **** **** 6246',
    name: 'HDFC Bank',
    logo: require('../../assets/croping/visa3x.png'),
  },
];
const PaymentOption = [
  // {
  //   id: 1,

  //   name: 'Card',
  //   logo: require('../../assets/croping/Wallet3x.png'),
  // },
  {
    id: 2,

    name: 'Card or Online Payment',
    logo: require('../../assets/croping/Wallet3x.png'),
    mode: 'Online'
  },
  {
    id: 3,
    mode: 'Cash',
    name: 'Cash on Delivery',
    logo: require('../../assets/croping/CashonDelivery3x.png'),
  },
];
const Styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    marginLeft: 10,
  },
  add: {
    height: 40,
    width: 40,
    backgroundColor: '#FFE14D',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  txt: {
    fontSize: 14,
    fontWeight: '500',
    color: '#352C48',
    lineHeight: 21,
  },
  total: {
    fontSize: 18,
    fontWeight: '600',
    color: '#7756FC',
    lineHeight: 27,
  },
  bill: {
    flexDirection: 'row',
    marginTop: 10,
    paddingHorizontal: 15,
    height: 30,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

