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
import { add_address, update_address } from '../../../redux/feature/featuresSlice';
import { errorToast } from '../../../configs/customToast';
import Loading from '../../../configs/Loader';

const InteractionModal = ({ visible, onClose, data }) => {
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
    const dispatch = useDispatch()





    useEffect(() => {
        setFullName(data?.full_name)
        setMobileNumber(data?.mobile_number)
        setCity(data?.city)
        setState(data?.state)
        setLandmark(data?.landmark)
        setHouseNo(data?.house_no)
        setPincode(data?.pincode)
        setStreet(data?.street)
    }, [data])
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
        data?.append('user_id', user?.user_data?.id);
        data?.append('full_name', fullName);
        data?.append('mobile_number', mobileNumber);
        data?.append('lat', '78.000');
        data?.append('long', '20.00');
        data?.append('pincode', pincode);
        data?.append('street', street);
        data?.append('house_no', houseNo);
        data?.append('landmark', landmark);
        data?.append('state', state);
        data?.append('city', city);
        data?.append('address_id', data.address_id);
        const params = {
            data: data,
            token: user?.token,
            isSelectes:true
        }
        dispatch(update_address(params)).then(res => {
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


                        {isLoading ? <Loading /> : null}
                        <TouchableOpacity
                            onPress={() => onClose()}
                            style={{ alignSelf: 'flex-end', marginVertical: 10, }}>
                            <Image
                                style={{ height: 25, width: 25 }}
                                source={require('../../../assets/croping/Close2x.png')} />
                        </TouchableOpacity>

                       


                        <TouchableOpacity
                            onPress={handleAddAddress}
                            style={styles.button}>
                            <Text style={styles.buttonText}>Add</Text>
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
        marginTop: hp(15),
        height: hp(75),
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

export default InteractionModal;
