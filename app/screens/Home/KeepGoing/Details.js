import React from 'react';
import {Image, ScrollView, Text, TouchableOpacity, View} from "react-native";
import tw from "twrnc";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {formatVND} from "app/utils/helper";
import InputSpinner from "react-native-input-spinner";

function Details(props) {
    const {products, discount, price} = props;
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
                    <Text style={tw`font-medium uppercase`}>Thông tin chương trình</Text>
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
                                                style={tw`font-medium text-red-600 mb-1`}
                                            >
                                                <Text style={tw`font-medium text-gray-500`}>Đơn giá: </Text>{item.price && formatVND(item.price)}
                                            </Text>
                                            <Text
                                                style={tw`font-medium text-red-600`}
                                            >
                                                <Text style={tw`font-medium text-gray-500`}>Số lượng: </Text>{item.quantity}
                                            </Text>
                                        </View>

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
                            <Text>Giá bán</Text>
                            <Text
                                style={tw`text-gray-600 text-base font-medium`}>{formatVND(price)}</Text>
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
                                    <Text style={tw`text-blue-500 text-lg font-bold`}>{formatVND(Number(price) - Number(discount.amount))}</Text>
                                </Text>
                                :
                                <Text style={tw`text-blue-500 text-lg font-bold`}>{formatVND(price)}</Text>
                            }

                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
}

export default Details;
