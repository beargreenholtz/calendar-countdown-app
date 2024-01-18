import { FontAwesome, Fontisto } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { type RouteProp, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, ActivityIndicator, Alert } from 'react-native';
import * as Animatable from 'react-native-animatable';

import { type EventData } from '../../types/event';
import { type RouteParams } from '../../types/routes';
import { dateFormat } from '../../utils/date-format';
import { calculateDaysPassed } from '../../utils/days-caculator';
import { getFontSize } from '../../utils/get-device-fontsize';
import ProgressElement from '../ui/ProgressElement';

function Event() {
	const route = useRoute<RouteProp<{ params: RouteParams }>>();

	const [event, setEvent] = useState<EventData>();

	const { eventId } = route.params;

	useEffect(() => {
		const getData = async () => {
			try {
				if (!eventId) throw 'cant find event';

				const value = await AsyncStorage.getItem(eventId);

				if (typeof value !== 'string') throw 'item fetching problem';

				const parsedEvent = JSON.parse(value);

				setEvent(parsedEvent);
			} catch {
				Alert.alert('Cant find event');
			}
		};

		getData();
	}, []);

	return event ? (
		<View>
			<View style={styles.upperContainer}>
				<View style={styles.titleWrapper}>
					<Animatable.Text animation="fadeInUp" style={styles.title}>
						{event.name}
					</Animatable.Text>
				</View>
				<ProgressElement createdDate={dateFormat(event.createdDate)} targetDate={dateFormat(event.date)} isSmall={false} />
			</View>
			<View style={styles.lowerContainer}>
				<View>
					<Animatable.View animation="fadeInUp" delay={200} style={styles.element}>
						<FontAwesome name="location-arrow" size={24} color="#BDCDE3" />
						<Text style={styles.location}>{event.location}</Text>
					</Animatable.View>
					<Animatable.View animation="fadeInUp" delay={400} style={styles.element}>
						<Fontisto name="date" size={24} color="#BDCDE3" />
						<View>
							<Text style={styles.targetDate}>Event date: {dateFormat(event.date)}</Text>
							<Text>Days past: {calculateDaysPassed(event.createdDate.toString())}</Text>
						</View>
					</Animatable.View>
					<Animatable.View delay={600} animation="fadeInUp">
						<Text>{event.description}</Text>
					</Animatable.View>
				</View>
			</View>
		</View>
	) : (
		<ActivityIndicator style={styles.loader} />
	);
}

const styles = StyleSheet.create({
	titleWrapper: {
		flexShrink: 1,
	},
	title: {
		fontSize: getFontSize(24),
		fontWeight: 'bold',
		overflow: 'scroll',
	},
	upperContainer: {
		paddingHorizontal: 20,
		justifyContent: 'space-around',
		alignItems: 'center',
		flexDirection: 'row',
		backgroundColor: '#BDCDE3',
		height: '25%',
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
		fontSize: getFontSize(16),
	},
	targetDate: {
		fontSize: getFontSize(16),
	},
	lowerContainer: {
		top: -12,
		borderTopEndRadius: 16,
		borderTopStartRadius: 16,
		backgroundColor: 'white',
		padding: 20,
		height: '100%',
	},
});

export default Event;
