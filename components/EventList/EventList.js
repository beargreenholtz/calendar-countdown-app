import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Text, Pressable, SafeAreaView, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';

import AddEventModal from '../AddEventModal/AddEventModal';
import ProgressElement from '../ui/ProgressElement';
import AddEventButton from '../AddEventButton/AddEventButton';
import { dateFormat } from '../../utils/date-format';

function EventList() {
	const navigation = useNavigation();
	const scrollY = useRef(new Animated.Value(0)).current;
	const [isToggledModal, setIsToggledModal] = useState(false);

	const onPressToggleModal = () => {
		setIsToggledModal((prev) => !prev);
	};

	const [events, setEvents] = useState();

	const onPressEvent = (id) => {
		navigation.navigate('Event', { eventId: id });
	};

	const onAddNewEvent = (event) => {
		setEvents((prev) => [...prev, event]);
	};

	const onLongPressRemoveItem = async (id) => {
		try {
			Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

			await AsyncStorage.removeItem(id);

			setEvents((prev) => prev.filter((event) => event.id !== id));
		} catch (error) {
			Alert.alert(error);
		}
	};

	useEffect(() => {
		(fetchAllEvents = async () => {
			let keys;
			try {
				keys = await AsyncStorage.getAllKeys();
			} catch (e) {
				Alert.alert(e);
			}
			if (keys && keys.length > 0) {
				const eventsPromises = keys.map(async (key) => {
					try {
						const eventJSON = await AsyncStorage.getItem(key);
						return eventJSON ? JSON.parse(eventJSON) : null;
					} catch (error) {
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
							<Animated.View style={{ transform: [{ scale }], opacity }}>
								<Pressable onPress={() => onPressEvent(event.item.id)} onLongPress={() => onLongPressRemoveItem(event.item.id)}>
									<View style={styles.eventContainer}>
										<View>
											<Text style={styles.title}>{event.item.name}</Text>
											<Text style={styles.targetDate}>{dateFormat(event.item.date)}</Text>
											<Text style={styles.location}>{event.item.location}</Text>
										</View>
										<ProgressElement createdDate={event.item.createdDate} targetDate={dateFormat(event.item.date)} isSmall />
									</View>
								</Pressable>
							</Animated.View>
						);
					}}
					keyExtractor={(item) => item.id}
					alwaysBounceVertical="false"
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
});

export default EventList;
