import * as Notifications from 'expo-notifications';
import { Alert } from 'react-native';

export const getUserPermission = async () => {
	const { status: existingStatus } = await Notifications.getPermissionsAsync();
	let finalStatus = existingStatus;
	if (existingStatus !== 'granted') {
		const { status } = await Notifications.requestPermissionsAsync();
		finalStatus = status;
	}
	if (finalStatus !== 'granted') {
		Alert.alert('Failed to get push token for push notification!');
		return false;
	}
};
