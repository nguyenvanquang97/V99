import React, {useRef, useState} from 'react';
import { Dimensions, Linking, Platform, StyleSheet, TouchableOpacity, View } from "react-native";
import Carousel from 'react-native-reanimated-carousel';
import { Image } from 'react-native';
import tw from 'twrnc';
import ApiConfig from "app/config/api-config";

const {width: screenWidth} = Dimensions.get('window');

function SlideShow(props) {
	const carouselRef = useRef(null);
	const [activeSlide, setActiveSlide] = useState(0);
	
	const renderItem = ({item, index}) => {
		return (
			<TouchableOpacity
				onPress={() => Linking.canOpenURL(item.url).then((supported) => {
					supported && Linking.openURL(item.url)
				})}
				activeOpacity={1}
			>
				<View style={styles.item}>
					<Image
						source={{uri: item.image}}
						style={styles.image}
					/>
				</View>
			</TouchableOpacity>
		);
	};

	const CustomPagination = ({items, activeSlide}) => (
		<View style={tw`absolute bottom-2 left-0 right-0 flex-row justify-center`}>
			{(items || []).map((_, index) => (
				<View
					key={index}
					style={[
						tw`w-2 h-2 rounded-full mx-1`,
						activeSlide === index ? tw`bg-white` : tw`bg-white bg-opacity-50`,
					]}
				/>
			))}
		</View>
	);

	return (
		<View style={[tw`my-5`, styles.container]}>
			<Carousel
				ref={carouselRef}
				width={screenWidth - 50}
				height={200}
				data={props.items || []}
				renderItem={renderItem}
				autoPlay
				autoPlayInterval={3000}
				loop
				onProgressChange={(_, absoluteProgress) =>
					setActiveSlide(Math.round(absoluteProgress))
				}
			/>
			<CustomPagination items={props.items} activeSlide={activeSlide} />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	item: {
		width: screenWidth - 50,
		height: 200,
		backgroundColor: 'white',
		borderRadius: 5,
		marginBottom: Platform.select({ios: 0, android: 1}), // Prevent a random Android rendering issue
	},
	image: {
		width: '100%',
		height: '100%',
		resizeMode: 'contain',
		borderRadius: 5,
	},
});

export default SlideShow;
