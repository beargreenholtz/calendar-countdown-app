import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as Notifications from 'expo-notifications';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Event from './components/Event/Event';
import Home from './screens/Home';

import 'react-native-gesture-handler';

Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldShowAlert: true,
		shouldPlaySound: false,
		shouldSetBadge: false,
	}),
});

export default function App() {
	const Stack = createStackNavigator();

	return (
		<>
			<StatusBar />
			<ActionSheetProvider>
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
			</ActionSheetProvider>
		</>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});
