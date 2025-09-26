import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import tw from "twrnc";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import * as geolib from "geolib";

function ShowroomItem(props) {
  const {item, map, setKho, kho} = props;
  const [distance, setDistance] = useState(0)
  useEffect(() => {
    if (map) {
      setDistance(
        geolib.getDistance({
          latitude: map.lat,
          longitude: map.lng
        }, {
          latitude: item.map_lat,
          longitude: item.map_lng,
        })
      )
    }

  }, [navigator, map])

  return (
    <TouchableOpacity
      onPress={() => setKho(item.id)}
    >
      <View style={tw`flex items-center flex-row py-2`}>
        {Number(kho) === Number(item.id) ?
          <Icon name={"radiobox-marked"} size={18} style={tw`text-blue-500 mr-1`}/>
          :
          <Icon name={"radiobox-blank"} size={18} style={tw`mr-1`} />
        }
        <View>
          <Text style={tw`font-medium mb-1`}>{item.showroomName ? item.showroomName : item.name}</Text>
          <Text style={tw`text-gray-500 text-xs`}>{item.showroomAddress}</Text>
          <Text style={tw`text-gray-500 text-xs`}>{Number(Number(distance)/1000).toFixed(2)} km</Text>
        </View>

      </View>
    </TouchableOpacity>
  );
}

export default ShowroomItem;
