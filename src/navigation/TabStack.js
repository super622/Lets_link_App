import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image } from 'react-native';
import { ChatListScreen, MemberListScreen, ProfileScreen } from '../screens';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const TabStack = () => {
    const Tab = createBottomTabNavigator();

    return (
        <Tab.Navigator
            initialRouteName='MemberList'
            screenOptions={({ route }) => ({
                tabBarShowLabel: false,
                headerShown: false,
                tabBarStyle: {
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    elevation: 0,
                    height: 60,
                    borderRadius: 0,
                    presentation: 'transparentModal',
                    animationTypeForReplace: 'pop',
                    animation: 'slide_from_right',
                },
                tabBarIcon: ({ focused, color, size }) => {
                    let colors;
                    if (route.name == 'MemberList') {
                        colors = focused ? '#6515AC' : '#9d9999';
                        return <Image
                                    source={require('../assets/images/users.png')}
                                    style={{ width: 25, height: 25, tintColor: colors }}
                                />
                    } else if (route.name === 'ChatList') {
                        colors = focused ? '#6515AC' : '#9d9999';
                        return <Image
                                    source={require('../assets/images/chat.png')}
                                    style={{ width: 25, height: 25, tintColor: colors }}
                                />
                    } else if (route.name === 'Profile') {
                        colors = focused ? '#6515AC' : '#9d9999';
                        return (
                            <FontAwesome
                                name={'user-o'}
                                size={25}
                                color={colors}
                            />
                        );
                    }
                },
            })}
        >
            <Tab.Screen name="MemberList" component={MemberListScreen}/>
            <Tab.Screen name="ChatList" component={ChatListScreen}/>
            <Tab.Screen name="Profile" component={ProfileScreen}/>
        </Tab.Navigator>
    );
};

export default TabStack;
