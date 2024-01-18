import { View, StyleSheet, Text } from 'react-native';

import { getFontSize } from '../../utils/get-device-fontsize';

function Header() {
	return (
		<View style={styles.container}>
			<Text style={styles.title}>My events</Text>
			<Text style={styles.date}>{"Today's Date: " + new Date().toLocaleDateString().toString()}</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		marginTop: 24,
		paddingHorizontal: 24,
		justifyContent: 'space-between',
	},
	title: {
		fontSize: getFontSize(16),
		textDecorationLine: 'underline',
	},
	date: {
		fontSize: getFontSize(16),
		textDecorationLine: 'underline',
	},
});

export default Header;
