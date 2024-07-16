import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { RadioButton } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { addres_delete, addres_list, update_address, add_address } from '../../redux/feature/featuresSlice';
import ProfileHeader from './ProfileHeader';
import Loading from '../../configs/Loader';
import AddressModal from './Modal/AddressModal';
import UpdateAddressModal from './Modal/UpdateAddressModal';
import { successToast, errorToast } from '../../configs/customToast';
import { getCurrentLocation, locationPermission } from '../../configs/helperFunction';

export default function Address() {
  const user = useSelector((state) => state.auth.userData);
  const isLoading = useSelector((state) => state.feature.isLoading);
  const addresList = useSelector((state) => state.feature.addresList);
  const [visible, setVisible] = useState(false);
  const [updateVisible, setUpdateVisible] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [CurrentLocation, setCurrentLocation] = useState({});
  const [LocationName, setLocationName] = useState('');
  const [pincode, setPincode] = useState('');
  const [street, setStreet] = useState('');
  const [houseNo, setHouseNo] = useState('');
  const [isFetchingLocation, setIsFetchingLocation] = useState(false); // Add loading state for location
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [landmark, setLandmark] = useState('');

  const navigation = useNavigation();
  const dispatch = useDispatch();
  const isFocussed = useIsFocused();

  const handleDeleteAddress = (addressId) => {
    Alert.alert(
      'Delete Address',
      'Are you sure you want to delete this address?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          onPress: () => remove_address(addressId),
          style: 'destructive',
        },
      ]
    );
  };

  const remove_address = async (id) => {
    const params = {
      address_id: id,
      token: user?.token,
    };
    dispatch(addres_delete(params)).then((res) => {
      get_Address();
    });
  };

  const selected_Address = (item) => {
  console.log(item.address_id);
    let data = new FormData();
    data?.append('user_id', user?.user_data?.id);
    data?.append('address_id', item.address_id);
    data?.append('is_selected', 1);
    data?.append('long', item.long);
    data?.append('lat', item.lat);
    const params = {
      data: data,
      token: user?.token,
      isSelectes: false,
    };
    dispatch(update_address(params)).then((res) => {
      get_Address();
    });
  };

  const get_Address = () => {
    const params = {
      token: user.token,
      user_id: user?.user_data.id,
    };
    dispatch(addres_list(params));
  };

  const getLiveLocation = async () => {

    setIsFetchingLocation(true); // Start loading

    const locPermissionDenied = await locationPermission();
    console.log('locPermissionDenied', locPermissionDenied);

    if (locPermissionDenied == 'granted') {
      try {
        const { latitude, longitude } = await getCurrentLocation();
        console.log(latitude, longitude);
        setCurrentLocation({
          latitude,
          longitude,
        });

        //   Fetch additional location details from Google Maps API (uncomment if needed)
        const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.GOOGLE_MAPS_API_KEY}`;
        try {
          const res = await fetch(url);
          const json = await res.json();

          const addressComponents = json.results[0].address_components;
      
          // Extract relevant address components
          const street = await addressComponents.find((component) => component.types.includes('route'))?.long_name || '';
          const houseNo = await addressComponents.find((component) => component.types.includes('street_number'))?.long_name || '';
          const city = await addressComponents.find((component) => component.types.includes('locality'))?.long_name || '';
          const state = await addressComponents.find((component) => component.types.includes('administrative_area_level_1'))?.long_name || '';
          const pincode = await addressComponents.find((component) => component.types.includes('postal_code'))?.long_name || '';
          setLocationName(json.results[0]?.formatted_address);
          setStreet(street);
          setHouseNo(houseNo);
          setCity(city);
          setState(state);
          setPincode(pincode);
          setLandmark(`${houseNo}' '${street}`)
          // Automatically add the address with the fetched details
          handleAddCurrentLocationAddress();
        } catch (e) {
          console.log("Error fetching location details:", e);
        }
      } catch (error) {
        console.error('Error fetching location:', error);
        errorToast('Failed to fetch location. Please try again.');
        setIsFetchingLocation(false); // End loading on error
      }
    } else {
      errorToast('Location permission denied');
      setIsFetchingLocation(false); // End loading if permission is denied
    }
  };

  const handleAddCurrentLocationAddress = () => {
    if (!pincode || !street || !houseNo || !state || !city) {
      setIsFetchingLocation(false); // End loading
      return errorToast('All fields are required');
    }


    let data = new FormData();
    data.append('user_id', user?.user_data.id);
    data.append('full_name', user?.user_data?.full_name);
    data.append('mobile_number', user?.user_data?.mobile_number);
    data.append('lat', CurrentLocation.latitude.toString());
    data.append('long', CurrentLocation.longitude.toString());
    data.append('pincode', pincode);
    data.append('street', street);
    data.append('house_no', houseNo);
    data.append('landmark', landmark);
    data.append('state', state);
    data.append('city', city);

    const params = {
      data: data,
      token: user?.token,
    };

    dispatch(add_address(params)).then((res) => {
      successToast('Address added successfully');
      get_Address();
      setIsFetchingLocation(false); // End loading after API call
    }).catch(() => {
      setIsFetchingLocation(false); // End loading on error
    });
  };

  useEffect(() => {
    get_Address();
  }, [user, isFocussed, visible, updateVisible]);

  const renderItem = ({ item }) => (
    <View style={[styles.addressContainer, styles.shadow]}>
      <View style={styles.addressContent}>
        <Image
          source={require('../../assets/croping/Address__.png')}
          style={styles.addressImage}
        />
        <View style={styles.addressDetails}>
          <Text style={styles.fullName}>{item.full_name}</Text>
          <Text style={styles.addressLine}>{item.street} House no {item.house_no}</Text>
          <Text style={styles.addressLine}>
            landmark {item.landmark} {item.city} {item.pincode} ({item.state})
          </Text>
          <Text style={styles.addressLine}>mobile {item.mobile_number}</Text>
        </View>
        <RadioButton
          value={item.id}
          status={item.is_selected == 1 ? 'checked' : 'unchecked'}
          onPress={() => {
            selected_Address(item)
          }}
        />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() => {
            setUpdateVisible(true);
            setModalData(item);
          }}
          style={styles.editButton}
        >
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleDeleteAddress(item.address_id)}
          style={styles.removeButton}
        >
          <Text style={styles.buttonText}>Remove</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {isLoading ? <Loading /> : null}
      <ScrollView showsVerticalScrollIndicator={false}>
        <ProfileHeader name={'Address'} Dwidth={'22%'} />
        <View style={styles.listContainer}>
      
          <TouchableOpacity
            onPress={getLiveLocation}
            style={styles.addButton}
            disabled={isFetchingLocation} // Disable button while fetching location
          >
            {isFetchingLocation ? (
              <ActivityIndicator size="small" color="#0000ff" />
            ) : (
              <Text style={styles.buttonText}>Use Current Location</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setVisible(true)}
            style={styles.addButton}
          >
            <Text style={styles.buttonText}>Add New Address</Text>
          </TouchableOpacity>
          {addresList && (
            <FlatList
              data={addresList}
              renderItem={renderItem}
              keyExtractor={(item) => item.address_id.toString()} // Add a keyExtractor
              showsHorizontalScrollIndicator={false}
            />
          )}
        </View>
      </ScrollView>

      <AddressModal visible={visible} onClose={() => setVisible(false)} />
      <UpdateAddressModal
        visible={updateVisible}
        data={modalData}
        onClose={() => setUpdateVisible(false)}
      />
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
  },
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    paddingHorizontal: 15,
  },
  addressContainer: {
    padding: 10,
    marginVertical: 10,
    marginHorizontal: 5,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
  },
  addressContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
  },
  addressImage: {
    height: 60,
    width: 60,
  },
  addressDetails: {
    width: '70%',
  },
  fullName: {
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 10,
    lineHeight: 24,
    color: '#352C48',
  },
  addressLine: {
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 10,
    lineHeight: 14,
    color: '#6B7280',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButton: {
    margin: 10,
    paddingHorizontal: 30,
    marginTop: 20,
    backgroundColor: '#9dc2f2',
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    borderRadius: 10,
  },
  removeButton: {
    margin: 10,
    paddingHorizontal: 20,
    marginTop: 20,
    backgroundColor: '#fa2d48',
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 14,
    color: '#000',
    fontWeight: '600',
  },
  addButton: {
    margin: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: 15,
    borderWidth: 1,
  },
  listContainer: {
    flex: 1,
    marginTop: 20,
  },
});

