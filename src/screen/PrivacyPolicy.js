import { View, Text,Image, StyleSheet,ScrollView,TouchableOpacity } from 'react-native'
import React, { useEffect } from 'react'
import { heightPercentageToDP as hp} from 'react-native-responsive-screen'
import { useIsFocused, useNavigation } from '@react-navigation/native'
import ProfileHeader from './FeaturesScreen/ProfileHeader';
import Loading from '../configs/Loader';
import { WebView } from 'react-native-webview';
import { get_privacy_policy } from '../redux/feature/featuresSlice';
import { useDispatch, useSelector } from 'react-redux';

export default function PrivacyPolicy() {
  const Privacypolicy = useSelector(state => state.feature?.Privacypolicy);
  const isLoading = useSelector(state => state.feature.isLoading);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const isFocuss = useIsFocused();
  const user = useSelector(state => state.auth.userData);
  const params ={
    token:user.token
  }
    
  useEffect(() => {
    dispatch(get_privacy_policy(params));
  }, [isFocuss,user]);






  return (
    <View style={{flex:1,backgroundColor:'#fff',paddingHorizontal:15}}>
   {isLoading ? <Loading /> : null}
   <ProfileHeader  name={'Privacy Policy'} Dwidth={'40%'}/>
  
   <View style={{height:hp(30),marginTop:20,alignItems:'center',justifyContent:'center'}}>
<Image  source={require('../assets/croping/PrivacyPolicy2x.png')} style={{height:'80%',width:'80%'}} resizeMode='contain' />
    </View>
  
    <View style={{flex:1}}>
    {Privacypolicy &&  <WebView 
          source={{ html: Privacypolicy[0].pp_text }} 
        />
    }
        </View>

    </View>
  )
}

const styles =StyleSheet.create({
    btn: {
        borderWidth: 1,
        height: 60,
        marginHorizontal: '9%',
        position: 'absolute',
        width: '91%',
        alignSelf: 'center',
        bottom: hp(5),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 15,
        backgroundColor: '#1D0B38',
      },
    txtInput: {
        flexDirection: 'row',
        marginTop: 15,
        borderWidth: 2,
        borderColor: '#EBEBEB',
        height: 60,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'space-between',
      },
})