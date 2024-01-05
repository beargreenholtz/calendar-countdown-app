import RNDateTimePicker from '@react-native-community/datetimepicker';
import React from 'react';
import { View, StyleSheet, Text, Pressable } from 'react-native';

import { type EventData } from '../../../types/event';

type Props = {
	readonly data: EventData;
	readonly isVisible: boolean;
	readonly toggleDateVisibility: () => void;
	readonly onPressSubmitEvent: () => void;
	readonly onChangeInput: (name: string, value: Date) => void;
	readonly onPressChangePart: (direction: string) => void;
};

function ThirdFormScreen(props: Props) {
	return (
		<>
			<Pressable style={[styles.button, styles.showDateButton]} onPress={() => props.toggleDateVisibility()}>
				<Text style={styles.textStyle}>Show Date</Text>
			</Pressable>
			{props.isVisible && (
				<RNDateTimePicker
					minimumDate={new Date()}
					themeVariant="light"
					value={props.data.date}
					accentColor="#7EA39F"
					onChange={(_, date) => (date ? props.onChangeInput('date', date) : new Date())}
				/>
			)}
			<Text>Pick the event date.</Text>
			<View style={styles.buttons}>
				<Pressable style={[styles.button, styles.buttonClose]} onPress={() => props.onPressChangePart('prev')}>
					<Text style={styles.textStyle}>Back</Text>
				</Pressable>
				<Pressable style={[styles.button, styles.buttonNext]} onPress={() => props.onPressSubmitEvent()}>
					<Text style={styles.textStyle}>Add event</Text>
				</Pressable>
			</View>
		</>
	);
}

const styles = StyleSheet.create({
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
	showDateButton: {
		backgroundColor: '#7EA39F',
		marginBottom: 8,
	},
});

export default ThirdFormScreen;
