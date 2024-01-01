import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { SafeAreaView, StyleSheet, TextInput, View } from 'react-native';
import Home from './screens/Home';
import Event from './components/Event/Event';
import { createStackNavigator } from '@react-navigation/stack';

import { NavigationContainer } from '@react-navigation/native';

export default function App() {
	const [eventName, setEventName] = useState('');
	const Stack = createStackNavigator();

	const onChangeEvent = (e) => {
		setEventName(e);
	};

	return (
		<>
			<StatusBar hidden />
			<View style={styles.container}>
				<NavigationContainer>
					<Stack.Navigator
						screenOptions={{
							headerShown: false,
						}}
					>
						<Stack.Screen name="Home" component={Home} />
						<Stack.Screen name="Event" component={Event} />
					</Stack.Navigator>
				</NavigationContainer>
			</View>
		</>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	// inputContainer: {
	// 	alignItems: 'center',
	// 	justifyContent: 'center',
	// 	flexDirection: 'row',
	// 	alignItems: 'center',
	// },
	dateInput: {
		borderWidth: 1,
		borderRadius: 4,
	},
});
