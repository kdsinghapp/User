import React, { useEffect, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, ImageBackground, StyleSheet } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { get_order_locations } from '../../redux/feature/featuresSlice';

const TrackOrder = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const { OrderId } = route.params;
  const mapRef = useRef(null);
  const dispatch = useDispatch();

  const Orderlocations = useSelector(state => state.feature.Orderlocations);

  const defaultLocation = {
    latitude: 22.7196,
    longitude: 75.8577,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  const driverLocation = Orderlocations?.driver_data
    ? {
        latitude: parseFloat(Orderlocations.driver_data.driver_lat),
        longitude: parseFloat(Orderlocations.driver_data.driver_long),
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }
    : null;

  const dropLocation = Orderlocations?.user_data
    ? {
        latitude: parseFloat(Orderlocations.user_data.lat),
        longitude: parseFloat(Orderlocations.user_data.long),
      }
    : null;

  useEffect(() => {
    const intervalId = setInterval(() => {
      getOrderLocation();
    }, 4000); // 4000 milliseconds = 4 seconds

    // Cleanup the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const getOrderLocation = () => {
    let data = new FormData();
    data.append('order_id', OrderId);

    const params = {
      data: data,
    };

    dispatch(get_order_locations(params)).then(res => {
     
    });
  };

  useEffect(() => {
    if (mapRef.current && driverLocation) {
      mapRef.current.animateCamera({
        center: driverLocation,
        zoom: 15,
      });
    }
  }, []);

  return (
    <View style={styles.container}>
      <ImageBackground source={require('../../assets/croping/Map3x.png')} style={styles.mapBackground}>
        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={dropLocation || defaultLocation}
          ref={mapRef}
        >
          {driverLocation && (
            <Marker coordinate={driverLocation} title="Delivery boy Location">
              <Image
                source={require('../../assets/croping/waiter.png')}
                style={{ width: 40, height: 40 }}
                resizeMode="contain"
              />
            </Marker>
          )}
          {dropLocation && (
            <Marker coordinate={dropLocation} title="Your Location">
              <Image
                source={require('../../assets/croping/table.png')}
                style={{ width: 50, height: 50 }}
                resizeMode="contain"
              />
            </Marker>
          )}
          {driverLocation && dropLocation && (
            <MapViewDirections
              origin={driverLocation}
              destination={dropLocation}
              apikey={process.env.GOOGLE_MAPS_API_KEY}
              strokeWidth={5}
              strokeColor="hotpink"
              optimizeWaypoints={true}
              mode="DRIVING"
              onError={errorMessage => {
                console.error('GOT AN ERROR', errorMessage);
              }}
            />
          )}
        </MapView>

        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapBackground: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 10,
    backgroundColor: 'skyblue',
    padding: 10,
    borderRadius: 5,
    paddingHorizontal: 15,
    elevation: 5, // To create a shadow effect
  },
  backButtonText: {
    fontSize: 16,
    color: '#000',
  },
});

export default TrackOrder;
