import {
    View,
    Text,
    Image,
    ScrollView,
    TouchableOpacity,
    FlatList,
    ActivityIndicator,
    StyleSheet,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import {
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { useNavigation, useRoute } from '@react-navigation/native';

import { useDispatch, useSelector } from 'react-redux';
import { get_popular_dish } from '../../redux/feature/featuresSlice';
import ProfileHeader from './ProfileHeader';
import Loading from '../../configs/Loader';
import ScreenNameEnum from '../../routes/screenName.enum';
import Searchbar from '../../configs/Searchbar';

export default function AllPopularDishes() {

    const [searchTerm, setSearchTerm] = useState('');
 
    const navigation = useNavigation();
    const isLoading = useSelector(state => state.feature.isLoading);
    const PopularDish = useSelector(state => state.feature.PopularDish) || [];
    const user = useSelector(state => state.auth.userData);
    const [loading, setLoading] = useState(true);
    const [filteredCategories, setFilteredCategories] = useState(PopularDish);

    const dispatch = useDispatch()


    useEffect(() => {
        setFilteredCategories(PopularDish);
    }, [PopularDish]);

    useEffect(() => {
        get_Mydishes();
    }, [user]);

    const get_Mydishes = async () => {
        try {


            const params = {
                
                token: user?.token
            };
            await dispatch(get_popular_dish(params));
        } catch (err) {
            console.log(err);
        }
    };



    const renderDish = ({ item }) => (
        <TouchableOpacity
        onPress={() => {
            navigation.navigate(ScreenNameEnum.DISH_INFORMATION,{item: item })
          }}
            style={[
                styles.shadow,
                {
                    marginTop: 5,
                    borderRadius: 10,
                    backgroundColor: '#FFF',
                    marginHorizontal: 5,
                    padding: 10,
                    marginBottom: hp(1),
                    width: '45%',
                    justifyContent: 'center',
                },
            ]}>
            <View>
                {loading && (
                    <ActivityIndicator
                        size="large"
                        color="#0000ff"
                        style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            zIndex: 1,
                            transform: [{ translateX: -25 }, { translateY: -25 }],
                        }}
                    />
                )}
                <Image
                    source={{ uri: item.restaurant_dish_image }}
                    style={{ height: 120, width: 150, borderRadius: 5 }}
                    onLoad={() => setLoading(false)}
                />
            </View>
            <View style={{ marginTop: 10 }}>
                <Text
                    style={{
                        color: '#352C48',
                        fontSize: 14,
                        fontWeight: '700',
                        lineHeight: 28,
                    }}>
                    {item.restaurant_dish_name}
                </Text>
            </View>
            <View style={{ marginTop: 5 }}>
                <Text
                    style={{
                        color: '#E79B3F',
                        fontSize: 12,
                        fontWeight: '700',
                        lineHeight: 24,
                    }}>
                    <Text
                        style={{
                            color: '#000',
                            fontSize: 12,
                            fontWeight: '700',
                            lineHeight: 20,
                        }}>
                        {' '}
                        Price:-
                    </Text>{' '}
                    £{item.restaurant_dish_price}
                </Text>
            </View>

          
        </TouchableOpacity>
    );

    const handleSearch = (text) => {


        setSearchTerm(text);
        if (text) {
            const filtered = PopularDish.filter((item) =>
                item?.restaurant_dish_name.toLowerCase().includes(text?.toLowerCase())
            );
            setFilteredCategories(filtered);
        } else {
            setFilteredCategories(PopularDish);
        }
    };



    return (
        <View style={{ flex: 1, backgroundColor: '#FFF', paddingHorizontal: 10 }}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {isLoading ? <Loading /> : null}
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ width: '90%' }}>
                        <ProfileHeader name={'Popular Dish'} />
                    </View>

                </View>
                <View style={{ marginTop: 5 }}>
                    <Searchbar
                        placeholder={'Search dishes, restaurants'}
         
                        onSearchTxt={handleSearch}
                        searchText={searchTerm}
                    />
                </View>
                <View style={{ marginTop: hp(3), flex: 1 }}>
                    {filteredCategories.length > 0 ? (
                        <FlatList
                            data={filteredCategories}
                            numColumns={2}
                            renderItem={renderDish}

                        />
                    ) : (
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ color: '#777777', fontSize: 12, fontWeight: '500' }}>
                                No Dish Found
                            </Text>
                        </View>
                    )}
                </View>
            </ScrollView>
        </View>
    );
}


const styles = StyleSheet.create({
    shadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
    }
})