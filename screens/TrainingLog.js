import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { db, auth } from '../firebase';
import { collection, addDoc, query, where, orderBy, getDocs, serverTimestamp } from 'firebase/firestore';

export default function TrainingLog({ route, navigation }) {
  const { exerciseName, selectedDate, mode, muscleGroup } = route.params;
  const [activeTab, setActiveTab] = useState(mode === 'history' ? 'HISTORY' : 'TRACK');
  const [weight, setWeight] = useState(0.0);
  const [reps, setReps] = useState(0);
  const [exerciseHistory, setExerciseHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const decreaseWeight = () => {
    if (weight >= 2.5) {
      setWeight(prev => parseFloat((prev - 2.5).toFixed(1)));
    }
  };

  const increaseWeight = () => {
    setWeight(prevWeight => {
      const newWeight = prevWeight + 2.5;
      return parseFloat(newWeight.toFixed(1));
    });
  };

  const decreaseReps = () => {
    if (reps > 0) {
      setReps(prev => prev - 1);
    }
  };

  const increaseReps = () => {
    setReps(prev => prev + 1);
  };

  const handleClear = () => {
    setWeight(0.0);
    setReps(0);
    setError(null);
  };

  const currentUser = auth.currentUser;

  useEffect(() => {
    if (!currentUser) {
      navigation.replace('Home');
      return;
    }
    fetchExerciseHistory();
  }, [exerciseName, selectedDate, currentUser]);

  const fetchExerciseHistory = async () => {
    if (!currentUser) return;

    setLoading(true);
    setError(null);
    try {
      const exercisesRef = collection(db, 'exercises');
      let q;

      if (selectedDate) {
        // Create date range for the selected date (start to end of day)
        const startDate = new Date(selectedDate);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(selectedDate);
        endDate.setHours(23, 59, 59, 999);

        q = query(
          exercisesRef,
          where('userId', '==', currentUser.uid),
          where('timestamp', '>=', startDate),
          where('timestamp', '<=', endDate),
          orderBy('timestamp', 'desc')
        );
      } else {
        // Query for specific muscle group instead of exercise name
        q = query(
          exercisesRef,
          where('userId', '==', currentUser.uid),
          where('muscleGroup', '==', muscleGroup),
          orderBy('timestamp', 'desc')
        );
      }
      
      const querySnapshot = await getDocs(q);
      const history = querySnapshot.docs.map(doc => {
        const data = doc.data();
        const timestamp = data.timestamp?.toDate() || new Date();
        return {
          id: doc.id,
          ...data,
          timestamp,
          weight: parseFloat(data.weight) || 0,
          reps: parseInt(data.reps) || 0
        };
      });
      
      setExerciseHistory(history);
    } catch (error) {
      console.error('Error fetching exercise history:', error);
      if (error.code === 'failed-precondition' || error.message.includes('index')) {
        setError('Setting up database indexing. Please try again in a few minutes.');
      } else {
        setError('Error loading history. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!currentUser) {
      setError('Please login to save exercise data');
      return;
    }

    if (weight === 0 || reps === 0) {
      setError('Please enter both weight and reps');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const exercisesRef = collection(db, 'exercises');
      const exerciseData = {
        userId: currentUser.uid,
        userEmail: currentUser.email,
        exerciseName,
        muscleGroup,
        weight: parseFloat(weight),
        reps: parseInt(reps),
        timestamp: serverTimestamp(),
      };

      await addDoc(exercisesRef, exerciseData);
      await fetchExerciseHistory();
      handleClear();
    } catch (error) {
      console.error('Error saving exercise:', error);
      setError('Failed to save exercise. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.exerciseName}>
        {selectedDate ? `Workout History - ${selectedDate}` : exerciseName}
      </Text>
      
      {!selectedDate && (
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'TRACK' && styles.activeTab]}
            onPress={() => setActiveTab('TRACK')}
          >
            <Text style={[styles.tabText, activeTab === 'TRACK' && styles.activeTabText]}>TRACK</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'HISTORY' && styles.activeTab]}
            onPress={() => {
              setActiveTab('HISTORY');
              fetchExerciseHistory();
            }}
          >
            <Text style={[styles.tabText, activeTab === 'HISTORY' && styles.activeTabText]}>HISTORY</Text>
          </TouchableOpacity>
        </View>
      )}

      {activeTab === 'TRACK' && !selectedDate ? (
        <View style={styles.trackContainer}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>WEIGHT (kgs)</Text>
            <View style={styles.inputContainer}>
              <TouchableOpacity style={styles.button} onPress={decreaseWeight}>
                <Text style={styles.buttonText}>−</Text>
              </TouchableOpacity>
              <View style={styles.valueContainer}>
                <Text style={styles.valueText}>{weight.toFixed(1)}</Text>
              </View>
              <TouchableOpacity style={styles.button} onPress={increaseWeight}>
                <Text style={styles.buttonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>REPS</Text>
            <View style={styles.inputContainer}>
              <TouchableOpacity style={styles.button} onPress={decreaseReps}>
                <Text style={styles.buttonText}>−</Text>
              </TouchableOpacity>
              <View style={styles.valueContainer}>
                <Text style={styles.valueText}>{reps}</Text>
              </View>
              <TouchableOpacity style={styles.button} onPress={increaseReps}>
                <Text style={styles.buttonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          {error && <Text style={styles.errorText}>{error}</Text>}

          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={[styles.saveButton, loading && styles.disabledButton]} 
              onPress={handleSave}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.saveButtonText}>SAVE</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
              <Text style={styles.clearButtonText}>CLEAR</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <ScrollView style={styles.historyContainer}>
          <View style={styles.historyHeader}>
            <Text style={styles.historyText}>
              {selectedDate ? `Exercises for ${selectedDate}` : `${muscleGroup} Training History`}
            </Text>
            {selectedDate && (
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
              >
                <Text style={styles.backButtonText}>Back to Calendar</Text>
              </TouchableOpacity>
            )}
          </View>
          
          {loading ? (
            <ActivityIndicator size="large" color="#d98d64" style={styles.loader} />
          ) : error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : exerciseHistory.length === 0 ? (
            <Text style={styles.emptyText}>
              {selectedDate 
                ? `No exercises found for ${selectedDate}`
                : `No history found for ${muscleGroup} exercises.`}
            </Text>
          ) : (
            exerciseHistory.map((exercise, index) => (
              <View key={exercise.id || index} style={styles.historyItem}>
                <Text style={styles.historyExerciseName}>
                  {exercise.exerciseName}
                </Text>
                <Text style={styles.historyDetails}>
                  Weight: {exercise.weight.toFixed(1)} kgs | Reps: {exercise.reps}
                </Text>
                <Text style={styles.historyTimestamp}>
                  {exercise.timestamp.toLocaleString()}
                </Text>
              </View>
            ))
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EFF3EA',
    padding: 20,
  },
  exerciseName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#d98d64',
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: '#d98d64',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#d98d64',
    fontWeight: 'bold',
  },
  trackContainer: {
    flex: 1,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    color: '#2C3E50',
    marginBottom: 15,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    width: 50,
    height: 50,
    backgroundColor: '#d98d64',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
  },
  valueContainer: {
    width: 120,
    height: 50,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d98d64',
  },
  valueText: {
    fontSize: 24,
    color: '#2C3E50',
    fontWeight: 'bold',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 40,
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#2ECC71',
    padding: 15,
    borderRadius: 8,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    opacity: 0.7,
  },
  clearButton: {
    flex: 1,
    backgroundColor: '#3498DB',
    padding: 15,
    borderRadius: 8,
    marginLeft: 10,
  },
  saveButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  clearButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  historyContainer: {
    flex: 1,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  historyText: {
    fontSize: 18,
    color: '#2C3E50',
  },
  backButton: {
    backgroundColor: '#3498DB',
    padding: 8,
    borderRadius: 6,
  },
  backButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  historyItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    width: '100%',
  },
  historyExerciseName: {
    fontSize: 16,
    color: '#2C3E50',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  historyDetails: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  historyTimestamp: {
    fontSize: 12,
    color: '#999',
  },
  errorText: {
    color: '#e74c3c',
    textAlign: 'center',
    marginVertical: 10,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
    marginTop: 20,
  },
  loader: {
    marginTop: 20,
  },
});