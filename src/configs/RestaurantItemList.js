import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import Fav from '../assets/sgv/Favorites.svg';
import FavAdd from '../assets/sgv/addFav.svg';
import ScreenNameEnum from '../routes/screenName.enum';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { Add_FavoriteList, get_RestauRantDetails } from '../redux/feature/featuresSlice';

export default function RestaurantItemList({ ...props }) {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.userData);
  const RestauRantDetails = useSelector(state => state.feature.ResturantDetails);

  const isFocuss = useIsFocused();
  const [expandedCategory, setExpandedCategory] = useState(null);

  const params = {
    data: {
      restaurant_id: props.data,
    },
    token: user.token,
  };

  useEffect(() => {
    dispatch(get_RestauRantDetails(params));
  }, [isFocuss, props.data]);
  function calculateDiscount(originalPrice, discountPercent) {
    const discountAmount = (originalPrice * discountPercent) / 100;
    const finalPrice = originalPrice - discountAmount;
    return finalPrice.toFixed(2); // To keep the final price with 2 decimal places
  }
  const add_favrate = (id) => {
    try {
      const params = {
        fav_id: id,
        fav_type: 'Dish',
        token: user?.token,
      };

      dispatch(Add_FavoriteList(params)).then(res => {
        const params = {
          data: {
            restaurant_id: props.data,
          },
          token: user.token,
        };
        dispatch(get_RestauRantDetails(params));
      });
    } catch (err) {
      console.log('RestaurantItemList', err);
    }
  };

  const RenderList = ({ item }) => {
    if (item.category_items.length === 0) return null;

    const isExpanded = expandedCategory === item.rescat_name;
    const itemsToShow = isExpanded ? item.category_items : item.category_items.slice(0, 2);

    return (
      <>
        <View style={styles.categoryHeader}>
          <View style={styles.categoryHeaderTextContainer}>
            <Text style={styles.categoryName}>{item.rescat_name}</Text>
            <Text style={styles.categoryItemsCount}>{item.category_items.length} items</Text>
          </View>
          <TouchableOpacity style={styles.seeAllButton} onPress={() => setExpandedCategory(isExpanded ? null : item.rescat_name)}>
            <Text style={styles.seeAllText}>{isExpanded ? 'Show less' : 'See all'}</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={itemsToShow}

          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate(ScreenNameEnum.DISH_INFORMATION, { item: item });
              }}
              style={[styles.shadow, styles.itemContainer]}
            >
              <View style={styles.itemImageContainer}>
                <Image
                  source={{ uri: item.restaurant_dish_image }}
                  style={styles.itemImage}
                />
              </View>
              <View style={styles.itemDetailsContainer}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemName}>{item.restaurant_dish_name}</Text>
                  <TouchableOpacity
                    disabled={item?.fav}


                    onPress={() => {
                      add_favrate(item.restaurant_dish_id);
                    }}
                  >

                  </TouchableOpacity>
                </View>
                <Text style={styles.itemDescription}>{item.restaurant_dish_description?.substring(0, 60)}...</Text>
                <View style={styles.itemFooter}>
                  <View style={{}}>

                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>


                      <Text
                        style={{
                          fontSize: 12,

                          fontWeight: '700',
                          lineHeight: 18,
                          color: '#000',
                        }}>
                        Price: </Text>
                      <Text
                        style={[item?.restaurant_dish_offer > 0 && styles.line, {
                          fontSize: 12,

                          fontWeight: '700',
                          lineHeight: 18,
                          color: item?.restaurant_dish_offer > 0 ? '#8c8d8f' : '#E79B3F',

                        }]}>
                        £{Number(item.restaurant_dish_price)?.toFixed(2)}
                      </Text>

                    </View>
                    {item?.restaurant_dish_offer > 0 &&
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>


                        <Text
                          style={{
                            fontSize: 12,

                            fontWeight: '700',
                            lineHeight: 18,
                            color: '#000',
                          }}>
                          Offer price: </Text>


                        <Text
                          style={{
                            fontSize: 12,

                            fontWeight: '700',
                            lineHeight: 18,
                            color: '#E79B3F',
                          }}>
                          £{Number(calculateDiscount(item.restaurant_dish_price, item.restaurant_dish_offer))?.toFixed(2)}
                        </Text>
                      </View>
                    }
                    {props.showPlusIcon && <Plus height={20} width={20} />}
                  </View>
                </View>
              </View>
              <TouchableOpacity
                disabled={item?.fav}

                style={{ position: 'absolute', bottom: 7, right: 7 }}
                onPress={() => {
                  add_favrate(item.restaurant_dish_id);
                }}
              >
                {item?.fav ? <FavAdd height={20} width={20} /> : <Fav height={20} width={20} />}
              </TouchableOpacity>

              {item?.restaurant_dish_offer > 0 &&
        <View style={{ position: 'absolute', top:-7, right:-7 }}>
          <Image source={require('../assets/croping/redo.png')} style={{ height: 60, width: 60 }} />
        </View>

      }
            </TouchableOpacity>
          )}
        />
      </>
    );
  };

  return (
    <View>
      <FlatList
        data={RestauRantDetails?.restaurant_items_category_wise?.filter(category => category.category_items.length > 0)}
        renderItem={({ item }) => {
          if (expandedCategory && expandedCategory !== item.rescat_name) {
            return null;
          }
          return <RenderList item={item} />;
        }}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  line: {
    textDecorationLine: 'line-through',
  },
  categoryHeader: {
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

  },
  categoryHeaderTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',

  },
  categoryName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#101010',
    lineHeight: 18,
    marginLeft: 10
  },
  categoryItemsCount: {
    color: '#9E9E9E',
    fontWeight: '500',
    fontSize: 16,
    lineHeight: 27,
    marginLeft: 10,
  },
  seeAllButton: {
    paddingHorizontal: 5,

  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#E79B3F',
    lineHeight: 27,
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  itemContainer: {
    paddingHorizontal: 5,
    borderRadius: 10,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 10,
    padding: 8,
    marginVertical: 5,
  },
  itemImageContainer: {
    height: 80,
    width: 80,
    marginTop: 5,
  },
  itemImage: {
    height: 80,
    width: 80,
    borderRadius: 15,
    borderColor: '#7756FC',
  },
  itemDetailsContainer: {
    height: 80,
    paddingVertical: 5,
    marginLeft: 10,
    width: '72%',
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemName: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 24,
    color: '#000000',
  },
  itemDescription: {
    color: '#9DB2BF',
    fontSize: 10,
    lineHeight: 15,
    fontWeight: '400',
    width: '85%',
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemPrice: {
    color: '#E79B3F',
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '700',
  },
});
