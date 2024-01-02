import React from 'react';
import { View, StyleSheet } from 'react-native';
import CircularProgress from 'react-native-circular-progress-indicator';
import * as Animatable from 'react-native-animatable';

import { calculateDaysPassed, calculateDaysPassedToTarget } from '../../utils/days-caculator';

function ProgressElement(props) {
	const timeReached = new Date(props.targetDate) - Date.now() <= 0;

	return (
		<Animatable.View animation="fadeInUp" style={props.style}>
			<CircularProgress
				value={timeReached ? 1 : calculateDaysPassed(props.createdDate)}
				radius={props.isSmall ? 45 : 80}
				duration={100}
				progressValueColor={'black'}
				maxValue={calculateDaysPassedToTarget(props.createdDate, props.targetDate)}
				activeStrokeColor={'#F8BD8E'}
				title={'Days'}
				titleColor={'black'}
				titleStyle={{ fontWeight: 'bold' }}
			/>
		</Animatable.View>
	);
}

export default ProgressElement;
