import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    Pressable,
    ScrollView,
    Switch,
    Modal,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { ALERT_TYPE, Toast } from 'react-native-alert-notification';
import Loader from '../components/Loader';
import { useAuthentication } from '../contexts/AuthContexts';
import { letsLinkAPI } from '../utility/api';

const SettingScreen = ({ navigation }) => {
    const { user, setUser, video, setVideo, notification, setNotification } = useAuthentication();
    const [modalVisible, setModalVisible] = useState(false);
    const [showIndicator, setShowIndicator] = useState(false);
    const [isEnabledVideo, setIsEnabledVideo] = useState(video);
    const [isEnabledNotification, setisEnabledNotification] = useState(notification);

    const toggleVideoSwitch = () => {
        setIsEnabledVideo(!isEnabledVideo);
        setVideo(!isEnabledVideo);
    };

    const toggleNotificationSwitch = () => {
        setisEnabledNotification(!isEnabledNotification);
        setNotification(!isEnabledNotification);
    }

    const handleLogout = () => {
        Toast.show({
            type: ALERT_TYPE.SUCCESS,
            title: 'Success',
            textBody: 'User Logout Successfully!',
            autoClose: 2000,
        });
        setUser(null);
        navigation.replace('Splash');
    };
  
    const deleteAccount = () => {
        setModalVisible(false);
        setShowIndicator(true);
        letsLinkAPI(`user/delete/${user?._id}`, {}, 'delete')
            .then(async(res) => {
                if (res.data.status == 'success') {
                    Toast.show({
                        type: ALERT_TYPE.SUCCESS,
                        title: 'Success',
                        textBody: res.data?.message,
                        autoClose: 2000
                    });
                    setUser(null);
                    navigation.replace('Splash');
                }
            })
            .catch(async(e) => {
                console.log(e);
            })
    };

    return (
        <View style={styles.container}>
            {showIndicator === true ? <Loader /> : null}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => {
                        navigation.goBack();
                    }}
                >
                    <AntDesign name={'arrowleft'} size={20} color={'white'} />
                </TouchableOpacity>
                <Text style={styles.heading}>Settings</Text>
                <Pressable
                    onPress={() => navigation.navigate('Package')}
                    style={{ flexDirection: 'row' }}
                >
                    <Image
                        source={require('../../assets/icons/coin.png')}
                        style={styles.logo}
                    />
                    <View>
                        <Text style={[styles.heading, { fontSize: 14 }]}>{user?.coin ? user?.coin : '0'}</Text>
                        <Text style={[styles.heading, { fontSize: 14 }]}>Coins</Text>
                    </View>
                </Pressable>
            </View>
            <View style={styles.bodyContainer}>
                <ScrollView
                    contentContainerStyle={{ paddingBottom: 30 }}
                    showsVerticalScrollIndicator={false}>
                    <Pressable
                        onPress={() => navigation.navigate('ContactUs')}
                        style={styles.bodyPressableItemContainer}
                    >
                        <View style={styles.bodyPressableItemImg}>
                            <Image
                                source={require('../assets/images/Keys.png')}
                                style={{ height: 30, width: 30 }}
                            />
                        </View>
                        <Text style={styles.bodyPressableItemTxt}>
                            Contact Support
                        </Text>
                    </Pressable>
                    <View style={[styles.bodyPressableItemContainer, { justifyContent: 'space-between', marginTop: 10 }]}>
                        <View style={styles.bodyPressableItemImg}>
                            <Image
                                source={require('../../assets/images/video.png')}
                                style={{height: 30, width: 30}}
                            />
                        </View>
                        <Text style={styles.bodyPressableItemTxt}>
                            Video Chat
                        </Text>
                        <Switch
                            trackColor={{ false: '#3e3e3e', true: 'rgba(101, 21, 172, 0.4)' }}
                            thumbColor={ isEnabledVideo ? 'rgba(101, 21, 172, 1)' : '#f4f3f4' }
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={toggleVideoSwitch}
                            value={isEnabledVideo}
                        />
                    </View>
                    <Pressable
                        onPress={() => navigation.navigate('Payout')}
                        style={[styles.bodyPressableItemContainer, { marginTop: 10 }]}
                    >
                        <View style={styles.bodyPressableItemImg}>
                            <Image
                                source={require('../assets/images/payout.png')}
                                style={{height: 30, width: 30}}
                            />
                        </View>
                        <Text style={styles.bodyPressableItemTxt}>
                            Your Payouts
                        </Text>
                    </Pressable>
                    <View style={[styles.bodyPressableItemContainer, { justifyContent: 'space-between', marginTop: 10 }]}>
                        <View style={styles.bodyPressableItemImg}>
                            <Image
                                source={require('../assets/images/notification.png')}
                                style={{ height: 30, width: 30 }}
                            />
                        </View>
                        <Text style={styles.bodyPressableItemTxt}>
                            Notification Settings
                        </Text>
                        <Switch
                            trackColor={{ false: '#3e3e3e', true: 'rgba(101, 21, 172, 0.4)' }}
                            thumbColor={ isEnabledNotification ? 'rgba(101, 21, 172, 1)' : '#f4f3f4' }
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={toggleNotificationSwitch}
                            value={isEnabledNotification}
                        />
                    </View>
                    <Pressable
                        onPress={() => navigation.navigate('Terms')}
                        style={[styles.bodyPressableItemContainer, { marginTop: 10 }]}
                    >
                        <View style={styles.bodyPressableItemImg}>
                            <Image
                                source={require('../assets/images/term.png')}
                                style={{ height: 30, width: 30 }}
                            />
                        </View>
                        <Text style={styles.bodyPressableItemTxt}>
                            Terms of Service
                        </Text>
                    </Pressable>
                    <Pressable
                        onPress={() => navigation.navigate('Privacy')}
                        style={[styles.bodyPressableItemContainer, { marginTop: 10 }]}
                    >
                        <View style={styles.bodyPressableItemImg}>
                            <Image
                                source={require('../assets/images/privacy.png')}
                                style={{ height: 30, width: 30 }}
                            />
                        </View>
                        <Text style={styles.bodyPressableItemTxt}>
                            Privacy Policy
                        </Text>
                    </Pressable>
                    <Pressable
                        onPress={() => handleLogout()}
                        style={[styles.bodyPressableItemContainer, { marginTop: 10 }]}
                    >
                        <View style={styles.bodyPressableItemImg}>
                            <Image
                                source={require('../assets/images/logout.png')}
                                style={{ height: 25, width: 25 }}
                            />
                        </View>
                        <Text style={styles.bodyPressableItemTxt}>
                            Logout
                        </Text>
                    </Pressable>
                    <Pressable
                        onPress={() => setModalVisible(true)}
                        style={[styles.bodyPressableItemContainer, { marginTop: 10 }]}
                    >
                        <View style={styles.bodyPressableItemImg}>
                            <Image
                                source={require('../assets/images/delete.png')}
                                style={{ height: 25, width: 25 }}
                            />
                        </View>
                        <Text
                            style={{
                                color: 'rgba(255, 48, 48, 1)',
                                fontSize: 18,
                                marginLeft: 10,
                                fontFamily: 'Poppins-Medium',
                            }}
                        >
                            Delete Account
                        </Text>
                    </Pressable>
                </ScrollView>
            </View>
            <Modal
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalBody}>
                        <View style={styles.modalHeader}>
                            <Pressable
                                style={[styles.modalHeaderButton, { marginLeft: 20 }]}
                                onPress={() => setModalVisible(!modalVisible)}
                            >
                                <Image
                                    style={{ height: 25, width: 25 }}
                                    source={require('../assets/icons/remove.png')}
                                />
                            </Pressable>
                            <Pressable style={styles.modalHeaderButton}></Pressable>
                        </View>
                        <Text style={styles.modalTitle}>
                            Delete Account
                        </Text>
                        <Text style={styles.modalTxt}>
                            Deleting your account will remove all of your information form our data base. This cannot be undone.
                        </Text>
                        <TouchableOpacity
                            onPress={()=> deleteAccount()}
                            style={styles.modalButton}
                        >
                            <Text style={styles.modalButtonTxt}>
                                Delete Account
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000'
    },
    header: {
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignSelf: 'center',
        width: '100%',
        padding: 10,
        marginTop: 10,
        paddingBottom: 20,
    },
    heading: {
        fontSize: 18,
        color: '#ffffff',
        fontWeight: '600',
        fontFamily: 'Poppins',
    },
    logo: {
        width: 20,
        height: 35,
        marginRight: 10
    },
    bodyContainer: {
        flex: 1,
        marginTop: 0,
        paddingTop: 20,
        backgroundColor: '#ffffff',
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40
    },
    bodyPressableItemContainer: {
        width: '100%',
        alignSelf: 'center',
        height: 70,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(245, 246, 246, 1)',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: '5%'
    },
    bodyPressableItemImg: {
        height: 50,
        width: 50,
        borderRadius: 30,
        backgroundColor: 'rgba(242, 248, 247, 1)',
        alignItems: 'center',
        justifyContent: 'center'
    },
    bodyPressableItemTxt: {
        color: 'black',
        fontSize: 18,
        marginLeft: 10,
        fontFamily: 'Poppins-Medium'
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        backfaceVisibility: 'rgba(0, 14, 8, 0.8)'
    },
    modalBody: {
        width: '100%',
        height: 300,
        backgroundColor: 'white',
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2
        }
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 10
    },
    modalHeaderButton: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10
    },
    modaltitle: {
        fontSize: 20,
        textAlign: 'center',
        color: '#000000',
        fontFamily: 'Poppins-SemiBold'
    },
    modalTxt: {
        fontSize: 16,
        textAlign: 'center',
        color: '#000000',
        width: '85%',
        alignSelf: 'center',
        fontFamily: 'Poppins-Regular',
        marginTop: 10
    },
    modalButton: {
        height: 50,
        backgroundColor: 'rgba(172, 21, 21, 1)',
        alignItems: 'center',
        justifyContent: 'center',
        width: '85%',
        borderRadius: 20,
        alignSelf: 'center',
        marginTop: 20
    },
    modalButtonTxt: {
        fontSize: 16,
        fontWeight: '600',
        alignSelf: 'center',
        color: '#ffffff',
        fontFamily: 'Poppins-Bold'
    }
});

export default SettingScreen;
