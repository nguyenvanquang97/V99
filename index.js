/**
 * @format
 */

import 'react-native-gesture-handler';
import { AppRegistry, StyleSheet, Text, View } from 'react-native';
import App from './app/Entrypoint';
import { name as appName } from './app.json';
import { enableScreens } from 'react-native-screens';

enableScreens();

const TestComponent = () => {
  console.log('TestComponent loaded successfully');
  
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Test Component Working!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'red',
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold'
  }
});



AppRegistry.registerComponent(appName, () => App);
