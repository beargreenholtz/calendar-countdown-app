export const calculateDaysPassed = (createdDate: string) => {
	const oneDay = 24 * 60 * 60 * 1000;
	const createdDateTime = new Date(createdDate).getTime();
	const currentDateTime = new Date().getTime();
	const daysPassed = Math.round(Math.abs((currentDateTime - createdDateTime) / oneDay));
	return daysPassed;
};

export const calculateDaysRemaining = (targetDate: string) => {
	const oneDay = 24 * 60 * 60 * 1000;
	const targetDateTime = new Date(targetDate).getTime();
	const currentDateTime = new Date().getTime();
	const daysPassed = Math.round(Math.abs((targetDateTime - currentDateTime) / oneDay + 1));
	return daysPassed;
};

export const calculateDaysPassedToTarget = (createdDate: string, targetDate: string) => {
	const oneDay = 24 * 60 * 60 * 1000;
	const createdDateTime = new Date(createdDate).getTime();
	const targetDateTime = new Date(targetDate).getTime();
	const daysPassed = Math.round(Math.abs((targetDateTime - createdDateTime) / oneDay));
	return daysPassed;
};
