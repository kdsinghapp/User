import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import React, { useEffect } from 'react';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import Loading from '../../configs/Loader';
import {
  add_cart,
  get_Profile,
  get_cart,
  remove_cart,
  update_cart,
} from '../../redux/feature/featuresSlice';
import ScreenNameEnum from '../../routes/screenName.enum';
import { errorToast } from '../../configs/customToast';


export default function Cart() {
  
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const user = useSelector(state => state.auth.userData);

  const isLoading = useSelector(state => state.feature.isLoading);
  const cartItem = useSelector(state => state.feature.cartItem);

  console.log(cartItem);
  useEffect(() => {
    const params = {
      token: user.token,
    };
    dispatch(get_Profile(params));
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


  const calculateTotal = () => {
    let total = 0;
    cartItem?.forEach(item => {
      total += item.quantity * item.dish_data?.restaurant_dish_price;
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
    const allSameRestaurant = cartItem.every(
      dish => dish.dish_data.restaurant_dish_restaurant_id === cartItem[0].dish_data.restaurant_dish_restaurant_id
    );
  
    if (!allSameRestaurant) {
      return errorToast('All items must be from the same restaurant.');
    }else{
      navigation.navigate(ScreenNameEnum.PAYMENT_SCREEN);
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
    <TouchableOpacity style={styles.cartItemContainer}>
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
            {item.dish_data?.restaurant_dish_name}
          </Text>
          <Text style={styles.dishDescription}>
            {item.dish_data?.restaurant_dish_description}
          </Text>
          <Text style={styles.dishPrice}>
          £{item.dish_data?.restaurant_dish_price*item.quantity}
          </Text>
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
          width: '30%',
          alignSelf: 'flex-end',
          justifyContent: 'center',
          height: 30,
          borderRadius: 15,
          alignItems: 'center',
        }}>
        <Text style={{ fontSize: 12, color: '#fff', fontWeight: '600' }}>
          remove
        </Text>
      </TouchableOpacity>

      <View style={{flexDirection:'row',alignItems:'center'}}>
        <Image  
        style={{height:60,width:60,borderRadius:30}}
        source={{uri:item.restaurant_data?.res_image}}
        />
        <View style={{marginLeft:10,width:'80%'}}>
        <Text style={{fontSize:12,color:'#000',fontWeight:'500'}}>{item.restaurant_data?.res_name}</Text>
        <Text style={{fontSize:12,color:'#000',fontWeight:'500'}}>{item.restaurant_data?.res_address}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
  const FooterComponent = () => (
    <View style={{height:hp(20)}}>
      
    </View>
  );
  return (
    <View style={styles.container}>
      {isLoading && <Loading />}
      <View style={styles.header}>
        <Text style={styles.headerText}>Cart</Text>
      </View>
      {cartItem?.length != 0 && (
        <>
          <View style={styles.cartListContainer}>
            <FlatList
              showsVerticalScrollIndicator={false}
              data={cartItem}
              renderItem={cartItemList}
              ListFooterComponent={FooterComponent}
            />
          </View>
          <View style={styles.footer}>
            <View style={styles.footerContent}>
              <View>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalAmount}>£ {calculateTotal()}</Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  checkCartItem()
                 
                }}
                style={styles.checkoutButton}>
                <Text style={styles.checkoutButtonText}>Check Out</Text>
              </TouchableOpacity>
            </View>
          </View>
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
    height: 73.41,
    marginTop: 5,
    width: 73.41,
    borderRadius:10
  },
  cartItemImage: {
    height: '100%',
    width: '100%',
    borderRadius:10,
    borderColor: '#7756FC',
  },
  cartItemDetails: {
    width: '45%',
    marginLeft: 10,
    justifyContent: 'center',
  },
  dishName: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 24,
    color: '#000000',
  },
  dishDescription: {
    color: '#9DB2BF',
    fontSize: 10,
    lineHeight: 15,
    fontWeight: '400',
  },
  dishPrice: {
    color: '#E79B3F',
    fontSize: 18,
    lineHeight: 27,
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
    height: 30,
    width: 30,
  },
  quantityText: {
    color: '#181818',
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 18,
  },
  footer: {
    backgroundColor: '#352C48',
    height: hp(12),
    width: '100%',
    bottom: 0,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
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
    color: '#9E9E9E',
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 33,
  },
  totalAmount: {
    color: '#CBC3E3',
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 33,
  },
  checkoutButton: {
    backgroundColor: '#7756FC',
    borderRadius: 40,
    height: 54,
    width: '40%',
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
