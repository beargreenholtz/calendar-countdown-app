import React, { useState } from 'react';
import { View, StyleSheet, Text, Pressable, TextInput, Alert, ActivityIndicator } from 'react-native';
import * as Haptics from 'expo-haptics';
import * as Location from 'expo-location';

import { FontAwesome } from '@expo/vector-icons';

function FirstFormScreen(props) {
	const [isLoadingLocation, setIsLoadingLocation] = useState(false);

	const onGetLocation = async () => {
		setIsLoadingLocation(true);
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

		let { status } = await Location.requestForegroundPermissionsAsync();
		if (status !== 'granted') {
			return;
		}

		let location = await Location.getCurrentPositionAsync({});
		const address = await Location.reverseGeocodeAsync(location.coords);

		props.onChangeInput('location', address[0].name);

		setIsLoadingLocation(false);
	};
	return (
		<>
			<TextInput
				placeholder="Event name"
				value={props.data.name ? props.data.name : ''}
				placeholderTextColor={'#BDCDE3'}
				onChangeText={(e) => props.onChangeInput('name', e)}
				style={styles.inputName}
			/>
			<View style={styles.locationContainer}>
				{!isLoadingLocation ? (
					<Pressable onPress={onGetLocation}>
						<FontAwesome name="location-arrow" size={24} color="#BDCDE3" />
					</Pressable>
				) : (
					<ActivityIndicator style={styles.loader} />
				)}
				<TextInput
					placeholder="Location"
					value={props.data.location}
					placeholderTextColor={'#BDCDE3'}
					onChangeText={(e) => props.onChangeInput('location', e)}
					style={styles.inputLocation}
				/>
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
		backgroundColor: '#7EA39F',
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
		fontWeight: 'bold',
		textAlign: 'center',
	},
});

export default FirstFormScreen;
