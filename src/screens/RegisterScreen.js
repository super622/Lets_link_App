import React, { useState } from 'react';
import {
    View,
    TouchableOpacity,
    TextInput,
    Pressable,
    Image,
    Modal,
    Dimensions,
    StyleSheet
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Text } from 'react-native-paper';
import { ScrollView } from 'react-native-gesture-handler';
import AntDesign from 'react-native-vector-icons/AntDesign';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import { ALERT_TYPE, Toast } from 'react-native-alert-notification';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import Loader from '../components/Loader';
import { letsLinkAPI } from '../utility/api';
import { useAuthentication } from '../contexts/AuthContexts';
import { theme } from '../assets/theme';

const RegisterScreen = ({ navigation }) => {
    const [showIndicator, setShowIndicator] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [cpassword, setCPassword] = useState('');
    const [gender, setGender] = useState('male');
    const [image, setImage] = useState({});
    const [birthDay, setBirthDay] = useState('');
    const [idCardFront, setIdCardFront] = useState({});
    const [idCardBack, setIdCardBack] = useState({});

    const { setUser } = useAuthentication();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const { height } = Dimensions.get('window');
    const { colors } = theme;

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = date => {
        let newdate = moment(date).format('DD-MM-YYYY');
        setBirthDay(newdate);
        hideDatePicker();
    };

    const onClickImagePicker = async () => {
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
                [{ resize: { width: pickerResult.assets[0].width, height: pickerResult.assets[0].height } }],
                { compress: 1, format: ImageManipulator.SaveFormat.PNG }
            );
            setShowModal(false);
            if (showModal == 'avatar') {
                setImage({
                    ...croppedImage,
                    size: pickerResult.assets[0].fileSize,
                    mime: pickerResult.assets[0].mimeType,
                    modificationDate: new Date().valueOf()
                });
            } else if (showModal == 'front') {
                setIdCardFront({
                    ...croppedImage,
                    size: pickerResult.assets[0].fileSize,
                    mime: pickerResult.assets[0].mimeType,
                    modificationDate: new Date().valueOf()
                });
            } else if (showModal == 'back') {
                setIdCardBack({
                    ...croppedImage,
                    size: pickerResult.assets[0].fileSize,
                    mime: pickerResult.assets[0].mimeType,
                    modificationDate: new Date().valueOf()
                });
            }
        }
    };

    const takePhotoFromCamera = async () => {
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
                [{ resize: { width: pickerResult.assets[0].width, height: pickerResult.assets[0].height } }],
                { compress: 1, format: ImageManipulator.SaveFormat.PNG }
            );
            setShowModal(false);
            if (showModal == 'avatar') {
                setImage({
                    ...croppedImage,
                    size: pickerResult.assets[0].fileSize,
                    mime: pickerResult.assets[0].mimeType,
                    modificationDate: new Date().valueOf()
                });
            } else if (showModal == 'front') {
                setIdCardFront({
                    ...croppedImage,
                    size: pickerResult.assets[0].fileSize,
                    mime: pickerResult.assets[0].mimeType,
                    modificationDate: new Date().valueOf()
                });
            } else if (showModal == 'back') {
                setIdCardBack({
                    ...croppedImage,
                    size: pickerResult.assets[0].fileSize,
                    mime: pickerResult.assets[0].mimeType,
                    modificationDate: new Date().valueOf()
                });
            }
        }
    };

    const calculateAge = (birthDate) => {
        const today = new Date();
        const [day, month, year] = birthDate.split('-').map(Number);
        const birthDateObj = new Date(year, month - 1, day);
        const monthDiff = today.getMonth() - birthDateObj.getMonth();
        let age = today.getFullYear() - birthDateObj.getFullYear();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
            age--;
        }
        return age;
    };

    const handleRegister = () => {
        if (Object.keys(image)?.length === 0) {
            Toast.show({
                type: ALERT_TYPE.DANGER,
                title: 'Error',
                textBody: 'Please Select Profile Image',
                autoClose: 2000,
            });
        } else if (!name) {
            Toast.show({
                type: ALERT_TYPE.DANGER,
                title: 'Error',
                textBody: 'Please Enter UserName',
                autoClose: 2000,
            });
        } else if (!email) {
            Toast.show({
                type: ALERT_TYPE.DANGER,
                title: 'Error',
                textBody: 'Please Enter Email',
                autoClose: 2000,
            });
        } else if (!emailRegex.test(email)) {
            Toast.show({
                type: ALERT_TYPE.DANGER,
                title: 'Error',
                textBody: 'Please Enter a Valid Email',
                autoClose: 2000,
            });
        } else if (!password) {
            Toast.show({
                type: ALERT_TYPE.DANGER,
                title: 'Error',
                textBody: 'Please Enter Password',
                autoClose: 2000,
            });
        } else if (!cpassword) {
            Toast.show({
                type: ALERT_TYPE.DANGER,
                title: 'Error',
                textBody: 'Please Enter Confirm Password',
                autoClose: 2000,
            });
        } else if (cpassword !== password) {
            Toast.show({
                type: ALERT_TYPE.DANGER,
                title: 'Error',
                textBody: 'Both passwords should be same',
                autoClose: 2000,
            });
        } else if (!birthDay) {
            Toast.show({
                type: ALERT_TYPE.DANGER,
                title: 'Error',
                textBody: 'Please Enter Birth Of Day',
                autoClose: 2000,
            });
        } else if (!gender) {
            Toast.show({
                type: ALERT_TYPE.DANGER,
                title: 'Error',
                textBody: 'Please Select Gender',
                autoClose: 2000,
            });
        } else if (gender === 'female' && (Object.keys(idCardFront)?.length === 0 || Object.keys(idCardBack)?.length === 0)) {
            Toast.show({
                type: ALERT_TYPE.DANGER,
                title: 'Error',
                textBody: 'Please Select ID/Driver License',
                autoClose: 2000,
            });
        } else if (calculateAge(birthDay) < 18) {
            Toast.show({
                type: ALERT_TYPE.DANGER,
                title: 'Error',
                textBody: 'You must be at least 18 years old to use this service.',
                autoClose: 2000,
            });
        } else {
            setShowIndicator(true);
            const formdata = new FormData();
            formdata.append('avatars', {
                name: image.uri.split('/').pop(),
                type: image.mime,
                size: image.size,
                uri: image.uri,
                lastModified: image.modificationDate,
                lastModifiedDate: new Date(),
            });

            const header = {
                'content-Type': 'multipart/form-data',
            };

            letsLinkAPI('user/uploadImage', formdata, 'post', header)
                .then(async (res) => {
                    if (res.data.length > 0) {
                        let avatar = res.data[0].url;
                        if (gender == 'male') {
                            const data = {
                                userName: name,
                                email: email,
                                gender: gender,
                                password: password,
                                dateOfBirth: birthDay,
                                image: avatar,
                            };

                            letsLinkAPI('user/register', data, 'post')
                                .then(async (res) => {
                                    setShowIndicator(false);
                                    if (res.data.status == 'success') {
                                        Toast.show({
                                            type: ALERT_TYPE.SUCCESS,
                                            title: 'Success',
                                            textBody: res.data?.message,
                                            autoClose: 2000,
                                        });
                                        setUser(res.data.data);
                                        navigation.navigate('Home');
                                    } else {
                                        Toast.show({
                                            type: ALERT_TYPE.DANGER,
                                            title: 'Error',
                                            textBody: res.data?.message,
                                            autoClose: 2000,
                                        });
                                    }
                                })
                                .catch(async (e) => {
                                    setShowIndicator(false);
                                    Toast.show({
                                        type: ALERT_TYPE.DANGER,
                                        title: 'Error',
                                        textBody: e.response?.data?.message ? e.response?.data?.message : "Network Error",
                                        autoClose: 2000
                                    });
                                });
                        } else {
                            const formdata1 = new FormData();
                            const arrImg = [
                                {
                                    name: idCardFront.uri.split('/').pop(),
                                    type: idCardFront.mime,
                                    size: idCardFront.size,
                                    uri: idCardFront.uri,
                                    lastModified: idCardFront.modificationDate,
                                    lastModifiedDate: new Date(),
                                },
                                {
                                    name: idCardBack.uri.split('/').pop(),
                                    type: idCardBack.mime,
                                    size: idCardBack.size,
                                    uri: idCardBack.uri,
                                    lastModified: idCardBack.modificationDate,
                                    lastModifiedDate: new Date(),
                                }
                            ];

                            arrImg.forEach((file, index) => {
                                formdata1.append('avatars', {
                                    uri: file.uri,
                                    type: file.type,
                                    name: file.name,
                                    size: file.size,
                                    lastModified: file.lastModified,
                                    lastModifiedDate: file.lastModifiedDate
                                });
                            });

                            letsLinkAPI('user/uploadImage', formdata1, 'post', header)
                                .then(async (res) => {
                                    setShowIndicator(false);
                                    if (res.data.length > 0) {
                                        const id_front = res.data[0].url;
                                        const id_back = res.data.length > 1 ? res.data[1].url : '';

                                        const data = {
                                            userName: name,
                                            email: email,
                                            gender: gender,
                                            password: password,
                                            dateOfBirth: birthDay,
                                            image: avatar,
                                            idCard: id_front + ";;" + id_back
                                        };

                                        letsLinkAPI('user/register', data, 'post')
                                            .then(async (res) => {
                                                setShowIndicator(false);
                                                if (res.data.status == "success") {
                                                    Toast.show({
                                                        type: ALERT_TYPE.SUCCESS,
                                                        title: 'Success',
                                                        textBody: res.data?.message,
                                                        autoClose: 2000
                                                    });
                                                    setUser(res.data.data);
                                                    navigation.navigate('Home');
                                                } else {
                                                    Toast.show({
                                                        type: ALERT_TYPE.DANGER,
                                                        title: 'Error',
                                                        textBody: res.data?.message,
                                                        autoClose: 2000
                                                    });
                                                }
                                            })
                                            .catch(async (e) => {
                                                setShowIndicator(false);
                                                Toast.show({
                                                    type: ALERT_TYPE.DANGER,
                                                    title: 'Error',
                                                    textBody: e.response?.data?.message ? e.response?.data?.message : "Network Error",
                                                    autoClose: 2000
                                                })
                                            });
                                    }
                                })
                        }
                    } else {
                        setShowIndicator(false);
                        Toast.show({
                            type: ALERT_TYPE.SUCCESS,
                            title: 'Error',
                            textBody: "Error uploading images",
                            autoClose: 2000
                        });
                    }
                })
                .catch(err => {
                    setShowIndicator(false);
                    Toast.show({
                        type: ALERT_TYPE.DANGER,
                        title: 'Error',
                        textBody: err.response?.data?.message ? err.response?.data?.message : "Network Error",
                        autoClose: 2000
                    });
                });
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView style={styles.background_image_container} contentContainerStyle={{ paddingBottom: 30 }}>
                {showIndicator === true ? <Loader /> : null}
                <View style={styles.auth_heading_View}>
                    <Text variant="titleLarge" style={styles.heading}>
                        Sign up with Email
                    </Text>
                </View>
                <Pressable
                    onPress={() => setShowModal('avatar')}
                    style={{
                        height: 100,
                        width: 100,
                        alignSelf: 'center',
                        borderRadius: 10,
                        marginTop: 20,
                    }}
                >
                    <Image
                        source={
                            Object.keys(image).length > 0
                                ? { uri: image?.uri }
                                : require('../assets/images/dummy.jpeg')
                        }
                        style={styles.avatar}
                    />
                    <View style={[styles.edit_icon_container, { backgroundColor: colors.button_color }]}>
                        <AntDesign name="edit" color={'white'} size={18} />
                    </View>
                </Pressable>
                <View style={{ margin: 20 }}>
                    <Text
                        variant="titleLarge"
                        style={styles.textLabel}
                    >
                        Username
                    </Text>
                    <TextInput
                        value={name}
                        onChangeText={e => setName(e)} // Updated
                        placeholder="@jhon"
                        style={styles.textFeild}
                        placeholderTextColor={colors.placeHolderTextColor}
                    />
                    <Text
                        variant="titleLarge"
                        style={styles.textLabel}
                    >
                        Your email
                    </Text>
                    <TextInput
                        value={email}
                        onChangeText={e => setEmail(e)}
                        placeholder="Jhon@gmail.com"
                        style={styles.textFeild}
                        placeholderTextColor={colors.placeHolderTextColor}
                    />
                    <Text
                        variant="titleLarge"
                        style={styles.textLabel}
                    >
                        Password
                    </Text>
                    <TextInput
                        value={password}
                        onChangeText={e => setPassword(e)}
                        placeholder="***********"
                        style={styles.textFeild}
                        placeholderTextColor={colors.placeHolderTextColor}
                        secureTextEntry={true}
                    />
                    <Text
                        variant="titleLarge"
                        style={styles.textLabel}
                    >
                        Confirm Password
                    </Text>
                    <TextInput
                        value={cpassword}
                        onChangeText={e =>
                            setCPassword(e)
                        }
                        placeholder="***********"
                        style={styles.textFeild}
                        placeholderTextColor={colors.placeHolderTextColor}
                        secureTextEntry={true}
                    />
                    <Text
                        variant="titleLarge"
                        style={styles.genderLabel}
                    >
                        Date of Birth
                    </Text>
                    <Pressable
                        onPress={showDatePicker}
                        style={styles.genderButtonContainer}
                    >
                        <Text style={styles.genderButtonTxt}>
                            {birthDay ? birthDay : "22-08-1991"}
                        </Text>
                    </Pressable>
                    <DateTimePickerModal
                        isVisible={isDatePickerVisible}
                        mode="date"
                        onConfirm={handleConfirm}
                        onCancel={hideDatePicker}
                        date={new Date("1991-08-22")}
                    />
                    <Text
                        variant="titleLarge"
                        style={styles.textLabel}
                    >
                        Gender
                    </Text>
                    <View style={styles.selectBoxContainer}>
                        <View style={styles.selectBox}>
                            <Pressable
                                onPress={() => setGender('male')}
                                style={{
                                    height: 25,
                                    width: 25,
                                    backgroundColor: gender === 'male' ? colors.button_color : 'grey',
                                    borderRadius: 30,
                                }}
                            ></Pressable>
                            <Text
                                style={{
                                    color: gender === 'male' ? colors.button_color : 'grey',
                                    fontSize: 14,
                                    fontFamily: 'Poppins-Regular',
                                    marginLeft: 10,
                                }}
                            >
                                Male
                            </Text>
                        </View>
                        <View style={styles.selectBox}>
                            <Pressable
                                onPress={() => setGender('female')}
                                style={{
                                    height: 25,
                                    width: 25,
                                    backgroundColor: gender === 'female' ? colors.button_color : 'grey',
                                    borderRadius: 30,
                                }}
                            ></Pressable>
                            <Text
                                style={{
                                    color: gender === 'female' ? colors.button_color : 'grey',
                                    fontSize: 14,
                                    fontFamily: 'Poppins-Regular',
                                    marginLeft: 10,
                                }}
                            >
                                Female
                            </Text>
                        </View>
                    </View>
                    {gender === 'female' ? (
                        <>
                            <Text
                                variant="titleLarge"
                                style={styles.DLLabel}
                            >
                                ID/Drivers License (Front)
                            </Text>
                            <Pressable
                                onPress={() => setShowModal('front')}
                            >
                                <View style={[styles.DLUploadContainer, Object.keys(idCardFront).length == 0 ? {} : { height: 200 }]}>
                                    {Object.keys(idCardFront).length === 0 ?
                                        <>
                                            <Text style={styles.DLUploadTxt}>
                                                Please Upload
                                            </Text>
                                            <MaterialCommunityIcons
                                                name={'camera-enhance-outline'}
                                                size={20}
                                                color={'#ffffff'}
                                            />
                                        </> :
                                        <Image
                                            source={{ uri: idCardFront?.uri }}
                                            style={styles.avatar}
                                        />
                                    }
                                </View>
                            </Pressable>
                            <Text
                                variant="titleLarge"
                                style={styles.DLLabel}
                            >
                                ID/Drivers License (Back)
                            </Text>
                            <Pressable
                                onPress={() => setShowModal('back')}
                            >
                                <View style={[styles.DLUploadContainer, Object.keys(idCardBack).length == 0 ? {} : { height: 200 }]}>
                                    {Object.keys(idCardBack).length === 0 ?
                                        <>
                                            <Text style={styles.DLUploadTxt}>
                                                Please Upload
                                            </Text>
                                            <MaterialCommunityIcons
                                                name={'camera-enhance-outline'}
                                                size={20}
                                                color={'#ffffff'}
                                            />
                                        </> :
                                        <Image
                                            source={{ uri: idCardBack?.uri }}
                                            style={styles.avatar}
                                        />
                                    }
                                </View>
                            </Pressable>
                        </>
                    ) : null}
                </View>
                <TouchableOpacity
                    style={[styles.registerButton, { backgroundColor: colors.button_color }]}
                    onPress={() => handleRegister()}
                >
                    <Text style={styles.registerButtonTxt}>
                        Create an account
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.login_now}
                    onPress={() => navigation.navigate('Login')}
                >
                    <Text
                        variant="titleMedium"
                        style={{ color: 'black', fontFamily: 'Poppins-Medium' }}
                    >
                        Already have an account?{' '}<Text style={{ color: theme.colors.button_color, fontFamily: 'Poppins-SemiBold' }}>Login</Text>
                    </Text>
                </TouchableOpacity>
            </ScrollView>
            <Modal
                animationType="fade"
                transparent={true}
                visible={showModal != false}
                onRequestClose={() => {
                    setShowModal(false);
                }}
            >
                <Pressable
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: (height / 100) * 100,
                        backgroundColor: '#70707070',
                    }}
                    onPress={() => setShowModal(false)}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalButtonContainer}>
                            <Pressable onPress={() => takePhotoFromCamera()}>
                                <Image
                                    source={require('../assets/images/camera1.png')}
                                    style={styles.modalButtonImage}
                                    resizeMode={'contain'}
                                />
                            </Pressable>
                            <Text style={styles.modalButtonTxt}>
                                From Camera
                            </Text>
                        </View>
                        <View style={styles.modalButtonContainer}>
                            <Pressable onPress={() => onClickImagePicker()}>
                                <Image
                                    source={require('../assets/images/gallery1.png')}
                                    style={styles.modalButtonImage}
                                    resizeMode={'contain'}
                                />
                            </Pressable>
                            <Text style={styles.modalButtonTxt}>
                                From Gallery
                            </Text>
                        </View>
                    </View>
                </Pressable>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    background_image_container: {
        flex: 1,
        resizeMode: 'contain'
    },
    auth_heading_View: {
        alignSelf: 'center',
        alignItems: 'center',
        paddingTop: 30,
        paddingBottom: 0
    },
    heading: {
        color: '#000000',
        fontSize: 28,
        padding: 6,
        fontFamily: 'Poppins-SemiBold'
    },
    avatar: {
        height: '100%',
        width: '100%',
        borderRadius: 10
    },
    edit_icon_container: {
        height: 30,
        width: 30,
        position: 'absolute',
        right: -5,
        bottom: -5,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10
    },
    textLabel: {
        fontSize: 16,
        color: '#000000',
        padding: 10,
        paddingBottom: 0,
        marginTop: 0,
        fontFamily: 'Poppins-Medium'
    },
    textFeild: {
        height: 50,
        borderRadius: 6,
        borderBottomWidth: 1,
        borderColor: '#E2E4E7',
        color: '#000000',
        padding: 10,
        fontSize: 16,
        fontFamily: 'Poppins-Medium'
    },
    selectBoxContainer: {
        height: 50,
        width: '90%',
        flexDirection: 'row',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    selectBox: {
        height: 40,
        width: '50%',
        flexDirection: 'row',
        alignItems: 'center'
    },
    registerButton: {
        width: '90%',
        height: 55,
        borderRadius: 20,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center'
    },
    registerButtonTxt: {
        color: '#ffffff',
        fontWeight: '600',
        fontSize: 18,
        fontFamily: 'Poppins-Medium'
    },
    login_now: {
        marginTop: 10,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center'
    },
    modalContainer: {
        width: '70%',
        height: 100,
        position: 'absolute',
        paddingHorizontal: 10,
        borderRadius: 10,
        backgroundColor: 'white',
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    modalButtonContainer: {
        height: 100,
        width: '50%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    modalButtonImage: {
        height: 50,
        width: 50
    },
    modalButtonTxt: {
        marginTop: 10,
        fontSize: 12,
        fontFamily: 'Poppins-Regular',
        color: 'black'
    },
    genderLabel: {
        padding: 10,
        paddingBottom: 0,
        marginTop: 0,
        fontSize: 16,
        fontWeight: '500',
        fontFamily: 'Poppins-Medium',
        color: '#000000'
    },
    genderButtonContainer: {
        height: 50,
        padding: 10,
        justifyContent: 'center',
        borderRadius: 6,
        borderBottomWidth: 1,
        borderColor: '#E2E4E7'
    },
    genderButtonTxt: {
        color: '#000000',
        fontSize: 16,
        fontFamily: 'Poppins-Medium'
    },
    DLLabel: {
        padding: 10,
        paddingBottom: 0,
        marginTop: 10,
        fontSize: 16,
        fontFamily: 'Poppins-Medium',
        color: '#000000'
    },
    DLUploadContainer: {
        height: 40,
        padding: 10,
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#B6B6B6',
        borderWidth: 1,
        borderStyle: 'dashed',
        borderRadius: 10
    },
    DLUploadTxt: {
        color: '#000E08',
        fontWeight: '500',
        fontSize: 12,
        fontFamily: 'Poppins-Regular'
    }
});

export default RegisterScreen;
