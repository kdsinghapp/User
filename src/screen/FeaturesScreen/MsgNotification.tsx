
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
    } from 'react-native';
    import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
    import { useIsFocused, useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import ProfileHeader from './ProfileHeader';
import Loading from '../../configs/Loader';

    interface Item {
      id: string;
      titile: string;
      time: string;
      type: string;
    }
    
    const MsgNotification: React.FC = () => {
        const isFocuse = useIsFocused();
        const navigation = useNavigation();
      
     const Notification = useSelector(state => state.feature.Notification);
        const isLoading = useSelector(state => state.feature.isLoading);
    //     const user = useSelector(state => state.auth.userData);
    //     const dispatch = useDispatch();
      
    //     useEffect(() => {
    //         const params ={
    //             user_id:user?.id
    //         }
    //       dispatch(get_user_notification(params));
    //     }, [isFocuse,user,deleteNotification]);
      

    //  const deleteNotification =async(id)=>{
    //     const params ={
    //         id:id
    //     }
    //    await dispatch(delete_notification(params));
    //  }
      const RecentListItem: React.FC<{ item: Item }> = ({ item }) => (
        <TouchableOpacity
          onLongPress={()=>{
            Alert.alert(
                "Delete Confirmation",
                "Are you sure you want to delete this ?",
                [
                  {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                  },
                  { text: "Delete", onPress: () => {
                    //deleteNotification(item.id)
                  } }
                ],
                { cancelable: false }
              );
          }}
          style={styles.listItem}>
          <View style={styles.itemHeader}>
            <View>
              <Image
                source={{uri:item.user_data.image}}
                style={styles.avatar}
              />
            </View>
            <View style={styles.itemText}>
              <Text style={styles.itemTitle}>{item.user_data.first_name} {item.user_data.last_name}</Text>
              <Text style={styles.itemTitle}>{item.description}</Text>
            </View>
          </View>
    
      
     
          <View>
            <Text style={styles.timeText}>{item.date_time}</Text>
          </View>
        </TouchableOpacity>
      );
    
      return (
        <View style={styles.container}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {isLoading?<Loading />:null}
          <ProfileHeader name={'Notification'} width={26} />
    
          <View style={styles.notificationContainer}>
          {Notification?.length >0 ? <FlatList
                data={Notification}
                renderItem={({ item }) => <RecentListItem item={item} />}
                keyExtractor={(item) => item.id}
                ListFooterComponent={() => <View style={styles.footer} />}
              />:<View style={{flex:1,alignItems:'center',justifyContent: 'center',}}>
<Text style={{fontSize:20,color:'#000'}}>No Notification found</Text>
            </View>
    }
            </View>
          </ScrollView>
        </View>
      );
    };
    
    export default MsgNotification;
    
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: '#fff',
      },
      colorDiv: {
        backgroundColor: '#874be9',
        height: hp(12),
        borderBottomRightRadius: 30,
        borderBottomLeftRadius: 30,
      },
      header: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        position: 'absolute',
        bottom: 20,
      },
      backButton: {
        width: '25%',
      },
      titleContainer: {
        width: '50%',
      },
      title: {
        fontWeight: '700',
        fontSize: 22,
        lineHeight: 32,
        color: '#FFF',
      },
      listItem: {
        padding: 10,
        borderBottomWidth: 0.8,
        borderColor: '#000',
        marginHorizontal: 15,
        backgroundColor: '#FFF',
        marginVertical: 10,
      },
      itemHeader: {
        width: '100%',
        height: hp(5),
        flexDirection: 'row',
      },
      avatar: {
        height: 30,
        width: 30,
        borderRadius: 15,
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
      buttonContainer: {
        paddingVertical: 10,
        flexDirection: 'row',
      },
      button: {
        backgroundColor: '#E95744',
        padding: 5,
        borderRadius: 5,
        paddingHorizontal: 20,
      },
      secondaryButton: {
        backgroundColor: '#DDDEE1',
        marginLeft: 20,
      },
      buttonText: {
        color: '#FFF',
        fontWeight: '500',
        fontSize: 10,
      },
      favoriteContainer: {
        paddingVertical: 10,
        flexDirection: 'row',
      },
      favoriteButton: {
        backgroundColor: '#DDDEE1',
        padding: 10,
        flexDirection: 'row',
        borderRadius: 5,
        width: '70%',
        alignItems: 'center',
        justifyContent: 'center',
      },
      favoriteText: {
        color: '#000',
        fontWeight: '500',
        fontSize: 12,
        marginLeft: 5,
      },
      fileContainer: {
        paddingVertical: 10,
        flexDirection: 'row',
      },
      fileButton: {
        padding: 10,
        flexDirection: 'row',
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
      },
      fileText: {
        color: '#000',
        fontWeight: '500',
        fontSize: 12,
        marginLeft: 5,
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
    
    const data: Item[] = [
      {
        id: '1',
        titile:
          'Dennisa Nedry requested access to Isla Nublar SOC2 compliance report',
        time: 'Last Wednesday at 9:42 AM',
        type: 'btn',
      },
      {
        id: '2',
        titile: 'Dennis Nedry commented on Isla Nublar SOC2 compliance report',
        time: 'Last Wednesday at 9:42 AM',
        type: 'no',
      },
      {
        id: '3',
        titile: 'Dennis Nedry commented on Isla Nublar SOC2 compliance report',
        time: 'Last Wednesday at 9:42 AM',
        type: 'tag',
      },
      {
        id: '4',
        titile: 'Dennis Nedry commented on Isla Nublar SOC2 compliance report',
        time: 'Last Wednesday at 9:42 AM',
        type: 'file',
      },
      {
        id: '5',
        titile: 'Dennis Nedry commented on Isla Nublar SOC2 compliance report',
        time: 'Last Wednesday at 9:42 AM',
        type: 'fav',
      },
    ];
    