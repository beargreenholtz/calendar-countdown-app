import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';
import * as Notifications from 'expo-notifications';
import React, { useState } from 'react';
import { KeyboardAvoidingView, View, Modal, StyleSheet, Alert, Platform, Text } from 'react-native';
import * as Progress from 'react-native-progress';
import { type EventData } from 'types/event';

import FirstFormScreen from './FirstFormScreen/FirstFormScreen';
import SecondFormScreen from './SecondFormScreen/SecondFormScreen';
import ThirdFormScreen from './ThirdFormScreen/ThirdFormScreen';
import { getUserPermission } from '../../utils/notification-permission';

type Props = {
	readonly onAddNewEvent: any;
	readonly onPressToggleModal: () => void;
	readonly isToggledModal: boolean;
};

function AddEventModal(props: Props) {
	const [progressPart, setProgressPart] = useState(1);
	const [isVisible, setIsVisible] = useState(true);

	const [eventData, setEventData] = useState({
		id: Crypto.randomUUID(),
		name: '',
		description: '',
		date: new Date(),
		location: '',
		createdDate: new Date(),
	});

	const toggleDateVisibility = () => {
		setIsVisible((prev) => !prev);
	};

	const onChangeInput = (inputName: string, value: string | Date) => {
		if (Platform.OS === 'android') setIsVisible((prev) => !prev);
		setEventData((prev) => {
			return {
				...prev,
				[inputName]: value,
			};
		});
	};

	const onPressChangePart = (direction: string) => {
		setProgressPart((prev) => {
			return direction === 'next' ? prev + 1 : prev - 1;
		});
	};

	const createNotification = (eventData: EventData) => {
		const isValid = getUserPermission();

		if (!isValid) return;

		Notifications.scheduleNotificationAsync({
			content: {
				title: `Your event ${eventData.name} is happening today`,
				body: `The place of the event is ${eventData.location}`,
			},
			trigger: {
				seconds: 10,
				// date: eventData.date.setSeconds(eventData.date.getSeconds() + 40),
			},
			identifier: eventData.id,
		});
	};

	const onPressSubmitEvent = async () => {
		try {
			if (eventData) {
				const eventDataString = JSON.stringify(eventData);
				await AsyncStorage.setItem(eventData.id, eventDataString);

				props.onAddNewEvent(eventData);
				createNotification(eventData);
			} else {
				Alert.alert('Invalid event data', 'Please check the event details');
			}
		} catch (error) {
			if (error instanceof Error) Alert.alert('Unable to add event', error.message);
		} finally {
			props.onPressToggleModal();
			setEventData({ id: Crypto.randomUUID(), name: '', description: '', date: new Date(), location: '', createdDate: new Date() });
			setProgressPart(1);
		}
	};

	return (
		<Modal
			animationType="slide"
			transparent
			visible={props.isToggledModal}
			onRequestClose={() => {
				props.onPressToggleModal();
			}}
		>
			<KeyboardAvoidingView behavior="height" style={styles.centeredView}>
				<View style={styles.modalView}>
					<View style={styles.progressBar}>
						<View style={styles.progressBarPartIndicator}>
							<Text>1</Text>
							<Text>2</Text>
							<Text>3</Text>
						</View>
						<Progress.Bar color="#BDCDE3" progress={(progressPart / 10) * 3.333} width={270} />
					</View>

					{progressPart === 1 && (
						<FirstFormScreen
							onPressToggleModal={props.onPressToggleModal}
							onPressChangePart={onPressChangePart}
							onChangeInput={onChangeInput}
							data={eventData}
						/>
					)}
					{progressPart === 2 && <SecondFormScreen onPressChangePart={onPressChangePart} onChangeInput={onChangeInput} data={eventData} />}
					{progressPart === 3 && (
						<ThirdFormScreen
							toggleDateVisibility={toggleDateVisibility}
							onPressSubmitEvent={onPressSubmitEvent}
							onPressChangePart={onPressChangePart}
							onChangeInput={onChangeInput}
							data={eventData}
							isVisible={isVisible}
						/>
					)}
				</View>
			</KeyboardAvoidingView>
		</Modal>
	);
}

const styles = StyleSheet.create({
	centeredView: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 22,
	},
	modalView: {
		margin: 20,
		backgroundColor: 'white',
		borderRadius: 20,
		alignItems: 'center',
		justifyContent: 'center',
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
		height: '100%',
		width: '100%',
	},
	modalText: {
		marginBottom: 16,
		textAlign: 'center',
	},
	progressBar: {
		marginBottom: 24,
	},
	progressBarPartIndicator: {
		flexDirection: 'row',
		justifyContent: 'space-around',
	},
});

export default AddEventModal;
