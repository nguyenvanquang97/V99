/**
 * React Native App
 * Everything starts from the Entry-point
 */
import React, { useEffect } from "react";
import { ActivityIndicator, LogBox, Platform, Text, TextInput } from "react-native";
import { Provider, useDispatch, useSelector } from "react-redux";
import { PersistGate } from 'redux-persist/es/integration/react';
import { Provider as PaperProvider } from 'react-native-paper';

import {
  PaperThemeDefault,
  PaperThemeDark,
  CombinedDefaultTheme,
  CombinedDarkTheme,
} from 'app/config/theme-config';
import Navigator from 'app/navigation/index';
import configureStore from 'app/store';
import { GetProductCategories, GetSettings, SetMap } from "app/store/actions/settingActions";
import FlashMessage from "react-native-flash-message";
import { appUpgradeVersionCheck } from "app-upgrade-react-native-sdk";
import { AppConfig } from "app/config/api-config";

import Geolocation from "@react-native-community/geolocation";

const { persistor, store } = configureStore();

Text.defaultProps = {
  ...(Text.defaultProps || {}),
  allowFontScaling: false,
};
TextInput.defaultProps = {
  ...(TextInput.defaultProps || {}),
  allowFontScaling: false,
};

const RootNavigation = () => {
  const dispatch = useDispatch();
  const isDark = useSelector((state) => state.themeReducer.isDark);
  const cart = useSelector((state) => state.CartReducer);
  const paperTheme = isDark ? PaperThemeDark : PaperThemeDefault;
  const combinedTheme = isDark ? CombinedDarkTheme : CombinedDefaultTheme;

  useEffect(() => {
    LogBox.ignoreAllLogs();
  }, [])

  useEffect(() => {
    Geolocation.getCurrentPosition(info => {
      if (info) {
        dispatch(SetMap({
          lat: info.coords.latitude,
          lng: info.coords.longitude
        }))
      }
    });
    dispatch(GetSettings());
    dispatch(GetProductCategories());
  }, [])

  return (
    <PaperProvider theme={paperTheme}>
      <Navigator theme={combinedTheme} />
    </PaperProvider>
  );
};

const EntryPoint = () => {
  const xApiKey = "OTBhMTQzYWItYzVmYi00YzdkLTkyMTUtODE4OGY2YzdiNzhj"; // Your project key
  const appInfo = {
    appId: Platform.OS === 'android' ? 'com.ecommerce.nutriv99' : 'id1665837914', // Your app url in play store or app store
    appName: 'NutriV99', // Your app name
    appVersion: Platform.OS === 'android' ? AppConfig.androidVersion : AppConfig.iosVersion, // Your app version
    platform: Platform.OS === 'android' ? 'android' : 'iOS', // App Platform, android or ios
    environment: 'production', // App Environment, production, development
  };

  // Alert config is optional
  const alertConfig = {
    title: 'New version is now available!',
    updateButtonTitle: 'Update Now',
    laterButtonTitle: 'Later',
    onDismissCallback: () => { console.log('Dismiss') },
    onLaterCallback: () => { console.log('Later') }
  };

  appUpgradeVersionCheck(appInfo, xApiKey, alertConfig);

  return (
    <Provider store={store}>
      <PersistGate loading={<ActivityIndicator />} persistor={persistor}>
        <RootNavigation />
        <FlashMessage
            position={"center"}
        />
      </PersistGate>
    </Provider>
  );
};

export default EntryPoint;
