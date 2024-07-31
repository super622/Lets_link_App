import React, { useState, useEffect, useRef } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    Modal,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    FlatList,
} from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import { Audio } from 'expo-av';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useFocusEffect } from '@react-navigation/native';
import userSocket from '../socket';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { ALERT_TYPE, Toast } from 'react-native-alert-notification';
import Entypo from 'react-native-vector-icons/Entypo';
import moment from 'moment';
import Icons from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import Loader from './Loader';
import { useAuthentication } from '../contexts/AuthContexts';
import { letsLinkAPI } from '../utility/api';

const ChatList = (props) => {
    const [lockModal, setLockModal] = useState(false);
    const [shareModal, setShareModal] = useState(false);
    const [selectionModal, setSelectionModal] = useState(false);
    const [imgModal, setImgModal] = useState(false);
    const [showIndicator, setShowIndicator] = useState(false);
    const [currentMessage, setCurrentMessage] = useState(null);
    const [marginBottom, setMarginBottom] = useState('0%');
    const [checkingImage, setCheckingImage] = useState('');
    const [messages, setMessages] = useState([]);
    const [imgSendModal, setImgSendModal] = useState(false);
    const [image, setImage] = useState({});
    const [lockmedia, setLockMedia] = useState(false);
    const [lockcoins, setLockCoins] = useState('');
    const [recordTime, setRecordTime] = useState(0);
    const [pressmmike, setPressMike] = useState(false);
    const [voiceData, setVoiceData] = useState('');
    const [sound, setSound] = useState(null);
    const [paused, setPaused] = useState(false);
    const [currentDurationSec, setCurrentDurationSec] = useState(0);
    const [currentPositionSec, setCurrentPositionSec] = useState(0);
    const [sound1, setSound1] = useState(null);
    const [paused1, setPaused1] = useState(false);
    const [currentDurationSec1, setCurrentDurationSec1] = useState(0);
    const [currentPositionSec1, setCurrentPositionSec1] = useState(0);
    const [curPlaySound, setCurPlaySound] = useState(-1);

    const { user } = useAuthentication();

    const data = props?.data;
    const isMountedRef = useRef(false);
    const recordingInstance = useRef(null);

    useEffect(() => {
        const requestPermissions = async () => {
            if (Platform.OS === 'android') {
                try {
                    const { status: writeStatus } = await MediaLibrary.requestPermissionsAsync();
                    const { status: audioStatus } = await Audio.requestPermissionsAsync();
        
                    if (writeStatus === 'granted' && audioStatus === 'granted') {
                        // Permissions granted
                        console.log('Permissions granted');
                    } else {
                        // All required permissions not granted
                        console.log('All required permissions not granted');
                        return;
                    }
                } catch (err) {
                    console.warn(err);
                    return;
                }
            }
        };
        
        requestPermissions();
        userSocket.initializeSocket();
    }, []);

    useEffect(() => {
        userSocket.initializeSocket();
        if (!isMountedRef.current) {
            const handleReceiveAcceptedOrder = data => {
                console.log('response from orders ===', data);
                if (data?.status === 'success') {
                    setMessages(prev => [data?.data, ...prev]);
                }
            };

            userSocket.on('receiveMessage', handleReceiveAcceptedOrder);
            isMountedRef.current = true;
        
            return () => {
                userSocket.off('receiveMessage', handleReceiveAcceptedOrder);
            };
        }
    }, [userSocket]);

    useFocusEffect(
        React.useCallback(() => {
            letsLinkAPI('user/getUserMessages', { chatId: data?.chatId }, 'post')
                .then(async(res) => {
                    if (res.data.status == "success") {
                        if (res.data.data.length > 0) {
                            setMessages(res.data.data.reverse());
                        }
                    }
                })
                .catch(async(e) => {
                    console.log(e);
                });
        }, []),
    );

    const sendVoiceMessage = async(uri) => {
        if (uri) {
            setShowIndicator(true);
            let formdata = new FormData();
            formdata.append('avatars', {
                uri: uri,
                size: 200,
                type: 'audio/mp4',
                name: 'voice.mp4',
                lastModified: new Date(),
                lastModifiedDate: new Date(),
            });

            const header = {
                'Content-Type': 'multipart/form-data'
            };

            letsLinkAPI('user/uploadImage', formdata, 'post', header)
                .then(async(res) => {
                    setShowIndicator(false);
                    setPaused(false);
                    if (res.data.length > 0) {
                        setVoiceData(res.data[0]?.url);
                    } else {
                        setVoiceData('');
                    }                    
                })
                .catch(async(e) => {
                    setShowIndicator(false);
                    console.log(e);
                });
        }
    };

    const onStartRecord = async() => {
        setVoiceData('');
        try {
            const newRecording = new Audio.Recording();
            await newRecording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
            newRecording.setOnRecordingStatusUpdate(status => {
                setRecordTime(formatTime('all', status.durationMillis));
                setCurrentPositionSec(formatTime('sec', status.durationMillis));
            });
            await newRecording.startAsync();
            recordingInstance.current = newRecording;
        } catch (e) {
            console.log('start recoding: ', e);
        }
    };

    const onStopRecord = async () => {
        try {
            await recordingInstance.current.stopAndUnloadAsync();
            const uri = recordingInstance.current.getURI();
            await sendVoiceMessage(uri);
            console.log('Recording stopped and stored at', uri);
        } catch (error) {
            console.error('Failed to stop recording', error);
        }
    };

    const onStartPlay = async () => {
        try {
            if (sound) {
                await sound.playFromPositionAsync(currentPositionSec);
                setPaused(true);
                sound.setOnPlaybackStatusUpdate(status => {
                    if (status.isLoaded && status.isPlaying) {
                        setCurrentPositionSec(status.positionMillis);
                        setCurrentDurationSec(status.durationMillis);
                    }
                    if (status.didJustFinish) {
                        onStopPlay();
                    }
                });
            } else {
                const { sound: newSound } = await Audio.Sound.createAsync(
                    { uri: `${voiceData}` },
                    { shouldPlay: true }
                );
                setSound(newSound);
                setPaused(true);
        
                newSound.setOnPlaybackStatusUpdate(status => {
                    if (status.isLoaded && status.isPlaying) {
                        setCurrentPositionSec(status.positionMillis);
                        setCurrentDurationSec(status.durationMillis);
                    }
                    if (status.didJustFinish) {
                        onStopPlay();
                    }
                });
            }
        } catch (error) {
            console.error('Failed to play sound', error);
        }
    };

    const onPausePlay = async () => {
        if (sound) {
            await sound.pauseAsync();
            setPaused(false);
        }
    };

    const onStopPlay = async () => {
        if (sound) {
            await sound.stopAsync();
            await sound.unloadAsync();
            setSound(null);
            setPaused(false);
            setCurrentPositionSec(0);
        }
    };

    const onStartPlay1 = async(source) => {
        const { sound: newSound1 } = await Audio.Sound.createAsync(
            { uri: source },
            { shouldPlay: true }
        );
        setSound1(newSound1);
        setPaused1(true);

        newSound1.setOnPlaybackStatusUpdate(status => {
            if (status.isLoaded && status.isPlaying) {
                setCurrentPositionSec1(status.positionMillis);
                setCurrentDurationSec1(status.durationMillis);
            }
            if (status.didJustFinish) {
                onStopPlay1();
            }
        });
    };

    const onPausePlay1 = async() => {
        if (sound1) {
            await sound1.pauseAsync();
            setPaused1(false);
        }
    };

    const onStopPlay1 = async() => {
        if (sound1) {
            await sound1.stopAsync();
            await sound1.unloadAsync();
        }
        setSound1(null);
        setPaused1(false);
        setCurrentPositionSec1(0);
    };

    const sendMessage = () => {
        if (currentMessage) {
            const obj = {
                text: currentMessage,
                sender: user?._id,
                chatId: data?.chatId,
            };
            console.log('send message obj ====', obj);
        
            userSocket.emit('sendMessage', obj);
            setCurrentMessage('');
        }
    };

    const sendVoice = () => {
        if (voiceData) {
            const obj = {
                voice: voiceData,
                sender: user?._id,
                chatId: data?.chatId,
            };
            console.log('send message obj ====', obj);
        
            userSocket.emit('sendMessage', obj);
            setVoiceData('');
            setPressMike(false);
        }
    };

    const sendImage = () => {
        setImgSendModal(false);
        setShowIndicator(true);

        let formdata = new FormData();
        formdata.append('avatars', {
            name: image.uri.split('/').pop(),
            type: image.mime,
            size: image.size,
            uri: image.uri,
            lastModified: image.modificationDate,
            lastModifiedDate: new Date(),
        });

        const header = {
            'Content-Type': 'multipart/form-data'
        };

        letsLinkAPI('user/uploadImage', formdata, 'post', header)
            .then(async(res) => {
                setShowIndicator(false);
                if (res.data.length) {
                    const obj = {
                        text: currentMessage,
                        sender: user?._id,
                        lockmedia: lockmedia,
                        mediacoins: lockcoins,
                        media: res.data[0]?.url,
                        chatId: data?.chatId,
                    };

                    userSocket.emit('sendMessage', obj);
                    setCurrentMessage('');
                    setSelectionModal(false);
                }
            })
            .catch(async(e) => {
                console.log(e);
                setShowIndicator(false);
                Toast.show({
                    type: ALERT_TYPE.SUCCESS,
                    title: 'Error',
                    textBody: 'Network Error',
                    autoClose: 2000,
                });
            });
    };

    const onClickImagePicker = async() => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted == false) {
            alert("You've refused to allow this app to access your photos!");
            return;
        }

        const pickerResult = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [4, 3],
        });

        if (!pickerResult.canceled) {
            const croppedImage = await ImageManipulator.manipulateAsync(
                pickerResult.assets[0].uri,
                [{ resize: { width: pickerResult.assets[0].width, height: pickerResult.assets[0].height }}],
                { compress: 1, format: ImageManipulator.SaveFormat.PNG }
            );
            setImgSendModal(true);
            setImage({
                ...croppedImage,
                size: pickerResult.assets[0].fileSize,
                mime: pickerResult.assets[0].mimeType,
                modificationDate: new Date().valueOf()
            });
        }
    };

    const takePhotoFromCamera = async() => {
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

        if (permissionResult.granted == false) {
            alert("You've refused to allow this app to access your camera!");
            return;
        }

        const pickerResult = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [4, 3],
        });

        if (!pickerResult.canceled) {
            const croppedImage = await ImageManipulator.manipulateAsync(
                pickerResult.assets[0].uri,
                [{ resize: { width: pickerResult.assets[0].width, height: pickerResult.assets[0].height }}],
                { compress: 1, format: ImageManipulator.SaveFormat.PNG }
            );
            setImgSendModal(true);
            setImage({
                ...croppedImage,
                size: pickerResult.assets[0].fileSize,
                mime: pickerResult.assets[0].mimeType,
                modificationDate: new Date().valueOf()
            });
        }
    };

    const formatTime = (type, millis) => {
        let minutes = '';
        let seconds = '';
        if (type == 'all') {
            minutes = Math.floor(millis / 60000);
            seconds = Math.floor((millis % 60000) / 1000);
            return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        } else if (type == 'sec') {
            seconds = Math.floor(millis / 1000);
            return seconds;
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : null}
            style={styles.container}
        >
            {showIndicator === true ? <Loader /> : null}
            <FlatList
                data={messages}
                inverted
                showsVerticalScrollIndicator={false}
                renderItem={item => {
                    return (
                        <View
                            style={{
                                alignSelf:
                                    item?.item?.sender == user?._id
                                    ? 'flex-end'
                                    : 'flex-start',
                                paddingLeft: 10,
                            }}
                        >
                            <View
                                style={[
                                    styles.card_container,
                                    {
                                        borderRadius: item?.item.media ? 20 : 8,
                                        backgroundColor:
                                            item?.item?.sender == user?._id
                                            ? '#AB4BFF'
                                            : '#F2F7FB',
                    
                                        alignSelf:
                                            item?.item?.sender == user?._id
                                            ? 'flex-start'
                                            : 'flex-end',
                                        padding: 2,
                                        marginLeft: item?.item?.user == user?._id ? '24%' : 0,
                                    },
                                ]}
                            >
                                {item?.item.media && (
                                    <View style={styles.card_media_container}>
                                        {item?.item?.lockmedia === true ? (
                                            <View style={styles.card_locked_media_container}>
                                                <Image
                                                    source={{uri: item?.item?.media}}
                                                    blurRadius={5}
                                                    style={styles.card_locked_media_image}
                                                />
                                                <View style={styles.card_locked_media_txt_container}>
                                                    <Image
                                                        source={require('../assets/icons/padlock.png')}
                                                        style={{ height: 30, width: 30 }}
                                                    />
                                                    <Text style={styles.card_locked_media_txt}>
                                                        {item?.item?.mediacoins} coins for unlock image
                                                    </Text>
                                                </View>
                                            </View>
                                        ) : (
                                            <TouchableOpacity
                                                style={{ height: 200, width: 200 }}
                                                onPress={() => {
                                                    setImgModal(true);
                                                    setCheckingImage(item?.item?.media);
                                                }}
                                            >
                                                <Image
                                                    source={{ uri: item?.item?.media }}
                                                    style={styles.card_media_image}
                                                />
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                )}

                                {item?.item.text ? (
                                    <View>
                                        <Text
                                            style={{
                                                color:
                                                    item?.item?.sender == user?._id
                                                    ? '#ffffff'
                                                    : 'black',
                                                fontSize: 12,
                                                fontFamily: 'Poppins-Medium',
                                                marginHorizontal: 6,
                                                marginTop: 5,
                                            }}
                                        >
                                            {item?.item?.text}
                                        </Text>
                                    </View>
                                ) : null}

                                {item?.item?.voice ? (
                                    <View style={styles.card_voice_container}>
                                        {paused1 === false ? (
                                            <Entypo
                                                name="controller-play"
                                                onPress={() => {
                                                    setCurPlaySound(item?.item?._id);
                                                    onStartPlay1(item?.item?.voice);
                                                }}
                                                size={20}
                                                color={
                                                    item?.item?.sender == user?._id
                                                    ? 'white'
                                                    : 'black'
                                                }
                                            />
                                        ) : (
                                            curPlaySound === item?.item?._id ? (
                                                <AntDesign
                                                    name="pause"
                                                    onPress={onPausePlay1}
                                                    size={20}
                                                    color={
                                                        item?.item?.sender == user?._id
                                                        ? 'white'
                                                        : 'black'
                                                    }
                                                />
                                            ) : (
                                                <Entypo
                                                    name="controller-play"
                                                    onPress={() => {
                                                        onStartPlay1(item?.item?.voice);
                                                    }}
                                                    size={20}
                                                    color={
                                                        item?.item?.sender == user?._id
                                                        ? 'white'
                                                        : 'black'
                                                    }
                                                />
                                            )
                                        )}
                                        <View style={styles.card_voice_timer}>
                                            <View
                                                style={{
                                                    borderWidth: 1,
                                                    borderColor:
                                                    item?.item?.sender == user?._id
                                                        ? 'white'
                                                        : 'black',
                                                    width: curPlaySound === item?.item?._id ? `${ (currentPositionSec1 / currentDurationSec1) * 100 }%` : `0%`,
                                                }}
                                            />
                                        </View>
                                    </View>
                                ) : null}

                                <Text
                                    style={{
                                        alignSelf: 'flex-end',
                                        fontSize: 8,
                                        marginTop: 2,
                                        fontFamily: 'Poppins-Medium',
                                        marginHorizontal: 6,
                                        color:
                                            item?.item?.sender == user?._id
                                            ? '#ffffff'
                                            : '#000000',
                                    }}
                                >
                                    {moment(item?.item?.createdAt).fromNow()}
                                </Text>
                            </View>
                        </View>
                    );
                }}
            />

            {pressmmike ? (
                <View style={styles.input_mic_container}>
                    <View style={styles.input_voice_container}>
                        {voiceData ? (
                            <View style={{ padding: 5, width: 250 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    {paused === false ? (
                                        <Entypo
                                            name="controller-play"
                                            onPress={onStartPlay}
                                            size={20}
                                        />
                                    ) : (
                                        <AntDesign name="pause" onPress={onPausePlay} size={20} />
                                    )}

                                    <View
                                        style={{
                                            flex: 1,
                                            backgroundColor: '#e2e2e2',
                                            marginRight: 10,
                                        }}
                                    >
                                        <View
                                            style={{
                                                borderWidth: 1,
                                                borderColor: 'black',
                                                width: `${
                                                    (currentPositionSec / currentDurationSec) * 100
                                                }%`,
                                            }}
                                        />
                                    </View>
                                    <Feather
                                        name="trash-2"
                                        color={'black'}
                                        size={22}
                                        onPress={() => {
                                            setVoiceData('');
                                            setRecordTime(0);
                                        }}
                                    />
                                </View>
                            </View>
                        ) : (
                            <View style={{ flexDirection: "row", justifyContent: 'space-between', alignItems: 'center' }}>
                                <Feather
                                    name="chevron-left"
                                    color={'black'}
                                    size={22}
                                    onPress={() => {
                                        setPressMike(false);
                                    }}
                                />
                                <View style={styles.voice_recording_container}>
                                    <Text style={styles.voice_recording_txt}>
                                        Recording Voice
                                    </Text>
                                    <Text style={styles.voice_recording_txt}>
                                        {recordTime}
                                    </Text>
                                </View>
                            </View>
                        )}
                    </View>

                    {voiceData ? (
                        <TouchableOpacity
                            style={styles.send_btn}
                            onPress={() => {
                                sendVoice();
                            }}
                        >
                            <MaterialCommunityIcons
                                name={'send'}
                                size={20}
                                color={'#ffffff'}
                            />
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            onLongPress={() => onStartRecord()}
                            onPressOut={() => onStopRecord()}
                            style={styles.mic_btn}
                        >
                            <Icons name="microphone" size={22} color={'white'} />
                        </TouchableOpacity>
                    )}
                </View>
            ) : (
                <View
                    style={[
                        styles.input_container,
                        { marginBottom: 10, justifyContent: 'space-between' },
                    ]}
                >
                    <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity
                            onPress={() => {
                                setSelectionModal(true);
                            }}
                            style={{ transform: [{rotate: '135deg'}], marginLeft: -6 }}
                        >
                            <MaterialCommunityIcons
                                name={'attachment'}
                                size={28}
                                color={'#000000'}
                            />
                        </TouchableOpacity>

                        {user?.gender === 'female' && (
                            <TouchableOpacity
                                style={{ marginLeft: 6 }}
                                onPress={() => {
                                    setShareModal(!shareModal);
                                }}
                            >
                                <MaterialCommunityIcons
                                    name={'lock-outline'}
                                    size={28}
                                    color={'#000000'}
                                />
                            </TouchableOpacity>
                        )}
                    </View>
                    <View style={styles.input_view}>
                        <TextInput
                            placeholder="Type Message ..."
                            placeholderTextColor={'#797C7B'}
                            value={currentMessage}
                            onFocus={() => {
                                setMarginBottom(Platform.OS === 'ios' ? '42%' : '0%');
                            }}
                            onBlur={() => {
                                setMarginBottom('0%');
                            }}
                            onChangeText={message => {
                                setCurrentMessage(message);
                            }}
                            style={{
                                height: 40,
                                maxWidth: '80%',
                                color: '#000000',
                                flexGrow: 10,
                            }}
                        />
                    </View>

                    {!currentMessage ? (
                        <TouchableOpacity
                            style={{
                                padding: 10,
                                borderRadius: 50,
                            }}
                            onPress={() => {
                                setPressMike(true);
                            }}
                        >
                            <Image
                                source={require('../assets/icons/microphone.png')}
                                style={{ height: 30, width: 25 }}
                            />
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            style={{
                                padding: 10,
                                borderRadius: 50,
                                backgroundColor: '#AB4BFF',
                            }}
                            onPress={() => {
                                sendMessage(null, null);
                            }}
                        >
                            <MaterialCommunityIcons
                                name={'send'}
                                size={20}
                                color={'#ffffff'}
                            />
                        </TouchableOpacity>
                    )}
                </View>
            )}

            <Modal
                transparent={true}
                visible={imgSendModal}
                onRequestClose={() => {}}
            >
                <View style={styles.centeredView}>
                    <View style={[styles.modalView, { height: 420 }]}>
                        <View style={styles.modalHeader}>
                            <Pressable
                                style={[
                                    styles.button,
                                    {
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginLeft: 20,
                                    }
                                ]}
                                onPress={() => setImgSendModal(false)}
                            >
                                <Image
                                    style={{ height: 25, width: 25 }}
                                    source={require('../assets/icons/remove.png')}
                                />
                            </Pressable>
                            <Text style={styles.modalHeaderTxt}>
                                Share Content
                            </Text>
                            <Pressable
                                style={[
                                    styles.button,
                                    {
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }
                                ]}
                            ></Pressable>
                        </View>
                        <Image
                            style={styles.sendImgModalImg}
                            source={{ uri: image?.uri }}
                        />
                        <View
                            style={[
                                styles.input_container,
                                {
                                    marginBottom: marginBottom, 
                                    justifyContent: 'space-between'
                                }
                            ]}
                        >
                            <View style={styles.sendImgModalTxtContainer}>
                                <TextInput
                                    placeholder="Type Message ..."
                                    placeholderTextColor={'#797C7B'}
                                    value={currentMessage}
                                    onFocus={() => {
                                        setMarginBottom(Platform.OS === 'ios' ? '42%' : '0%');
                                    }}
                                    onBlur={() => {
                                        setMarginBottom('0%');
                                    }}
                                    onChangeText={message => {
                                        setCurrentMessage(message);
                                    }}
                                    style={styles.sendImgModalTxt}
                                />
                            </View>
                            <TouchableOpacity
                                style={styles.send_btn}
                                onPress={() => {
                                    sendImage();
                                }}
                            >
                                <MaterialCommunityIcons
                                    name={'send'}
                                    size={20}
                                    color={'#ffffff'}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <Modal 
                transparent={true} 
                visible={selectionModal} 
                onRequestClose={() => {}}
            >
                <View style={styles.centeredView}>
                    <View style={[styles.modalView, { height: 200 }]}>
                        <View style={styles.modalHeader}>
                            <Pressable
                                style={[
                                    styles.button,
                                    {
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginLeft: 20,
                                    }
                                ]}
                                onPress={() => setSelectionModal(false)}>
                                <Image
                                    style={{height: 25, width: 25}}
                                    source={require('../assets/icons/remove.png')}
                                />
                            </Pressable>
                            <Text style={styles.modalHeaderTxt}>
                                Share Content
                            </Text>
                            <Pressable
                                style={[
                                    styles.button,
                                    {
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }
                                ]}
                            ></Pressable>
                        </View>
                        <Pressable
                            onPress={() => takePhotoFromCamera()}
                            style={styles.selectionModalContainer}
                        >
                            <View style={styles.selectionModalImg}>
                                <Image
                                    source={require('../assets/icons/camera.png')}
                                    style={{ height: 20, width: 20 }}
                                />
                            </View>
                            <Text style={styles.selectionModalTxt}>
                                Take Photo
                            </Text>
                            <View style={styles.selectionModalBlank}></View>
                        </Pressable>
                        <Pressable
                            onPress={() => onClickImagePicker()}
                            style={styles.selectionModalContainer}
                        >
                            <View style={styles.selectionModalImg}>
                                <Image
                                    source={require('../assets/icons/gallery.png')}
                                    style={{ height: 20, width: 20 }}
                                />
                            </View>
                            <Text style={styles.selectionModalTxt}>
                                Photo Gallery
                            </Text>
                            <View style={styles.selectionModalBlank}></View>
                        </Pressable>
                    </View>
                </View>
            </Modal>

            <Modal
                transparent={true}
                visible={lockModal}
                onRequestClose={() => {
                    setLockMedia(!lockModal);
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <View style={styles.modalHeader}>
                            <Pressable
                                style={[
                                    styles.button,
                                    {
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginLeft: 20,
                                    }
                                ]}
                                onPress={() => setLockMedia(!lockModal)}
                            >
                                <Image
                                    style={{ height: 25, width: 25 }}
                                    source={require('../assets/icons/remove.png')}
                                />
                            </Pressable>
                            <Text style={styles.modalHeaderTxt}>
                                Share Content
                            </Text>
                            <Pressable
                                style={[
                                    styles.button,
                                    {
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginLeft: 20,
                                    }
                                ]}
                                onPress={() => setLockMedia(!lockModal)}
                            ></Pressable>
                        </View>
                        <View style={{ marginLeft: 15 }}>
                            <TouchableOpacity
                                onPress={() => {
                                    setLockCoins('90');
                                    setLockModal(false);
                                }}
                                style={styles.lockModalContainer}
                            >
                                <View style={styles.lockModalImg}>
                                    <Image
                                        source={require('../assets/icons/dollar.png')}
                                        style={{ height: 22, aspectRatio: 4 / 4 }}
                                    />
                                </View>
                                <Text style={styles.lockModalTxt}>
                                    Lock for 90 coins
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    setLockCoins('110');
                                    setLockModal(false);
                                }}
                                style={styles.lockModalContainer}
                            >
                                <View style={styles.lockModalImg}>
                                    <Image
                                        source={require('../assets/icons/dollar.png')}
                                        style={{ height: 22, aspectRatio: 4 / 4 }}
                                    />
                                </View>
                                <Text style={styles.lockModalTxt}>
                                    Lock for 110 coins
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    setLockCoins('130');
                                    setLockModal(false);
                                }}
                                style={styles.lockModalContainer}
                            >
                                <View style={styles.lockModalImg}>
                                    <Image
                                        source={require('../assets/icons/dollar.png')}
                                        style={{ height: 22, aspectRatio: 4 / 4 }}
                                    />
                                </View>
                                <Text style={styles.lockModalTxt}>
                                    Lock for 130 coins
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <Modal
                transparent={true}
                visible={shareModal}
                onRequestClose={() => {
                    setShareModal(!shareModal);
                }}>
                <View style={styles.centeredView}>
                    <View style={[styles.modalView, { height: 220 }]}>
                        <View style={styles.modalHeader}>
                            <Pressable
                                style={[
                                    styles.button,
                                    {
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginLeft: 20,
                                    }
                                ]}
                                onPress={() => setShareModal(!shareModal)}
                            >
                                <Image
                                    style={{ height: 25, width: 25 }}
                                    source={require('../assets/icons/remove.png')}
                                />
                            </Pressable>
                            <Text style={styles.modalHeaderTxt}>
                                Share Content
                            </Text>
                            <Pressable
                                style={[
                                    styles.button,
                                    {
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginLeft: 20,
                                    }
                                ]}
                            ></Pressable>
                        </View>
                        <View style={{ marginLeft: 15 }}>
                            <TouchableOpacity
                                onPress={() => {
                                    setShareModal(false);
                                    setLockMedia(true);
                                    setTimeout(() => {
                                        setLockModal(true);
                                    }, 100);
                                }}
                                style={styles.lockModalContainer}
                            >
                                <View style={styles.lockModalImg}>
                                    <MaterialCommunityIcons
                                        name={'camera-enhance-outline'}
                                        size={25}
                                        color={'#797C7B'}
                                    />
                                </View>
                                <Text style={styles.lockModalTxt}>
                                    Locked Photos
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    setShareModal(false);
                                    setLockMedia(true);
                                    setTimeout(() => {
                                        setLockModal(true);
                                    }, 100);
                                }}
                                style={styles.lockModalContainer}
                            >
                                <View style={styles.lockModalImg}>
                                    <MaterialCommunityIcons
                                        name={'play-circle-outline'}
                                        size={25}
                                        color={'#797C7B'}
                                    />
                                </View>
                                <Text style={styles.lockModalTxt}>
                                    Locked Videos
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <Modal
                animationType="fade"
                transparent={true}
                visible={imgModal}
                onRequestClose={() => {
                    setImgModal(!imgModal);
                }}
            >
                <Pressable
                    style={styles.imgModalContainer}
                    onPress={() => setImgModal(!imgModal)}
                >
                    <View style={styles.imgModaImg}>
                        <Image
                            source={{ uri: checkingImage }}
                            style={{ height: '100%', width: '100%', borderRadius: 20 }}
                        />
                    </View>
                </Pressable>
            </Modal>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff'
    },
    card_container: {
        maxWidth: 220,
        borderRadius: 8,
        margin: 10,
    },
    card_media_container: {
        height: 200,
        width: 200,
        borderRadius: 20
    },
    card_locked_media_container: {
        height: '100%',
        width: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        borderRadius: 20,
    },
    card_locked_media_image: {
        height: 200,
        width: 200,
        borderRadius: 20,
        position: 'absolute',
    },
    card_locked_media_txt_container: {
        height: 100,
        width: '90%',
        alignSelf: 'center',
        marginTop: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    card_locked_media_txt: {
        color: 'white',
        fontSize: 12,
        fontFamily: 'Poppins-Medium',
        marginTop: 5,
    },
    card_media_image: {
        height: 200,
        width: 200,
        borderRadius: 20,
        position: 'absolute',
    },
    card_voice_container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 5,
        width: 180,
        paddingTop: 10,
    },
    card_voice_timer: {
        flex: 1,
        backgroundColor: '#e2e2e2',
        marginRight: 10,
    },
    input_container: {
        margin: 10,
        marginBottom: 10,
        height: 50,
        flexDirection: 'row',
        width: '100%',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 20,
        paddingRight: 20,
    },
    input_mic_container: {
        width: '90%',
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    input_voice_container: {
        height: 50,
        width: '85%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F3F6F6',
        borderRadius: 12,
    },
    voice_recording_container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    voice_recording_txt: {
        color: 'black',
        fontSize: 14,
        marginLeft: 20,
    },
    send_btn: {
        padding: 10,
        borderRadius: 50,
        backgroundColor: '#AB4BFF',
    },
    mic_btn: {
        height: 50,
        width: 50,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50,
        backgroundColor: '#AB4BFF',
        marginLeft: 10,
    },
    centeredView: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: 'rgba(45, 45, 45, 0.4)',
    },
    modalView: {
        backgroundColor: 'white',
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
        width: '100%',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 10,
    },
    modalHeaderTxt: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000000',
        marginRight: 40,
        fontFamily: 'Poppins-SemiBold',
    },
    sendImgModalTxtContainer: {
        padding: 5,
        width: '85%',
        height: 40,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#F3F6F6',
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: '#F3F6F6',
        justifyContent: 'space-around',
    },
    sendImgModalTxt: {
        height: 40,
        width: '80%',
        color: '#000000',
        flexGrow: 10,
    },
    sendImgModalImg: {
        height: 300,
        width: '90%',
        borderRadius: 10,
        alignSelf: 'center',
        resizeMode: 'contain',
    },
    selectionModalContainer: {
        width: '100%',
        alignSelf: 'center',
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: '5%',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    selectionModalImg: {
        height: 40,
        width: 40,
        borderRadius: 30,
        backgroundColor: 'rgba(242, 248, 247, 1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    selectionModalTxt: {
        color: 'black',
        fontSize: 14,
        marginLeft: 10,
        fontFamily: 'Poppins-SemiBold',
        width: '70%',
    },
    selectionModalBlank: {
        height: 40,
        width: 40,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    lockModalContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        padding: 20,
    },
    lockModalImg: {
        backgroundColor: '#F2F8F7',
        borderRadius: 50,
        alignItems: 'center',
    },
    lockModalTxt: {
        fontSize: 14,
        color: '#000000',
        marginLeft: 20,
        fontFamily: 'Poppins-SemiBold',
    },
    imgModalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        backgroundColor: '#70707070',
    },
    imgModaImg: {
        backgroundColor: 'white',
        borderRadius: 20,
        height: '40%',
        width: '90%',
        position: 'absolute',
    },
    button: {
        padding: 10,
    },
    input_view: {
        padding: 5,
        width: '75%',
        height: 40,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#F3F6F6',
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: '#F3F6F6',
        justifyContent: 'space-around',
    },
});

export default ChatList;