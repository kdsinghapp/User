import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

const AddressPicker = ({ onSave }) => {
    const [currentPosition, setCurrentPosition] = useState({
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
    });
    const [selectedPosition, setSelectedPosition] = useState(null);
    const [address, setAddress] = useState('');

    useEffect(() => {
        Geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                const newPosition = {
                    latitude,
                    longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                };
                setCurrentPosition(newPosition);
                setSelectedPosition(newPosition);
                fetchAddress(latitude, longitude);
            },
            (error) => alert(error.message),
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
        );
    }, []);

    const fetchAddress = (latitude, longitude) => {
        // Fetch address using reverse geocoding
        // Example using Google Maps Geocoding API
        fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.GOOGLE_MAPS_API_KEY}`)
            .then(response => response.json())
            .then(data => {
                if (data.results.length > 0) {
                    setAddress(data.results[0].formatted_address);
                }
            })
            .catch(error => console.log(error));
    };

    const handlePlaceSelected = (data, details) => {
        const latitude = details.geometry.location.lat;
        const longitude = details.geometry.location.lng;
        const newPosition = {
            latitude,
            longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
        };
        setSelectedPosition(newPosition);
        setAddress(details.formatted_address);
    };

    const handleMarkerDragEnd = (e) => {
        const { latitude, longitude } = e.nativeEvent.coordinate;
        setSelectedPosition({
            ...selectedPosition,
            latitude,
            longitude
        });
        fetchAddress(latitude, longitude);
    };

    return (
        <SafeAreaView style={{ backgroundColor: '#fff', flex: 1 }}>
        <StatusBar backgroundColor={'#fff'} />
        <View style={styles.container}>
            <GooglePlacesAutocomplete
                placeholder="Search for a location"
                minLength={2}
                fetchDetails={true}
                onPress={handlePlaceSelected}
                query={{
                    key: process.env.GOOGLE_MAPS_API_KEY,
                    language: 'en',
                }}
                styles={{
                    textInputContainer: styles.textInputContainer,
                    textInput: styles.textInput,
                }}
                nearbyPlacesAPI="GooglePlacesSearch"
                debounce={200}
                enablePoweredByContainer={false} 
            />
            <Button title="Use Current Location" onPress={() => setSelectedPosition(currentPosition)} />
            <MapView
                style={styles.map}
                region={selectedPosition || currentPosition}
            >
                {selectedPosition && (
                    <Marker
                        coordinate={selectedPosition}
                        draggable
                        onDragEnd={handleMarkerDragEnd}
                    />
                )}
            </MapView>
            <Text style={styles.addressText}>Selected Address: {address}</Text>
            <Button title="Save Address" onPress={() => onSave(address, selectedPosition)} />
        </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    textInputContainer: {
        width: '100%',
    },
    textInput: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 10,
        paddingLeft: 10,
    },
    map: {
        ...StyleSheet.absoluteFillObject,
        height: '70%',
    },
    addressText: {
        padding: 10,
        backgroundColor: '#fff',
        textAlign: 'center',
        marginBottom: 10,
    },
});

export default AddressPicker;
