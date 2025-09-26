import * as React from 'react';
import { Button, View } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from "app/screens/Home";
import { RootStackScreen } from "app/navigation/StackScreen/RootStackScreen";
import CustomDrawer from "app/components/CustomDrawer";
import { useEffect, useState } from "react";
import { apiClient } from "app/services/client";
import ProductCategoryScreen from "app/screens/Products/ProductCategory";

const Drawer = createDrawerNavigator();

export default function DrawerScreen() {
	
	return (
		<Drawer.Navigator
			initialRouteName="Home"
			screenOptions={{
				headerShown: false,
			}}
			drawerContent={(props) => <CustomDrawer {...props} />}
		>
			<Drawer.Screen
				name="Home"
				component={RootStackScreen}
			/>
		</Drawer.Navigator>
	)
}