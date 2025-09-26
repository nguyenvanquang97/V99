import React, {useEffect, useState} from 'react';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import {Dimensions, Text, TouchableOpacity, View, Linking} from "react-native";
import {useSelector} from "react-redux";
import {showMessage} from "react-native-flash-message";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import IconIos from "react-native-vector-icons/Ionicons";
import tw from "twrnc";
import * as Animatable from "react-native-animatable";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const SCREEN_WIDTH = Dimensions.get("window").width;

console.disableYellowBox = true;

function QRScanner(props) {
    const [result, setResult] = useState(null)
    const settings = useSelector(state => state.SettingsReducer.options);

    useEffect(() => {
        props.navigation.setOptions({
            title: 'Quét Mã QR',
            headerStyle: {
                backgroundColor: '#fff',
            },
            headerTintColor: '#000',
            headerLeft: () => (
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => props.navigation.goBack()}>
                    <Icon name="chevron-left"
                          size={32}
                          style={tw`ml-3`}
                    />
                </TouchableOpacity>
            ),
        })
    }, [])

    function onSuccess(res) {
        const url = res.data;
        if (url) {
            props.navigation.navigate('Register', {
                cccdData: url
            })
        } else {
            showMessage({
                message: 'Mã QR không hợp lệ',
                type: 'danger',
                icon: 'danger',
                duration: 3000,
            });
        }
    }

    const overlayColor = "rgba(0,0,0,0.5)"; // this gives us a black color with a 50% transparency

    const rectDimensions = SCREEN_WIDTH * 0.65; // this is equivalent to 255 from a 393 device width
    const rectBorderWidth = SCREEN_WIDTH * 0.005; // this is equivalent to 2 from a 393 device width
    const rectBorderColor = "transparent";

    const scanBarWidth = SCREEN_WIDTH * 0.46; // this is equivalent to 180 from a 393 device width
    const scanBarHeight = SCREEN_WIDTH * 0.0025; //this is equivalent to 1 from a 393 device width
    const scanBarColor = "#c50036";

    const iconScanColor = "white";

    const styles = {
        rectangleContainer: {
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "transparent"
        },

        rectangle: {
            height: rectDimensions,
            width: rectDimensions,
            borderWidth: rectBorderWidth,
            borderColor: rectBorderColor,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "transparent"
        },

        topOverlay: {
            flex: 1,
            height: SCREEN_WIDTH,
            width: SCREEN_WIDTH,
            backgroundColor: overlayColor,
            justifyContent: "center",
            alignItems: "center"
        },

        bottomOverlay: {
            flex: 1,
            height: SCREEN_WIDTH,
            width: SCREEN_WIDTH,
            backgroundColor: overlayColor,
            paddingBottom: SCREEN_WIDTH * 0.25,
            justifyContent: "center",
            alignItems: "center"
        },

        leftAndRightOverlay: {
            height: SCREEN_WIDTH * 0.65,
            width: SCREEN_WIDTH,
            backgroundColor: overlayColor
        },

        scanBar: {
            width: scanBarWidth,
            height: scanBarHeight,
            backgroundColor: scanBarColor
        }
    };

    function makeSlideOutTranslation(translationType, fromValue) {
        return {
            from: {
                [translationType]: SCREEN_WIDTH * -0.18
            },
            to: {
                [translationType]: fromValue
            }
        };
    }

    return (
        <View style={tw`flex bg-white min-h-full content-between`}>
            <QRCodeScanner
                onRead={onSuccess}
                reactivate={true}
                reactivateTimeout={3000}
                cameraType={'back'}
                showMarker={true}
                cameraProps={{captureAudio: false}}
                cameraStyle={{ height: SCREEN_HEIGHT }}
                customMarker={
                    <View style={styles.rectangleContainer}>
                        <View style={styles.topOverlay} />

                        <View style={{ flexDirection: "row" }}>
                            <View style={styles.leftAndRightOverlay} />
                            <View style={styles.rectangle}>
                                <Icon
                                    name="scan-helper"
                                    size={SCREEN_WIDTH * 0.6}
                                    color={iconScanColor}
                                />
                                <Animatable.View
                                    style={styles.scanBar}
                                    direction="alternate-reverse"
                                    iterationCount="infinite"
                                    duration={1700}
                                    easing="linear"
                                    animation={makeSlideOutTranslation(
                                        "translateY",
                                        SCREEN_WIDTH * -0.54
                                    )}
                                />
                            </View>

                            <View style={styles.leftAndRightOverlay} />
                        </View>

                        <View style={styles.bottomOverlay}>
                            <Text style={{ fontSize: 16, color: "white" }}>
                                Hướng Camera Về Mã QR
                            </Text>
                        </View>
                    </View>
                }
            />
        </View>

    );
}

export default QRScanner;
