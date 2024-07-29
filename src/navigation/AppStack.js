import { createStackNavigator } from "@react-navigation/stack";
import { ChatScreen, ContactUsScreen, LoginScreen, MemberProfileScreen, PackageScreen, PayoutScreen, PrivacyScreen, RegisterScreen, SettingScreen, SplashScreen, TermsScreen } from "../screens";
import TabStack from './TabStack';

const Stack = createStackNavigator();

const AppStack = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                animationEnabled: true,
                headerShown: false,
                animationTypeForReplace: 'pop'
            }}
        >
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="Home" component={TabStack} />
            <Stack.Screen name="MemberProfile" component={MemberProfileScreen} />
            <Stack.Screen name="Package" component={PackageScreen} />
            <Stack.Screen name="Chat" component={ChatScreen} />
            <Stack.Screen name="Setting" component={SettingScreen} />
            <Stack.Screen name="ContactUs" component={ContactUsScreen} />
            <Stack.Screen name="Payout" component={PayoutScreen} />
            <Stack.Screen name="Terms" component={TermsScreen} />
            <Stack.Screen name="Privacy" component={PrivacyScreen} />
            
        </Stack.Navigator>
    );
};

export default AppStack;