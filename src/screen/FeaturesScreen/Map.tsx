import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, SafeAreaView, StatusBar } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { useNavigation } from '@react-navigation/native';
import Geolocation from 'react-native-geolocation-service';
import { useSelector } from 'react-redux';
import { Image } from 'react-native';

const MapScreen = ({ route }) => {
    const { item } = route.params;

    const [destination, setDestination] = useState({
        latitude: parseFloat(item?.lat),
        longitude: parseFloat(item?.lon)
    });
    const [currentLocation, setCurrentLocation] = useState(null);
    const [showDirections, setShowDirections] = useState(false);
    const navigation = useNavigation();
    const mapRef = useRef(null);
    const user = useSelector(state => state.auth.userData);

    useEffect(() => {
        const fetchCurrentLocation = () => {
            Geolocation.getCurrentPosition(
                position => {
                    const { latitude, longitude } = position.coords;
                    setCurrentLocation(null);
                },
                error => {
                    console.log(error);
                },
                { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
            );
        };

        // Fetch initial location
        fetchCurrentLocation();

        // Set interval to update location every 10 seconds (adjust as needed)
        const intervalId = setInterval(fetchCurrentLocation, 10000);

        // Clear interval on component unmount
        return () => clearInterval(intervalId);
    }, []);

    const handleGoBack = () => {
        navigation.goBack();
    };

    return (
        <SafeAreaView style={{ backgroundColor: '#fff', flex: 1 }}>
        <StatusBar backgroundColor={'#fff'} />
        <View style={styles.container}>
       <>
                <MapView
                    ref={mapRef}
                  //  provider={PROVIDER_GOOGLE}
                    style={styles.map}
                    initialRegion={{
                        latitude: destination.latitude,
                        longitude: destination.longitude,
                        latitudeDelta: 0.1,
                        longitudeDelta: 0.1,
                    }}
                    mapType="standard"
                >
                    <Marker
                        coordinate={destination}
                        title={item.name}
                            description={item.address}pinColor='green'
                    />
                </MapView>
                <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
                        <Text>Back</Text>
                    </TouchableOpacity>
                    </>
        </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2c3e50',
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 20,
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        width: '90%',
        height: 50,
    },
    backButton: {
        position: 'absolute',
        top: 20,
        left: 20,
        backgroundColor: 'skyblue',
        padding: 10,
        borderRadius: 5,
    },
});

export default MapScreen;
