import { FontAwesome } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import * as Location from 'expo-location';
import React, { useState } from 'react';
import { View, StyleSheet, Text, Pressable, TextInput, ActivityIndicator } from 'react-native';

import { type EventData } from '../../../types/event';

type Props = {
	readonly data: EventData;
	readonly onChangeInput: (name: string, value: string) => void;
	readonly onPressChangePart: (direction: string) => void;
	readonly onPressToggleModal: () => void;
};

function FirstFormScreen(props: Props) {
	const [isLoadingLocation, setIsLoadingLocation] = useState(false);

	const onGetLocation = async () => {
		setIsLoadingLocation(true);
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

		const { status } = await Location.requestForegroundPermissionsAsync();
		if (status !== 'granted') {
			setIsLoadingLocation(false);

			return;
		}

		const location = await Location.getCurrentPositionAsync({ accuracy: 1 });

		const address = await Location.reverseGeocodeAsync(location.coords);

		props.onChangeInput('location', address[0].street && address[0].streetNumber ? address[0].street + ' ' + address[0].streetNumber : '');

		setIsLoadingLocation(false);
	};
	return (
		<>
			<View>
				<Text>Event name</Text>
				<TextInput
					placeholder="Party in ibiza"
					value={props.data.name ? props.data.name : ''}
					placeholderTextColor="#BDCDE3"
					onChangeText={(e) => props.onChangeInput('name', e)}
					style={styles.inputName}
					maxLength={16}
				/>
			</View>
			<View>
				<Text>Location</Text>
				<View style={styles.locationContainer}>
					<TextInput
						placeholder="Ibiza"
						value={props.data.location}
						placeholderTextColor="#BDCDE3"
						onChangeText={(e) => props.onChangeInput('location', e)}
						style={styles.inputLocation}
						maxLength={25}
					/>
					{!isLoadingLocation ? (
						<Pressable onPress={onGetLocation}>
							<FontAwesome name="location-arrow" size={24} color="#BDCDE3" />
						</Pressable>
					) : (
						<ActivityIndicator />
					)}
				</View>
			</View>
			<View style={styles.buttons}>
				<Pressable style={[styles.button, styles.buttonClose]} onPress={props.onPressToggleModal}>
					<Text style={styles.textStyle}>Cancel</Text>
				</Pressable>
				<Pressable style={[styles.button, styles.buttonNext]} onPress={() => props.onPressChangePart('next')}>
					<Text style={styles.textStyle}>Next</Text>
				</Pressable>
			</View>
		</>
	);
}

const styles = StyleSheet.create({
	inputName: {
		borderWidth: 1,
		minWidth: 200,
		borderRadius: 8,
		padding: 4,
		marginBottom: 16,
	},
	inputLocation: { borderWidth: 1, minWidth: 170, borderRadius: 8, padding: 4, marginBottom: 16 },
	locationContainer: {
		flexDirection: 'row',
		gap: 10,
	},
	buttons: {
		flexDirection: 'row',
		gap: 12,
	},
	buttonNext: {
		backgroundColor: '#7597C5',
	},
	button: {
		borderRadius: 6,
		padding: 10,
	},
	buttonClose: {
		backgroundColor: '#BDCDE3',
	},
	textStyle: {
		color: 'black',
		textAlign: 'center',
	},
});

export default FirstFormScreen;
