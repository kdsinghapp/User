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
                    {item?.fav ? <FavAdd height={20} width={20} /> : <Fav height={20} width={20} />}
                  </TouchableOpacity>
                </View>
                <Text style={styles.itemDescription}>{item.restaurant_dish_description}</Text>
                <View style={styles.itemFooter}>
                  <TouchableOpacity>
                    <Text style={styles.itemPrice}>£{item.restaurant_dish_price}</Text>
                  </TouchableOpacity>
                </View>
              </View>
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
    fontSize: 18,
    fontWeight: '700',
    color: '#101010',
    lineHeight: 27,
  },
  categoryItemsCount: {
    color: '#9E9E9E',
    fontWeight: '500',
    fontSize: 16,
    lineHeight: 27,
    marginLeft: 10,
  },
  seeAllButton: {
    width: '20%',
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
