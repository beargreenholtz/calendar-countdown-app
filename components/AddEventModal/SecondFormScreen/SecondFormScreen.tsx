import React from 'react';
import { View, StyleSheet, Text, Pressable, TextInput } from 'react-native';

import { type Event } from '../../../types/event';

type Props = {
	readonly data: Event;
	readonly onChangeInput: (name: string, value: string) => void;
	readonly onPressChangePart: (direction: string) => void;
};

function SecondFormScreen(props: Props) {
	return (
		<>
			<TextInput
				placeholder="Description"
				value={props.data.description}
				placeholderTextColor="#BDCDE3"
				onChangeText={(e) => props.onChangeInput('description', e)}
				style={styles.inputDescription}
				numberOfLines={4}
				multiline
			/>
			<View style={styles.buttons}>
				<Pressable style={[styles.button, styles.buttonClose]} onPress={() => props.onPressChangePart('prev')}>
					<Text style={styles.textStyle}>Back</Text>
				</Pressable>
				<Pressable style={[styles.button, styles.buttonNext]} onPress={() => props.onPressChangePart('next')}>
					<Text style={styles.textStyle}>Next</Text>
				</Pressable>
			</View>
		</>
	);
}

const styles = StyleSheet.create({
	inputDescription: {
		borderWidth: 1,
		minWidth: 200,
		borderRadius: 8,
		padding: 4,
		marginBottom: 16,
		maxHeight: 200,
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

export default SecondFormScreen;
