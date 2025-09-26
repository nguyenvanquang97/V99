import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, ScrollView, Image, Touchable, TouchableOpacity} from "react-native";
import tw from "twrnc";
import {formatVND} from "app/utils/helper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import apiConfig from "app/config/api-config";
import BuyComboProduct from "./BuyComboProduct";

function ComboProduct(props) {
    const {settings, currentUser} = props;

    const [combos, setCombos] = useState([]);

    const [comboNumber, setComboNumber] = useState(0);
    const [comboPrice, setComboPrice] = useState(0);
    const [discount, setDiscount] = useState({
        amount: 0,
        percent: 0
    });
    const [calc, setCalc] = useState({ subTotal: 0, totalDiscount: 0, vatAmount: 0, price: 0, discountPercent: 0 });

    // Load combos from server (new combo API)
    useEffect(() => {
        async function fetchCombos() {
            try {
                const res = await axios.get(`${apiConfig.BASE_URL}/combos`);
                const list = res.data || [];
                setCombos(list);
                // Do not auto-select any combo
            } catch (e) {}
        }
        fetchCombos();
    }, [])

    // Remove auto calculator; only calculate on buy
    useEffect(() => {
        async function recalc() {
            if (!comboNumber) return;
            const Token = await AsyncStorage.getItem('v99_user_token');
            axios.post(
                `${apiConfig.BASE_URL}/member/order/calculator-combo`,
                { comboId: comboNumber },
                { headers: { Authorization: `Bearer ${Token}` } }
            ).then(res => {
                const c = res.data || {};
                setCalc({
                    subTotal: Number(c.subTotal || 0),
                    totalDiscount: Number(c.totalDiscount || 0),
                    vatAmount: Number(c.vatAmount || 0),
                    price: Number(c.price || 0),
                    discountPercent: Number(c.discountPercent || 0),
                })
                setDiscount({ amount: Number(c.totalDiscount || 0), percent: Number(c.discountPercent || 0) });
                setComboPrice(Number(c.subTotal || 0));
            }).catch(() => {});
        }
        recalc();
    }, [comboNumber])

    const Banner = ({message, style}) => {
        return (
            <Text style={[styles.banner, style]}>
                {message}
            </Text>
        );
    };

    const styles = StyleSheet.create({
        banner: {
            position: 'absolute',
            right: -40,
            top: 5,
            width: 120,
            transform: [{ rotate: "45deg" }],
            backgroundColor: 'black',
            color: 'white',
            padding: 8,
            textAlign: 'center',
        },
    });

    return (
        <View style={tw`overflow-hidden bg-white m-3 rounded-md border border-yellow-200 p-3`}>
            <View style={tw`mb-3`}>
                <Text style={tw`font-bold uppercase`}>Combo sản phẩm</Text>
            </View>
            <View style={tw`mb-5`}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                >
                    {combos && combos.map((el) => (
                        <View
                            style={tw`border w-32 mr-2 rounded-md relative bg-white p-3 ${el.id === comboNumber ? 'border-yellow-500' : 'border-gray-200'}`}
                        >
                            <View style={tw`py-1`}>
                                <Text  style={tw`font-medium`} numberOfLines={2} ellipsizeMode='tail'>Combo {el.id}</Text>
                            </View>
                            <View style={tw`py-1`}>
                                <Text  style={tw`font-medium`} numberOfLines={2} ellipsizeMode='tail'>{formatVND(el.price)}</Text>
                            </View>
                            <View style={tw`mt-2`}>
                                <TouchableOpacity
                                    onPress={() => {
                                        props.navigation.navigate('Modal', {
                                            content: <BuyComboProduct
                                                navigation={props.navigation}
                                                backScreen={'Home'}
                                                comboNumber={el.id}
                                                discount={{ amount: 0, percent: 0 }}
                                                comboPrice={Number(el.price || 0)}
                                            />
                                        })
                                    }}
                                    activeOpacity={1}
                                    style={tw`px-3 py-2 flex items-center rounded bg-blue-500`}
                                >
                                    <Text style={tw`text-white`}>Chọn mua</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
                </ScrollView>
            </View>
            {/* Removed bottom global buy section; buying happens per combo card */}
            <Banner
                message="HOT"
                style={{
                    color: 'black',
                    backgroundColor: 'yellow',
                    fontWeight: 'bold',
                }}
            />
        </View>
    );
}

export default ComboProduct;
