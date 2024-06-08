import React from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StatusBar,
  Platform,
  StyleSheet,
} from 'react-native';


//Main loader component0
export default class Loading extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={{backgroundColor:'#F0F0F0',borderRadius:15,height:'25%',width:'60%',justifyContent:'center',alignItems:'center'}}>

     
        <ActivityIndicator size={Platform.OS == 'ios' ? 1 : 40} color={'green'} />
        <Text style={{fontStyle:'italic',color:'green'}}>please Wait......</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
     backgroundColor:'rgba(248,249,249,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
    
  },
  loadingview: {
    backgroundColor: 'green',
    flexDirection: 'row',
    alignSelf: 'center',
    padding: 10,
  },
  txt: {
    marginLeft: 10,
    marginTop: 5,
  },
});
