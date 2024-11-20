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
import {useSelector} from 'react-redux';
import {AllGetAPI} from '../../component/APIscreen';
import Loading from '../../component/Loading';
import moment from 'moment';

const descrip =
  ' Le Lorem Ipsum est simplement du faux texte employé dans la composit..';

const UserVideos = ({navigation, route}) => {
  const {data} = route.params;
  console.log('object', data);

  const user = useSelector(state => state.user.user);
  const [Membermodal, setMembermodal] = useState(false);

  const [ViewDeta, setViewDeta] = useState([]);

  useEffect(() => {
    setMembermodal(true);
    DeatilPush();
  }, []);

  const DeatilPush = async () => {
    AllGetAPI({
      url: `get-user-media-list/video/${data.id}`,
      Auth: user.userdata.api_token,
    })
      .then(res => {
        setViewDeta(res.media);
        setMembermodal(false);

        console.log('res', res);
      })
      .catch(err => {
        console.log('err in article-list', err);
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
        <Text style={Stylsheet.semibldTxt}>Video's Media</Text>
        <Text style={Stylsheet.semibldTxt}>{'    '}</Text>
      </View>
      <ScrollView>
        {Membermodal && <Loading />}
        <View>
          <View style={{alignSelf: 'center', marginTop: 40}}>
            <FlatList
              showsVerticalScrollIndicator={false}
              data={ViewDeta}
              keyExtractor={item => item.id}
              ListEmptyComponent={() => {
                return (
                  <View style={{marginTop: 200}}>
                    <Text style={[Stylsheet.b0ldTxt, {color: '#9F9F9F'}]}>
                      You haven't add any videos
                    </Text>
                  </View>
                );
              }}
              renderItem={({item}) => {
                return (
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('UserVDetail', {Detail: item})
                    }
                    style={Stylsheet.photo_mediaF}>
                    <View style={Stylsheet.flat_view1}>
                      <Image
                        style={Stylsheet.photo_Fimg}
                        source={{uri: item.mediafile[0].thumbnail}}
                        resizeMode="contain"
                      />
                      <Image
                        style={{width: 45, height: 45, position: 'absolute'}}
                        source={ImagesCom.playIcon}
                        resizeMode="contain"
                      />
                    </View>
                    <View style={Stylsheet.flat_view2}>
                      <Text style={Stylsheet.photo_Ftxt1}>{item.title}</Text>
                      <Text style={[Stylsheet.photo_Ftxt2, {color: '#666666'}]}>
                        {item.description?.length > 30
                          ? item.description?.substring(0, 46) + '...'
                          : item.description}
                      </Text>
                    </View>
                    <View style={Stylsheet.flat_view3}>
                      <Text style={[Stylsheet.photo_Ftxt2, {paddingRight: 10}]}>
                        {moment(item.created_at).format('hh:mm a')}
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

export default UserVideos;
