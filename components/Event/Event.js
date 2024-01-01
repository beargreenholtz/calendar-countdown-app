import { useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, ActivityIndicator, Alert } from 'react-native';
import { FontAwesome, Fontisto } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import AsyncStorage from '@react-native-async-storage/async-storage';

import ProgressElement from '../ui/ProgressElement';
import { dateFormat } from '../../utils/date-format';

function Event() {
	const route = useRoute();
	const [event, setEvent] = useState();

	const eventId = route.params.eventId;

	useEffect(() => {
		const getData = async () => {
			try {
				const value = await AsyncStorage.getItem(eventId);
				const parsedEvent = JSON.parse(value);

				setEvent(parsedEvent);
			} catch (e) {
				Alert.alert('Cant find event');
			}
		};

		getData();
	}, []);

	return event ? (
		<View style={styles.container}>
			<View style={styles.upperContainer}>
				<Animatable.Text animation="fadeInUp" style={styles.title}>
					{event.name}
				</Animatable.Text>
				<ProgressElement
					style={styles.progressCircle}
					createdDate={dateFormat(event.createdDate)}
					targetDate={dateFormat(event.date)}
					isSmall={false}
				/>
			</View>
			<View style={styles.lowerContainer}>
				<View style={styles.descriptionContainer}>
					<Animatable.View animation="fadeInUp" delay={200} style={styles.element}>
						<FontAwesome name="location-arrow" size={24} color="#BDCDE3" />
						<Text style={styles.location}>{event.location}</Text>
					</Animatable.View>
					<Animatable.View animation="fadeInUp" delay={400} style={styles.element}>
						<Fontisto name="date" size={24} color="#BDCDE3" />
						<Text style={styles.targetDate}>{dateFormat(event.date)}</Text>
					</Animatable.View>
					<Animatable.View delay={600} animation="fadeInUp">
						<Text style={styles.description}>{event.description}</Text>
					</Animatable.View>
				</View>
			</View>
		</View>
	) : (
		<ActivityIndicator style={styles.loader} />
	);
}

const styles = StyleSheet.create({
	title: {
		position: 'absolute',
		top: 110,
		left: 24,
		fontSize: 26,
		fontWeight: 'bold',
	},
	upperContainer: {
		backgroundColor: '#BDCDE3',
		height: 250,
	},
	loader: {
		justifyContent: 'center',
		alignItems: 'center',
		height: '100%',
	},
	element: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 12,
		marginBottom: 12,
	},
	location: {
		fontSize: 16,
	},
	targetDate: {
		fontSize: 16,
	},
	lowerContainer: {
		top: -12,
		borderTopEndRadius: 16,
		borderTopStartRadius: 16,
		backgroundColor: 'white',
		padding: 20,
		height: '100%',
	},
	progressCircle: {
		position: 'absolute',
		bottom: 30,
		right: 30,
	},
});

export default Event;
