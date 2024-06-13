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
} from 'react-native';
import { RadioButton } from 'react-native-paper'; // Importing RadioButton
import { useDispatch, useSelector } from 'react-redux';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { addres_delete, addres_list, update_address } from '../../redux/feature/featuresSlice';
import ProfileHeader from './ProfileHeader';
import Loading from '../../configs/Loader';
import AddressModal from './Modal/AddressModal';
import UpdateAddressModal from './Modal/UpdateAddressModal';
import { successToast } from '../../configs/customToast';
import ScreenNameEnum from '../../routes/screenName.enum';


export default function Address() {
  const user = useSelector((state) => state.auth.userData);
  const isLoading = useSelector((state) => state.feature.isLoading);
  const addresList = useSelector((state) => state.feature.addresList);
  const [visible, setVisible] = useState(false);
  const [updateVisible, setUpdateVisible] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null); // State to keep track of selected address
const navigation= useNavigation()
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
          onPress: () => {
           remove_address(addressId)
          },
          style: 'destructive',
        },
      ]
    );
  };

  const remove_address =async(id)=>{
console.log(id);
    const params ={
      address_id:id,
      token:user?.token
    }

    dispatch(addres_delete(params)).then(res=>{
      get_Address();
    })
  }
  const selected_Address = (id) => {

    let data = new FormData();
    data?.append('user_id', user?.user_data?.id);
    data?.append('address_id', id);
    data?.append('is_selected',1);
    data?.append('long', '22.7');
    data?.append('lat', '22.7');
    const params = {
        data: data,
        token: user?.token,
        isSelectes:false
    }
    dispatch(update_address(params)).then(res => {
  
      get_Address();
    })
};


  const get_Address = () => {
    const params = {
      token: user.token,
      user_id: user?.user_data.id,
    };
    dispatch(addres_list(params));
  };

  useEffect(() => {
    get_Address();
  }, [user, isFocussed, visible, updateVisible]);

  const renderItem = ({ item }) => (
    <View style={[styles.addressContainer,styles.shdow]}>
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
          status={item.is_selected == 1 ?'checked':'unchecked'}
          onPress={()=>{
            selected_Address(item.address_id)
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
          {addresList && (
            <FlatList
              data={addresList}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              showsHorizontalScrollIndicator={false}
            />
          )}
          <TouchableOpacity
             onPress={() => setVisible(true)}

            // onPress={()=>{
            //   navigation.navigate(ScreenNameEnum.AddressPicker)
            // }}
            style={styles.addButton}
          >
            <Text style={styles.buttonText}>Add New Address</Text>
          </TouchableOpacity>
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
  shdow:{
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
    padding:10,
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
    borderWidth:1
  },
  listContainer: {
    flex: 1,
    marginTop: 20,
  },
});
