import React, { useEffect, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, ImageBackground, StyleSheet, ActivityIndicator, SafeAreaView, StatusBar } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { get_order_locations } from '../../redux/feature/featuresSlice';

const TrackOrder = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const { OrderId } = route.params || {};

  const mapRef = useRef(null);
  const dispatch = useDispatch();

  const Orderlocations = useSelector(state => state.feature.Orderlocations);


  const driverLocation = Orderlocations?.driver_data
    ? {
      latitude: parseFloat(Orderlocations.driver_data.driver_lat),
      longitude: parseFloat(Orderlocations.driver_data.driver_long),

    }
    : null;

  const dropLocation = Orderlocations?.user_data
    ? {
      latitude: parseFloat(Orderlocations?.user_data?.user_lat),
      longitude: parseFloat(Orderlocations?.user_data?.user_long),
    }
    : null;

  useEffect(() => {
    if (!OrderId) return;

    const intervalId = setInterval(() => {
      getOrderLocation();
    }, 5000); // 10000 milliseconds = 10 seconds

    // Cleanup the interval on component unmount
    return () => clearInterval(intervalId);
  }, [OrderId]);

  const getOrderLocation = async () => {
    try {
      let data = new FormData();
      data.append('order_id', OrderId);

      const params = {
        data: data,
      };

      await dispatch(get_order_locations(params)).unwrap();
    } catch (error) {
      console.error('Failed to fetch order locations:', error);
    }
  };

  useEffect(() => {
    if (mapRef.current && driverLocation) {
      mapRef.current.animateCamera({
        center: driverLocation,
        zoom: 15,
      });
    }
  }, [driverLocation]);

  if (!OrderId) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Order ID is missing. Please try again.</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!dropLocation && !driverLocation) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={{color:'#000'}}>Loading order locations...</Text>
      </View>
    );
  }


  return (
    <SafeAreaView style={{ backgroundColor: '#fff', flex: 1 }}>
    <StatusBar backgroundColor={'#fff'} />
    <View style={styles.container}>
      {dropLocation && driverLocation &&

        <ImageBackground source={require('../../assets/croping/Map3x.png')} style={styles.mapBackground}>
          <MapView
            style={styles.map}
           // provider={}
            initialRegion={
              {
                ...dropLocation,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }
            }
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
              <Marker coordinate={dropLocation} title="My Location">
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
        </ImageBackground>}
    </View>
    </SafeAreaView>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default TrackOrder;




