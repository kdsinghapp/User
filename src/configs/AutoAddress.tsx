import React, { useEffect } from 'react';
import { Alert, Linking, PermissionsAndroid, Platform, View } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: 'Location Permission',
                    message: 'This app needs access to your location.',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log('Location permission granted');
            } else {
                console.log('Location permission denied');
              
            }
        } catch (err) {
            console.warn(err);
        }
    }
};



const GooglePlacesInput = ({ placeholder, onPlaceSelected }) => {
    useEffect(() => {
        requestLocationPermission();
    }, []);

    return (
        <View style={{ borderRadius: 30, flexDirection: 'row', alignItems: 'center' }}>
            <GooglePlacesAutocomplete
                fetchDetails={true}
                placeholder={placeholder}
                onPress={(data, details = null) => {
                    if (details) {
                        try{
                
                        onPlaceSelected(details);
                        }
                        catch(err){
                            console.log('GooglePlacesAutocomplete=>>>>>',err);
                        }
                    }
                }}
                styles={{
                    description: {
                        fontWeight: 'bold',
                        color: 'black',
                        width: '90%',
                    },
                    container: {
                        marginHorizontal: 10,
                        marginTop: 10,
                        backgroundColor: '#fff'
                    },
                    textInput: {
                        fontSize: 13,
                        color: '#000',
                        height: '100%',
                        width: '90%',
                        borderWidth: 1,
                        borderRadius: 10,
                        paddingVertical:10,
                        borderColor:'#ccc'
                    },
                }}
                textInputProps={{
                    placeholderTextColor: "#000",
                  
                }}
                query={{
                    key: process.env.GOOGLE_MAPS_API_KEY,
                    language: 'en',
                }}
                enablePoweredByContainer={false}
            />
        </View>
    );
};

export default GooglePlacesInput;
