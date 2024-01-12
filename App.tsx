import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Event from './components/Event/Event';
import Home from './screens/Home';

import 'react-native-gesture-handler';

export default function App() {
	const Stack = createStackNavigator();

	return (
		<>
			<StatusBar />
			<SafeAreaView style={styles.container}>
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
			</SafeAreaView>
		</>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});
