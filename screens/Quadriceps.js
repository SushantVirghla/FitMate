import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, TextInput, Button, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; 
import SearchBar from '../components/Searchbar'; 

const Quadriceps = ({ navigation }) => { 
  const [exercises, setExercises] = useState([
    'Squats',
    'Leg Press',
    'Leg Extensions',
    'Lunges',
    'Bulgarian Split Squats',
    'Walking Lunges',
    'Jump Squats',
    'Front Squats',
    'Hack Squats',
    'Step-Ups',
  ]);

  const [newExercise, setNewExercise] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [editedExercise, setEditedExercise] = useState('');
  const [searchText, setSearchText] = useState('');
  const [filteredExercises, setFilteredExercises] = useState(exercises); 

  const handleAddExercise = () => {
    if (newExercise.trim() !== '') { 
      setExercises([...exercises, newExercise]); 
      setFilteredExercises([...exercises, newExercise]); 
      setNewExercise(''); 
    }
  };

  const handleDeleteExercise = (index) => {
    Alert.alert(
      'Delete Exercise',
      'Are you sure you want to delete this exercise?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => {
          const updatedExercises = [...exercises];
          updatedExercises.splice(index, 1); 
          setExercises(updatedExercises);
          setFilteredExercises(updatedExercises); 
        }},
      ]
    );
  };

  const handleEditExercise = (index, currentExercise) => {
    setIsEditing(true);
    setEditIndex(index);
    setEditedExercise(currentExercise);
  };

  const handleSaveEdit = () => {
    if (editedExercise.trim() !== '') {
      const updatedExercises = [...exercises];
      updatedExercises[editIndex] = editedExercise;
      setExercises(updatedExercises);
      setFilteredExercises(updatedExercises); 
      setIsEditing(false);
      setEditIndex(null);
      setEditedExercise('');
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditIndex(null);
    setEditedExercise('');
  };

  const handleItemPress = (item) => {
    navigation.navigate('Train', { exerciseName: item, muscleGroup: 'Quadriceps' }); 
  };

  const handleSearch = () => {
    const filtered = exercises.filter((exercise) =>
      exercise.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredExercises(filtered); 
  };

  return (
    <View style={styles.container}>
      <SearchBar onSearch={handleSearch} setSearchText={setSearchText} /> 
      <Text style={styles.header}>Quadriceps Exercises</Text> 
      <View style={styles.inputContainer}>
        <TextInput 
          style={styles.input} 
          placeholder="Add new exercise" 
          value={newExercise} 
          onChangeText={(text) => setNewExercise(text)} 
        />
        <Button title="Add" onPress={handleAddExercise} style={styles.addButton} /> 
      </View>
      <FlatList
        data={filteredExercises}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.listItem}>
            {isEditing && editIndex === index ? (
              <View style={styles.editContainer}>
                <TextInput
                  style={[styles.item, { flex: 1 }]}
                  value={editedExercise}
                  onChangeText={setEditedExercise}
                  autoFocus={true}
                />
                <TouchableOpacity onPress={handleSaveEdit} style={styles.editButton}>
                  <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleCancelEdit} style={styles.editButton}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity onPress={() => handleItemPress(item)} style={styles.exerciseItem}>
                <Text style={styles.item}>{item}</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={() => {
              Alert.alert(
                'Options',
                'Choose an action:',
                [
                  { text: 'Edit', onPress: () => handleEditExercise(index, item) },
                  { text: 'Delete', onPress: () => handleDeleteExercise(index) },
                ]
              );
            }} style={styles.optionsButton}>
              <MaterialIcons name="more-vert" size={24} color="gray" /> 
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#EFF3EA', 
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2C3E50',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 6,
    padding: 10,
    marginRight: 10,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
  },
  item: {
    fontSize: 18,
    marginBottom: 10,
    color: '#2C3E50',
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  editContainer: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  editInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#3498DB',
    borderRadius: 6,
    padding: 8,
    marginRight: 10,
  },
  editButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  saveButtonText: {
    color: '#2ECC71',
    fontWeight: 'bold',
  },
  cancelButtonText: {
    color: '#E74C3C',
    fontWeight: 'bold',
  },
  exerciseItem: {
    flex: 1,
    paddingRight: 10,
  },
  optionsButton: {
    padding: 5,
  },
  addButton: {
    backgroundColor: '#4CAF50', 
    paddingHorizontal: 15,
    borderRadius: 5,
  },
});

export default Quadriceps;