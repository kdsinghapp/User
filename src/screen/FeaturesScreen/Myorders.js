import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { get_order_data_by_id, user_order_status } from '../../redux/feature/featuresSlice';
import Loading from '../../configs/Loader';
import { useNavigation } from '@react-navigation/native';
import ScreenNameEnum from '../../routes/screenName.enum';
import LoadingDots from "react-native-loading-dots";

export default function MyOrders() {
  const [status, setStatus] = useState('Pending');
  const OrderDetails = useSelector(state => state.feature.OrderDetails);
  const user = useSelector(state => state.auth.userData);
  const isLoading = useSelector(state => state.feature.isLoading);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isExpandedIndex, setIsExpandedIndex] = useState(null);

  const dispatch = useDispatch();
  const navigation = useNavigation()
  useEffect(() => {
    get_order(status);
  }, [status]);

  const get_order = async sts => {
    try {
      const params = {
        data: {
          user_id: user?.user_data.id,
          status: sts,
        },
        token: user?.token,
      };
      await dispatch(get_order_data_by_id(params));
    } catch (err) {
      console.error(err);
    }
  };
  const order_canceld = (order_id) => {

    Alert.alert(
      'Cancel Order',
      'Are you sure you want to cancel this order?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Confirm',
          onPress: () => cancelOrder(order_id),
        },
      ],
      { cancelable: false }
    );

  }


  const cancelOrder = (order_id) => {
    const params = {
      order_id: order_id,
      token: user?.token
    }

    dispatch(user_order_status(params)).then(res => {
      get_order(status);
    });
  };

  const TopRateRestaurant = ({ item, index }) => {

    const isExpand = isExpanded && isExpandedIndex === index
    const statusImage =
      item.status === 'Complete'
        ? require('../../assets/croping/Completed2x.png')
        : item.status === 'Cancel'
          ? require('../../assets/croping/Close2x.png')
          : require('../../assets/croping/pending.png');

    const statusColor =
      item.status === 'Complete'
        ? '#00C366'
        : item.status === 'Cancel'
          ? '#F44336'
          : '#FFA500';

    const statusBackgroundColor =
      item.status === 'Complete'
        ? 'rgba(0, 195, 102, 0.2)'
        : item.status === 'Cancel'
          ? '#FFDADA'
          : 'rgba(255, 165, 0, 0.2)';

    const totalPrice = item.order_details.reduce(
      (acc, curr) => acc + curr.quantity * curr.price_per_unit,
      0,
    );
    const formatTime = (dateTimeString) => {
      const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const monthsOfYear = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const date = new Date(dateTimeString);

      // Get day of the week, month, and year
      const dayOfWeek = daysOfWeek[date.getDay()];
      const month = monthsOfYear[date.getMonth()];
      const year = date.getFullYear();

      // Get hours and minutes
      let hours = date.getHours();
      const minutes = ('0' + date.getMinutes()).slice(-2);

      // Convert hours to 12-hour format
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;

      return `${dayOfWeek} ${month} ${date.getDate()}, ${year} ${hours}:${minutes} ${ampm}`;
    };




    return (
      <TouchableOpacity
        // disabled={item.status === 'Pending'}
        style={[styles.container, styles.shadow]}
        onPress={() => {
          setIsExpanded(!isExpanded)
          setIsExpandedIndex(index)
        }}
      >
        <View style={{ width: '88%', justifyContent: 'center', }}>
          <Text style={{ fontSize: 12, fontWeight: '500' }}>
            Order ID- {item.resord_id}
          </Text>
          <Text style={{ fontSize: 12, fontWeight: '500' }}>
            Order Time {formatTime(item.created_at)}
          </Text>
        </View>

        <Text style={styles.detailsText}>Order Details:</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: item.restaurant_data?.res_image }}
              style={{
                height: '90%',
                width: '90%',
                borderRadius: 100,
                borderColor: '#7756FC',
              }}
              resizeMode="cover"
            />
          </View>
          <View style={{ marginLeft: 10 }}>
            <Text style={{ fontSize: 14, color: "#000", fontWeight: '600' }}>{item.restaurant_data?.res_name}</Text>
            <Text style={{ fontSize: 12, color: "#777777", fontWeight: '600' }}>{item.restaurant_data?.res_address}</Text>
          </View>
        </View>
        {!isExpand && <View style={{ marginTop: 20 }}>
          <View style={styles.detailsRow}>
            <Text style={styles.totalPriceText}>Total Bill:</Text>
            <Text style={{ width: '20%' }}>-</Text>
            <Text
              style={{

                ...{ color: '#000', fontWeight: '600', marginRight: 20, },
              }}
            >
              {item.total_price.toFixed(2)}
            </Text>
          </View>
          <View
            style={{
              marginTop: 20,
              backgroundColor: statusBackgroundColor,
              flexDirection: 'row',
              borderRadius: 5,
              height: 34,
              alignItems: 'center',
              paddingHorizontal: 10,
            }}
          >
            <Image source={statusImage} style={{ height: 20, width: 20 }} />
            <Text
              style={{
                color: statusColor,
                marginLeft: 10,
                fontSize: 12,
                lineHeight: 15,
                fontWeight: '500',
                marginRight: item.status === 'Accepted' ? 5 : 0
              }}
            >
              {item.status === 'Complete' && 'Yeay, you have completed it!'}
{item.status === 'Cancel' && 
  (item.user_order_status === 'Cancel By User' 
    ? 'You canceled this booking!' 
    : 'Your order was canceled by the restaurant!')}
{item.status === 'Pending' && 'Your booking is pending!'}
{item.status === 'Accepted' && 'Your order is under prescription!'}


            </Text>
            {item.status === 'Accepted' && <LoadingDots size={5} bounceHeight={4} colors={[statusColor, statusColor, statusColor, statusColor]} />}
          </View>

       {item.status === 'Pending' ||item.status === 'Accepted' &&   <TouchableOpacity
            onPress={() => {
              order_canceld(item.resord_id)
            }}
            style={styles.cancelButton}>
            <Text style={styles.cancelButtonText}>Cancel Order</Text>
          </TouchableOpacity>}
        </View>
        }

        {isExpand && (<>
          <View style={{ marginTop: 5 }}>
            {item.order_details.map((dish, index) => (
              <View key={index} style={{ marginTop: 15 }}>

                <View style={{ marginTop: 5 }}>

                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: 14, color: "#000", fontWeight: '500' }}>
                      {dish.dish_name} x {dish.quantity}
                    </Text>
                    <View>
                      <Text style={{ fontSize: 14, color: "#000", fontWeight: '500' }}>
                        Total: {(dish.quantity * dish.price_per_unit).toFixed(2)}
                      </Text>

                      <Text style={{ fontSize: 10, color: "#000", fontWeight: '500' }}>
                        (Price per unit: {dish.price_per_unit.toFixed(2)})
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            ))}

            <View
              style={{
                marginTop: 20,
                backgroundColor: statusBackgroundColor,
                flexDirection: 'row',
                borderRadius: 5,
                height: 34,
                alignItems: 'center',
                paddingHorizontal: 10,
              }}
            >
              <Image source={statusImage} style={{ height: 20, width: 20 }} />
              <Text
                style={{
                  color: statusColor,
                  marginLeft: 10,
                  fontSize: 12,
                  lineHeight: 15,
                  fontWeight: '500',
                  marginRight: item.status === 'Accepted' ? 5 : 0
                }}
              >
                {item.status === 'Complete' && 'Yeay, you have completed it!'}
{item.status === 'Cancel' && 
  (item.user_order_status === 'Cancel By User' 
    ? 'You canceled this booking!' 
    : 'Your order was canceled by the restaurant!')}
{item.status === 'Pending' && 'Your booking is pending!'}
{item.status === 'Accepted' && 'Your order is under prescription!'}


              </Text>
              {item.status === 'Accepted' && <LoadingDots size={5} bounceHeight={4} colors={[statusColor, statusColor, statusColor, statusColor]} />}
            </View>
            <View style={[styles.detailsRow, { borderBottomWidth: 0, marginTop: 10 }]}>
              <Text style={styles.totalPriceText}>Tax Amount :</Text>
              <Text style={{ width: '20%' }}>-</Text>

              <Text
                style={{

                  ...{ color: '#000', fontWeight: '600', marginRight: 20, },
                }}
              >
                {item.tax_amount}.00
              </Text>
            </View>
            <View style={[styles.detailsRow, { borderBottomWidth: 0, marginTop: 0 }]}>
              <Text style={styles.totalPriceText}>Delivery charge :</Text>
              <Text style={{ width: '20%' }}>-</Text>
              <Text
                style={{

                  ...{ color: '#000', fontWeight: '600', marginRight: 20 },
                }}
              >
                {item.delivery_charge}.00
              </Text>
            </View>
            <View style={[styles.detailsRow, { borderBottomWidth: 0, marginTop: 0 }]}>
              <Text style={styles.totalPriceText}>Sub Total :</Text>
              <Text style={{ width: '20%' }}>-</Text>
              <Text
                style={{

                  ...{ color: '#000', fontWeight: '600', marginRight: 20 },
                }}
              >
                {item.sub_total}.00
              </Text>
            </View>
            <View style={styles.detailsRow}>
              <Text style={[styles.totalPriceText, { fontSize: 14 }]}>Total Bill:</Text>
              <Text style={{ width: '20%' }}>-</Text>
              <Text
                style={{

                  ...{ color: '#000', fontWeight: '600', marginRight: 20, },
                }}
              >
                {item.total_price.toFixed(2)}
              </Text>
            </View>
            
       {item.status === 'Pending' ||item.status === 'Accepted' &&   <TouchableOpacity
            onPress={() => {
              order_canceld(item.resord_id)
            }}
            style={styles.cancelButton}>
            <Text style={styles.cancelButtonText}>Cancel Order</Text>
          </TouchableOpacity>}
          </View>
          {/* {item.status === 'Accepted' && isExpand && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                height: 60, // adjust as per your requirements
                marginTop: 20,
              }}
            >
              <Image
                source={require('../../assets/croping/Call3x.png')}
                style={{ height: 60, width: 60 }}
              />
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate(ScreenNameEnum.TRACK_ORDER);
                }}
                style={{
                  backgroundColor: '#352C48',
                  alignItems: 'center',
                  height: 40,
                  borderRadius: 30,
                  justifyContent: 'center',
                  width: '80%',
                }}
              >
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: '500',
                    lineHeight: 22,
                    color: '#FFFFFF',
                  }}
                >
                  Track
                </Text>
              </TouchableOpacity>
            </View>
          )} */}
        </>
        )}

        {item.status === 'Driver' && (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              height: 60, // adjust as per your requirements
              marginTop: 20,
            }}
          >
            <Image
              source={require('../../assets/croping/Call3x.png')}
              style={{ height: 60, width: 60 }}
            />
            <TouchableOpacity
              onPress={() => {
                navigation.navigate(ScreenNameEnum.TRACK_ORDER);
              }}
              style={{
                backgroundColor: '#352C48',
                alignItems: 'center',
                height: 40,
                borderRadius: 30,
                justifyContent: 'center',
                width: '80%',
              }}
            >
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: '500',
                  lineHeight: 22,
                  color: '#FFFFFF',
                }}
              >
                Track
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>
    );
  };



  return (
    <View style={{ paddingHorizontal: 15, flex: 1, backgroundColor: '#FFFFFF' }}>
      {isLoading && <Loading />}
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ marginTop: 20 }}>
          <Text
            style={{
              fontWeight: '700',
              fontSize: 20,
              lineHeight: 30,
              color: '#000',
            }}>
            My Order
          </Text>
        </View>
        <View
          style={{
            height: hp(10),
            alignItems: 'center',
            justifyContent: 'space-between',
            flexDirection: 'row',
          }}>
          <TouchableOpacity
            disabled={status === 'Pending'}
            onPress={() => setStatus('Pending')}
            style={{
              backgroundColor: status === 'Pending' ? '#7756FC' : '#FFF',
              borderRadius: 30,
              alignItems: 'center',
              justifyContent: 'center',
              width: wp('28%'),
              height: 47,
            }}>
            <Text
              style={{
                fontSize: 18,
                lineHeight: 27,
                fontWeight: '500',
                color: status === 'Pending' ? '#FFFFFF' : '#352C48',
              }}>
              Pending
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            disabled={status === 'Complete'}
            onPress={() => setStatus('Complete')}
            style={{
              backgroundColor: status === 'Complete' ? '#7756FC' : '#FFF',
              borderRadius: 30,
              alignItems: 'center',
              justifyContent: 'center',
              width: wp('28%'),
              height: 47,
            }}>
            <Text
              style={{
                fontSize: 18,
                lineHeight: 27,
                fontWeight: '500',
                color: status === 'Complete' ? '#FFFFFF' : '#352C48',
              }}>
              Complete
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            disabled={status === 'Cancel'}
            onPress={() => setStatus('Cancel')}
            style={{
              backgroundColor: status === 'Cancel' ? '#7756FC' : '#FFF',
              borderRadius: 30,
              alignItems: 'center',
              justifyContent: 'center',
              width: wp('28%'),
              height: 47,
            }}>
            <Text
              style={{
                fontSize: 18,
                lineHeight: 27,
                fontWeight: '500',
                color: status === 'Cancel' ? '#FFFFFF' : '#352C48',
              }}>
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{ marginTop: 20 }}>
          {OrderDetails?.length === 0 ? (
            <View style={{ alignItems: 'center', marginTop: 20 }}>
              <Text style={{ fontSize: 18, color: '#888' }}>Order not found</Text>
            </View>
          ) : (
            <FlatList
              showsVerticalScrollIndicator={false}
              data={OrderDetails}
              renderItem={TopRateRestaurant}
              keyExtractor={item => item.id}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  cancelButton: {
    backgroundColor: '#FFDADA', // Light red background color
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10
  },
  cancelButtonText: {
    color: '#FF0000', // Red text color
    fontSize: 16,
    fontWeight: 'bold',
  },
  container: {
    paddingHorizontal: 10,
    borderRadius: 10,
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    marginVertical: 10,
    width: '95%',
    padding: 15,
  },
  shadow: {
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  imageContainer: {
    height: 60,
    width: 60,

    alignItems: 'center',
    justifyContent: 'center'


  },
  nameText: {
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 30,
    color: '#000000',
  },
  locationText: {
    color: '#9DB2BF',
    fontSize: 12,
    lineHeight: 15,
    fontWeight: '400',
    marginTop: 10,
  },
  statusContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '50%',
    marginTop: 20,
    paddingVertical: 2,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '500',
    color: '#FFF',
  },
  detailsText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    marginTop: 5
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',

    borderBottomWidth: 1,
    paddingBottom: 10,
    borderColor: '#777777',


  },
  totalPriceText: {
    fontSize: 12,
    color: '#000',
    fontWeight: '500',

    width: '40%'
  },
});
