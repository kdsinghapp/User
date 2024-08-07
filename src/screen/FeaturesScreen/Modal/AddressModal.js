import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
    Modal,
    View,
    StyleSheet,
    Animated,
    Dimensions,
    Text,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Image
} from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { useDispatch, useSelector } from 'react-redux';
import { add_address } from '../../../redux/feature/featuresSlice';
import { errorToast } from '../../../configs/customToast';
import Loading from '../../../configs/Loader';
import GooglePlacesInput from '../../../configs/AutoAddress';

const AddressModal = ({ visible, onClose, }) => {
    const screenHeight = Dimensions.get('screen').height;
    const translateY = useRef(new Animated.Value(screenHeight)).current;
    const user = useSelector(state => state.auth.userData);
    const isLoading = useSelector(state => state.feature.isLoading);
    const [fullName, setFullName] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [pincode, setPincode] = useState('');
    const [street, setStreet] = useState('street');
    const [houseNo, setHouseNo] = useState('');
    const [landmark, setLandmark] = useState('');
    const [state, setState] = useState('');
    const [city, setCity] = useState('');
    const [Location, setLocation] = useState(null)
    const dispatch = useDispatch()
    useEffect(() => {
        if (visible) {
            openModal();
        } else {
            closeModal();
        }
    }, [visible]);

    const openModal = () => {
        Animated.timing(translateY, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    const closeModal = () => {
        Animated.timing(translateY, {
            toValue: screenHeight,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    const handleAddAddress = () => {
        if (!fullName || !mobileNumber || !street || !houseNo) {
            // Display error message or toast indicating missing fields
            return errorToast('All fields are required');
           
        }
        let data = new FormData();
        data.append('user_id', user?.user_data.id);
        data.append('full_name', fullName);
        data.append('mobile_number', mobileNumber);
        data.append('lat',Location?.latitude);
        data.append('long', Location?.longitude);
        // data.append('pincode', pincode);
        data.append('street', street);
        data.append('house_no', houseNo);
        // data.append('landmark', landmark);
        // data.append('state', state);
        // data.append('city', city);
        console.log('address_data ',data);
        const params = {
            data: data,
            token: user?.token
        }
        dispatch(add_address(params)).then(res=>{
            onClose()

        })
    };
    const handleSelectLocation = useCallback(
        (details) => {
          const { lat, lng } = details.geometry.location;
          setLocation({
            latitude: lat,
            longitude: lng,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          });
    
    
          const formattedAddress = formatAddress(details);
          console.log('details=>>>>>>>>>>>>>>>>>>>>>', formattedAddress);
          setStreet(formattedAddress)
        },
        [visible]
      );
      function formatAddress(addressData) {
        const components = addressData.address_components;
        const addressParts = [];
    
        components.forEach(component => {
          if (component.types.includes("premise")) {
            addressParts.push(component.long_name);
          } else if (component.types.includes("sublocality_level_1") || component.types.includes("sublocality")) {
            addressParts.push(component.long_name);
          } else if (component.types.includes("locality")) {
            addressParts.push(component.long_name);
          } else if (component.types.includes("administrative_area_level_1")) {
            addressParts.push(component.long_name);
          } else if (component.types.includes("country")) {
            addressParts.push(component.long_name);
          }
        });
    
        return addressParts.join(", ");
      }
    return (
        <Modal visible={visible} transparent>
            <View style={styles.container}>
          
                
            
                <Animated.View
                    style={[
                        styles.modal,
                        {
                            transform: [{ translateY: translateY }],
                        },
                    ]}>
                        {isLoading?<Loading />:null}
                   <TouchableOpacity 
onPress={()=>onClose()}
style={{alignSelf:'flex-end',marginVertical:10,}}>
    <Image  
    style={{height:25,width:25}}
    source={require('../../../assets/croping/Close2x.png')}/>
</TouchableOpacity>
<View >
        <GooglePlacesInput placeholder={'Post code'} onPlaceSelected={handleSelectLocation} />
      </View>

<ScrollView showsVerticalScrollIndicator={false}>
                        <View style={styles.inputContainer}>
                            <TextInput
                                placeholder="Full Name"
                                style={[styles.input, !fullName && styles.inputError]}
                                value={fullName}
                                placeholderTextColor={'#000'}
                                onChangeText={setFullName}
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <TextInput
                                placeholder="Mobile Number"
                                style={[styles.input, !mobileNumber && styles.inputError]}
                                value={mobileNumber}
                                onChangeText={setMobileNumber}
                                keyboardType="phone-pad"
                                placeholderTextColor={'#000'}
                            />
                        </View>
                   
             
                        <View style={styles.inputContainer}>
                            <TextInput
                                placeholder="House Number"
                                style={[styles.input, !houseNo && styles.inputError]}
                                value={houseNo}
                                onChangeText={setHouseNo}
                                placeholderTextColor={'#000'}
                            />
                        </View>
                 
                      
                        <TouchableOpacity
                            onPress={handleAddAddress}
                            style={styles.button}>
                            <Text style={styles.buttonText}>Add Address</Text>
                        </TouchableOpacity>
                        </ScrollView>
                </Animated.View>
            
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modal: {
        backgroundColor: 'white',
        padding: 16,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        marginTop:hp(10),
        height: hp(90),
    },
    inputContainer: {
        marginVertical: 10,
        marginHorizontal: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        paddingHorizontal: 10,
        backgroundColor: '#FFF',
    },
    input: {
        height: 50,
        color:'#000'
    },
    inputError: {
        borderColor: 'red',
    },
    button: {
        backgroundColor: '#7756FC',
        height: 50,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 20,
        marginHorizontal: 10,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFF',
    },
});

export default AddressModal;
