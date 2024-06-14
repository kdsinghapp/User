import React, { useRef, useEffect, useState } from 'react';
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
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
const AddressModal = ({ visible, onClose, }) => {
    const screenHeight = Dimensions.get('screen').height;
    const translateY = useRef(new Animated.Value(screenHeight)).current;
    const user = useSelector(state => state.auth.userData);
    const isLoading = useSelector(state => state.feature.isLoading);
    const [fullName, setFullName] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [pincode, setPincode] = useState('');
    const [street, setStreet] = useState('');
    const [houseNo, setHouseNo] = useState('');
    const [landmark, setLandmark] = useState('');
    const [state, setState] = useState('');
    const [city, setCity] = useState('');
    const [PickupLocationlat, setPickupLocationlat] = useState({
        lat: "",
        lng: "",
        place: ""
    });
    const dispatch = useDispatch()

    console.log(PickupLocationlat);
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
        if (!fullName || !mobileNumber || !pincode || !street || !houseNo || !state || !city) {
            // Display error message or toast indicating missing fields
            return errorToast('All fields are required');
           
        }
        let data = new FormData();
        data.append('user_id', user?.user_data.id);
        data.append('full_name', fullName);
        data.append('mobile_number', mobileNumber);
        data.append('lat', '78.000');
        data.append('long', '20.00');
        data.append('pincode', pincode);
        data.append('street', street);
        data.append('house_no', houseNo);
        data.append('landmark', landmark);
        data.append('state', state);
        data.append('city', city);
        const params = {
            data: data,
            token: user?.token
        }
        dispatch(add_address(params)).then(res=>{
            onClose()

        })
    };

    return (
        <Modal visible={visible} transparent>
            <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
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
                        <View style={styles.inputContainer}>
                            <TextInput
                                placeholder="Full Name"
                                style={[styles.input, !fullName && styles.inputError]}
                                value={fullName}
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
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <TextInput
                                placeholder="Pincode"
                                style={[styles.input, !pincode && styles.inputError]}
                                value={pincode}
                                onChangeText={setPincode}
                                keyboardType="number-pad"
                            />
                        </View>
                        <View style={styles.inputContainer}>
                        <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: 10,
                        backgroundColor: 'white',
                        elevation: 3,
                        shadowColor: 'black',
                        borderRadius: 3,
                        shadowOffset: {
                            width: 0,
                            height: 1
                        },
                        padding: 8,
                        shadowOpacity: 0.15,
                        shadowRadius: 2.84,
                        borderRadius: 12
                    }}>

                    <GooglePlacesAutocomplete
                        scrollEnabled={false}
                        fetchDetails={true}
                        GooglePlacesDetailsQuery={{ fields: 'geometry' }}
                        placeholder={'steet'}
                        onPress={(data, details = null) => {
                            try{

                                setPickupLocationlat({ ...PickupLocationlat, lat: details?.geometry?.location?.lat, lng: details?.geometry?.location?.lng, place: data.description });
                            }catch(err){
                                console.log(err);
                            }
                        }}
                        styles={{
                            description: {
                                fontWeight: 'bold',
                                color: 'black',
                                width: '100%',
                            },
                            container: {
                                padding: 0,
                            },
                            textInput: {
                                fontSize: 12,
                                color: '#000',
                                height: '100%',
                                width: '100%',
                            },
                        }}
                        textInputProps={{
                            placeholderTextColor: "#000"
                        }}
                        query={{
                            key: process.env.GOOGLE_MAPS_API_KEY,
                            language: 'en',
                        }}
                    />
                </View>
                        </View>
                        <View style={styles.inputContainer}>
                            <TextInput
                                placeholder="House Number"
                                style={[styles.input, !houseNo && styles.inputError]}
                                value={houseNo}
                                onChangeText={setHouseNo}
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <TextInput
                                placeholder="Landmark"
                                style={[styles.input, !landmark && styles.inputError]}
                                value={landmark}
                                onChangeText={setLandmark}
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <TextInput
                                placeholder="State"
                                style={[styles.input, !state && styles.inputError]}
                                value={state}
                                onChangeText={setState}
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <TextInput
                                placeholder="City"
                                style={[styles.input, !city && styles.inputError]}
                                value={city}
                                onChangeText={setCity}
                            />
                        </View>
                      
                        <TouchableOpacity
                            onPress={handleAddAddress}
                            style={styles.button}>
                            <Text style={styles.buttonText}>Add Address</Text>
                        </TouchableOpacity>
                  
                </Animated.View>
                </ScrollView>
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
