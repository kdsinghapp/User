import {
  View,
  Text,
  ScrollView,
  Image,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import React, { useEffect } from 'react';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { styles } from '../configs/Styles';
import Star from '../assets/sgv/star.svg';
import Plus from '../assets/sgv/Plus.svg';
import Fav from '../assets/sgv/Favorites.svg';
import FavAdd from '../assets/sgv/addFav.svg';
import ScreenNameEnum from '../routes/screenName.enum';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { Add_FavoriteList, get_RestauRantDetails } from '../redux/feature/featuresSlice';
export default function RestaurantItemList({ ...props }) {

  const navigation = useNavigation()
  const dispatch = useDispatch()
  const user = useSelector(state => state.auth.userData);
  const RestauRantDetails = useSelector(state => state.feature.ResturantDetails);

  const isFocuss = useIsFocused()
  const params = {
    data: {
      restaurant_id: props.data,
    },
    token: user.token,
  };
  useEffect(() => {
    dispatch(get_RestauRantDetails(params));
  }, [isFocuss, props.data]);


  const add_favrate = (id) => {


    try {
      const params = {
        fav_id: id,
        fav_type: 'Dish',
        token: user?.token
      }


      dispatch(Add_FavoriteList(params)).then(res => {
        const params = {
          data: {
            restaurant_id: props.data,
          },
        }
        dispatch(get_RestauRantDetails(params));
      })
    }
    catch (err) {
      console.log('RestaurantItemList', err);
    }

  }
  const RenderJuiceList = ({ item }) => (<>
    <View
      style={{
        marginTop: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text
          style={{
            fontSize: 18,
            fontWeight: '700',
            color: '#101010',
            lineHeight: 27,
          }}>
          {item.rescat_name}
        </Text>

        <Text
          style={{
            color: '#9E9E9E',
            fontWeight: '500',
            fontSize: 16,
            lineHeight: 27,
            marginLeft: 10,
          }}>
          {item.category_items.length} items
        </Text>
      </View>
      <TouchableOpacity style={{ width: '15%' }}>
        <Text
          style={{
            fontSize: 14,
            fontWeight: '500',
            color: '#E79B3F',
            lineHeight: 27,
          }}>
          See all
        </Text>
      </TouchableOpacity>
    </View>
    <FlatList
      data={item.category_items}
      renderItem={({ item }) => (
        <TouchableOpacity

          onPress={() => {
            navigation.navigate(ScreenNameEnum.DISH_INFORMATION, { item: item })
          }}
          style={[
            styles.shadow,
            {

              paddingHorizontal: 5,
              borderRadius: 10,
              flexDirection: 'row',

              backgroundColor: '#FFFFFF',
              marginHorizontal: 10,
              padding: 8,
              marginVertical: 5,
            },
          ]}>
          <View style={{ height: 80, width: 80, marginTop: 5, }}>
            <Image
              source={{ uri: item.restaurant_dish_image }}
              style={{
                height: 80,
                width: 80,
                borderRadius: 15,

                borderColor: '#7756FC',
              }}
            />

          </View>

          <View style={{
            height: 80, paddingVertical: 5,
            marginLeft: 10, width: '72%',
          }}>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '700',
                  lineHeight: 24,
                  color: '#000000',
                }}>
                {item.restaurant_dish_name}
              </Text>
              <TouchableOpacity
                disabled={item?.fav}
                onPress={() => {
                  add_favrate(item.restaurant_dish_id)
                }}
              >

                {item?.fav ? <FavAdd height={20} width={20} /> :
                  <Fav height={20} width={20} />
                }
              </TouchableOpacity>
            </View>

            <Text
              style={{
                color: '#9DB2BF',
                fontSize: 10,
                lineHeight: 15,
                fontWeight: '400',
                width: '85%'
              }}>
              {item.restaurant_dish_description}
            </Text>



            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>



              <TouchableOpacity
                onPress={() => {

                }}
                style={{

                }}>
                <Text
                  style={{
                    color: '#E79B3F',
                    fontSize: 14,
                    lineHeight: 21,
                    fontWeight: '700',
                  }}>
                  {item.restaurant_dish_price}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      )}

    />
  </>
  );
  return (
    <View>
      <FlatList
        data={RestauRantDetails?.restaurant_items_category_wise}
        renderItem={RenderJuiceList}

        showsHorizontalScrollIndicator={false} // Optional: hide horizontal scroll indicator
      />
    </View>
  );
}


