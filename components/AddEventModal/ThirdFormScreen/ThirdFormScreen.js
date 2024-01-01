import React from 'react';
import { View, StyleSheet, Text, Pressable } from 'react-native';
import RNDateTimePicker from '@react-native-community/datetimepicker';

function ThirdFormScreen(props) {
	return (
		<>
			<RNDateTimePicker
				minimumDate={new Date()}
				themeVariant={'light'}
				value={props.data.date}
				accentColor={'#7EA39F'}
				onChange={(e, date) => props.onChangeInput('date', date)}
			/>

			<Text style={styles.modalText}>Pick the event date.</Text>
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
});

export default ThirdFormScreen;
