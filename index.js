// import { registerRootComponent } from 'expo';

// import App from './App';

// import { AppRegistry } from 'react-native';
// import AppContainer from './Appcontainer'; 
import React from 'react';
import { registerRootComponent } from 'expo';
import AppContainer from './Appcontainer'; 
import { StyleSheet } from 'react-native';

export default function EntryPoint() {
    return <AppContainer />;
  }
// AppRegistry.registerComponent('todoList', () => AppContainer);
// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(AppContainer);export const styles = StyleSheet.create({
    topbar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#B0E0E6',
        height: 50,
    },
    toptext: {
        flex: 1,
        textAlign: 'center',
        fontSize: 18,
    },
    plus: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        inplus: {
            fontSize: 24,
            color: '#fff',
        },
    }
});

