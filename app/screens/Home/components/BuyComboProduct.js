import React, {useEffect, useState} from 'react';
import {Image, ScrollView, Text, TouchableOpacity, View} from "react-native";
import {useDispatch, useSelector} from "react-redux";
import tw from "twrnc";
import {formatVND} from "app/utils/helper.js";
import InputSpinner from "react-native-input-spinner";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import apiConfig from "app/config/api-config";

function BuyComboProduct(props) {
    const {comboNumber, discount, comboPrice} = props;
    const dispatch = useDispatch();
    const settings = useSelector(state => state.SettingsReducer.options)

    const [products, setProducts] = useState([]);
    const [orderItemArr, setOrderItemArr] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0)
    const [loading, setLoading] = useState(false)

    // Load selected combo items from server and map to UI list
    useEffect(() => {
        async function fetchComboItems() {
            try {
                const res = await axios.get(`${apiConfig.BASE_URL}/combos`);
                const list = res.data || [];
                const selected = list.find(c => Number(c.id) === Number(comboNumber));
                if (selected) {
                    const mapped = (selected.items || []).map(it => ({
                        id: it.productPrice.id,
                        image: it.productPrice.product && it.productPrice.product.featureImage,
                        name: `${it.productPrice.product && it.productPrice.product.name}-${it.productPrice.name}`,
                        price: it.productPrice.price,
                        quantity: it.quantity,
                    }));
                    setProducts(mapped);
                }
            } catch (e) {}
        }
        if (comboNumber) fetchComboItems();
    }, [comboNumber])

    useEffect(() => {
        if (settings && products) {
            let total = 0;
            const itemArr = products.map((el) => {
                total += Number(el.price) * Number(el.quantity)
                return {
                    productPrice: el.id,
                    quantity: el.quantity,
                    price: el.price,
                    total,
                }
            })
            setOrderItemArr(itemArr);
        }
    }, [dispatch, settings, products]);

    function handleChangeQuantity(Item) {
        const currentCart = orderItemArr;
        const index = currentCart.findIndex(item => Number(item.productPrice) === Number(Item.productPrice));
        if (index !== -1) {
            const ItemTotal = Number(Item.quantity) * Number(Item.price)
            const newList = [
                ...currentCart.slice(0, index),
                {...Item, total: ItemTotal},
                ...currentCart.slice(index + 1),
            ];
            setOrderItemArr(newList)
        } else {
            setOrderItemArr(currentCart.concat(Item))
        }
    }

    useEffect(() => {
        let total = 0;
        if (orderItemArr) {
            const abc = orderItemArr.map((el) => {
                total += Number(el.price) * Number(el.quantity)
            })
        }
        setTotalPrice(total);
    }, [orderItemArr])

    async function handleBuyCombo() {
        // Block if total product price exceeds combo price
        if (Number(totalPrice) > Number(comboPrice)) {
            return;
        }
        try {
            setLoading(true)
            const Token = await AsyncStorage.getItem('v99_user_token');
            const res = await axios.post(
                `${apiConfig.BASE_URL}/member/order/calculator-combo`,
                { comboId: comboNumber },
                { headers: { Authorization: `Bearer ${Token}` } }
            );
            console.log('calculator-combo response:', res && res.data);
            const calc = res.data || {};
            const subTotal = Number(calc.subTotal || comboPrice);
            const totalDiscount = Number(calc.totalDiscount || (discount && discount.amount) || 0);
            const vatPercent = Number(settings && settings.vat_percent) || 8;
            const vatAmount = Number.isFinite(Number(calc.vatAmount)) && calc.vatAmount !== null
                ? Number(calc.vatAmount)
                : Math.round((subTotal - totalDiscount) * vatPercent / 100);
            const finalPrice = Number.isFinite(Number(calc.price)) && calc.price !== null
                ? Number(calc.price)
                : (subTotal - totalDiscount + vatAmount);
            const checkoutParams = {
                subTotal,
                totalDiscount,
                discountPercent: Number(calc.discountPercent || (discount && discount.percent) || 0),
                vatAmount,
                price: finalPrice,
                btmReward: Number(calc.btmReward || 0),
                commissionBaseAmount: Number(calc.commissionBaseAmount || 0),
                totalAmount: subTotal - totalDiscount,
                cashAmount: finalPrice,
                pointAmount: 0,
                type: 'Combo',
                orderItemArr,
                comboNumber,
                comboId: comboNumber,
            };
            setLoading(false)
            props.navigation.navigate('CustomerInformation', checkoutParams)
        } catch (e) {
            console.log('calculator-combo error:', e && e.response && e.response.data || e.message);
            setLoading(false)
            props.navigation.navigate('CustomerInformation', {
                subTotal: comboPrice,
                totalAmount: Number(comboPrice) - Number(discount.amount),
                cashAmount: Number(comboPrice) - Number(discount.amount),
                pointAmount: 0,
                totalDiscount: discount && discount.amount,
                discountPercent:discount && discount.percent,
                type: 'Combo',
                orderItemArr,
                comboNumber,
                comboId: comboNumber,
            })
        }
    }

    return (
        <View>
            <View style={tw`flex bg-gray-100 min-h-full content-between`}>

                <View style={tw`bg-white ios:pt-4 android:pt-4 pb-4 flex-row items-center`}>
                    <TouchableOpacity
                        onPress={() => props.navigation.navigate(props.backScreen)}
                        style={tw`mr-3 ml-3`}
                    >
                        <Icon name="close" size={26}/>
                    </TouchableOpacity>
                    <Text style={tw`font-medium uppercase`}>Chọn số lượng sản phẩm</Text>
                </View>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    overScrollMode={'never'}
                    scrollEventThrottle={16}
                >
                    <View style={tw`pb-52 pt-3`}>
                        {products && products.map((item, index) => (
                            <View style={tw`relative rounded mx-3 mb-3 bg-white p-3 shadow`}>
                                <View style={tw`flex flex-row items-center`} key={index}>
                                    <View style={tw`mr-3`}>
                                        <Image
                                            source={{ uri: item.image }}
                                            style={tw`w-26 h-26`}
                                        />
                                    </View>
                                    <View>
                                        <View style={tw`mb-3`}>
                                            <Text
                                                style={tw`font-medium mb-1 mr-26`}
                                                numberOfLines={2}
                                                ellipsizeMode={"tail"}
                                            >
                                                {item.name}
                                            </Text>
                                            <Text
                                                style={tw`font-medium text-red-600`}
                                            >
                                                <Text style={tw`font-medium text-gray-500`}>Đơn giá: </Text>{item.price && formatVND(item.price)}
                                            </Text>
                                        </View>
                                        <InputSpinner
                                            min={0}
                                            step={1}
                                            height={40}
                                            width={140}
                                            style={tw`shadow-none border border-gray-200`}
                                            skin={"square"}
                                            colorMax={"#f04048"}
                                            colorMin={"#cbcbcb"}
                                            value={Number(item.quantity)}
                                            onChange={(num) => {
                                                handleChangeQuantity({ productPrice: item.id, price: item.price, quantity: num })
                                            }}
                                        />

                                    </View>
                                </View>
                            </View>
                        ))}
                    </View>
                </ScrollView>

                <View
                    style={tw`absolute bottom-0 android:bottom-14 bg-white w-full pt-1 pb-5 shadow-lg px-3`}>
                    <View style={tw`mt-2 mb-1`}>
                        <View style={tw`flex flex-row items-center justify-between mb-1`}>
                            <Text>Tổng sản phẩm</Text>
                            <Text
                                style={tw`${Number(totalPrice) > Number(comboPrice) ? 'text-red-500' : 'text-gray-600'} text-base font-medium`}>{formatVND(totalPrice)}</Text>
                        </View>
                    </View>
                    <View style={tw`mb-2`}>
                        <View style={tw`flex flex-row items-center justify-between mb-1`}>
                            <Text style={tw`text-base`}>
                                Tổng tiền
                                {discount.amount > 0 &&
                                    <Text style={tw`text-sm text-red-500 pl-1`}>(-{discount.percent}%)</Text>
                                }
                            </Text>
                            {discount.amount > 0 ?
                                <Text>
                                    <Text style={tw`text-blue-500 text-lg font-bold`}>{formatVND(Number(comboPrice) - Number(discount.amount))}</Text>
                                </Text>
                                :
                                <Text style={tw`text-blue-500 text-lg font-bold`}>{formatVND(comboPrice)}</Text>
                            }

                        </View>
                    </View>
                    <View>
                        <TouchableOpacity
                            disabled={Number(totalPrice) > Number(comboPrice)}
                            style={tw`${Number(totalPrice) > Number(comboPrice) ? 'bg-gray-300' : 'bg-blue-500'} px-5 py-3 rounded w-full flex items-center justify-between`}
                            onPress={() => handleBuyCombo()}
                        >
                            {loading ? <Text style={tw`text-white font-bold uppercase`}>Đang xử lý...</Text> : <Text style={tw`text-white font-bold uppercase`}>đặt hàng</Text>}
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );
}

export default BuyComboProduct;
