import * as Haptics from 'expo-haptics';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedButton } from 'react-native-really-awesome-button';

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
			<ThemedButton backgroundColor="#F8BD8E" textColor="#000" width={80} height={80} borderRadius={26} name="bruce" type="primary" onPress={handlePress}>
				+
			</ThemedButton>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		position: 'absolute',
		bottom: 20,
		right: 20,
	},
});

export default AddEventButton;
