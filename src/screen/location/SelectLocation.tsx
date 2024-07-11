import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    SafeAreaView,
    Alert,
    ActivityIndicator,
    Platform,
    Image,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDistance } from 'geolib';
import { heightPercentageToDP } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import { errorToast } from '../../configs/customToast';
import { useLocation } from '../../configs/LocationContext';
import GooglePlacesInput from '../../configs/AutoAddress';
import { update_profile } from '../../redux/feature/featuresSlice';
import { useDispatch, useSelector } from 'react-redux';

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY; // Replace with your actual API key

const SelectLocation = () => {
    const [location, setLocation] = useState(null);
    const [savedAddresses, setSavedAddresses] = useState([]);
    const [nearbyLocations, setNearbyLocations] = useState([]);
    const [recentLocations, setRecentLocations] = useState([]);
    const [currentCoords, setCurrentCoords] = useState(null);
    const { setLocationName } = useLocation(); // Get the setLocationName function from context
    const navigation = useNavigation();
    const user = useSelector(state => state.auth.userData);
    const dispatch = useDispatch()
    useEffect(() => {
        const loadSavedAddresses = async () => {
            const saved = await AsyncStorage.getItem('savedAddresses');
            if (saved) {
                setSavedAddresses(JSON.parse(saved));
            }
        };

        loadSavedAddresses();

        Geolocation.getCurrentPosition(
            position => {
                const { latitude, longitude } = position.coords;
                setLocation({
                    latitude,
                    longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                });
                handleSave(latitude,
                    longitude,)
                setCurrentCoords({ latitude, longitude });
                fetchNearbyLocations(latitude, longitude);
            },
            error => {
                console.log(error);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
    }, []);

    const fetchNearbyLocations = async (latitude, longitude) => {
        try {
            const response = await fetch(
                `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=200&key=${GOOGLE_MAPS_API_KEY}`
            );
            const data = await response.json();
            setNearbyLocations(data.results);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSaveAddress = useCallback(
        async (address) => {

            console.log('handle save address',address?.geometry?.location);
            if(address?.geometry?.location?.lng &&  address?.geometry?.lng){

                handleSave(address?.geometry?.location?.lng,
                   address?.geometry?.lng)
            }
            const existingAddress = savedAddresses.find(item => item.place_id === address.place_id);
            if (existingAddress) {
                errorToast('This address is already saved.');
                setLocationName(address?.name); // Set the location name in context
                navigation.goBack();
                return;
            }

            const updatedAddresses = [...savedAddresses, address];
            setSavedAddresses(updatedAddresses);
            await AsyncStorage.setItem('savedAddresses', JSON.stringify(updatedAddresses));
            setLocationName(address?.name); // Set the location name in context
            navigation.goBack();
        },
        [savedAddresses, setLocationName, navigation]
    );

    const handleSelectLocation = useCallback(
        (details) => {
            const { lat, lng } = details.geometry.location;
            handleSave(lat,
                lng,)
            setLocation({
                latitude: lat,
                longitude: lng,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            });
            const recent = [...recentLocations, details];
            setRecentLocations(recent);
            handleSaveAddress(details); // Save the selected address
            setLocationName(address?.name); // Set the location name in context
            navigation.goBack();
        },
        [recentLocations, handleSaveAddress, setLocationName, navigation]
    );




    const handleSave = (latitude,
        longitude,) => {

console.log('call ','handleSave',latitude,
longitude,);


        const formData = new FormData();

        formData.append('lat', latitude);
        formData.append('long', longitude);


        const params = {

            data: formData,
            token: user?.token,
        };



        dispatch(update_profile(params)).then(err => {
            const params = {
                token: user.token,
            };

        });
    };
    const renderLocationItem = useCallback(({ item }) => {
        const distance = currentCoords
            ? getDistance(currentCoords, {
                latitude: item.geometry.location.lat,
                longitude: item.geometry.location.lng,
            })
            : 0;

        const formattedDistance = distance < 1000
            ? `${distance} m`
            : `${(distance / 1000).toFixed(2)} km`;

        return (
            <TouchableOpacity
                onPress={() => handleSaveAddress(item)}
                style={styles.locationItem}
            >
                <View>
                    <Image
                        style={{ height: 20, width: 20 }}
                        resizeMode="contain"
                        source={require('../../assets/croping/Pin3x.png')}
                    />
                    <Text style={{ fontSize: 10, color: '#000', marginTop: 5 }}>{formattedDistance}</Text>
                </View>
                <View style={{ marginLeft: 20 }}>
                    <Text style={styles.locationName}>{item.name}</Text>
                    <Text style={styles.locationAddress}>{item.vicinity}</Text>
                </View>
            </TouchableOpacity>
        );
    }, [currentCoords]);

    return (
        <SafeAreaView style={styles.container}>
            <View style={{ marginTop: Platform.OS === 'ios' ? -20 : 0 }}>
                <View style={styles.header}>
                    <Text style={styles.headerText}>Location</Text>
                </View>
            </View>
            <View style={{ width: '100%', marginTop: 10 }}>
                <GooglePlacesInput placeholder={'Search'} onPlaceSelected={handleSelectLocation} />
            </View>
            {/* <View style={styles.savedContainer}>
                <Text style={styles.sectionTitle}>Saved Addresses</Text>
                <FlatList
                    data={savedAddresses}
                    renderItem={renderLocationItem}
                    keyExtractor={(item, index) => index.toString()}
                />
            </View> */}
            <View style={styles.nearbyContainer}>
                <Text style={[styles.sectionTitle, { fontSize: 16, fontWeight: '400' }]}>NEARBY LOCATIONS</Text>
                {nearbyLocations && <FlatList
                    data={nearbyLocations}
                    renderItem={renderLocationItem}
                    keyExtractor={(item, index) => index.toString()}
                />}
                {nearbyLocations == null && <ActivityIndicator size={20} />}
            </View>
            <TouchableOpacity
                style={styles.currentLocationButton}
                onPress={() => {
                    Geolocation.getCurrentPosition(
                        position => {
                            const { latitude, longitude } = position.coords;
                            setLocation({
                                latitude,
                                longitude,
                                latitudeDelta: 0.01,
                                longitudeDelta: 0.01,
                            });
                            setCurrentCoords({ latitude, longitude });
                            fetchNearbyLocations(latitude, longitude);
                        },
                        error => {
                            console.log(error);
                        },
                        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
                    );
                }}
            >
                <Image
                    style={{ height: 20, width: 20 }}
                    resizeMode="contain"
                    source={require('../../assets/croping/Pin3x.png')}
                />
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
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
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    savedContainer: {
        marginVertical: 10,
    },
    nearbyContainer: {
        marginVertical: 10,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '400',
        marginHorizontal: 15,
        marginVertical: 10,
        color:'#000'
    },
    locationItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        flexDirection: 'row',
        alignItems: 'center',
    },
    locationName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    locationAddress: {
        fontSize: 14,
        color: '#555',
    },
    currentLocationButton: {
        position: 'absolute',
        bottom: 30,
        right: 30,
        backgroundColor: '#007bff',
        borderRadius: 30,
        height: 60,
        width: 60,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default SelectLocation;
