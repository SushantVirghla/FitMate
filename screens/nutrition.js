import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { auth, db } from '../firebase';
import { 
  collection,
  doc,
  setDoc,
  getDoc,
  query,
  where,
  orderBy,
  getDocs
} from 'firebase/firestore';

const API_KEY = 'GO_TO_USDA_NUTRITION_GET_YOUR_API';
const USDA_API_URL = 'https://api.nal.usda.gov/fdc/v1';

const Nutrition = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [amount, setAmount] = useState('');
  const [dailyLog, setDailyLog] = useState([]);
  const [totalNutrition, setTotalNutrition] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    loadDailyLog();
  }, [selectedDate]);

  const loadDailyLog = async () => {
    if (!auth.currentUser) {
      Alert.alert('Error', 'Please log in to track nutrition');
      return;
    }

    setIsLoading(true);
    try {
      const docRef = doc(db, 'nutrition', `${auth.currentUser.uid}_${selectedDate}`);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setDailyLog(data.logs || []);
      } else {
        setDailyLog([]);
      }
    } catch (error) {
      console.error('Error loading log:', error);
      Alert.alert('Error', 'Failed to load nutrition data');
    } finally {
      setIsLoading(false);
    }
  };

  const saveDailyLog = async (newLog) => {
    if (!auth.currentUser) return;

    try {
      const docRef = doc(db, 'nutrition', `${auth.currentUser.uid}_${selectedDate}`);
      await setDoc(docRef, {
        userId: auth.currentUser.uid,
        date: selectedDate,
        logs: newLog,
        totals: {
          calories: totalNutrition.calories,
          protein: totalNutrition.protein,
          carbs: totalNutrition.carbs,
          fats: totalNutrition.fats,
        },
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error saving log:', error);
      Alert.alert('Error', 'Failed to save nutrition data');
    }
  };

  const loadHistoricalData = async (days = 7) => {
    if (!auth.currentUser) return;

    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const q = query(
        collection(db, 'nutrition'),
        where('userId', '==', auth.currentUser.uid),
        where('date', '>=', startDate.toISOString().split('T')[0]),
        where('date', '<=', endDate.toISOString().split('T')[0]),
        orderBy('date', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const history = [];
      querySnapshot.forEach((doc) => {
        history.push(doc.data());
      });

      return history;
    } catch (error) {
      console.error('Error loading history:', error);
      Alert.alert('Error', 'Failed to load nutrition history');
    }
  };


  const getNutrientValue = (nutrients, nutrientId) => {
    const nutrient = nutrients.find(n => n.nutrientId === nutrientId);
    return nutrient ? nutrient.value : 0;
  };

  let searchTimeout = null;
  const searchFood = (query) => {
    setSearchQuery(query);
    
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    searchTimeout = setTimeout(async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `${USDA_API_URL}/foods/search?api_key=${API_KEY}&query=${encodeURIComponent(query)}&pageSize=25`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );

        if (!response.ok) {
          throw new Error('Search failed');
        }

        const data = await response.json();
        
        const transformedResults = data.foods.map(food => ({
          id: food.fdcId.toString(),
          name: food.description,
          calories: getNutrientValue(food.foodNutrients, 1008),
          protein: getNutrientValue(food.foodNutrients, 1003),
          carbs: getNutrientValue(food.foodNutrients, 1005),
          fats: getNutrientValue(food.foodNutrients, 1004),
          unit: '100g',
          brandOwner: food.brandOwner || 'Generic',
          source: food.dataType
        }));

        setSearchResults(transformedResults);
      } catch (error) {
        Alert.alert('Error', 'Failed to search foods. Please try again.');
        console.error('Search error:', error);
      } finally {
        setIsLoading(false);
      }
    }, 500);
  };

  const addFood = async (food) => {
    if (!auth.currentUser) {
      Alert.alert('Error', 'Please log in to track nutrition');
      return;
    }

    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount');
      return;
    }

    const multiplier = parseFloat(amount) / 100;
    const newEntry = {
      id: Date.now().toString(),
      name: food.name,
      amount: parseFloat(amount),
      calories: food.calories * multiplier,
      protein: food.protein * multiplier,
      carbs: food.carbs * multiplier,
      fats: food.fats * multiplier,
      unit: 'g',
      brandOwner: food.brandOwner,
      source: food.source,
      addedAt: new Date().toISOString(),
    };

    const newLog = [...dailyLog, newEntry];
    setDailyLog(newLog);
    await saveDailyLog(newLog);
    
    setSearchQuery('');
    setAmount('');
    setSearchResults([]);
  };

  const removeFood = async (id) => {
    const newLog = dailyLog.filter(item => item.id !== id);
    setDailyLog(newLog);
    await saveDailyLog(newLog);
  };

  const changeDate = (daysToAdd) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + daysToAdd);
    setSelectedDate(newDate.toISOString().split('T')[0]);
  };

  useEffect(() => {
    const totals = dailyLog.reduce((acc, item) => ({
      calories: acc.calories + item.calories,
      protein: acc.protein + item.protein,
      carbs: acc.carbs + item.carbs,
      fats: acc.fats + item.fats,
    }), { calories: 0, protein: 0, carbs: 0, fats: 0 });
    
    setTotalNutrition(totals);
  }, [dailyLog]);

  const renderSearchItem = ({ item }) => (
    <TouchableOpacity
      style={styles.searchItem}
      onPress={() => addFood(item)}
    >
      <View>
        <Text style={styles.foodName}>{item.name}</Text>
        <Text style={styles.brandName}>{item.brandOwner}</Text>
      </View>
      <View style={styles.nutritionInfo}>
        <Text>Calories: {item.calories.toFixed(1)}</Text>
        <Text>Protein: {item.protein.toFixed(1)}g</Text>
      </View>
    </TouchableOpacity>
  );

  const renderLogItem = ({ item }) => (
    <View style={styles.logItem}>
      <View style={styles.logItemMain}>
        <View>
          <Text style={styles.foodName}>{item.name}</Text>
          <Text style={styles.amount}>{item.amount}g</Text>
        </View>
        <View style={styles.nutritionInfo}>
          <Text>Cal: {item.calories.toFixed(1)}</Text>
          <Text>Prot: {item.protein.toFixed(1)}g</Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => removeFood(item.id)}
      >
        <Text style={styles.removeButtonText}>Remove</Text>
      </TouchableOpacity>
    </View>
  );

  const DateNavigation = () => (
    <View style={styles.dateContainer}>
      <TouchableOpacity onPress={() => changeDate(-1)} style={styles.dateButton}>
        <Text>Previous</Text>
      </TouchableOpacity>
      <Text style={styles.dateText}>{selectedDate}</Text>
      <TouchableOpacity onPress={() => changeDate(1)} style={styles.dateButton}>
        <Text>Next</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nutrition Tracker</Text>
      
      <DateNavigation />

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Search food..."
          value={searchQuery}
          onChangeText={searchFood}
        />
        <TextInput
          style={[styles.input, styles.amountInput]}
          placeholder="Grams"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
        />
      </View>

      
      {isLoading && (
        <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
      )}

      {searchResults.length > 0 && (
        <FlatList
          data={searchResults}
          keyExtractor={(item) => item.id}
          style={styles.searchResults}
          renderItem={renderSearchItem}
        />
      )}
  
      <Text style={styles.sectionTitle}>Food Log for {selectedDate}</Text>
      <FlatList
        data={dailyLog}
        keyExtractor={(item) => item.id}
        style={styles.logList}
        renderItem={renderLogItem}
      />

      <View style={styles.totalsContainer}>
        <Text style={styles.totalsTitle}>Daily Totals</Text>
        <Text>Calories: {totalNutrition.calories.toFixed(1)}</Text>
        <Text>Protein: {totalNutrition.protein.toFixed(1)}g</Text>
        <Text>Carbs: {totalNutrition.carbs.toFixed(1)}g</Text>
        <Text>Fats: {totalNutrition.fats.toFixed(1)}g</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  amountInput: {
    flex: 0.3,
  },
  searchResults: {
    maxHeight: 200,
  },
  searchItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  logItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  logItemMain: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  foodName: {
    fontSize: 16,
    fontWeight: '500',
  },
  brandName: {
    fontSize: 12,
    color: '#666',
  },
  amount: {
    fontSize: 14,
    color: '#666',
  },
  nutritionInfo: {
    alignItems: 'flex-end',
  },
  removeButton: {
    backgroundColor: '#ff4444',
    padding: 5,
    borderRadius: 5,
    alignSelf: 'flex-start',
  },
  removeButtonText: {
    color: 'white',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  totalsContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
  },
  totalsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  loader: {
    marginVertical: 20,
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  dateButton: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default Nutrition;
