import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Platform,
  Alert,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import Loading from '../../configs/Loader';
import {
  add_cart,
  general_setting,
  get_Profile,
  get_cart,
  remove_cart,
  update_cart,
} from '../../redux/feature/featuresSlice';
import ScreenNameEnum from '../../routes/screenName.enum';
import { errorToast } from '../../configs/customToast';
import useBackHandler from '../../configs/useBackHandler';


export default function Cart() {
  
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const user = useSelector(state => state.auth.userData);

  const isLoading = useSelector(state => state.feature.isLoading);
  const cartItem = useSelector(state => state.feature.cartItem);
  const generalInfo = useSelector(state => state.feature.generalInfo);

  const [showFooter, setShowFooter] = useState(false);

  useEffect(() => {
    // Set a timer to show the footer after 2 seconds
    const timer = setTimeout(() => {
      setShowFooter(true);
    }, 2000);

    // Cleanup the timer if the component is unmounted before the timer completes
    return () => clearTimeout(timer);
  }, []);
  useBackHandler(navigation,'Cart');
  useEffect(() => {
    const params = {
      token: user.token,
    };
    dispatch(get_Profile(params));

    dispatch(general_setting(params));
  }, [user]);
  useEffect(() => {
    get_cart_item();
  }, [user, isFocused]);

  const get_cart_item = async () => {
    const params = {
      data: {
        user_id: user?.user_data.id,
      },
      token: user?.token,
    };

    dispatch(get_cart(params));
  };

  function calculateDiscount(originalPrice, discountPercent) {
    const discountAmount = (originalPrice * discountPercent) / 100;
    const finalPrice = originalPrice - discountAmount;
    return finalPrice.toFixed(2); // To keep the final price with 2 decimal places
  }
  const calculateTotal = () => {
    let total = 0;
    cartItem?.forEach(item => {
      total += Number(item.quantity) * Number(calculateDiscount(item.dish_data?.restaurant_dish_price,item.dish_data?.restaurant_dish_offer));
    });
    return total.toFixed(2);
  };

  const handleIncrementQuantity = item => {
    const updatedItem = { ...item, quantity: item.quantity + 1 };
    const params = {
      data: {
        cart_id: updatedItem.cart_id,
        user_id: user.user_data.id,
        quantity: updatedItem.quantity,
      },
      token: user?.token,
    };

    dispatch(update_cart(params)).then(() => {
      get_cart_item(); // Refresh the cart items after updating
    });
  };

  const checkCartItem =()=>{

    if(user?.guest){
      Alert.alert(
        "Sign Up Required",
        "You need to sign up to access this feature. Would you like to sign up now?",
        [
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel"
          },
          {
            text: "Sign Up",
            onPress: () => { navigation.navigate(ScreenNameEnum.SIGNUP_SCREEN) } // Replace with your signup navigation
          }
        ],
        { cancelable: false }
      );
    
    }
    else{
    const allSameRestaurant = cartItem.every(
      dish => dish.dish_data.restaurant_dish_restaurant_id === cartItem[0].dish_data.restaurant_dish_restaurant_id
    );
  
    if (!allSameRestaurant) {
      return errorToast('All items must be from the same restaurant.');
    }else{
      navigation.navigate(ScreenNameEnum.PAYMENT_SCREEN,{res_id:cartItem[0].restaurant_data?.res_id});
    }

  }
  }

  const handleDecrementQuantity = item => {
    if (item.quantity > 1) {
      const updatedItem = { ...item, quantity: item.quantity - 1 };
      const params = {
        data: {
          cart_id: updatedItem.cart_id,
          user_id: user.user_data.id,
          quantity: updatedItem.quantity,
        },
        token: user?.token,
      };

      dispatch(update_cart(params)).then(() => {
        get_cart_item(); // Refresh the cart items after updating
      });
    }
  };

  const remove_To_cart = async item => {
    const params = {
      data: {
        cart_id: item.cart_id,
        user_id: user.user_data.id,
      },
      token: user?.token,
    
    };

    dispatch(remove_cart(params)).then(() => {
      get_cart_item(); // Refresh the cart items after updating
    });
  };
  const cartItemList = ({ item }) => (
    <View style={styles.cartItemContainer}>
      <View style={styles.cartItemRow}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: item.dish_data?.restaurant_dish_image }}
            style={styles.cartItemImage}
            resizeMode='cover'
          />
        </View>
        <View style={styles.cartItemDetails}>
          <Text style={styles.dishName}>
            {item.dish_data?.restaurant_dish_name?.substring(0,20)}
          </Text>
          <Text style={styles.dishDescription}>
            {item.dish_data?.restaurant_dish_description?.substring(0,25)}..
          </Text>
        
          <View style={{marginTop:5}}>

