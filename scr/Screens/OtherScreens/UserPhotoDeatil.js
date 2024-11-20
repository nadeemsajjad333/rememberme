import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  ImageBackground,
  FlatList,
  Dimensions,
  StyleSheet,
} from 'react-native';
import React, {useState} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {ImagesCom} from '../../constant/images';
import {Colors} from '../../constant/colors';
import Button from '../../constant/button';
import Carousel from 'react-native-snap-carousel';
import {Pagination} from 'react-native-snap-carousel';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Stylsheet from '../../constant/Stylsheet';
import ReadMore from '@fawazahmed/react-native-read-more';

const {width} = Dimensions.get('window');
const descrip =
  "oligosaccharides), medical food, bottled water, breakfast cereals,coffee and tea, confectionery, dairy products, ice cream, frozenfood, pet foods, and snacks. Twenty-nine of Nestlé's brands haannual sales of over 1 billion CHF (about US$1.1 billion)[13]including Nespresso, Nescafé, Kit Kat, Smarties, Nesquik,Stouffer's, Vittel, and Maggi. Nestlé has 447 factories, operates in 189 countries, and employs around 339,000 people.[14] It is one of the main shareholders of L'Oreal, the world's largest cosmetics company.[15] Nestlé was formed in 1905 by the merger of the Anglo-Swiss Milk Company, which was established in 1866 by brothers George and Charle";

const UserPhotoDetail = ({navigation, route}) => {
  const {Detail} = route.params;
  console.log('data    jmk', Detail);

  const [activeSlide, setActiveSlide] = useState(0);

  const images = [
    {id: 1, source: {uri: Detail.mediafile.file}},
    {id: 2, source: {uri: Detail.mediafile.file}},

    // Add more images here
  ];

  const [img, setimgs] = useState(Detail.mediafile);
  console.log('object', img);
  const renderItem = ({item}) => {
    return (
      <View
        style={[Stylsheet.slide, {width: width * 0.8, height: width * 0.8}]}>
        <Image
          style={Stylsheet.image}
          source={{uri: item.file}}
          resizeMode="cover"
        />
      </View>
    );
  };

  return (
    <View style={Stylsheet.container}>
      <View
        style={{
          width: '100%',
          height: 70,
          backgroundColor: '#FFFFFF',
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,

          elevation: 5,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <TouchableOpacity
          style={{left: 10}}
          onPress={() => navigation.goBack()}>
          <AntDesign name="arrowleft" size={22} style={{color: '#000'}} />
        </TouchableOpacity>
        <Text style={Stylsheet.semibldTxt}>{Detail.title}</Text>
        <Text style={Stylsheet.semibldTxt}>{'    '}</Text>
      </View>
      <ScrollView>
        <View style={{paddingBottom: 25}}>
          <View style={{marginTop: 15, height: 285}}>
            <Carousel
              data={img}
              renderItem={renderItem}
              sliderWidth={width}
              itemWidth={width * 0.8}
              layoutCardOffset={10}
              onSnapToItem={index => setActiveSlide(index)}
            />
            <Pagination
              dotsLength={img.length}
              activeDotIndex={activeSlide}
              containerStyle={{paddingVertical: 3}}
              dotStyle={Stylsheet.paginationDot}
              inactiveDotOpacity={0.5}
              inactiveDotScale={0.8}
            />
          </View>

          <View style={{marginHorizontal: wp(5), marginTop: wp(5)}}>
            <Text style={[Stylsheet.b0ldTxt, {fontSize: 16}]}>Description</Text>
            <View
              style={[
                Stylsheet.textinptBox,
                {
                  height: 150,
                  alignItems: 'flex-start',
                  alignSelf: 'center',
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                },
              ]}>
              <ReadMore
                numberOfLines={6}
                style={Stylsheet.readMore}
                seeMoreStyle={{color: Colors.MainColor}}
                seeLessStyle={{color: Colors.MainColor}}>
                {Detail.description}
              </ReadMore>
              <View></View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default UserPhotoDetail;
