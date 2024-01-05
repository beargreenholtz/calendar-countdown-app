import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Home from './screens/Home';
import Event from './components/Event/Event';
import { createStackNavigator } from '@react-navigation/stack';
import 'react-native-gesture-handler';

import { NavigationContainer } from '@react-navigation/native';

export default function App() {
	const Stack = createStackNavigator();

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
	dateInput: {
		borderWidth: 1,
		borderRadius: 4,
	},
});
