import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import DatePicker from 'react-native-date-picker';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Edit from '../../assets/sgv/Edit.svg';
import ProfileHeader from './ProfileHeader';
import TextInputField from '../../configs/TextInputField';
import { useDispatch, useSelector } from 'react-redux';
import { get_Profile, update_profile } from '../../redux/feature/featuresSlice';
import Loading from '../../configs/Loader';
import ImagePicker from 'react-native-image-crop-picker';

export default function EditProfile() {
  const user = useSelector(state => state.auth.userData);
  const UserData = useSelector(state => state.feature?.getProfile);
  const isLoading = useSelector(state => state.feature.isLoading);
  const [email, setEmail] = useState('');
  const [isFocus, setIsFocus] = useState(false);
  const dispatch = useDispatch();
  const [FullName, setFullName] = useState('');
  const [Mobile, setMobile] = useState('');
  const [Dob, setDob] = useState(new Date());
  const [address, setAddress] = useState('');
  const [profile, setProfile] = useState('');
  const [imageUrl, setimageUrl] = useState('');
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);

  useEffect(() => {
    const params = {
      token: user.token,
    };
    dispatch(get_Profile(params));
  }, [user]);

  useEffect(() => {
    if (UserData) {
      setFullName(UserData?.full_name);
      setEmail(UserData?.email);
      setMobile(UserData?.mobile_number);
      setDob(new Date(UserData?.date_of_birth?.split('/').reverse().join('-')));
      setAddress(UserData?.home_town);
      setimageUrl(UserData?.images);
    }
  }, [UserData]);


  const openImageLibrary = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    })
      .then(image => {
        setProfile(image);
        setimageUrl(image.path);
      })
      .catch(err => {
        console.log(err);
      });
  };

  const handleSave = () => {

    const formData = new FormData();

    formData.append('full_name', FullName);
    formData.append('date_of_birth', Dob.toISOString().split('T')[0],);
    formData.append('home_town', address);
    formData.append('mobile_number', Mobile);
    formData.append('images', profile?.path
      ? {
        uri:
          Platform.OS === 'android'
            ? profile.path
            : profile?.path?.replace('file://', ''),
        type: profile.mime,
        name: `image${user?.user_data.useres_id}.png`,
      }
      : {
        uri: imageUrl,
        type: 'image/jpeg',
        name: `image${user?.user_data.useres_id}.png`,
      },);



    const params = {

      data: formData,
      token: user?.token,
    };



    dispatch(update_profile(params)).then(err => {
      const params = {
        token: user.token,
      };
      dispatch(get_Profile(params));
    });
  };

  return (
    <View style={styles.container}>
      {isLoading ? <Loading /> : null}
      <ScrollView showsVerticalScrollIndicator={false}>
        <ProfileHeader name={'Edit Profile'} Dwidth={'30%'} />
        <TouchableOpacity
          onPress={openImageLibrary}
          style={[styles.profileImageContainer, styles.shadow, { borderWidth: 2 }]}>
          {imageUrl ? (
            <Image source={{ uri: imageUrl }} style={styles.profileImage} />
          ) : (
            <Text style={styles.profileInitial}>
              {FullName[0]?.toUpperCase()}
            </Text>
          )}
          <View style={styles.editIcon}>
            <Edit />
          </View>
        </TouchableOpacity>

        <View style={styles.publicContainer}>
          <Text style={styles.publicText}>
     Details
          </Text>
        </View>

        <View style={{}}>
          <TextInputField
            onChangeText={setFullName}
            isFocus={isFocus}
            name={'Full Name'}
            placeholder={FullName || 'Full Name'}
            firstLogo={false}
            showEye={false}
          />
        </View>

        <View>
          <View
            style={{
              borderWidth: 2, height: 55, borderColor: '#EBEBEB', borderRadius: 10,
              flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',

              paddingHorizontal: 15
            }}
          >
            <View>
              <Text style={{
                fontWeight: '500',
                fontSize: 14, color: '#9DB2BF'
              }}>Date of Birth</Text>
              <Text style={{
                color: '#000000', marginTop: 5,
                fontWeight: '500',
                fontSize: 14,
              }}>{Dob ? Dob.toISOString().split('T')[0] : 'DOB'}</Text>
            </View>

            <TouchableOpacity
              onPress={() => setDatePickerVisible(true)}
            >
              <Image source={require('../../assets/croping/calendar.png')}
                style={{ height: 20, width: 20 }}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View>
          <TextInputField
            onChangeText={setAddress}
            isFocus={isFocus}
            name={'City'}
            placeholder={address || 'City'}
            firstLogo={false}
            showEye={false}
          />
        </View>

        <View style={styles.privateContainer}>
   
        </View>
        <View>
          <View
            style={{
              borderWidth: 2, height: 55, borderColor: '#EBEBEB', borderRadius: 10,
              flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
marginTop:10,
              paddingHorizontal: 15
            }}
          >
            <View>
              <Text style={{
                fontWeight: '500',
                fontSize: 14, color: '#9DB2BF'
              }}>Email</Text>
              <Text style={{
                color: '#000000', marginTop: 5,
                marginLeft:0,
                fontWeight: '500',
                fontSize: 14,
              }}>{email}</Text>
            </View>

          </View>
        </View>
        <View>
          <TextInputField
            onChangeText={setMobile}
            isFocus={isFocus}
            name={'Mobile Number'}
            placeholder={Mobile || 'Mobile Number'}
            firstLogo={false}
            showEye={false}
          />
        </View>
      </ScrollView>

      <TouchableOpacity
        style={[styles.tabBtn, { position: 'absolute', bottom: 20 }]}
        onPress={handleSave}>
        <Text style={styles.saveButtonText}>
          Save
        </Text>
      </TouchableOpacity>

      <DatePicker
        modal
        open={isDatePickerVisible}
        date={Dob}
        mode="date"
        onConfirm={(date) => {
          setDatePickerVisible(false);
          setDob(date);
        }}
        onCancel={() => {
          setDatePickerVisible(false);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  tabBtn: {
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 60,
    marginTop: 25,
    width: '100%',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 1,
    backgroundColor: '#352C48',
  },
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
  profileImage: {
    height: 90,
    width: 90,
    borderRadius: 45,
  },
  editIcon: {
    position: 'absolute',
    bottom: 5,
    right: 5,
  },
  profileImageContainer: {
    alignSelf: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
    height: 110,
    width: 110,
    borderRadius: 55,
    backgroundColor: '#FFF',
    justifyContent: 'center',
  },
  profileInitial: {
    fontSize: 20,
    color: '#000',
    fontWeight: '600',
  },
  publicContainer: {
    marginTop: hp(3),
  },
  publicText: {
    fontSize: 20,
    lineHeight: 30,
    fontWeight: '700',
    color: '#000',
  },
  privateContainer: {

  },
  privateText: {
    fontSize: 20,
    lineHeight: 30,
    fontWeight: '700',
    color: '#000',
  },
  saveButtonText: {
    fontWeight: '600',
    fontSize: 17,
    color: '#FFF',
    lineHeight: 25.5,
    marginLeft: 10,
  },
});
