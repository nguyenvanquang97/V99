import React from "react";
import { Image, Text, View } from "react-native";
import tw from "twrnc";
import { formatDate, formatNumber } from "app/utils/helper";
import Icon from "react-native-vector-icons";

function CustomerItem(props) {
    const {item, settings, navigation} = props
    return (
        <View style={tw`bg-white py-2 mb-1 border-b border-gray-100`}>
            <View style={tw`flex flex-row items-center`}>
                <View style={tw`mr-3 flex items-center`}>
                    {!item.avatar ?
                        <Image source={require('../../assets/images/logo.png')} style={tw`w-12 h-12 object-cover rounded-full border border-gray-100`} />
                        :
                        <Image source={{ uri: item.avatar }} style={tw`w-12 h-12 object-cover rounded-full`} />
                    }
                </View>

                <View>
                    <Text style={tw`font-bold`}>{item.name}</Text>
                    <Text style={tw`text-xs`}>SĐT: <Text style={tw`font-bold text-yellow-500`}>{item.phone}</Text></Text>
                </View>
            </View>
        </View>
    );
}

export default CustomerItem;
