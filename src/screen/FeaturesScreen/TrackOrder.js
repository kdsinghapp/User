import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, ImageBackground, StyleSheet } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import Geolocation from 'react-native-geolocation-service';
import { request, PERMISSIONS } from 'react-native-permissions';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useDispatch, useSelector } from 'react-redux';
import { get_Profile } from '../../redux/feature/featuresSlice';
import { useNavigation } from '@react-navigation/native';

const restaurantLocation = {
  latitude: 22.714501,
  longitude: 75.866383,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
};
const DriverLocation = {
  latitude: 22.714978,
  longitude: 75.887287,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
};

const deliveryLocation = {
  latitude: 22.7196,
  longitude: 75.8577,
};

const TrackOrder = () => {
  const navigation = useNavigation();
  const mapRef = useRef(null);
  
  const [driverLocation, setDriverLocation] = useState(DriverLocation);
  const [deliveryDetails, setDeliveryDetails] = useState({
    distance: '',
    duration: '',
  });
  const [Deliveryaddress, setDeliveryaddress] = useState("Delivery Location");
  const [Pickupaddress, setPickupaddress] = useState("Our Restaurant");
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchDeliveryDetails = async () => {
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${driverLocation.latitude},${driverLocation.longitude}&destinations=${deliveryLocation.latitude},${deliveryLocation.longitude}&key=AIzaSyADzwSBu_YTmqWZj7ys5kp5UcFDG9FQPVY`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch delivery details');
        }

        const data = await response.json();
        const { status, rows } = data;

        if (status === 'OK') {
          const distance = rows[0].elements[0].distance.text;
          const duration = rows[0].elements[0].duration.text;

          setDeliveryDetails({
            distance,
            duration,
          });
        }
      } catch (error) {
        console.error('Error fetching delivery details: ', error);
      }
    };

    fetchDeliveryDetails();
  }, [driverLocation]);

  useEffect(() => {
    // Watch driver's location
    const requestLocationPermission = async () => {
      const result = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
      if (result === 'granted') {
        Geolocation.watchPosition(
          position => {
            setDriverLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          },
          error => console.log(error),
          { enableHighAccuracy: true, distanceFilter: 10, interval: 5000 }
        );
      }
    };

    requestLocationPermission();
  }, []);

  return (
    <View style={styles.container}>
      <ImageBackground source={require('../../assets/croping/Map3x.png')} style={styles.mapBackground}>
        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={restaurantLocation}
          ref={mapRef}
        >
          <Marker coordinate={restaurantLocation} title={Pickupaddress}>
            <Image
              source={require('../../assets/croping/res.png')}
              style={{ width: 40, height: 40 }}
              resizeMode='contain'
            />
          </Marker>
          <Marker coordinate={deliveryLocation} title={Deliveryaddress}>
            <Image
              source={require('../../assets/croping/table.png')}
              style={{ width: 40, height: 40 }}
              resizeMode='contain'
            />
          </Marker>
          <Marker coordinate={driverLocation} title="Driver">
            <Image
              source={require('../../assets/croping/waiter.png')}
              style={{ width: 50, height: 50 }}
              resizeMode='contain'
            />
          </Marker>
          <MapViewDirections
            origin={driverLocation}
            destination={restaurantLocation}
            apikey="AIzaSyADzwSBu_YTmqWZj7ys5kp5UcFDG9FQPVY"
            strokeWidth={4}
            strokeColor="hotpink"
            optimizeWaypoints={true}
            mode="DRIVING"
            onReady={result => {
              console.log(`Distance: ${result.distance} km`)
              console.log(`Duration: ${result.duration} min.`)
              mapRef.current.fitToCoordinates(result.coordinates, {
                edgePadding: {
                  right: 20,
                  bottom: 20,
                  left: 20,
                  top: 20,
                },
              });
            }}
            onError={(errorMessage) => {
              console.error('GOT AN ERROR', errorMessage);
            }}
          />
        </MapView>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>

        <View style={styles.bottomContainer}>
          <View style={styles.profileImageContainer}>
            <Image source={require('../../assets/images/dp.jpeg')} style={styles.profileImage} />
          </View>

          <View style={styles.callIconContainer}>
            <Image source={require('../../assets/croping/Call3x.png')} style={styles.callIcon} />
          </View>
          
          <View style={styles.profileNameContainer}>
            <Text style={styles.profileName}>Kaylynn Stanton</Text>
          </View>
          
          <View style={styles.deliveryInfoContainer}>
            <Text style={styles.deliveryInfo}>{deliveryDetails.duration} {deliveryDetails.distance} Free Delivery</Text>
          </View>

          <View style={styles.addressContainer}>
            <View style={styles.addressItem}>
              <Image source={require('../../assets/croping/Pin3x.png')} style={styles.addressIcon} />
              <View style={styles.addressTextContainer}>
                <Text style={styles.addressTitle}>Pickup Location</Text>
                <Text style={styles.addressSubtitle}>{Pickupaddress}</Text>
              </View>
            </View>
            <View style={styles.addressItem}>
              <Image source={require('../../assets/croping/Pin3x.png')} style={styles.addressIcon} />
              <View style={styles.addressTextContainer}>
                <Text style={styles.addressTitle}>Delivery Location</Text>
                <Text style={styles.addressSubtitle}>{Deliveryaddress}</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity style={styles.moreDetailsButton}>
            <Text style={styles.moreDetailsButtonText}>More Details</Text>
          </TouchableOpacity>
          
          <View style={styles.bottomSpacing} />
        </View>
      </ImageBackground>
    </View>
  );
}

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
  bottomContainer: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    position: 'absolute',
    borderTopRightRadius: 40,
    borderTopLeftRadius: 40,
    bottom: 0,
  },
  profileImageContainer: {
    height: 133,
    width: 133,
    alignSelf: 'center',
    top: -40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 66.5,
    backgroundColor: '#FFF',
  },
  profileImage: {
    height: 100,
    width: 100,
    borderRadius: 50,
  },
  callIconContainer: {
    position: 'absolute',
    top: 20,
    left: 20,
  },
  callIcon: {
    height: 80,
    width: 80,
  },
  profileNameContainer: {
    alignSelf: 'center',
    marginTop: -25,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#352C48',
    lineHeight: 30,
  },
  deliveryInfoContainer: {
    alignSelf: 'center',
    alignItems: 'center',
  },
  deliveryInfo: {
    fontSize: 12,
    fontWeight: '500',
    color: '#352C48',
    lineHeight: 18,
  },
  addressContainer: {
    paddingHorizontal: 45,
    marginTop: 15,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressIcon: {
    height: 24,
    width: 24,
  },
  addressTextContainer: {
    marginLeft: 10,
  },
  addressTitle: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '700',
    color: '#352C48',
  },
  addressSubtitle: {
    fontSize: 10,
    color: '#000',
    lineHeight: 15,
    fontWeight: '500',
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
  moreDetailsButton: {
    backgroundColor: '#352C48',
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    marginHorizontal: 25,
    marginTop: 23,
  },
  moreDetailsButtonText: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: '600',
    lineHeight: 25,
  },
  bottomSpacing: {
    height: hp(2),
  },
});

export default TrackOrder;
