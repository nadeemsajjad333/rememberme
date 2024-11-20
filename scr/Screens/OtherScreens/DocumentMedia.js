import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Stylsheet from '../../constant/Stylsheet';
import {ImagesCom} from '../../constant/images';
import {FontsFmily} from '../../constant/fonts';
import {useSelector} from 'react-redux';
import {AllGetAPI} from '../../component/APIscreen';
import Loading from '../../component/Loading';

const DocumentMedia = ({navigation}) => {
  const user = useSelector(state => state.user.user);
  const [Membermodal, setMembermodal] = useState(false);

  const [ViewDeta, setViewDeta] = useState([]);
  console.log('ViewDeta++++++++..', ViewDeta);

  useEffect(() => {
    setMembermodal(true);
    DeatilPush();
  }, []);

  const DeatilPush = async () => {
    AllGetAPI({url: `get-media/doc`, Auth: user.userdata.api_token})
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

  const renderItem = ({item, index}) => {
    return (
      <View style={Stylsheet.DocBox}>
        <View style={[Stylsheet.flexdirec, {justifyContent: 'space-between'}]}>
          <View>
            <Text
              style={{
                fontFamily: FontsFmily.Bold,
                fontSize: 14,
                color: '#000',
                left: 20,
              }}>
              Inheritance Document
            </Text>
          </View>
          <View style={{justifyContent: 'space-between', height: 100}}>
            <Image
              style={Stylsheet.scrimg}
              source={ImagesCom.srchdoc}
              resizeMode="contain"
            />
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('ViewPDF', {pdfFile: ViewDeta})
              }
              activeOpacity={0.6}
              style={Stylsheet.curv_view2}>
              <Text
                style={[
                  Stylsheet.regulrtxt,
                  {color: '#FFFFFF', fontFamily: FontsFmily.Medium},
                ]}>
                Open
              </Text>
            </TouchableOpacity>
          </View>
        </View>
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
        <Text style={Stylsheet.semibldTxt}>Document’s</Text>
        <Text style={Stylsheet.semibldTxt}>{'    '}</Text>
      </View>
      <ScrollView>
        {Membermodal && <Loading />}
        <View>
          <View style={{flex: 1, marginTop: 30}}>
            <FlatList
              data={ViewDeta}
              ListEmptyComponent={() => {
                return (
                  <View style={{marginTop: 200, alignSelf: 'center'}}>
                    <Text style={[Stylsheet.b0ldTxt, {color: '#9F9F9F'}]}>
                      Sorry! we haven't found any documents
                    </Text>
                  </View>
                );
              }}
              renderItem={renderItem}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default DocumentMedia;
