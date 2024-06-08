import { View, Text ,Image,TextInput} from 'react-native'
import React, { useState } from 'react'
import { styles } from './Styles'

export default function Searchbar({...props}) {
    const [searchText, setSearchText] = useState('');



   
    const handleSearch = (txt) => {
      setSearchText(txt)
     
      if (typeof props.onSearchTxt === 'function') {
        props.onSearchTxt(txt);
    }
    };
  return (
    <View
    style={[
      {
        backgroundColor: '#fff',
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal:5,
     
        paddingHorizontal: 15,
        borderRadius: 15,
      },
      styles.shadow,
    ]}>
    <Image
      source={require('../assets/croping/search2x.png')}
      style={{height: 25, width: 25}}
      resizeMode="contain"
    />

    <TextInput
      onChangeText={handleSearch}
      value={searchText}
      style={{
        marginLeft: 10,

        width: '85%',
        fontSize: 16,
        lineHeight: 24,
        fontWeight: '400',
        color: '#302D2D',
      }}
      onFocus={props.onSearchonFocus}
      placeholderTextColor={'#302D2D'}
      placeholder={props.placeholder}
    />
  </View>
  )
}