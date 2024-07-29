import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    Image,
    TouchableOpacity,
    Modal,
    Pressable,
} from 'react-native';
import Lightbox from 'react-native-lightbox-v2';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Loader from '../components/Loader';
import { useAuthentication } from '../contexts/AuthContexts';
import { letsLinkAPI } from '../utility/api';
  
const MemberProfileScreen = ({ navigation, route }) => {
    const [reportModalVisible, setReportModalVisible] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [radius, setRadius] = useState(500);
    const [borderWidth, setBorderWidth] = useState(5);
    const [checkingImage, setCheckingImage] = useState('');
    const [height, setHeight] = useState(5);
    const [showIndicator, setShowIndicator] = useState(false);

    const { user } = useAuthentication();
    const data = route?.params?.data;
    const width = Dimensions.get('window').width;

    const createChat = () => {
        setShowIndicator(true);
        letsLinkAPI('user/createChat', { user: user._id, other: data?._id }, "post")
            .then(async(res) => {
                setShowIndicator(false);
                navigation.navigate('Chat', { data: res.data.data });
            })
            .catch(async(e) => {
                setShowIndicator(false);
                console.log(e);
            });
    };

    return (
        <View style={styles.container}>
            {showIndicator === true ? <Loader /> : null}
            <View style={{ height: width / 1.2 }}>
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => {
                            navigation.goBack();
                        }}
                    >
                        <MaterialIcons name={'arrow-back'} size={20} color={'#ffffff'} />
                    </TouchableOpacity>
                    <Text style={styles.heading}>Profile</Text>
                    <TouchableOpacity
                        onPress={() => {
                            setReportModalVisible(true);
                        }}
                        style={styles.menuIconContainer}
                    >
                        <Image
                            source={require('../assets/icons/edit.png')}
                            style={styles.menuIcon}
                        />
                    </TouchableOpacity>
                </View>
                <View>
                    <Lightbox
                        onClose={() => {
                            setRadius(500);
                            setBorderWidth(5);
                        }}
                        onOpen={() => {
                            setBorderWidth(0);
                            setRadius(0);
                        }}
                    >
                        <Image
                            style={{
                            height: 140,
                            width: 140,
                            borderRadius: radius,
                            alignSelf: 'center',
                            borderWidth: borderWidth,
                            borderColor: '#6515AC',
                            marginTop: 10,
                            }}
                            source={{
                            uri: data?.image,
                            // 'https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o='
                            }}
                        />
                    </Lightbox>
                    <Text style={[styles.heading, { alignSelf: 'center', marginTop: 10, fontSize: 20 }]}>
                        {data?.userName}
                    </Text>
                    <Text style={[styles.heading, { alignSelf: 'center', fontSize: 12, color: '#797C7B' }]}>
                        @ {data?.userName}
                    </Text>
                </View>
            </View>
            <View style={styles.imageContainer}>
                <View style={{ width: '90%', alignSelf: 'center' }}>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            overflow: 'hidden',
                        }}
                    >
                        <View style={{ width: '30%' }}>
                            <TouchableOpacity
                                style={styles.cardImg}
                                onPress={() => {
                                    if (data?.profileImages[0]?.url) {
                                        setModalVisible(true);
                                        setCheckingImage(data?.profileImages[0]?.url);
                                    }
                                }}
                            >
                                <Image
                                    style={styles.imageCard}
                                    source={{ uri: data?.profileImages?.length > 0 ? data?.profileImages[0]?.url : null }}
                                />
                            </TouchableOpacity>
                        </View>
                        <View style={{ width: '30%' }}>
                            <TouchableOpacity
                                style={styles.cardImg}
                                onPress={() => {
                                    if (data?.profileImages[1]?.url) {
                                        setModalVisible(true);
                                        setCheckingImage(data?.profileImages[1]?.url);
                                    }
                                }}
                            >
                            <Image
                                style={styles.imageCard}
                                source={{ uri: data?.profileImages?.length > 1 ? data?.profileImages[1]?.url : null,
                                }}
                            />
                            </TouchableOpacity>
                        </View>
                        <View style={{ width: '30%' }}>
                            <TouchableOpacity
                                style={styles.cardImg}
                                onPress={() => {
                                    if (data?.profileImages[2]?.url) {
                                        setModalVisible(true);
                                        setCheckingImage(data?.profileImages[2]?.url);
                                    }
                                }}
                            >
                                <Image
                                    style={styles.imageCard}
                                    source={{ uri: data?.profileImages?.length > 2 ? data?.profileImages[2]?.url : null }}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}
                    >
                        <View style={{ width: '30%' }}>
                            <TouchableOpacity
                                style={styles.cardImg}
                                onPress={() => {
                                    if (data?.profileImages[3]?.url) {
                                        setModalVisible(true);
                                        setCheckingImage(data?.profileImages[3]?.url);
                                    }
                                }}
                            >
                                <Image
                                    style={styles.imageCard}
                                    source={{ uri: data?.profileImages?.length > 3 ? data?.profileImages[3]?.url : null }}
                                />
                            </TouchableOpacity>
                        </View>
                        <View style={{ width: '30%' }}>
                            <TouchableOpacity
                                style={styles.cardImg}
                                onPress={() => {
                                    if (data?.profileImages[4]?.url) {
                                        setModalVisible(true);
                                        setCheckingImage(data?.profileImages[4]?.url);
                                    }
                                }}
                            >
                                <Image
                                    style={styles.imageCard}
                                    source={{ uri: data?.profileImages?.length > 4 ? data?.profileImages[4]?.url : null }}
                                />
                            </TouchableOpacity>
                        </View>
                        <View style={{ width: '30%' }}>
                            <TouchableOpacity
                                style={styles.cardImg}
                                onPress={() => {
                                    if (data?.profileImages[5]?.url) {
                                        setModalVisible(true);
                                        setCheckingImage(data?.profileImages[5]?.url);
                                    }
                                }}
                            >
                                <Image
                                    style={styles.image_card}
                                    source={{ uri: data?.profileImages?.length > 5 ? data?.profileImages[5]?.url : null }}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <TouchableOpacity
                    onPress={() => {
                        createChat();
                    }}
                    style={styles.createChatButtonContainer}
                >
                    <Text style={styles.createChatButtonTxt}>
                        Chat Now
                    </Text>
                </TouchableOpacity>
            </View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={reportModalVisible}
                onRequestClose={() => {
                    setReportModalVisible(!reportModalVisible);
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.reportModalContainer}>
                        <View style={styles.reportModalHeader}>
                            <Pressable
                                style={[styles.reportModalHeaderButton, { marginLeft: 20 }]}
                                onPress={() => setModalVisible(!modalVisible)}
                            >
                                <Image
                                    style={{ height: 25, width: 25 }}
                                    source={require('../assets/icons/remove.png')}
                                />
                            </Pressable>
                            <Text style={styles.reportModalHeaderTxt}>
                                Report
                            </Text>
                            <Pressable style={styles.reportModalHeaderButton}></Pressable>
                        </View>
                        <View style={{ marginLeft: 15 }}>
                            <View style={styles.reportModalItemContainer}>
                                <View style={styles.reportModalImgContainer}>
                                    <Image
                                        source={require('../assets/icons/userBlock.png')}
                                        style={{ height: 20 }}
                                    />
                                </View>
                                <Text style={styles.reportModalItemTxt}>
                                    Report Picture
                                </Text>
                            </View>
                            <View style={styles.reportModalItemContainer}>
                                <View style={styles.reportModalImgContainer}>
                                    <Image
                                        source={require('../assets/icons/block.png')}
                                        style={{ height: 22, aspectRatio: 4 / 4 }}
                                    />
                                </View>
                                <Text style={styles.reportModalItemTxt}>
                                    Block User
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <Pressable
                    style={[styles.modalContainer, { height: (height / 100) * 100 }]}
                    onPress={() => setModalVisible(!modalVisible)}
                >
                    <View style={styles.modalImgContainer}>
                        <Image
                            source={{ uri: checkingImage }}
                            style={styles.modalImage}
                        />
                    </View>
                </Pressable>
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
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignSelf: 'center',
        width: '100%',
        padding: 10,
        marginTop: 20
    },
    heading: {
        fontSize: 18,
        color: '#ffffff',
        fontWeight: '600',
        fontFamily: 'Poppins-SemiBold',
    },
    menuIconContainer: {
        flexDirection: 'row',
        width: 50,
        marginRight: -20,
        alignItems: 'center'
    },
    menuIcon: {
        height: 20,
        marginLeft: 20
    },
    avatar:  {
        height: 140,
        width: 140,
        alignSelf: 'center',
        marginTop: 10,
        borderColor: '#6515AC'
    },
    imageContainer: {
        flex: 1,
        marginTop: 0,
        paddingTop: 20,
        backgroundColor: '#ffffff',
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40
    },
    createChatButtonContainer: {
        position: 'relative',
        bottom: 10,
        width: '75%',
        height: 45,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        borderRadius: 20,
        backgroundColor: '#6515AC',
    },
    createChatButtonTxt: {
        fontSize: 16,
        color: '#ffffff',
        fontWeight: '700',
        fontFamily: 'Poppins-Regular'
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
    },
    centeredView: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    reportModalContainer: {
        width: '100%',
        height: 200,
        backgroundColor: 'white',
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2
        }
    },
    reportModalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 10
    },
    reportModalHeaderTxt: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000000',
        marginRight: 40,
        fontFamily: 'Poppins-SemiBold'
    },
    reportModalHeaderButton: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10
    },
    reportModalItemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        marginTop: 20,
        paddingHorizontal: 10
    },
    reportModalImgContainer: {
        height: 35,
        width: 35,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F2F8F7',
        borderRadius: 50
    },
    reportModalItemTxt: {
        fontSize: 16,
        color: '#000000',
        marginLeft: 20,
        fontFamily: 'Poppins-Medium'
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#707070'
    },
    modalImgContainer: {
        position: 'absolute',
        height: '40%',
        width: '90%',
        backgroundColor: 'white',
        borderRadius: 20
    },
    modalImage: {
        height: '100%',
        width: '100%',
        borderRadius: 20
    }
});

export default MemberProfileScreen;