<View style={{flexDirection:'row',alignItems:'center'}}>


<Text
  style={{
    fontSize: 12,
   
    fontWeight: '700',
    lineHeight: 18,
    color: '#000',
  }}>
  Price: </Text>
    <Text style={[styles.dishPrice,item?.dish_data.restaurant_dish_offer > 0 && styles.line ,]}>
   £{Number(item.dish_data?.restaurant_dish_price)*Number(item.quantity)} 
</Text>

</View>
{item?.dish_data.restaurant_dish_offer > 0 && 
<View style={{flexDirection:'row',alignItems:'center'}}>


<Text
  style={{
    fontSize: 12,
   
    fontWeight: '700',
    lineHeight: 18,
    color: '#000',
  }}>Offer price: </Text>

<Text
  style={{
    fontSize: 12,
    
    fontWeight: '700',
    lineHeight: 18,
    color: '#E79B3F',
  }}> £{Number(calculateDiscount(item.dish_data?.restaurant_dish_price, item.dish_data?.restaurant_dish_offer))*Number(item.quantity)} 
</Text>
</View>}
          </View>
        </View>
        <View style={styles.quantityContainer}>
          <TouchableOpacity onPress={() => handleDecrementQuantity(item)}>
            <Image
              source={require('../../assets/croping/IconMinus2x.png')}
              style={styles.quantityIcon}
            />
          </TouchableOpacity>
          <View>
            <Text style={styles.quantityText}>{item.quantity}</Text>
          </View>
          <TouchableOpacity onPress={() => handleIncrementQuantity(item)}>
            <Image
              source={require('../../assets/croping/IconPlus2x.png')}
              style={styles.quantityIcon}
            />
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity
        onPress={() => {
          remove_To_cart(item);
        }}
        style={{
          backgroundColor: '#ed777e',
          width: '25%',
          alignSelf: 'flex-end',
          justifyContent: 'center',
          height:22,
          borderRadius: 15,
          alignItems: 'center',
        }}>
        <Text style={{ fontSize: 12, color: '#fff', fontWeight: '600' }}>
          remove
        </Text>
      </TouchableOpacity>

      <View style={{flexDirection:'row',alignItems:'center'}}>
        <Image  
        style={{height:30,width:30,borderRadius:15}}
        source={{uri:item.restaurant_data?.res_image}}
        />
        <View style={{marginLeft:10,width:'80%'}}>
        <Text style={{fontSize:10,color:'#000',fontWeight:'500'}}>{item.restaurant_data?.res_name.substring(0,30)}</Text>
        <Text style={{fontSize:10,color:'#000',fontWeight:'500'}}>{item.restaurant_data?.res_address?.substring(0,30)}</Text>
        </View>
      </View>
    </View>
  );
  const FooterComponent = () => (
    <View style={{height:hp(40)}}>
      
    </View>
  );
  const calculateTotalAm = (totalBill, deliveryCharge, tax, discount) => {
    const bill = Number(totalBill) || 0;
    const delivery = Number(deliveryCharge) || 0;
    const taxAmount = Number(tax) || 0;

    return (bill + delivery + taxAmount).toFixed(2);
  };
  const totalAmount = calculateTotalAm(
    calculateTotal(),
    generalInfo?.delivery_charge,
    generalInfo?.service_charge,

  );
  
  return (
    
    <View style={styles.container}>
       {Platform.OS === 'ios' ? (
          <View style={{height:40}} />
        ) : (
          <View style={{height: 10}} />
        )}
      {isLoading && <Loading />}
      <View style={styles.header}>
        <Text style={styles.headerText}>Cart</Text>
      </View>
      {cartItem?.length != 0  && (
        <>
          <View style={styles.cartListContainer}>
            <FlatList
              showsVerticalScrollIndicator={false}
              data={cartItem}
              renderItem={cartItemList}
              ListFooterComponent={FooterComponent}
            />
          </View>
        {cartItem?.length != 0 && showFooter && <View style={styles.footer}>
            <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginHorizontal:20}}>
            <Text style={styles.totalLabel}>Subtotal</Text>
                <Text style={styles.totalAmount}>£ {calculateTotal()}</Text>
            </View>
            <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginHorizontal:20}}>
            <Text style={styles.totalLabel}>Delivery fee</Text>
                <Text style={styles.totalAmount}>£ {generalInfo?.delivery_charge}</Text>
            </View>
            <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginHorizontal:20}}>
            <Text style={styles.totalLabel}>Service charge </Text>
                <Text style={styles.totalAmount}>£ {generalInfo?.service_charge}</Text>
            </View>
            <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginHorizontal:20}}>
            <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalAmount}>£ {totalAmount}</Text>
            </View>
            <View style={styles.footerContent}>
           
              <TouchableOpacity
                onPress={() => {
                  checkCartItem()
                 
                }}
                style={styles.checkoutButton}>
                <Text style={styles.checkoutButtonText}>Check Out ( £{totalAmount})</Text>
              </TouchableOpacity>
            </View>
          </View>}
        </>
      )}

      {cartItem?.length == 0 && (
       
          <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{color:'#000'}}>No Cart Item Found</Text>
          </View>
     
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  line:{
    textDecorationLine:'line-through',},
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    marginTop: 20,
    paddingHorizontal: 15,
  },
  headerText: {
    fontWeight: '700',
    fontSize: 20,
    lineHeight: 30,
    color: '#000',
  },
  cartListContainer: {
    marginTop: 20,
    paddingHorizontal: 10,
  },
  cartItemContainer: {
    paddingHorizontal: 10,
    borderRadius: 10,
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    marginVertical: 10,
    padding: 10,
    width: '95%',
    justifyContent: 'center',
    shadowColor: "#000",
shadowOffset: {
	width: 0,
	height: 2,
},
shadowOpacity: 0.25,
shadowRadius: 3.84,

elevation: 5,
  },
  cartItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageContainer: {
    height:60,
    marginTop: 5,
    width: 60,
    borderRadius:10
  },
  cartItemImage: {
    height: '100%',
    width: '100%',
    borderRadius:10,
    borderColor: '#7756FC',
  },
  cartItemDetails: {
    width: '52%',
    marginLeft: 10,
    paddingTop:10,
    justifyContent: 'center',
  },
  dishName: {
    fontSize:12,
    fontWeight: '700',
    lineHeight:13,
    color: '#000000',
  },
  dishDescription: {
    color: '#9DB2BF',
    fontSize: 12,
    lineHeight: 13,
    fontWeight: '400',
  },
  dishPrice: {
    color: '#E79B3F',
    fontSize:14,
    lineHeight:15,
    fontWeight: '700',
  },
  quantityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '25%',
    marginHorizontal: 10,
    alignItems: 'center',
  },
  quantityIcon: {
    height:25,
    width:25,
  },
  quantityText: {
    color: '#181818',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 18,
  },
  footer: {
    backgroundColor: '#352C48',
    paddingTop:5,
    height: hp(27),
    width: '100%',
    bottom: 0,
    borderTopRightRadius:30,
    borderTopLeftRadius:30,
    position: 'absolute',
    justifyContent: 'center',
  },
  footerContent: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  totalLabel: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 33,
  },
  totalAmount: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 33,
  },
  checkoutButton: {
    backgroundColor: '#7756FC',
    borderRadius: 40,
    marginTop:10,
    height:50,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 24,
  },
});
