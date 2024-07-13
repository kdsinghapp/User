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
import ProfileHeader from './FeaturesScreen/ProfileHeader';
import Loading from '../configs/Loader';
import { get_category_dish } from '../redux/feature/featuresSlice';
import ScreenNameEnum from '../routes/screenName.enum';

export default function CategoryDishes() {
    const route = useRoute();

    const { cat_id } = route.params
    const navigation = useNavigation();
    const isLoading = useSelector(state => state.feature.isLoading);
    const CategoryDish = useSelector(state => state.feature.CategoryDish) || [];
    const user = useSelector(state => state.auth.userData);
    const [loading, setLoading] = useState(true);

    const dispatch = useDispatch()


    useEffect(() => {
        get_Mydishes();
    }, [cat_id, user]);

    const get_Mydishes = async () => {
        try {


            const params = {
                category_id: cat_id,
                token: user?.token
            };
            await dispatch(get_category_dish(params));
        } catch (err) {
            console.log(err);
        }
    };



    const renderDish = ({ item }) => (
        <TouchableOpacity
            onPress={() => {
                navigation.navigate(ScreenNameEnum.DISH_INFORMATION, { item: item })
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
                <Text
                    style={{
                        color: '#352C48',
                        fontSize: 14,
                        fontWeight: '700',
                        lineHeight: 28,
                    }}>
                    {item.restaurant_dish_name}
                </Text>
                <Text
                    style={{
                        color: '#E79B3F',
                        fontSize: 14,
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
            <View style={{ marginTop: 10, flexDirection: 'row', alignItems: 'center' }}>
                <Image

                    style={{ height: 40, width: 40, borderRadius: 20 }}
                    source={{ uri: item.restaurant_data?.res_image }} />
                <View style={{marginLeft:5}}>
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
                        {item.restaurant_data?.res_address?.substring(0, 20)}
                    </Text>
                </View>
            </View>


        </TouchableOpacity>
    );



    return (
        <View style={{ flex: 1, backgroundColor: '#FFF', paddingHorizontal: 10 }}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {isLoading ? <Loading /> : null}
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ width: '90%' }}>
                        <ProfileHeader name={'All Dishes'} />
                    </View>

                </View>
                <View style={{ marginTop: hp(3), flex: 1 }}>
                    {CategoryDish.length > 0 ? (
                        <FlatList
                            data={CategoryDish}
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