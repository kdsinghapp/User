import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Star from '../../assets/sgv/star.svg';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useDispatch, useSelector } from 'react-redux';
import { add_cart } from '../../redux/feature/featuresSlice';
import Loading from '../../configs/Loader';
import ScreenNameEnum from '../../routes/screenName.enum';
import ProfileHeader from './ProfileHeader';

export default function DishInformation() {
  const route = useRoute();
  const { item } = route.params;
  const navigation = useNavigation();
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false); // State to track if item is added to cart
  const dispatch = useDispatch();
  const increaseQuantity = () => setQuantity(quantity + 1);
  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const user = useSelector(state => state.auth.userData);
  const isLoading = useSelector(state => state.feature.isLoading);



  const add_To_cart = async () => {
    const params = {
      data: {
        user_id: user?.user_data.id,
        dish_id: item?.restaurant_dish_id,
        quantity: quantity,
      },
      token: user?.token,
      navigation: navigation,
    };

    dispatch(add_cart(params));

    // Set addedToCart to true after adding to cart
    setAddedToCart(true);
  };

  const goToCart = () => {
    navigation.navigate(ScreenNameEnum.CART_STACK);
  };
  function calculateDiscount(originalPrice, discountPercent) {
    const discountAmount = (originalPrice * discountPercent) / 100;
    const finalPrice = originalPrice - discountAmount;
    return finalPrice.toFixed(2); // To keep the final price with 2 decimal places
  }
  return (
    <View style={styles.container}>
      {isLoading ? <Loading /> : null}
      {Platform.OS === 'ios' ? (
          <View style={{height:40}} />
        ) : (
          <View style={{height:0}} />
        )}

<View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ width: '90%' }}>
                        <ProfileHeader name={'Dish Details'}  />
                    </View>
                </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ImageBackground
          source={{ uri: item.restaurant_dish_image }}
          resizeMode='contain'
          style={{ height: hp(30) }}>
       
         
        </ImageBackground>
        <View style={styles.headerContent}>
            <Text style={styles.restaurantName}>
              {item.restaurant_dish_name?.toUpperCase()}
            </Text>
            <Text style={styles.deliveryText}>{item.restaurant_dish_preapare_time?.substring(0, 2)} min  preapare time
              </Text>
           
            <View style={styles.ratingContainer}>
              <Star height={15} width={15} marginLeft={5} />
              <Star height={15} width={15} marginLeft={5} />
              <Star height={15} width={15} marginLeft={5} />
              <Star height={15} width={15} marginLeft={5} />
              <Star height={15} width={15} marginLeft={5} />
              <Text style={styles.ratingText}>
                {item.restaurant_dish_rating}
              </Text>
            </View>
          </View>
        <View style={styles.contentContainer}>
          <View style={styles.priceContainer}>
      <View style={{justifyContent:'center',}}>
      <View style={{flexDirection:'row',alignItems:'center'}}>


<Text
  style={{
    fontSize:18,
   
    fontWeight: '700',

    color: '#000',
  }}>
  Price: </Text>
<Text
  style={[item?.restaurant_dish_offer > 0 && styles.line ,{
    fontSize: 18,
   
    fontWeight: '700',
  
    color:item?.restaurant_dish_offer > 0? '#8c8d8f':'#E79B3F',
  }]}>
   £{item.restaurant_dish_price} 
</Text>

