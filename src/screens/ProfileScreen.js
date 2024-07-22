import React, { useState } from 'react';
import {
    Text,
    View,
    Dimensions,
    Image,
    FlatList,
    TouchableOpacity,
    Modal,
    Pressable,
    StyleSheet,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Lightbox from 'react-native-lightbox-v2';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import { ALERT_TYPE, Toast } from 'react-native-alert-notification';
import { useFocusEffect } from '@react-navigation/native';
import Loader from '../components/Loader';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { useAuthentication } from '../contexts/AuthContexts';
import { letsLinkAPI } from '../utility/api';

const ProfileScreen = ({ navigation }) => {
    const [showIndicator, setShowIndicator] = useState(false);
    const [uploadImages, setUploadImages] = useState([]);
    const [imageUpload, setImageUpload] = useState([]);
    const [radius, setRadius] = useState(500);
    const [borderWidth, setBorderWidth] = useState(5);
    const [height, setHeight] = useState(140);
    const [image, setImage] = useState({});
    const [image1, setImage1] = useState('');
    const [image2, setImage2] = useState('');
    const [image3, setImage3] = useState('');
    const [image4, setImage4] = useState('');
    const [image5, setImage5] = useState('');
    const [image6, setImage6] = useState('');
    const [showSelectionModal, setShowSelectionModal] = useState(false);
    const [showImgModal, setShowImgModal] = useState(false);
    const [checkingImage, setCheckingImage] = useState('');
    const [active, setActive] = useState(false);

    const { user, setUser } = useAuthentication();
    const imagePlaceHolder = 'https://t3.ftcdn.net/jpg/03/45/05/92/360_F_345059232_CPieT8RIWOUk4JqBkkWkIETYAkmz2b75.jpg';
    const windowWidth = Dimensions.get('window').width;
  
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
            setShowSelectionModal(false);
            if (showSelectionModal == 'avatar') {
                setImage({
                    ...croppedImage,
                    size: pickerResult.assets[0].fileSize,
                    mime: pickerResult.assets[0].mimeType,
                    modificationDate: new Date().valueOf()
                });
            } else if (showSelectionModal == 1) {
                setImage1({
                    ...croppedImage,
                    size: pickerResult.assets[0].fileSize,
                    mime: pickerResult.assets[0].mimeType,
                    modificationDate: new Date().valueOf()
                });
            } else if (showSelectionModal == 2) {
                setImage2({
                    ...croppedImage,
                    size: pickerResult.assets[0].fileSize,
                    mime: pickerResult.assets[0].mimeType,
                    modificationDate: new Date().valueOf()
                });
            } else if (showSelectionModal == 3) {
                setImage3({
                    ...croppedImage,
                    size: pickerResult.assets[0].fileSize,
                    mime: pickerResult.assets[0].mimeType,
                    modificationDate: new Date().valueOf()
                });
            } else if (showSelectionModal == 4) {
                setImage4({
                    ...croppedImage,
                    size: pickerResult.assets[0].fileSize,
                    mime: pickerResult.assets[0].mimeType,
                    modificationDate: new Date().valueOf()
                });
            } else if (showSelectionModal == 5) {
                setImage5({
                    ...croppedImage,
                    size: pickerResult.assets[0].fileSize,
                    mime: pickerResult.assets[0].mimeType,
                    modificationDate: new Date().valueOf()
                });
            } else if (showSelectionModal == 6) {
                setImage6({
                    ...croppedImage,
                    size: pickerResult.assets[0].fileSize,
                    mime: pickerResult.assets[0].mimeType,
                    modificationDate: new Date().valueOf()
                });
            }

            if (typeof showSelectionModal == 'number') {
                setImageUpload((pre) => {
                    if (!pre.includes(showSelectionModal)) {
                        return [...pre, showSelectionModal];
                    }
                    return pre;
                });
            }
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
            setShowSelectionModal(false);
            if (showSelectionModal == 'avatar') {
                setImage({
                    ...croppedImage,
                    size: pickerResult.assets[0].fileSize,
                    mime: pickerResult.assets[0].mimeType,
                    modificationDate: new Date().valueOf()
                });
            } else if (showSelectionModal == 1) {
                setImage1({
                    ...croppedImage,
                    size: pickerResult.assets[0].fileSize,
                    mime: pickerResult.assets[0].mimeType,
                    modificationDate: new Date().valueOf()
                });
            } else if (showSelectionModal == 2) {
                setImage2({
                    ...croppedImage,
                    size: pickerResult.assets[0].fileSize,
                    mime: pickerResult.assets[0].mimeType,
                    modificationDate: new Date().valueOf()
                });
            } else if (showSelectionModal == 3) {
                setImage3({
                    ...croppedImage,
                    size: pickerResult.assets[0].fileSize,
                    mime: pickerResult.assets[0].mimeType,
                    modificationDate: new Date().valueOf()
                });
            } else if (showSelectionModal == 4) {
                setImage4({
                    ...croppedImage,
                    size: pickerResult.assets[0].fileSize,
                    mime: pickerResult.assets[0].mimeType,
                    modificationDate: new Date().valueOf()
                });
            } else if (showSelectionModal == 5) {
                setImage5({
                    ...croppedImage,
                    size: pickerResult.assets[0].fileSize,
                    mime: pickerResult.assets[0].mimeType,
                    modificationDate: new Date().valueOf()
                });
            } else if (showSelectionModal == 6) {
                setImage6({
                    ...croppedImage,
                    size: pickerResult.assets[0].fileSize,
                    mime: pickerResult.assets[0].mimeType,
                    modificationDate: new Date().valueOf()
                });
            }

            if (typeof showSelectionModal == 'number') {
                setImageUpload((pre) => {
                    if (!pre.includes(showSelectionModal)) {
                        return [...pre, showSelectionModal];
                    }
                    return pre;
                });
            }
        }
    };

    const handleRemove = (type) => {
        let newArray = imageUpload.filter(element => element !== type);
        let newArray1 = uploadImages.filter((element, idx) => idx + 1 !== type);

        setImageUpload(newArray);
        setUploadImages(newArray1);

        switch(type) {
            case 1:
                setImage1('');
                break;
            case 2:
                setImage2('');
                break;
            case 3:
                setImage3('');
                break;
            case 4:
                setImage4('');
                break;
            case 5:
                setImage5('');
                break;
            case 6:
                setImage6('');
                break;
            case 0:
                setImage1('');
                setImage2('');
                setImage3('');
                setImage4('');
                setImage5('');
                setImage6('');
                break;
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            setUploadImages([]);
            handleRemove(0);
            getImages();
        }, []),
    );

    const getImages = () => {
        letsLinkAPI(`user/get/${user?._id}`, {}, 'get')
            .then(async(res) => {
                if (res.data.status == "success") {
                    if (res.data?.data?.profileImages?.length > 0) {
                        setUploadImages(re.data?.data?.profileImages);
                        for (let i = 0; i < res.data?.data?.profileImages.length; i ++) {
                            setImageUpload((pre) => {
                                if (!pre.includes(i + 1)) {
                                    return [...pre, i + 1];
                                }
                                return pre;
                            });
                        }

                        if (res.data?.data?.profileImages.length > 0) {
                            setImage1(res.data.data.profileImages[0].url);
                        }
                        if (res.data?.data?.profileImages.length > 1) {
                            setImage2(res.data.data.profileImages[1].url);
                        }
                        if (res.data?.data?.profileImages.length > 2) {
                            setImage3(res.data.data.profileImages[2].url);
                        }
                        if (res.data?.data?.profileImages.length > 3) {
                            setImage4(res.data.data.profileImages[3].url);
                        }
                        if (res.data?.data?.profileImages.length > 4) {
                            setImage5(res.data.data.profileImages[4].url);
                        }
                        if (res.data?.data?.profileImages.length > 5) {
                            setImage6(res.data.data.profileImages[5].url);
                        }
                    } else {
                        setUploadImages([]);
                    }
                }
            })
            .catch(async(e) => {
                console.log(e);
            });
    };
  
    const profileUpdate = () => {
        if (imageUpload?.length === 0) {
            Toast.show({
                type: ALERT_TYPE.SUCCESS,
                title: 'Error',
                textBody: 'Please Select Images',
                autoClose: 2000,
            });
        } else {
            setShowIndicator(true);
            let formdata = new FormData();
            const imgMap = {
                1: image1,
                2: image2,
                3: image3,
                4: image4,
                5: image5,
                6: image6
            };

            imageUpload.forEach(type => {
                let imgData = imgMap[type];
                formdata.append('avatars', {
                    name: imgData.uri.split('/').pop(),
                    type: imgData.mime,
                    size: imgData.size,
                    uri: imgData.uri,
                    lastModified: imgData.modificationDate,
                    lastModifiedDate: new Date(),
                });
            });

            if (formdata?._parts.length > 0) {
                const header = {
                    'Content-Type': 'multipart/form-data'
                };

                letsLinkAPI('user/uploadImage', formdata, 'post', header)
                    .then(async(res) => {
                        if (res.data.length > 0) {
                            if (uploadImages.length > 0) {
                                const data = {
                                    profileImages: [...uploadImages, ...res.data]
                                };

                                letsLinkAPI(`user/update/${user?._id}`, data, 'put')
                                    .then(async(res) => {
                                        setShowIndicator(false);
                                        if (res.data.status == 'success') {
                                            Toast.show({
                                                type: ALERT_TYPE.SUCCESS,
                                                title: 'Success',
                                                textBody: res.data?.message,
                                                autoClose: 2000
                                            });
                                            handleRemove(0);
                                            getImages();
                                        } else {
                                            Toast.show({
                                                type: ALERT_TYPE.DANGER,
                                                title: 'Error',
                                                textBody: res.data?.message,
                                                autoClose: 2000
                                            });
                                        }
                                    })
                                    .catch(async(e) => {
                                        setShowIndicator(false);
                                        Toast.show({
                                            type: ALERT_TYPE.DANGER,
                                            title: 'Error',
                                            textBody: 'Network Error',
                                            autoClose: 2000
                                        });
                                    });
                            } else {
                                const data1 = {
                                    profileImages: res.data
                                };

                                letsLinkAPI(`user/update/${user?._id}`, data1, 'put')
                                    .then(async(res) => {
                                        setShowIndicator(false);
                                        if (res.data.status == 'success') {
                                            Toast.show({
                                                type: ALERT_TYPE.SUCCESS,
                                                title: 'Success',
                                                textBody: res.data?.message,
                                                autoClose: 2000
                                            });
                                            handleRemove(0);
                                            getImages();
                                        } else {
                                            Toast.show({
                                                type: ALERT_TYPE.DANGER,
                                                title: 'Error',
                                                textBody: res.data?.message,
                                                autoClose: 2000
                                            });
                                        }
                                    })
                                    .catch(async(e) => {
                                        setShowIndicator(false);
                                        Toast.show({
                                            type: ALERT_TYPE.DANGER,
                                            title: 'Error',
                                            textBody: 'Network Error',
                                            autoClose: 2000
                                        });
                                    });
                            }
                        } else {
                            Toast.show({
                                type: ALERT_TYPE.DANGER,
                                title: 'Error',
                                textBody: res.data?.message,
                                autoClose: 2000
                            });
                        }
                    })
                    .catch(async(e) => {
                        setShowIndicator(false);
                        Toast.show({
                            type: ALERT_TYPE.DANGER,
                            title: 'Error',
                            textBody: 'Network Error',
                            autoClose: 2000
                        });
                    });
            } else {
                const data3 = {
                    profileImages: uploadImages
                };

                letsLinkAPI(`user/update/${user?._id}`, data3, 'put')
                    .then(async(res) => {
                        setShowIndicator(false);
                        if (res.data.status == 'success') {
                            Toast.show({
                                type: ALERT_TYPE.SUCCESS,
                                title: 'Success',
                                textBody: res.data?.message,
                                autoClose: 2000
                            });
                            handleRemove(0);
                            getImages();
                        } else {
                            Toast.show({
                                type: ALERT_TYPE.DANGER,
                                title: 'Error',
                                textBody: res.data?.message,
                                autoClose: 2000
                            });
                        }
                    })
                    .catch(async(e) => {
                        setShowIndicator(false);
                        Toast.show({
                            type: ALERT_TYPE.DANGER,
                            title: 'Error',
                            textBody: 'Network Error',
                            autoClose: 2000
                        });
                    });
            }
        }
    };

    const avatarUpdate = () => {
        if (Object.keys(image)?.length === 0) {
            Toast.show({
                type: ALERT_TYPE.SUCCESS,
                title: 'Error',
                textBody: 'Please Select Profile Image',
                autoClose: 2000,
            });
        } else {
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
                    if (res.data.length > 0) {
                        const data = {
                            image: res.data[0].url
                        };

                        letsLinkAPI(`user/update/${user?._id}`, data, 'put')
                            .then(async(res) => {
                                setShowIndicator(false);
                                if (res.data.status == 'success') {
                                    setUser(res.data.data);
                                    setImage({});
                                } else {
                                    Toast.show({
                                        type: ALERT_TYPE.SUCCESS,
                                        title: 'Error',
                                        textBody: res.data?.message,
                                        autoClose: 2000
                                    });
                                }
                            })
                            .catch(async(e) => {
                                setShowIndicator(false);
                                Toast.show({
                                    type: ALERT_TYPE.SUCCESS,
                                    title: 'Error',
                                    textBody: 'Network Error',
                                    autoClose: 2000
                                });
                            });
                    } else {
                        setShowIndicator(false);
                        Toast.show({
                            type: ALERT_TYPE.DANGER,
                            title: 'Failure',
                            textBody: '',
                            autoClose: 2000
                        });
                    }
                })
                .catch(async(e) => {
                    setShowIndicator(false);
                    Toast.show({
                        type: ALERT_TYPE.SUCCESS,
                        title: 'Error',
                        textBody: 'Network Error',
                        autoClose: 2000
                    });
                });
        }
    };

    return (
        <View style={styles.container}>
            {showIndicator === true ? <Loader /> : null}
            <View style={{ height: windowWidth / 1.2 }}>
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => {
                            navigation.navigate('setting');
                        }}
                    >
                        <Ionicons name="settings-outline" color={'white'} size={24} />
                    </TouchableOpacity>
                    <Pressable
                        onPress={() => navigation.navigate('Package')}
                        style={{ flexDirection: 'row' }}
                    >
                        <Image
                            source={require('../../assets/icons/coin.png')}
                            style={styles.logo}
                        />
                        <View>
                            <Text style={[styles.heading, { fontSize: 14 }]}>
                                {user?.coins ? user?.coins : '0'}
                            </Text>
                            <Text style={[styles.heading, { fontSize: 14 }]}>Coins</Text>
                        </View>
                    </Pressable>
                </View>
                <View>
                    <Lightbox
                        onClose={() => {
                            setRadius(500);
                            setBorderWidth(5);
                            setHeight(140);
                        }}
                        onOpen={() => {
                            setRadius(0);
                            setBorderWidth(0);
                            setHeight(400);
                        }}
                    >
                        <Image
                            style={[styles.avatar, { borderRadius: radius, borderWidth: borderWidth }]}
                            source={{ uri: Object?.keys(image)?.length > 0 ? image?.path : user?.image }}
                        />
                    </Lightbox>
                    {Object?.keys(image).length > 0 ? (
                        <Pressable
                            onPress={() => avatarUpdate()}
                            style={styles.avatarEditIcon}
                        >
                            <Entypo name="check" size={24} color={'#AB4BFF'} />
                        </Pressable>
                    ) : (
                        <Pressable
                            onPress={() => setShowSelectionModal('avatar')}
                            style={styles.avatarEditIcon}>
                            <MaterialCommunityIcons
                                name={'pencil-outline'}
                                size={24}
                                color={'#AB4BFF'}
                            />
                        </Pressable>
                    )}
                    <Text style={[styles.heading, { alignSelf: 'center', fontSize: 20, textTransform: 'capitalize' }]}>
                        {user?.userName}
                    </Text>
                    <Text style={[styles.heading, { alignSelf: 'center', fontSize: 12, color: '#797C7B' }]}>
                        @{userdata?.userName}
                    </Text>
                </View>
            </View>
            <View style={styles.profileContainer}>
                <View style={styles.profileHeader}>
                    <Pressable
                        onPress={() => setActive(!active)}
                        style={styles.profileHeaderIcon}
                    >
                        <MaterialCommunityIcons
                            name={'pencil-outline'}
                            size={24}
                            color={'#AB4BFF'}
                        />
                    </Pressable>
                </View>

                {active ? (
                    <View style={styles.profileBodyContainer}>
                        <View style={[styles.profileBodyItem, { overflow: 'hidden' }]}>
                            <View style={{ width: '30%' }}>
                                <TouchableOpacity
                                    style={styles.cardImg}
                                    onPress={() => setShowSelectionModal(1)}
                                >
                                    <Image
                                        style={styles.imageCard}
                                        source={{ uri: image1 ? image1.uri ? image1.uri : image1 : imagePlaceHolder }}
                                    />
                                </TouchableOpacity>
                                {image1 ? (
                                    <Entypo
                                        name="circle-with-cross"
                                        color="red"
                                        size={22}
                                        onPress={() => handleRemove(1)}
                                        style={{ position: 'absolute', top: 1, right: -5 }}
                                    />
                                ) : null}
                            </View>
                            <View style={{ width: '30%' }}>
                                <TouchableOpacity
                                    style={styles.cardImg}
                                    onPress={() => setShowSelectionModal(2)}
                                >
                                    <Image
                                        style={styles.imageCard}
                                        source={{ uri: image2 ? image2.uri ? image2.uri : image2 : imagePlaceHolder }}
                                    />
                                </TouchableOpacity>
            
                                {image2 ? (
                                    <Entypo
                                        name="circle-with-cross"
                                        color="red"
                                        size={22}
                                        onPress={() => handleRemove(2)}
                                        style={{ position: 'absolute', top: 1, right: -5 }}
                                    />
                                ) : null}
                            </View>
                            <View style={{ width: '30%' }}>
                                <TouchableOpacity
                                    style={styles.cardImg}
                                    onPress={() => setShowSelectionModal(3)}
                                >
                                    <Image
                                        style={styles.imageCard}
                                        source={{ uri: image3 ? image3.uri ? image3.uri : image3 : imagePlaceHolder }}
                                    />
                                </TouchableOpacity>
            
                                {image2 ? (
                                    <Entypo
                                        name="circle-with-cross"
                                        color="red"
                                        size={22}
                                        onPress={() => handleRemove(3)}
                                        style={{ position: 'absolute', top: 1, right: -5 }}
                                    />
                                ) : null}
                            </View>
                        </View>
                        <View style={styles.profileBodyItem}>
                            <View style={{ width: '30%' }}>
                                <TouchableOpacity
                                    style={styles.cardImg}
                                    onPress={() => setShowSelectionModal(4)}
                                >
                                    <Image
                                        style={styles.imageCard}
                                        source={{ uri: image4 ? image4.uri ? image4.uri : image4 : imagePlaceHolder }}
                                    />
                                </TouchableOpacity>
            
                                {image4 ? (
                                    <Entypo
                                        name="circle-with-cross"
                                        color="red"
                                        size={22}
                                        onPress={() => handleRemove(4)}
                                        style={{ position: 'absolute', top: 1, right: -5 }}
                                    />
                                ) : null}
                            </View>
                            <View style={{ width: '30%' }}>
                                <TouchableOpacity
                                    style={styles.cardImg}
                                    onPress={() => setShowSelectionModal(5)}
                                >
                                    <Image
                                        style={styles.imageCard}
                                        source={{ uri: image5 ? image5.uri ? image5.uri : image5 : imagePlaceHolder }}
                                    />
                                </TouchableOpacity>
            
                                {image5 ? (
                                    <Entypo
                                        name="circle-with-cross"
                                        color="red"
                                        size={22}
                                        onPress={() => handleRemove(5)}
                                        style={{ position: 'absolute', top: 1, right: -5 }}
                                    />
                                ) : null}
                            </View>
                            <View style={{ width: '30%' }}>
                                <TouchableOpacity
                                    style={styles.cardImg}
                                    onPress={() => setShowSelectionModal(6)}
                                >
                                    <Image
                                        style={styles.imageCard}
                                        source={{ uri: image6 ? image6.uri ? image6.uri : image6 : imagePlaceHolder }}
                                    />
                                </TouchableOpacity>
            
                                {image6 ? (
                                    <Entypo
                                        name="circle-with-cross"
                                        color="red"
                                        size={22}
                                        onPress={() => handleRemove(6)}
                                        style={{ position: 'absolute', top: 1, right: -5 }}
                                    />
                                ) : null}
                            </View>
                        </View>
                    </View>
                ) : (
                    <View style={styles.profileBody}>
                        <FlatList
                            data={uploadImages}
                            numColumns={3}
                            columnWrapperStyle={{ justifyContent: 'space-between' }}
                            renderItem={data => {
                                return (
                                    <TouchableOpacity
                                        style={styles.cardImg}
                                        onPress={() => {
                                            setShowImgModal(true);
                                            setCheckingImage(data?.item?.url);
                                        }}
                                    >
                                        <Image
                                            style={styles.imageCard}
                                            source={{ uri: data?.item?.url }}
                                        />
                                    </TouchableOpacity>
                                );
                            }}
                        />
                    </View>
                )}
    
                {imageUpload?.length > 0 && active && (
                    <TouchableOpacity
                        onPress={() => profileUpdate()}
                        style={styles.updateButton}
                    >
                        <Text style={styles.updateButtonTxt}>
                            Update Profile
                        </Text>
                    </TouchableOpacity>
                )}

                {user?.gender === 'male' ? (
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Package')}
                        style={styles.updateButton}
                    >
                        <Text style={styles.updateButtonTxt}>
                            Buy Coins
                        </Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Payout')}
                        style={styles.updateButton}
                    >
                        <Text style={styles.updateButtonTxt}>
                            Request Payout
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
            <Modal
                animationType="fade"
                transparent={true}
                visible={showSelectionModal}
                onRequestClose={() => {
                    setShowSelectionModal(false);
                }}
            >
                <Pressable
                    style={[styles.imageShowModalContainer, { height: (height / 100) * 100 }]}
                    onPress={() => setShowSelectionModal(false)}
                >
                    <View style={styles.uploadSelectionModalContainer}>
                        <View style={styles.uploadSelectionModalItems}>
                            <Pressable onPress={() => takePhotoFromCamera()}>
                                <Image
                                    source={require('../assets/images/camera1.png')}
                                    style={{ height: 50, width: 50 }}
                                    resizeMode={'contain'}
                                />
                            </Pressable>
                            <Text style={styles.uploadSelectionModalTxt}>
                                From Camera
                            </Text>
                        </View>
                        <View style={styles.uploadSelectionModalItems}>
                            <Pressable onPress={() => onClickImagePicker()}>
                                <Image
                                    source={require('../assets/images/gallery1.png')}
                                    style={{ height: 50, width: 50 }}
                                    resizeMode={'contain'}
                                />
                            </Pressable>
                            <Text style={styles.uploadSelectionModalTxt}>
                                From Gallery
                            </Text>
                        </View>
                    </View>
                </Pressable>
            </Modal>
            <Modal
                animationType="fade"
                transparent={true}
                visible={showImgModal}
                onRequestClose={() => {
                    setShowImgModal(!showImgModal);
                }}
            >
                <Pressable
                    style={[styles.imageShowModalContainer, { height: (height / 100) * 100 }]}
                    onPress={() => setShowImgModal(!showImgModal)}
                >
                    <View style={styles.imageShowModalBody}>
                        <Image
                            source={{ uri: checkingImage }}
                            style={styles.imageShowModalImg}
                        />
                        <Pressable
                            style={styles.imageShowModalIcon}
                            onPress={() => {
                                setShowImgModal(false);
                                setCheckingImage('');
                            }}
                        >
                            <Entypo name="circle-with-cross" color={'red'} size={28} />
                        </Pressable>
                    </View>
                </Pressable>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginBottom: '15%',
        backgroundColor: '#000000'
    },
    header: {
      justifyContent: 'space-between',
      flexDirection: 'row',
      alignSelf: 'center',
      width: '100%',
      padding: 10,
      paddingHorizontal: '5%',
      marginTop: 20
    },
    heading: {
      fontSize: 18,
      color: '#ffffff',
      fontWeight: '600',
      fontFamily: 'Poppins-Medium',
    },
    logo: {
        width: 20,
        height: 40,
        marginRight: 10,
    },
    avatar: {
        height: 140,
        width: 140,
        alignSelf: 'center',
        top: -10,
        borderColor: '#6515AC'
    },
    avatarEditIcon: {
        alignSelf: 'center',
        marginTop: -40,
        marginRight: '-20%',
        backgroundColor: '#ffffff',
        borderRadius: 50,
        padding: 4,
        borderWidth: 2,
        borderColor: '#AB4BFF'
    },
    cardImg: {
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        borderRadius: 100,
        height: 60,
        alignSelf: 'center',
        marginBottom: 20,
        marginTop: 30,
        padding: 10,
    },
    imageCard: {
        width: 100,
        borderRadius: 20,
        height: 100,
        alignSelf: 'center',
        borderWidth: 0.2,
    },
    profileContainer: {
        marginTop: 0,
        backgroundColor: '#ffffff',
        flex: 1,
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        paddingTop: 20
    },
    profileHeader: {
        width: '85%',
        alignSelf: 'center',
        alignItems: 'flex-end'
    },
    profileHeaderIcon: {
        height: 35,
        width: 35,
        marginTop: -10,
        backgroundColor: '#ffffff',
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#Ab4BFF'
    },
    profileBodyContainer: {
        width: '90%',
        alignSelf: 'center'
    },
    profileBodyItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    updateButton: {
        position: 'relative',
        width: '75%',
        height: 45,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        marginTop: 30,
        borderRadius: 20,
        backgroundColor: '#6515AC'
    },
    updateButtonTxt: {
        fontSize: 16,
        fontWeight: '700',
        fontFamily: 'Poppins-Regular',
        color: '#ffffff'
    },
    imageShowModalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#707070'
    },
    imageShowModalBody: {
        position: 'absolute',
        width: '90%',
        height: '100%',
        backgroundColor: 'white',
        borderRadius: 20
    },
    imageShowModalImg: {
        width: '100%',
        height: '100%',
        borderRadius: 20
    },
    imageShowModalIcon: {
        position: 'absolute',
        top: -10,
        right: -5
    },
    uploadSelectionModalContainer: {
        position: 'absolute',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 100,
        width: '70%',
        paddingHorizontal: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        backgroundColor: 'white',
        borderRadius: 10,
    },
    uploadSelectionModalItems: {
        height: 100,
        width: '50%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    uploadSelectionModalTxt: {
        fontSize: 12,
        fontFamily: 'Poppins-Regular',
        marginTop: 10,
        color: 'black'
    }
});

export default ProfileScreen;
