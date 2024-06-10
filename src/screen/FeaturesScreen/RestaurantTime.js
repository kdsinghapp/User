import {
    View,
    Text,
    FlatList,
    StyleSheet,
  } from 'react-native';
  import React from 'react';
  
  export default function RestaurantTime({ restaurant }) {
    const daysOfWeek = [
      { day: 'Monday', open: restaurant.res_monday_open, close: restaurant.res_monday_close },
      { day: 'Tuesday', open: restaurant.res_tuesday_open, close: restaurant.res_tuesday_close },
      { day: 'Wednesday', open: restaurant.res_wednesday_open, close: restaurant.res_wednesday_close },
      { day: 'Thursday', open: restaurant.res_thursday_open, close: restaurant.res_thursday_close },
      { day: 'Friday', open: restaurant.res_friday_open, close: restaurant.res_friday_close },
      { day: 'Saturday', open: restaurant.res_saturday_open, close: restaurant.res_saturday_close },
      { day: 'Sunday', open: restaurant.res_sunday_open, close: restaurant.res_sunday_close },
    ];
  
    return (
      <View style={styles.container}>
        <FlatList
          data={daysOfWeek}
          keyExtractor={(item) => item.day}
          renderItem={({ item }) => {
            const isClosed = item.day === restaurant.res_weekly_closed;
            return (
              <View style={styles.dayContainer}>
                <Text style={styles.dayName}>{item.day}</Text>
                <Text style={[styles.openCloseTimes, isClosed && styles.closedText]}>
                  {isClosed ? 'Closed' : `${item.open} - ${item.close !== 'undefined' ? item.close : 'Closed'}`}
                </Text>
              </View>
            );
          }}
        />
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
    paddingHorizontal:16,
    paddingVertical:10
    },
    dayContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
    },
    dayName: {
      fontSize: 12,
      fontWeight: '500',

    },
    openCloseTimes: {
      fontSize: 12,
      fontWeight:'600',
      color: '#666',
    },
    closedText: {
      color: 'red',
    },
  });
  