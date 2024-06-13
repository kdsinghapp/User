import React, { useEffect, useState } from 'react';
import { View, Text, Switch, FlatList, StyleSheet } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useDispatch, useSelector } from 'react-redux';

import { get_Profile, update_profile } from '../../redux/feature/featuresSlice';
import ProfileHeader from './ProfileHeader';
import Fcm from '../../fcm';

interface User {
  id: string;
  token: string;
}

interface RootState {
  auth: {
    userData: User;
    Update_user: {
      booking_updates: '1' | '0';
      tours_activities_attra: '1' | '0';
      reviews: '1' | '0';
    };
  };
  feature: {
    getProfile: {
      booking_updates: '1' | '0';
      activities_and_attractions: '1' | '0';
      reviews: '1' | '0';
    };
    isLoading: boolean;
  };
}

interface NotificationItem {
  id: string;
  name: string;
  Details: string;
  key: keyof RootState['auth']['Update_user'];
}

const data: NotificationItem[] = [
  {
    id: '1',
    name: 'Booking updates',
    Details: 'Receive important messages and updates from your tour operator',
    key: 'booking_updates',
  },
  {
    id: '2',
    name: 'Reviews',
    Details: 'Receive important messages and updates from your tour operator',
    key: 'reviews',
  },
  {
    id: '3',
    name: 'Activities & Attractions',
    Details: 'Receive important messages and updates from your tour operator',
    key: 'activities_and_attractions',
  },
];

const Notification: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.userData);
  const getProfile = useSelector((state: RootState) => state.feature.getProfile);
  const isLoading = useSelector((state: RootState) => state.feature.isLoading);

  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      const params = { token: user.token };
      dispatch(get_Profile(params));
    }
  }, [user, dispatch]);

  const [switchStates, setSwitchStates] = useState<{ [key: string]: boolean }>({});



  
  useEffect(() => {
    if (getProfile) {
      setSwitchStates({
        booking_updates: getProfile.booking_updates === '1',
        activities_and_attractions: getProfile.activities_and_attractions === '1',
        reviews: getProfile.reviews === '1',
      });
    }
  }, [getProfile]);

  const toggleSwitch = (key: keyof RootState['auth']['Update_user']) => {
    const newValue = !switchStates[key];
    setSwitchStates(prevStates => ({
      ...prevStates,
      [key]: newValue,
    }));

    // Call the API to update notification settings
    updateNotificationSettings(key, newValue);
  };

  const updateNotificationSettings = async (
    key: keyof RootState['auth']['Update_user'],
    newValue: boolean,
  ) => {
    console.log(key, newValue ? '1' : '0');
    
    const data = new FormData();
    //data.append('user_id', user?.user_data?.useres_id);
    data.append(key, newValue ? '1' : '0');
    const params = {
      token: user.token,
      data:data,
      Notification: true,
    };

    dispatch(update_profile(params)).then(res=>{
      const params = { token: user.token };
      dispatch(get_Profile(params));
    })
  };

  const renderItem = ({ item }: { item: NotificationItem }) => (
    <View style={styles.itemContainer}>
    
        <>
          <View style={styles.itemTextContainer}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemDetails}>{item.Details}</Text>
          </View>
          <Switch
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={switchStates[item.key] ? '#f5dd4b' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={() => toggleSwitch(item.key)}
            value={switchStates[item.key]}
          />
        </>
      
    </View>
  );

  return (
    <View style={styles.container}>
      <ProfileHeader Dwidth={'35%'} name={'Notification'} />
     
      {/* <View style={styles.listContainer}>
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          showsHorizontalScrollIndicator={false}
        />
      </View> */}
      <Fcm  />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    paddingHorizontal: 10,
  },
  listContainer: {
    flex: 1,
    marginTop: 20,
  },
  itemContainer: {
    marginVertical: 10,
    marginHorizontal: 5,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: hp(12),
    borderBottomWidth: 1,
    borderColor: '#E3E3E3',
    borderRadius: 15,
    padding: 10,
  },
  itemTextContainer: {
    width: '70%',
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
    lineHeight: 24,
    color: '#000000',
    fontFamily: 'Federo-Regular',
  },
  itemDetails: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 10,
    lineHeight: 18,
    color: '#777777',
    fontFamily: 'Federo-Regular',
  },
});

export default Notification;
