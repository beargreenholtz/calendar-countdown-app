import { useActionSheet } from '@expo/react-native-action-sheet';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import * as Notifications from 'expo-notifications';
import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Text, Pressable, SafeAreaView, Animated, Alert, Platform, Linking } from 'react-native';
import * as Animatable from 'react-native-animatable';

import Header from './Header';
import { type EventData } from '../../types/event';
import { dateFormat } from '../../utils/date-format';
import { getFontSize } from '../../utils/get-device-fontsize';
import AddEventButton from '../AddEventButton/AddEventButton';
import AddEventModal from '../AddEventModal/AddEventModal';
import ProgressElement from '../ui/ProgressElement';

function EventList() {
	const navigation = useNavigation();
	const { showActionSheetWithOptions } = useActionSheet();

	const [longPressedEventId, setLongPressedEventId] = useState('');

	const scrollY = useRef(new Animated.Value(0)).current;
	const [isToggledModal, setIsToggledModal] = useState(false);

	const onPressToggleModal = () => {
		setIsToggledModal((prev) => !prev);
	};

	const [events, setEvents] = useState<EventData[]>([]);

	const onPressEvent = async (id: string) => {
		navigation.navigate('Event', { eventId: id });
	};

	const onAddNewEvent = (event: EventData) => {
		if (event) {
			setEvents((prev) => [...prev, event]);
		}
	};

	const onPressLocation = async (location: string) => {
		if (!location) return;

		const destination = encodeURIComponent(`${location}`);
		const provider = Platform.OS === 'ios' ? 'apple' : 'google';
		const link = `http://maps.${provider}.com/?daddr=${destination}`;

		try {
			const supported = await Linking.canOpenURL(link);

			if (supported) Linking.openURL(link);
		} catch (error) {
			console.log(error);
		}
	};

	const onLongPressRemoveItem = async (id: string) => {
		setLongPressedEventId(id);
		const options = ['Delete', 'Cancel'];
		const destructiveButtonIndex = 0;
		const cancelButtonIndex = 1;
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

		showActionSheetWithOptions(
			{
				options,
				cancelButtonIndex,
				destructiveButtonIndex,
			},
			async (selectedIndex: number | undefined) => {
				if (selectedIndex === destructiveButtonIndex) {
					try {
						await Notifications.dismissNotificationAsync(id);
						await AsyncStorage.removeItem(id);
						setEvents((prev) => prev.filter((event) => event.id !== id));
						setLongPressedEventId('');
					} catch (error) {
						if (error instanceof Error) Alert.alert(error.message);
						setLongPressedEventId('');
					}
				} else {
					setLongPressedEventId('');
				}
			},
		);
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

				<Header />
				<Animated.FlatList
					scrollEventThrottle={5}
					showsVerticalScrollIndicator={false}
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
										<View style={[styles.eventContainer, longPressedEventId === event.item.id && styles.selectedContainer]}>
											<View>
												<Text style={styles.title}>{event.item.name}</Text>
												<View style={styles.targetDateContainer}>
													<MaterialCommunityIcons name="book" size={18} color="black" />
													<Text style={styles.targetDate}>{new Date(event.item.date).toLocaleDateString().toString()}</Text>
												</View>
												<Pressable onPress={() => onPressLocation(event.item.location)} style={styles.locationContainer}>
													{event.item.location && <FontAwesome name="location-arrow" size={18} color="#BDCDE3" />}
													<Text>{event.item.location}</Text>
												</Pressable>
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
	header: {
		flex: 1,
	},
	container: {
		flex: 1,
	},
	title: {
		fontSize: getFontSize(20),
		fontWeight: 'bold',
	},
	targetDate: {
		fontSize: getFontSize(16),
	},
	locationContainer: {
		flexDirection: 'row',
		gap: 4,
		alignItems: 'center',
	},
	targetDateContainer: {
		flexDirection: 'row',
		gap: 4,
		alignItems: 'center',
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
		fontSize: getFontSize(18),
		fontWeight: 'bold',
	},
	pageTitle: {
		fontSize: getFontSize(16),
		textDecorationLine: 'underline',
		marginTop: 24,
		paddingHorizontal: 24,
	},
	selectedContainer: {
		backgroundColor: '#FFCCCC',
	},
});

export default EventList;
