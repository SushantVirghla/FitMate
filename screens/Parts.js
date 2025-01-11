import React from 'react';
import { StyleSheet, Text, View, ImageBackground, TouchableOpacity, Dimensions } from 'react-native';

const muscleGroups = [
  {
    id: 1,
    name: 'Chest',
    image: require('../assets/images/body/chest.png'),
    backgroundColor: 'cyan',
  },
  {
    id: 2,
    name: 'Back',
    image: require('../assets/images/body/back.png'),
    backgroundColor: 'lightblue',
  },
  {
    id: 3,
    name: 'Biceps',
    image: require('../assets/images/body/biceps.png'),
    backgroundColor: 'cyan',
  },
  {
    id: 4,
    name: 'Triceps',
    image: require('../assets/images/body/triceps.png'),
    backgroundColor: 'cyan',
  },
  {
    id: 5,
    name: 'Abs',
    image: require('../assets/images/body/abs.png'),
    backgroundColor: 'yellow',
  },
  {
    id: 6,
    name: 'Shoulders',
    image: require('../assets/images/body/shoulder.png'),
    backgroundColor: 'orange',
  },
  {
    id: 7,
    name: 'Forearms',
    image: require('../assets/images/body/forearm.png'),
    backgroundColor: 'lightcoral',
  },
  {
    id: 8,
    name: 'Calves',
    image: require('../assets/images/body/calves.png'),
    backgroundColor: 'lightgray',
  },
  {
    id: 9,
    name: 'Hamstrings',
    image: require('../assets/images/body/hams.png'),
    backgroundColor: 'lightgray',
  },
  {
    id: 10,
    name: 'Quadriceps',
    image: require('../assets/images/body/quadricep (1).png'),
    backgroundColor: 'green',
  },
  {
    id: 11,
    name: 'Trapezius',
    image: require('../assets/images/body/trapezius.png'),
    backgroundColor: 'lightcoral',
  },
  {
    id: 12,
    name: 'Lower Back',
    image: require('../assets/images/body/lowerback.png'),
    backgroundColor: 'grey',
  },
];

const screenWidth = Dimensions.get('window').width;
const numColumns = 3; 
const cardWidth = (screenWidth - (numColumns + 1) * 10) / numColumns; 

export default function Parts({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.select}>Select Muscle Group</Text>
      <View style={styles.muscleimages}>
        {muscleGroups.map((item, index) => (
          <View key={item.id} style={[styles.muscleGroup, { width: cardWidth }]}> 
            <TouchableOpacity
              style={[styles.muscleGroupContainer, { backgroundColor: item.backgroundColor }]}
              onPress={() => navigation.navigate(item.name, { muscleGroup: item })} 
            >
              <ImageBackground style={styles.muscleImage} source={item.image} />
            </TouchableOpacity>
            <Text style={styles.muscleText}>{item.name}</Text> 
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EFF3EA',
  },

  select: {
    fontWeight: 'bold',
    fontSize: 28,
    alignSelf: 'center',
    marginTop: 15, 
  },

  muscleimages: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginTop: 20, 
  },

  muscleGroupContainer: {
    width: '90%', 
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 20, // Add spacing between muscle groups
  },

  muscleImage: {
    width: 80,
    height: 80,
    alignSelf: 'center',
  },

  muscleText: {
    textAlign: 'center', 
    marginTop: 5,
    fontWeight: 'bold', 
  },

  muscleGroup: {
    width: cardWidth,
    alignItems: 'center', 
  },
});