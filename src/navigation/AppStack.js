import { createStackNavigator } from "@react-navigation/stack";
import { ChatScreen, ContactUsScreen, LoginScreen, MemberProfileScreen, PackageScreen, PayoutScreen, PrivacyScreen, RegisterScreen, SettingScreen, SplashScreen, TermsScreen } from "../screens";
import TabStack from './TabStack';

const Stack = createStackNavigator();

const AppStack = () => {
    return (
        <Stack.Navigator
            initialRouteName="SplashScreen"
            screenOptions={{
                animationEnabled: true,
                headerShown: false,
                animationTypeForReplace: 'pop'
            }}
        >
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="Splash" component={LoginScreen} />
            <Stack.Screen name="Splash" component={RegisterScreen} />
            <Stack.Screen name="Home" component={TabStack} />
            <Stack.Screen name="Splash" component={MemberProfileScreen} />
            <Stack.Screen name="Splash" component={PackageScreen} />
            <Stack.Screen name="Splash" component={ChatScreen} />
            <Stack.Screen name="Splash" component={SettingScreen} />
            <Stack.Screen name="Splash" component={ContactUsScreen} />
            <Stack.Screen name="Splash" component={PayoutScreen} />
            <Stack.Screen name="Splash" component={TermsScreen} />
            <Stack.Screen name="Splash" component={PrivacyScreen} />
            
        </Stack.Navigator>
    );
};

export default AppStack;