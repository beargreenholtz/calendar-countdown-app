import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Text, Pressable, SafeAreaView, Animated, Alert, Platform } from 'react-native';
import * as Animatable from 'react-native-animatable';

import { type EventData } from '../../types/event';
import { dateFormat } from '../../utils/date-format';
import AddEventButton from '../AddEventButton/AddEventButton';
import AddEventModal from '../AddEventModal/AddEventModal';
import ProgressElement from '../ui/ProgressElement';

function EventList() {
	const navigation = useNavigation();
	const scrollY = useRef(new Animated.Value(0)).current;
	const [isToggledModal, setIsToggledModal] = useState(false);

	const onPressToggleModal = () => {
		setIsToggledModal((prev) => !prev);
	};

	const [events, setEvents] = useState<EventData[]>([]);

	const onPressEvent = (id: string) => {
		navigation.navigate('Event', { eventId: id });
	};

	const onAddNewEvent = (event: EventData) => {
		if (event) {
			setEvents((prev) => [...prev, event]);
		}
	};

	const onLongPressRemoveItem = async (id: string) => {
		try {
			Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

			await AsyncStorage.removeItem(id);

			setEvents((prev) => prev.filter((event) => event.id !== id));
		} catch (error) {
			if (error instanceof Error) Alert.alert(error.message);
		}
	};

	useEffect(() => {
		(async () => {
			let keys;
			try {
				keys = await AsyncStorage.getAllKeys();
			} catch (error) {
				if (error instanceof Error) Alert.alert(error.message);
			}
			if (keys && keys.length > 0) {
				const eventsPromises = keys.map(async (key) => {
					try {
						const eventJSON = await AsyncStorage.getItem(key);
						return eventJSON ? JSON.parse(eventJSON) : null;
					} catch {
						return null;
					}
				});
				const fetchedEvents = await Promise.all(eventsPromises);
				const filteredEvents = fetchedEvents.filter((event) => event !== null);
				setEvents(filteredEvents);
			}
		})();
	}, []);
	return (
		<>
			<SafeAreaView style={styles.container}>
				{events.length === 0 && (
					<Animatable.View style={styles.noEventsInfoContainer} animation="fadeInUp">
						<Text style={styles.noEventsTitle}>No events...</Text>
					</Animatable.View>
				)}
				<AddEventModal onAddNewEvent={onAddNewEvent} onPressToggleModal={onPressToggleModal} isToggledModal={isToggledModal} />
				<Animated.FlatList
					data={events}
					onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
					renderItem={(event) => {
						const inputRange = [-1, 0, event.index * 100, (event.index + 2) * 100];
						const opacityInputRange = [-1, 0, event.index * 100, (event.index + 0.5) * 100];

						const scale = scrollY.interpolate({
							inputRange,
							outputRange: [1, 1, 1, 0],
						});

						const opacity = scrollY.interpolate({
							inputRange: opacityInputRange,
							outputRange: [1, 1, 1, 0],
						});

						return (
							<>
								<Animated.View
									style={[{ transform: [{ scale }], opacity }, { marginTop: Platform.OS === 'android' && event.index === 0 ? 12 : 0 }]}
								>
									<Pressable onPress={() => onPressEvent(event.item.id)} onLongPress={() => onLongPressRemoveItem(event.item.id)}>
										<View style={styles.eventContainer}>
											<View>
												<Text style={styles.title}>{event.item.name}</Text>
												<Text style={styles.targetDate}>{dateFormat(event.item.date)}</Text>
												<Text>{event.item.location}</Text>
											</View>
											<ProgressElement
												createdDate={dateFormat(event.item.createdDate)}
												targetDate={dateFormat(event.item.date)}
												isSmall
											/>
										</View>
									</Pressable>
								</Animated.View>
								{event.index === events.length - 1 && (
									<Animatable.View style={styles.deleteInfo} animation="fadeInUp">
										<Text>Long press on event to delete</Text>
									</Animatable.View>
								)}
							</>
						);
					}}
					keyExtractor={(item) => item.id}
				/>
			</SafeAreaView>
			<AddEventButton onPressToggleModal={onPressToggleModal} />
		</>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	title: {
		fontSize: 26,
		fontWeight: 'bold',
	},
	targetDate: {
		fontSize: 16,
	},
	eventContainer: {
		flexDirection: 'row',
		height: 100,
		backgroundColor: '#E1E8F2',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: 16,
		marginBottom: 8,
		borderRadius: 12,
		marginHorizontal: 20,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 1,
		},
		shadowOpacity: 0.22,
		shadowRadius: 2.22,
	},
	deleteInfo: {
		alignSelf: 'center',
		marginBottom: 12,
	},
	noEventsInfoContainer: {
		position: 'absolute',
		height: '100%',
		justifyContent: 'center',
		alignSelf: 'center',
	},
	noEventsTitle: {
		fontSize: 18,
		fontWeight: 'bold',
	},
});

export default EventList;
