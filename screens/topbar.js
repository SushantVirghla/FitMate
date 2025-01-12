import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { format } from 'date-fns'; 

const TopBar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    setSelectedDate(new Date()); 
  }, []);

  const onDateChange = (date) => {
    setSelectedDate(date); 
  };

  const formattedDate = format(selectedDate, 'dd/MM/yyyy'); 

  return (
    <View style={styles.topbar}>
      {/* <TouchableOpacity style={styles.plus}>
        <Image style={styles.left} source={require('../assets/images/before.png')} />
      </TouchableOpacity> */}
      <View style={styles.dateContainer}>
        <Text style={styles.toptext}>Today</Text>
        <Text style={styles.date}>{formattedDate}</Text> {/* Display formatted date */}
      </View>
      {/* <TouchableOpacity style={styles.plus}>
        <Image style={styles.left} source={require('../assets/images/next.png')} />
      </TouchableOpacity> */}
    </View>
  );
};

const styles = StyleSheet.create({
  topbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#B0E0E6',
    height: 50,
    width: '100%',
  },
  toptext: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
  },
  date: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
  },
  plus: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  // left: {
  //   height: 30,
  //   width: 30,
  // },
  dateContainer: {
    flex: 1,
    alignItems: 'center',
  },
});

export default TopBar;
