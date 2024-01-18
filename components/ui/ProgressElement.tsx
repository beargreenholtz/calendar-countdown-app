import React from 'react';
import { Dimensions } from 'react-native';
import * as Animatable from 'react-native-animatable';
import CircularProgress from 'react-native-circular-progress-indicator';

import { calculateDaysPassedToTarget, calculateDaysRemaining } from '../../utils/days-caculator';

type Props = {
	readonly isSmall: boolean;
	readonly createdDate: string;
	readonly targetDate: string;
};

function ProgressElement(props: Props) {
	const timeReached = new Date(props.targetDate).getTime() - Date.now() <= 0;

	const screenWidth = Dimensions.get('window').width;

	const radius = props.isSmall ? 45 : screenWidth * 0.2;
	return (
		<Animatable.View animation="fadeInUp">
			<CircularProgress
				value={timeReached ? 0 : calculateDaysRemaining(props.targetDate)}
				radius={radius}
				duration={100}
				progressValueColor="black"
				maxValue={calculateDaysPassedToTarget(props.createdDate, props.targetDate)}
				initialValue={calculateDaysPassedToTarget(props.createdDate, props.targetDate)}
				activeStrokeColor="#F8BD8E"
				title="Days"
				titleColor="black"
				titleStyle={{ fontWeight: 'bold' }}
			/>
		</Animatable.View>
	);
}

export default ProgressElement;
