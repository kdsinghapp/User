

import React, { useState } from "react";
import { View, ImageBackground } from "react-native";

import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { _get_by_map, get_services } from "../../services/Auth";



import { useTheme } from "@react-navigation/native";
const ChooseLocation = ({ navigation, route }) => {

  const [PickupLocationlat, setPickupLocationlat] = useState({
    lat: "",
    lng: "",
    place: ""
  });
  const [loading, setLoading] = useState(false)
  const { colors } = useTheme()


  const get_providerList = () => {
    if (PickupLocationlat?.lat?.length === 0) {
      errorToast("Please Enter Location")
    } else {
      navigation.navigate("ServicesUserList", { serID, name, PickupLocationlat })
    }
  }



  return (
    <View style={{ flex: 1, backgroundColor: colors.backgroundColor }}>

      <View style={{ flex: 1, padding: 20, paddingTop: 0 }}>
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
            placeholder={'localizationStrings?.searchlocation'}
            onPress={(data, details = null) => {
              try {
         
                setPickupLocationlat({ ...PickupLocationlat, lat: details?.geometry?.location?.lat, lng: details?.geometry?.location?.lng, place: data.description });
              } catch (err) {
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

    </View>
  )

}
export default ChooseLocation
