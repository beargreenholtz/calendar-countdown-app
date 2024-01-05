export type RootStackParamList = {
	Event: { eventId: string };
};

declare global {
	namespace ReactNavigation {
		interface RootParamList extends RootStackParamList {}
	}
}
