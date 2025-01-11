import React from 'react';
import { NavigationContainer } from '@react-navigation/native'; 
import { createStackNavigator } from '@react-navigation/stack';
import App from './App'; 
import Signup from './Signup'; 
import mainscreen from './screens/mainscreen'
import Parts from './screens/Parts';
import Chest from './screens/Chest';
import Back from './screens/Back';
import Biceps from './screens/Biceps';
import Triceps from './screens/Triceps';
import Abs from './screens/Abs';
import Shoulders from './screens/Shoulders';
import Forearms from './screens/Forearms';
import Calves from './screens/Calves';
import Hamstrings from './screens/Hamstrings';
import Quadriceps from './screens/Quadriceps';
import Trapezius from './screens/Trapezius';
import LowerBack from './screens/LowerBacks';
import TrainingLog from './screens/TrainingLog';
import Nutrition from './screens/nutrition';

const Stack = createStackNavigator();

const AppContainer = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
          name="Home" 
          component={App} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="Dashboard" component={mainscreen} />
        <Stack.Screen name="Selection" component={Parts} />
        <Stack.Screen name="Chest" component={Chest} />
        <Stack.Screen name="Back" component={Back} />
        <Stack.Screen name="Biceps" component={Biceps} />
        <Stack.Screen name="Triceps" component={Triceps} />
        <Stack.Screen name="Shoulders" component={Shoulders} />
        <Stack.Screen name="Forearms" component={Forearms} />
        <Stack.Screen name="Calves" component={Calves} />
        <Stack.Screen name="Hamstrings" component={Hamstrings} />
        <Stack.Screen name="Quadriceps" component={Quadriceps} />
        <Stack.Screen name="Trapezius" component={Trapezius} />
        <Stack.Screen name="Lower Back" component={LowerBack} />
        <Stack.Screen name="Abs" component={Abs} />
        <Stack.Screen name="Train" component={TrainingLog} />
        <Stack.Screen name="Nutrition" component={Nutrition} />

        
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppContainer;