import React from 'react';
import { View, StyleSheet } from 'react-native';
import CircularProgress from 'react-native-circular-progress-indicator';
import * as Animatable from 'react-native-animatable';

import { calculateDaysPassed, calculateDaysPassedToTarget } from '../../utils/days-caculator';

type Props = {
	readonly isSmall: boolean;
	readonly createdDate: string;
	readonly targetDate: string;
};

function ProgressElement(props: Props) {
	const timeReached = new Date(props.targetDate).getTime() - Date.now() <= 0;

	return (
		<Animatable.View animation="fadeInUp">
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
