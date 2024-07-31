import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Image,
    Modal,
    Pressable,
} from 'react-native';
import { Text } from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ChatList from '../components/ChatList';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useFocusEffect } from '@react-navigation/native';
import { ALERT_TYPE, Toast } from 'react-native-alert-notification';
import { useAuthentication } from '../contexts/AuthContexts';
import Loader from '../components/Loader';
import { letsLinkAPI } from '../utility/api';

const ChatScreen = ({ navigation, route }) => {
    const [showModal, setShowModal] = useState(false);
    const [showIndicator, setShowIndicator] = useState(false);
    const { user, video } = useAuthentication();

    const data = route?.params?.data;

    const handleUserBlock = () => {
        setShowModal(false);
        setShowIndicator(true);
        letsLinkAPI('user/block', { chatId: data?.chatId, userId: user?._id }, 'post')
            .then(async(res) => {
                setShowIndicator(false);
                if (res.data.status == "success") {
                    Toast.show({
                        type: ALERT_TYPE.SUCCESS,
                        title: 'Success',
                        textBody: res.data?.message,
                        autoClose: 2000,
                    });
                    navigation.goBack();
                } else {
                    Toast.show({
                        type: ALERT_TYPE.DANGER,
                        title: 'Error',
                        textBody: res.data?.message,
                        autoClose: 2000,
                    });
                }
            })
            .catch(async(e) => {
                setShowIndicator(false);
                console.log(e);
            });
    };

    const handleDeleteChat = () => {
        setShowModal(false);
        setShowIndicator(true);
        letsLinkAPI('user/delete', { chatId: data?.chatId }, 'post')
            .then(async(res) => {
                setShowIndicator(false);
                if (res.data.status == "success") {
                    Toast.show({
                        type: ALERT_TYPE.SUCCESS,
                        title: 'Success',
                        textBody: res.data?.message,
                        autoClose: 2000,
                    });
                    navigation.goBack();
                } else {
                    Toast.show({
                        type: ALERT_TYPE.DANGER,
                        title: 'Error',
                        textBody: res.data?.message,
                        autoClose: 2000,
                    });
                }
            })
            .catch(async(e) => {
                setShowIndicator(false);
                console.log(e);
            });
    };

    return (
        <View style={styles.container}>
            {showIndicator === true ? <Loader /> : null}
            <View style={{ height: 80 }}>
                <View style={styles.header}>
                    <TouchableOpacity
                        style={{ width: 40, marginLeft: 0 }}
                        onPress={() => {
                            navigation.goBack();
                        }}
                    >
                        <MaterialIcons name={'arrow-back'} size={28} color={'#000000'} />
                    </TouchableOpacity>
                    <View style={styles.header_avatar_container}>
                        <Image
                            style={styles.header_avatar}
                            source={{ uri: data?.other?.image }}
                        />
                        <View>
                            <Text style={styles.header_avatar_name}>{data?.other?.userName}</Text>
                            <Text style={styles.header_avatar_status_label}>
                                Active now
                            </Text>
                        </View>
                    </View>
                    <View style={styles.header_avatar_status}>
                        {/* video call button */}
                        <TouchableOpacity onPress={() => setShowModal(!showModal) }>
                            <Image
                                source={require('../assets/icons/darkMenu.png')}
                                style={styles.header_menu}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <View style={{ flex: 1 }}>
                <ChatList data={data} />
            </View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={showModal}
                onRequestClose={() => {
                    setShowModal(!showModal);
                }}
            >
                <View style={styles.modal_container}>
                    <View style={styles.modal_body}>
                        <View style={styles.modal_header}>
                            <Pressable 
                                style={[styles.modal_header_close_btn, { marginLeft: 20 }]}
                                onPress={() => setShowModal(!showModal)}
                            >
                                <Image
                                    style={{ height: 25, width: 25 }}
                                    source={require('../assets/icons/remove.png')}
                                />
                            </Pressable>
                            <Text style={styles.modal_header_txt}>More</Text>
                            <Pressable style={styles.modal_header_close_btn}></Pressable>
                        </View>
                        <View style={{ marginLeft: 15 }}>
                            <TouchableOpacity
                                onPress={() => {
                                    setShowModal(false);
                                    Toast.show({
                                        type: ALERT_TYPE.SUCCESS,
                                        title: 'Success',
                                        textBody: 'You have mute this user',
                                        autoClose: 2000,
                                    });
                                }}
                                style={styles.modal_content_btn}
                            >
                                <View style={styles.modal_content_icon}>
                                    <MaterialCommunityIcons
                                        name={'volume-mute'}
                                        size={25}
                                        color={'#797C7B'}
                                    />
                                </View>
                                <Text style={styles.modal_content_txt}>
                                    Mute User
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    setShowModal(false);
                                    Toast.show({
                                        type: ALERT_TYPE.SUCCESS,
                                        title: 'Success',
                                        textBody: 'You have report this image',
                                        autoClose: 2000,
                                    });
                                }}
                                style={styles.modal_content_btn}
                            >
                                <View style={styles.modal_content_icon}>
                                    <Image
                                        source={require('../assets/icons/userBlock.png')}
                                        style={{ height: 20 }}
                                    />
                                </View>
                                <Text style={styles.modal_content_txt}>
                                    Report Picture
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => handleUserBlock()}
                                style={styles.modal_content_btn}
                            >
                                <View style={styles.modal_content_icon}>
                                    <Image
                                        source={require('../assets/icons/block.png')}
                                        style={{ height: 20 }}
                                    />
                                </View>
                                <Text style={styles.modal_content_txt}>
                                    Block User
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => handleDeleteChat()}
                                style={styles.modal_content_btn}
                            >
                                <View style={styles.modal_content_icon}>
                                    <MaterialCommunityIcons
                                        name={'delete-outline'}
                                        size={25}
                                        color={'#797C7B'}
                                    />
                                </View>
                                <Text style={styles.modal_content_txt}>
                                    Delete Chat
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff'
    },
    header: {
        width: '95%',
        flexDirection: 'row',
        alignSelf: 'center',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 20,
    },
    header_avatar_container: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    header_avatar: {
        width: 40,
        height: 40,
        borderRadius: 50,
        marginRight: 10,
    },
    header_avatar_name: {
        fontSize: 20,
        fontWeight: '700',
        color: '#000000',
        marginLeft: 0,
        fontFamily: 'Poppins-Regular',
    },
    header_avatar_status: {
        position: 'absolute',
        right: 5,
        flexDirection: 'row',
        alignItems: 'center',
        height: 40
    },
    header_avatar_status_label: {
        color: '#0000000',
        fontSize: 12,
        fontFamily: 'Poppins-Regular'
    },
    header_menu: {
        width: 5,
        height: 22,
        marginLeft: 20,
        tintColor: '#000000',
    },
    modal_container: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    modal_body: {
        width: '100%',
        height: 300,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        backgroundColor: '#ffffff',
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
    },
    modal_header: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    modal_header_close_btn: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
    },
    modal_header_txt: {
        marginRight: 40,
        fontSize: 16,
        fontWeight: '600',
        color: '#000000',
        fontFamily: 'Poppins-SemiBold',
    },
    modal_content_btn: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        marginTop: 20,
        paddingHorizontal: 10,
    },
    modal_content_icon: {
        height: 35,
        width: 35,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F2F8F7',
        borderRadius: 50,
    },
    modal_content_txt: {
        marginLeft: 20,
        fontSize: 16,
        fontWeight: '600',
        color: '#000000',
        fontFamily: 'Poppins-Medium',
    }
});

export default ChatScreen;
