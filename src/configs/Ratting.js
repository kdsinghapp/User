import React from 'react';
import { View, StyleSheet ,Image} from 'react-native';
import Star from '../assets/sgv/star.svg';
import BStar from '../assets/sgv/StarBlack.svg';
import {  } from 'react-native-svg';
 // Half Star (Assuming you have a half-star SVG)

const Rating = ({ rating }) => {
  return (
    <View style={styles.container}>
      {StarData.map((item, index) => (
        <React.Fragment key={item.id}>
          {index +1  <= Math.floor(rating) ? (
            <Star height={15} width={15} marginLeft={5} /> // Full Star
          ) : index < rating ? (
            <Image  source={require('../assets/rating.png')}   style={{height:13,width:13, marginLeft:5}} /> // Half Star
          ) : (
            <BStar height={15} width={15} marginLeft={5} /> // Empty Star
          )}
        </React.Fragment>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', // Horizontal arrangement
    alignItems: 'center', // Align items in the row
  },
});

export default Rating;

const StarData = [{ id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }, { id: '5' }];
