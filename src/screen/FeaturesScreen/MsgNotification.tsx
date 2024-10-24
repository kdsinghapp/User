import React, { useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ScrollView,
  Alert,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import ProfileHeader from './ProfileHeader';
import Loading from '../../configs/Loader';
import { get_notifications } from '../../redux/feature/featuresSlice';
import { Screen } from 'react-native-screens';
import ScreenNameEnum from '../../routes/screenName.enum';

interface Item {
  id: string;
  title: string;
  time: string;
  type: string;
  notification_data: any; // Adjusted to include notification data
}

const MsgNotification: React.FC = () => {
  const isFocused = useIsFocused();
  const navigation = useNavigation();

  const NotificationList = useSelector(state => state.feature.NotificationList);
  const isLoading = useSelector(state => state.feature.isLoading);
  const user = useSelector(state => state.auth.userData);
  const dispatch = useDispatch();

  const formatDate = (isoString) => {
    const date = new Date(isoString);

    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getUTCFullYear();

    let hours = date.getUTCHours();
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const seconds = String(date.getUTCSeconds()).padStart(2, '0');

    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    hours = String(hours).padStart(2, '0');

    const formattedDate = `${day}/${month}/${year}`;
    const formattedTime = `${hours}:${minutes} ${ampm}`;

    return `${formattedDate}, ${formattedTime}`;
  };

  useEffect(() => {
    const params = {
      token: user?.token,
    };
    dispatch(get_notifications(params));
  }, [isFocused, user]);

  const RecentListItem: React.FC<{ item: Item }> = ({ item }) => {
    const restaurantDishImage = item?.notification_data?.notify_type == 'AddDish' ? item?.notification_data?.data?.restaurant_dish_image : item?.notification_data?.data?.image;

    const notificationTitle = item?.notification_data?.title;
    const notificationBody = item?.notification_data?.body;
    const coupon_code = item?.notification_data?.data.coupon_code;

    return (
      <TouchableOpacity
disabled={item?.notification_data.notify_type != 'AddDish'}
onPress={()=>{
  navigation.navigate(ScreenNameEnum.DISH_INFORMATION,{item:item.notification_data.data})
}}

        style={[styles.listItem,{ backgroundColor:item?.notification_data?.notify_type == 'AddDish' ?'#b9e5ff':'#fffacb',borderRadius:10}]}
      >
        {item?.notification_data.notify_type == 'AddDish' && <View style={styles.itemHeader}>
          <View>
            {restaurantDishImage && (
              <Image
                source={{ uri: restaurantDishImage }}
                style={styles.avatar}
              />
            )}
          </View>
          <View style={styles.itemText}>
            <Text style={styles.itemTitle}>{notificationTitle}</Text>
            <Text style={[styles.itemTitle, { color: '#777777', fontSize: 10 }]}>
              {notificationBody}
            </Text>
          </View>
        </View>
        }
        {item?.notification_data.notify_type == 'AddCoupon' && <View style={styles.itemHeader}>
          <View>
            {restaurantDishImage && (
              <Image
                source={{ uri: restaurantDishImage }}
                style={styles.avatar}
              />
            )}
          </View>
          <View style={[styles.itemText,{marginTop:10}]}>
            <Text style={styles.itemTitle}>{notificationTitle}</Text>
            <Text style={[styles.itemTitle, { color: '#777777', fontSize: 10 }]}>
              {notificationBody}
            </Text>
            <Text style={[styles.itemTitle, { color: '#777777', fontSize: 10 }]}>
            Try this coupon code  <Text style={[styles.itemTitle, { color: '#777777', fontSize: 14,marginLeft:10 }]}>
            {coupon_code}
            </Text>
            </Text>
          </View>
        </View>
        }
        <View style={{alignSelf:'flex-end'}}>
          <Text style={styles.timeText}>{formatDate(item.created_at)}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{ backgroundColor: '#fff', flex: 1 }}>
    <StatusBar backgroundColor={'#fff'} />
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {isLoading ? <Loading /> : null}
        <View style={{ marginHorizontal: 10 }}>
          <ProfileHeader name={'Notification'} />
        </View>
        <View style={styles.notificationContainer}>
          {NotificationList?.length > 0 ? (
            <FlatList
              data={NotificationList}
              renderItem={({ item }) => <RecentListItem item={item} />}
              keyExtractor={(item) => item.id}
              ListFooterComponent={() => <View style={styles.footer} />}
            />
          ) : (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 20, color: '#000' }}>No Notification found</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
    </SafeAreaView>
  );
};

export default MsgNotification;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  listItem: {
    padding: 10,
  
    borderColor: '#000',
    marginHorizontal: 15,
    backgroundColor: '#FFF',
    marginVertical: 10,
  },
  itemHeader: {
    width: '100%',
    height: hp(5),
    flexDirection: 'row',
    alignItems:'center'
  },
  avatar: {
    height: 60,
    width: 60,
    borderRadius: 15,
    marginTop:15
  },
  itemText: {
    marginLeft: 10,
    width: '90%',
  },
  itemTitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#1A1F36',
  },
  timeText: {
    color: '#A5ACB8',
    fontWeight: '500',
    fontSize: 10,
  },
  footer: {
    height: hp(6),
  },
});
