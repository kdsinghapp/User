import { View, Text,ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { get_top_rated_restaurants } from '../../redux/feature/featuresSlice';

export default function getTopRatedRestaurants() {


    const navigation = useNavigation();
    const isLoading = useSelector(state => state.feature.isLoading);
    const getTopRated_restaurants = useSelector(state => state.feature.getTopRated_restaurants) || [];
    const user = useSelector(state => state.auth.userData);
    const [loading, setLoading] = useState(true);

    const dispatch = useDispatch()

    console.log(getTopRated_restaurants);

    useEffect(() => {
        get_MyRestaurant();
    }, [user]);

    const get_MyRestaurant = async () => {
        try {


            const params = {
                
                token: user?.token
            };
            await dispatch(get_top_rated_restaurants(params));
        } catch (err) {
            console.log(err);
        }
    };


  return (
    <View style={{ flex: 1, backgroundColor: '#FFF', paddingHorizontal: 10 }}>
    <ScrollView showsVerticalScrollIndicator={false}>
        {isLoading ? <Loading /> : null}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ width: '90%' }}>
                <ProfileHeader name={'Restaurants'} />
            </View>

        </View>
        <View style={{ marginTop: hp(3), flex: 1 }}>
            {PopularDish.length > 0 ? (
                <FlatList
                    data={PopularDish}
                    numColumns={2}
                    renderItem={renderDish}

                />
            ) : (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ color: '#777777', fontSize: 12, fontWeight: '500' }}>
                        No Restaurant Found
                    </Text>
                </View>
            )}
        </View>
    </ScrollView>
</View>
  )
}