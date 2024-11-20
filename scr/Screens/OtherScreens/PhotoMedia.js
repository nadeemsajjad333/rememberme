import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  ImageBackground,
  FlatList,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Stylsheet from '../../constant/Stylsheet';
import {ImagesCom} from '../../constant/images';
import {Colors} from '../../constant/colors';
import Button from '../../constant/button';
import {AllGetAPI} from '../../component/APIscreen';
import Loading from '../../component/Loading';
import {useSelector} from 'react-redux';
import moment from 'moment';

const PhotoMedia = ({navigation}) => {
  const user = useSelector(state => state.user.user);
  const [tickCheck, setTickCheck] = useState(false);
  const [Membermodal, setMembermodal] = useState(false);

  const [ViewDeta, setViewDeta] = useState([]);
  console.log('photos Media++++++++..', ViewDeta);

  useEffect(() => {
    setMembermodal(true);
    DeatilPush();
  }, []);

  const DeatilPush = async () => {
    AllGetAPI({url: `get-media/photo`, Auth: user.userdata.api_token})
      .then(res => {
        setViewDeta(res.media);
        setMembermodal(false);

        console.log('res', res);
      })
      .catch(err => {
        console.log('err in photos', err);
        setMembermodal(false);
      });
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
        <Text style={Stylsheet.semibldTxt}>Photo's Media</Text>
        <Text style={Stylsheet.semibldTxt}>{'    '}</Text>
      </View>

      <ScrollView>
        {Membermodal && <Loading />}
        <View>
          <View style={{alignSelf: 'center', marginTop: 40}}>
            <FlatList
              showsVerticalScrollIndicator={false}
              data={ViewDeta}
              ListEmptyComponent={() => {
                return (
                  <View style={{marginTop: 200}}>
                    <Text style={[Stylsheet.b0ldTxt, {color: '#9F9F9F'}]}>
                      You haven't add any photos
                    </Text>
                  </View>
                );
              }}
              keyExtractor={item => item.id}
              renderItem={({item}) => {
                return (
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('PhotoDetails', {Detail: item})
                    }
                    style={Stylsheet.photo_mediaF}>
                    <View style={Stylsheet.flat_view1}>
                      <Image
                        style={Stylsheet.photo_Fimg}
                        source={{uri: item.mediafile[0].file}}
                        resizeMode="contain"
                      />
                    </View>
                    <View style={Stylsheet.flat_view2}>
                      <Text style={Stylsheet.photo_Ftxt1}>{item.title}</Text>
                      <Text style={[Stylsheet.photo_Ftxt2, {color: '#666666'}]}>
                        {item.description.length < 20
                          ? `${item.description}`
                          : `${item.description.substring(0, 60)}...`}
                      </Text>
                    </View>
                    <View style={Stylsheet.flat_view3}>
                      <Text style={[Stylsheet.photo_Ftxt2, {paddingRight: 10}]}>
                        {moment(item.created_at).format('h:mm a')}
                      </Text>
                      <Text
                        style={[
                          Stylsheet.photo_Ftxt2,
                          {fontSize: 9, right: 7},
                        ]}>
                        {moment(item.created_at).format('YYYY-D-MM')}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default PhotoMedia;
