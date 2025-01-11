import React, { useState, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { 
    StyleSheet, 
    Text, 
    View, 
    Image, 
    TouchableOpacity, 
    Modal,
    Animated,
    Dimensions,
    TouchableWithoutFeedback,
    Alert
} from 'react-native';
import { Calendar } from 'react-native-calendars'; 
import 'react-native-gesture-handler';
import TopBar from './topbar';
import { Menu } from 'lucide-react-native';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { format } from 'date-fns';

const { width, height } = Dimensions.get('window');

export default function Fscreen({ navigation }) {
    const [showModal, setShowModal] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const slideAnim = useRef(new Animated.Value(-width/2)).current;

    // Existing functionality remains the same...
    const toggleDrawer = () => {
        const toValue = isDrawerOpen ? -width/2 : 0;
        Animated.timing(slideAnim, {
            toValue,
            duration: 300,
            useNativeDriver: true,
        }).start();
        setIsDrawerOpen(!isDrawerOpen);
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigation.replace('Home');
        } catch (error) {
            console.error('Logout error:', error);
            Alert.alert('Error', 'Failed to logout. Please try again.');
        }
    };

    const handleLogoutPress = () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel'
                },
                {
                    text: 'Logout',
                    onPress: () => {
                        toggleDrawer();
                        handleLogout();
                    },
                    style: 'destructive'
                }
            ]
        );
    };
    const WorkoutPlusIcon = () => (
        <View style={styles.plusIconContainer}>
          <View style={styles.plusIcon}>
            <Text style={styles.plusText}>+</Text>
          </View>
          <Text style={styles.addWorkoutText}>Add Workout</Text>
        </View>
      );
      
      const CalendarIcon = () => (
        <View style={styles.calendarIconContainer}>
          <View style={styles.calendarHeader}>
            <Text style={styles.calendarMonth}>Jan</Text>
          </View>
          <View style={styles.calendarBody}>
            <Text style={styles.calendarDate}>11</Text>
          </View>
        </View>
      );
    return(
        <View style={styles.container}>
            <TopBar/>
            
            <TouchableOpacity 
                style={styles.menuIcon}
                onPress={toggleDrawer}
            >
                <Menu size={32} color="#2C3E50" />
            </TouchableOpacity>

            <View style={styles.content}>
                <Text style={styles.log}>Workout Log</Text>
                
                <TouchableOpacity 
                   style={styles.addWorkoutButton}
                    onPress={() => navigation.navigate('Selection')}
                    >
                    <WorkoutPlusIcon />
                    </TouchableOpacity>
           
                    <TouchableOpacity 
                       style={styles.calendarButton}
                      onPress={() => setShowModal(true)}
                            >       
                    <CalendarIcon />
                    </TouchableOpacity>

                <Modal 
                    visible={showModal} 
                    animationType='slide'
                    transparent={true}
                    onRequestClose={() => setShowModal(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContainer}>
                            <Text style={styles.modalTitle}>Select Date</Text>
                            <Calendar 
                                style={styles.realcal}
                                theme={{
                                    calendarBackground: '#FFFFFF',
                                    textSectionTitleColor: '#2C3E50',
                                    selectedDayBackgroundColor: '#3498DB',
                                    selectedDayTextColor: '#FFFFFF',
                                    todayTextColor: '#3498DB',
                                    dayTextColor: '#2C3E50',
                                    textDisabledColor: '#BDC3C7',
                                    dotColor: '#3498DB',
                                    monthTextColor: '#2C3E50',
                                    textDayFontWeight: '500',
                                    textMonthFontWeight: 'bold',
                                    textDayHeaderFontWeight: '600'
                                }}
                                hideExtraDays={true}
                                onDayPress={data => {
                                    setShowModal(false);
                                    navigation.navigate('Train', {
                                        selectedDate: format(new Date(data.dateString), 'yyyy-MM-dd'),
                                        mode: 'history'
                                    });
                                }}                    
                            />  
                            <TouchableOpacity 
                                onPress={() => setShowModal(false)}
                                style={styles.closeButton}
                            >
                                <Text style={styles.closeButtonText}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </View>

            {isDrawerOpen && (
                <TouchableWithoutFeedback onPress={toggleDrawer}>
                    <View style={styles.overlay} />
                </TouchableWithoutFeedback>
            )}

            <Animated.View 
                style={[
                    styles.drawer,
                    {
                        transform: [{ translateX: slideAnim }]
                    }
                ]}
            >
                <View style={styles.drawerContent}>
                    <View style={styles.drawerHeader}>
                        <Text style={styles.drawerTitle}>Menu</Text>
                    </View>
                    
                    <TouchableOpacity 
                        style={styles.drawerItem}
                        onPress={() => {
                            toggleDrawer();
                            navigation.navigate('Nutrition');
                        }}
                    >
                        <Text style={styles.drawerItemText}>Nutrition Tracker</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={[styles.drawerItem, styles.logoutItem]}
                        onPress={handleLogoutPress}
                    >
                        <Text style={styles.logoutText}>Logout</Text>
                    </TouchableOpacity>
                </View>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FA',
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    menuIcon: {
        position: 'absolute',
        top: 6,
        left: 16,
        zIndex: 1,
        padding: 8,
    },
    log: {
        fontSize: 24,
        fontWeight: '600',
        color: '#2C3E50',
        textAlign: 'center',
        marginTop: 20,
        marginBottom: 30,
    },
    plus: {
        position: 'absolute',
        top: height * 0.15,
        left: '50%',
        marginLeft: -60,
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#3498DB',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    plusInner: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    inplus: {
        color: '#FFFFFF',
        fontSize: 60,
        fontWeight: '300',
        marginBottom: 5,
    },
    addTextContainer: {
        alignItems: 'center',
    },
    add: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '500',
    },
    addwo: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '500',
    },
    clndr: {
        position: 'absolute',
        bottom: height * 0.15,
        left: '50%',
        marginLeft: -35,
    },
    inclndr: {
        height: 70,
        width: 70,
        tintColor: '#3498DB',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '90%',
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        padding: 20,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2C3E50',
        textAlign: 'center',
        marginBottom: 15,
    },
    realcal: {
        borderRadius: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    closeButton: {
        marginTop: 20,
        backgroundColor: '#3498DB',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    closeButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: 2,
    },
    drawer: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        width: width/2,
        backgroundColor: '#FFFFFF',
        zIndex: 3,
        borderTopRightRadius: 20,
        borderBottomRightRadius: 20,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 0 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    drawerContent: {
        flex: 1,
    },
    drawerHeader: {
        padding: 20,
        paddingTop: 60,
        borderBottomWidth: 1,
        borderBottomColor: '#ECF0F1',
        backgroundColor: '#3498DB',
    },
    drawerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    drawerItem: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ECF0F1',
    },
    drawerItemText: {
        fontSize: 16,
        color: '#2C3E50',
        fontWeight: '500',
    },
    logoutItem: {
        marginTop: 'auto',
        borderTopWidth: 1,
        borderTopColor: '#ECF0F1',
        backgroundColor: '#FFF5F5',
    },
    logoutText: {
        color: '#E74C3C',
        fontSize: 16,
        fontWeight: 'bold',
    },
    addWorkoutButton: {
        position: 'absolute',
        top: height * 0.2,
        alignSelf: 'center',
        alignItems: 'center',
    },
    
    plusIconContainer: {
        alignItems: 'center',
    },
    
    plusIcon: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#4A90E2',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
    },
    
    plusText: {
        color: '#FFFFFF',
        fontSize: 40,
        fontWeight: '300',
        marginTop: -4,
    },
    
    addWorkoutText: {
        marginTop: 8,
        color: '#2C3E50',
        fontSize: 16,
        fontWeight: '600',
    },
    
    calendarButton: {
        position: 'absolute',
        bottom: height * 0.15,
        alignSelf: 'center',
    },
    
    calendarIconContainer: {
        width: 60,
        height: 70,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    
    calendarHeader: {
        height: 20,
        backgroundColor: '#4A90E2',
        justifyContent: 'center',
        alignItems: 'center',
    },
    
    calendarMonth: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '600',
    },
    
    calendarBody: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    
    calendarDate: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2C3E50',
    },
});
