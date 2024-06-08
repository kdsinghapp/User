import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  Alert,
} from 'react-native';
import React, {useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import Star from '../../assets/sgv/star.svg';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {useDispatch, useSelector} from 'react-redux';
import {add_cart} from '../../redux/feature/featuresSlice';
import Loading from '../../configs/Loader';

export default function DishInformation() {
  const route = useRoute();
  const {item} = route.params;
  const navigation = useNavigation();
  const [quantity, setQuantity] = useState(1);
  const dispatch = useDispatch();
  const increaseQuantity = () => setQuantity(quantity + 1);
  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const user = useSelector(state => state.auth.userData);
  const isLoading = useSelector(state => state.feature.isLoading);
  console.log('==================item==================',item);

  const add_To_cart = async () => {
   
    const params = {
      data: {
        user_id: user?.user_data.id,
        dish_id: item?.restaurant_dish_id,
        quantity: quantity,
      },
      token: user?.token,
      navigation:navigation
    };

    dispatch(add_cart(params));
  };

  return (
    <View style={styles.container}>
      {isLoading ? <Loading /> : null}
      <ScrollView showsVerticalScrollIndicator={false}>
        <ImageBackground
          source={{uri: item.restaurant_dish_image}}
          style={{height: hp(30)}}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Image
                source={require('../../assets/croping/Back-Navs2x.png')}
                style={styles.backIcon}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.headerContent}>
            <Text style={styles.restaurantName}>
              {item.restaurant_dish_name}
            </Text>
            <View style={styles.deliveryInfo}>
              <Text style={styles.deliveryText}>
                {item.restaurant_dish_preapare_time?.substring(0, 2)} min 1.5km
                Free Delivery
              </Text>
            </View>
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
        </ImageBackground>
        <View style={styles.contentContainer}>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>${item.restaurant_dish_price}</Text>
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
          </View>
        </View>
      </ScrollView>
      <TouchableOpacity onPress={add_To_cart} style={styles.addToCartButton}>
        <Text style={styles.addToCartText}>Add To Cart</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'#fff'
  },

  header: {
    height: hp(15),
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  backIcon: {
    height: 32,
    width: 32,
  },
  headerContent: {
    height: hp(10),
    paddingHorizontal: 20,
  },
  restaurantName: {
    fontWeight: '700',
    lineHeight: 30,
    fontSize: 20,
    color: '#FFF',
  },
  deliveryInfo: {
    justifyContent: 'center',
    height: hp(5),
  },
  deliveryText: {
    fontWeight: '500',
    marginLeft: 10,
    lineHeight: 18,
    fontSize: 12,
    color: '#FFF',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  ratingText: {
    fontSize: 12,
    lineHeight: 18,
    marginLeft: 10,
    fontWeight: '700',
    color: '#FFF',
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
    fontSize: 32,
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
    bottom: 10,
    alignSelf: 'center',
    backgroundColor: '#7756FC',
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