</View>
{item?.restaurant_dish_offer > 0  &&
<View style={{flexDirection:'row',alignItems:'center'}}>


<Text
  style={{
    fontSize:18,
   
    fontWeight: '700',
   
    color: '#000',
  }}>
  Offer price: </Text>

<Text
  style={{
    fontSize: 18,
    
    fontWeight: '700',
  
    color: '#E79B3F'
  }}> £{calculateDiscount(item.restaurant_dish_price, item.restaurant_dish_offer)} 
</Text>
</View>}
      </View>
            <View style={styles.quantityContainer}>
              <TouchableOpacity onPress={decreaseQuantity}>
                <Image
                  source={require('../../assets/croping/IconMinus2x.png')}
                  style={styles.quantityIcon}
                />
              </TouchableOpacity>
              <Text style={styles.quantityText}>{quantity}</Text>
              <TouchableOpacity onPress={increaseQuantity}>
                <Image
                  source={require('../../assets/croping/IconPlus2.png')}
                  style={styles.quantityIcon}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.aboutContainer}>
            <Text style={styles.aboutTitle}>About</Text>
            <Text style={styles.aboutDescription}>
              {item.restaurant_dish_description}
            </Text>
            {item?.restaurant_data && <Text style={[styles.aboutTitle,{marginTop:20}]}>Restaurant Details</Text> }
            {item?.restaurant_data &&
            
               <View style={{ marginTop: 10, flexDirection: 'row', 
               paddingVertical:5,alignItems: 'center' }}>
               <Image

                   style={{ height: 40, width: 40, borderRadius: 20 }}
                   source={{ uri: item.restaurant_data?.res_image }} />
               <View style={{marginLeft:5,width:'80%'}}>
                   <Text
                       style={{
                           color: '#352C48',
                           fontSize: 12,
                           fontWeight: '700',
                           lineHeight: 14,
                       }}>
                       {item.restaurant_data?.res_name}
                   </Text>
                   <Text
                       style={{
                           color: '#777777',
                           fontSize: 10,
                           fontWeight: '700',
                           lineHeight: 14,
                       }}>
                       {item.restaurant_data?.res_address}
                   </Text>
               </View>
           </View>
            }
          </View>
        </View>
      </ScrollView>
      <TouchableOpacity onPress={add_To_cart} style={styles.addToCartButton}>
        <Text style={styles.addToCartText}>Add To Cart</Text>
      </TouchableOpacity>
      {/* Render "Go To Cart" button if item is added to cart */}
      {addedToCart && (
        <TouchableOpacity onPress={goToCart} style={styles.goToCartButton}>
          <Text style={styles.addToCartText}>Go To Cart</Text>
        </TouchableOpacity>
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
    height: hp(8),
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  backIcon: {
    height: 32,
    width: 32,
  },
  headerContent: {
    height: hp(10),
paddingHorizontal:10

  },
  restaurantName: {
    fontWeight: '800',
    lineHeight: 30,
    fontSize: 20,
    color: '#000',
  },
  deliveryInfo: {
    justifyContent: 'center',

  },
  deliveryText: {
    fontWeight: '600',

    lineHeight: 18,
    fontSize: 14,
    color: '#000',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
 
    marginTop:10
  },
  ratingText: {
    fontSize: 12,
    lineHeight: 18,
    marginLeft: 10,
    fontWeight: '700',
    color: '#000',
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 15,
  },
  priceContainer: {
    height: hp(10),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize:24,
    lineHeight: 48,
    fontWeight: '700',
    color: '#E79B3F',
   
  },
  quantityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '25%',
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
  aboutContainer: {
    marginTop: 10,
    justifyContent: 'center',
  },
  aboutTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#101010',
    lineHeight: 27,
  },
  aboutDescription: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '400',
    color: '#6A6A6A',
  },
  addToCartButton: {
    marginTop: hp(11),
    width: '90%',
    position: 'absolute',
    bottom:20,
    alignSelf: 'center',
    backgroundColor: '#7756FC',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    height: 47,
  },
  goToCartButton: {
    marginTop: hp(17),
    width: '90%',
    position: 'absolute',
    bottom:20,
    alignSelf: 'center',
    backgroundColor: '#352C48',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    height: 47,
  },
  addToCartText: {
    fontWeight: '600',
    fontSize: 17,
    color: '#FFFFFF',
    lineHeight: 25.5,
    marginLeft: 10,
  },
});
