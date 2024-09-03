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
import { Food_categories, get_popular_dish } from '../../redux/feature/featuresSlice';
import ProfileHeader from './ProfileHeader';
import Loading from '../../configs/Loader';
import ScreenNameEnum from '../../routes/screenName.enum';
import Searchbar from '../../configs/Searchbar';
import useBackHandler from '../../configs/useBackHandler';

export default function AllCategories() {
    const navigation = useNavigation();
    const isLoading = useSelector(state => state.feature.isLoading);
    const AllCategory = useSelector(state => state.feature.AllCategory) || [];
    const user = useSelector(state => state.auth.userData);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredCategories, setFilteredCategories] = useState([]);
    useBackHandler(navigation,'Category');
    const dispatch = useDispatch();

    useEffect(() => {
        get_Category();
    }, [user]);



    const get_Category = async () => {
        try {
            const params = {
                token: user?.token
            };
            await dispatch(Food_categories(params)).then(res=>{
                setTimeout(() => {
                   
                }, 3000); // 3
            })
        } catch (err) {
            console.log(err);
        }
    };

    const handleSearch = (text) => {


        setSearchTerm(text);
        if (text) {
            const filtered = AllCategory.filter((item) =>
                item?.rescat_name.toLowerCase().includes(text?.toLowerCase())
            );
            setFilteredCategories(filtered);
        } else {
            setFilteredCategories(AllCategory);
        }
    };



  

    const renderDish = ({ item }) => (
        <TouchableOpacity
            onPress={() => {
                navigation.navigate(ScreenNameEnum.CATEGORY_DISHES, { cat_id: item.rescat_id })
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
                    source={{ uri: item.rescat_image }}
                    style={{ height: 120, width: 150, borderRadius: 5 }}
                    onLoad={() => setLoading(false)}
                />
            </View>
            <View style={{ marginTop: 10, alignItems: 'center' }}>
                <Text
                    style={{
                        color: '#352C48',
                        fontSize: 18,
                        fontWeight: '700',
                        lineHeight: 28,
                    }}>
                    {item.rescat_name}
                </Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={{ flex: 1, backgroundColor: '#FFF', paddingHorizontal: 10 }}>
                {isLoading ? <Loading /> : null}
            <ScrollView showsVerticalScrollIndicator={false}>

                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ width: '90%' }}>
                        <ProfileHeader name={'Categories'} />
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
                    {filteredCategories.length > 0 || AllCategory?.length > 0 ? (
                        <FlatList
                            data={filteredCategories?.length !== 0 ?filteredCategories:AllCategory}
                            numColumns={2}
                            renderItem={renderDish}
                        />
                    ) : (
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ color: '#777777', fontSize: 12, fontWeight: '500' }}>
                                No Categories Found
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
});
