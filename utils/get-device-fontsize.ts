import { PixelRatio } from 'react-native';

export const getFontSize = (size: number) => {
	const fontScale = PixelRatio.getFontScale();
	return size / fontScale;
};
