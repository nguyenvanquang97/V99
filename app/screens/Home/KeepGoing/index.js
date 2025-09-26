import React, {useEffect, useState} from 'react';
import {Text, TouchableOpacity, View} from "react-native";
import tw from "twrnc";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import moment from "moment";
import BuyComboProduct from "app/screens/Home/components/BuyComboProduct";
import Details from "app/screens/Home/KeepGoing/Details";
import CountDown from 'react-native-countdown-component';

function KeepGoing(props) {
    const {settings, currentUser, navigation} = props;

    const comboPrice = Number(settings && settings.keeping_price);
    const [orderItemArr, setOrderItemArr] = useState([]);

    const discount = {
        percent: Number(settings && settings.keeping_discount_percent),
        amount: Number(comboPrice)*Number(settings && settings.keeping_discount_percent)/100
    }

    let products =  [];
    if (settings) {
        products = JSON.parse(settings && settings.keeping_products)
    }

    const [showButton, setShowButton] = useState(false);

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
    }, [settings]);

    let active = 0;
    const [date, setDate] = useState(null)
    let message = null;
    if (settings) {
        if (Number(settings.keeping_active) === 1) {
            active = 1;

            if (moment().isBefore(moment(settings.keeping_startDate, "DD/MM/YYYY"), 'day')) {
                //date = settings.keeping_startDate;
                message = `Vui lòng chờ đến thời điểm đăng ký duy trì tài khoản hàng tháng!`
            } else {
                message = `Duy trì tài khoản hàng tháng này trước khi thời gian đếm ngược kết thúc!`
                //date = settings.keeping_endDate;
            }
        }
    }



    const [totalDuration, setTotalDuration] = useState(0)

    useEffect(() => {
        if (settings) {
            let datex = null
            if (moment().isBefore(moment(settings.keeping_startDate, "DD/MM/YYYY"), 'day')) {
                setShowButton(false)
                datex = settings.keeping_startDate
            } else if (moment().isAfter(moment(settings.keeping_endDate, "DD/MM/YYYY"), 'day')) {
                setShowButton(false)
            } else {
                datex = settings.keeping_endDate
                setShowButton(true)
            }
            setDate(datex)
            var diffr = moment(datex, "DD/MM/YYYY").diff(moment(), 'seconds')
            setTotalDuration(diffr);
        }
    }, [settings, navigator]);

    function handleBuyKeeping() {
        const checkoutParams = {
            subTotal: comboPrice,
            totalAmount: Number(comboPrice) - Number(discount.amount),
            cashAmount: Number(comboPrice) - Number(discount.amount),
            pointAmount: 0,
            totalDiscount: discount && discount.amount,
            discountPercent:discount && discount.percent,
            type: 'Duy trì',
            orderItemArr,
            comboNumber: 4,
        }
        props.navigation.navigate('CustomerInformation', checkoutParams)
    }

    const [showAll, setShowAll] = useState(true)

    function handleFinish() {
        if (moment().isBefore(moment(settings && settings.keeping_startDate, "DD/MM/YYYY"), 'day')) {
            setShowButton(false)
        } else if (moment().isAfter(moment(settings && settings.keeping_endDate, "DD/MM/YYYY"), 'day')) {
            setShowButton(false)
        } else {
            setShowButton(true)
        }
    }

    return (
        active === 1 && totalDuration > 0 &&
        <View style={tw`overflow-hidden bg-white m-3 rounded-md border border-red-200 p-3`}>
            <View style={tw`mb-3 flex flex-row items-center justify-between`}>
                <Text style={tw`font-bold uppercase`}>Chương trình duy trì tháng {moment().format("MM/YYYY")}</Text>
                <TouchableOpacity
                    onPress={() => props.navigation.navigate('Modal', {
                        content: <Details
                            navigation={props.navigation}
                            backScreen={'Home'}
                            products={products && products}
                            price={comboPrice}
                            discount={discount}
                        />
                    })}
                >
                    <Icon name={"information"} size={20} style={tw`text-blue-400`} />
                </TouchableOpacity>
            </View>
            <View style={tw`mb-3`}>
                <Text>{message}</Text>
            </View>
            <CountDown
                until={totalDuration}
                timetoShow={('H', 'M', 'S')}
                timeLabels={{d: 'Ngày', h: 'Giờ', m: 'Phút', s: 'Giây'}}
                onFinish={() => handleFinish()}
                size={20}
            />
            {showButton &&
                <View style={tw`mt-3`}>
                    <TouchableOpacity
                        style={tw`bg-red-500 px-5 py-2 rounded w-full flex flex-col items-center`}
                        onPress={() => handleBuyKeeping()}
                    >
                        <View style={tw`flex flex-row items-center`}>
                            <Text style={tw`text-white font-bold uppercase`}>Kích hoạt</Text>
                            <Icon name={"arrow-right"} style={tw`text-white ml-2`} />
                        </View>
                    </TouchableOpacity>
                </View>
            }
        </View>
    );
}

export default KeepGoing;
