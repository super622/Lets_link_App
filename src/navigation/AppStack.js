import { createStackNavigator } from "@react-navigation/stack";
import { SplashScreen } from "../screens";
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
            <Stack.Screen name="Home" component={TabStack} />
        </Stack.Navigator>
    );
};

export default AppStack;