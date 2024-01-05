import React, { useState } from 'react';
import { View, Pressable, StyleSheet, Text, Animated } from 'react-native';
import * as Haptics from 'expo-haptics';

type Props = {
	readonly onPressToggleModal: () => void;
};

function AddEventButton(props: Props) {
	const handlePress = () => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
		props.onPressToggleModal();
	};

	return (
		<View style={[styles.container]}>
			<Pressable style={styles.button} onPress={handlePress}>
				<Text style={styles.text}>+</Text>
			</Pressable>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		position: 'absolute',
		bottom: 20,
		right: 20,
	},
	button: {
		borderRadius: 90,
		alignItems: 'center',
		justifyContent: 'center',
		borderWidth: 3,
		backgroundColor: '#F8BD8E',
		width: 80,
		height: 80,
	},
	text: {
		fontSize: 16,
		lineHeight: 21,
		fontWeight: 'bold',
		letterSpacing: 0.25,
	},
});

export default AddEventButton;
