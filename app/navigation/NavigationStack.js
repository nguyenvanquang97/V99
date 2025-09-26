import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "react-native";
import { RootStackScreen } from "app/navigation/StackScreen/RootStackScreen";
import DrawerScreen from "app/navigation/StackScreen/Drawer";

const App = (props) => {
	const { theme } = props;
	
	return (
		<NavigationContainer theme={theme}>
			<StatusBar barStyle={theme.dark ? 'light-content' : 'dark-content'} />
			{/*<RootStackScreen />*/}
			<DrawerScreen />
		</NavigationContainer>
	);
};

export default App;
