import { StyleSheet, View, StatusBar } from 'react-native';
import { useFonts } from 'expo-font';
import { NavigationContainer } from '@react-navigation/native';
import { AlertNotificationRoot } from 'react-native-alert-notification';
import { MD3LightTheme as DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import AuthenticationProvider from './src/contexts/AuthContexts';
import theme from './src/assets/theme';
import Navigation from './src/navigation';

const App = () => {
  const [fontsLoaded] = useFonts({
    "BebasNeue-Regular": require("./src/assets/fonts/BebasNeue-Regular.ttf"),
    "Poppins-Black": require("./src/assets/fonts/Poppins-Black.ttf"),
    "Poppins-BlackItalic": require("./src/assets/fonts/Poppins-BlackItalic.ttf"),
    "Poppins-Bold": require("./src/assets/fonts/Poppins-Bold.ttf"),
    "Poppins-BoldItalic": require("./src/assets/fonts/Poppins-BoldItalic.ttf"),
    "Poppins-ExtraBold": require("./src/assets/fonts/Poppins-ExtraBold.ttf"),
    "Poppins-ExtraBoldItalic": require("./src/assets/fonts/Poppins-ExtraBoldItalic.ttf"),
    "Poppins-ExtraLight": require("./src/assets/fonts/Poppins-ExtraLight.ttf"),
    "Poppins-ExtraLightItalic": require("./src/assets/fonts/Poppins-ExtraLightItalic.ttf"),
    "Poppins-Italic": require("./src/assets/fonts/Poppins-Italic.ttf"),
    "Poppins-Light": require("./src/assets/fonts/Poppins-Light.ttf"),
    "Poppins-LightItalic": require("./src/assets/fonts/Poppins-LightItalic.ttf"),
    "Poppins-Medium": require("./src/assets/fonts/Poppins-Medium.ttf"),
    "Poppins-MediumItalic": require("./src/assets/fonts/Poppins-MediumItalic.ttf"),
    "Poppins-Regular": require("./src/assets/fonts/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("./src/assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-SemiBoldItalic": require("./src/assets/fonts/Poppins-SemiBoldItalic.ttf"),
    "Poppins-Thin": require("./src/assets/fonts/Poppins-Thin.ttf"),
    "Poppins-ThinItalic": require("./src/assets/fonts/Poppins-ThinItalic.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <NavigationContainer>
      <AuthenticationProvider>
        <AlertNotificationRoot>
          <PaperProvider theme={theme}>
            <View style={styles.container}>
              <StatusBar style="auto"/>
              <Navigation />
            </View>
          </PaperProvider>
        </AlertNotificationRoot>
      </AuthenticationProvider>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});

export default App;