import {
    View,
    Text,
    TouchableOpacity,
    Image,
    TextInput,
    ScrollView,
  } from 'react-native';
  import React,{useState,useEffect} from 'react';
  import AntDesign from 'react-native-vector-icons/AntDesign';
  import Stylsheet from '../../constant/Stylsheet';
  import {ImagesCom} from '../../constant/images';
  import {Colors} from '../../constant/colors';
  import Button from '../../constant/button';
  import { FontsFmily } from '../../constant/fonts';
  import { AllGetAPI, UserMediaAPi } from '../../component/APIscreen';
  import Loading from '../../component/Loading';
  import { useSelector } from 'react-redux';
  
  const UserMedia = ({navigation,route}) => {
    const {userData}=route.params
  
    const user = useSelector(state => state.user.user);
  
    const [Membermodal, setMembermodal] = useState(false);
  
  
  
  
  
    const [ViewDeta, setViewDeta] = useState([]);
    console.log('ViewDeta++++++++..', ViewDeta);
  
    useEffect(() => {
      setMembermodal(true);
      MediaUSer()
    }, []);
  
 
    const MediaUSer = async () => {
      UserMediaAPi({url: `get-user-media/${userData.id}`, Auth: user.userdata.api_token})
        .then(res => {
          setViewDeta([res]);
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
        {Membermodal && <Loading/>}
        <View style={{flex:1}}>
          <View style={{
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
               flexDirection:"row",
              justifyContent: 'space-between',
              alignItems: 'center',
          }}>
          <TouchableOpacity 
          style={{left:10}}
          onPress={() => navigation.goBack(true)}>
          <AntDesign
            name="arrowleft"
            size={22}
            style={{color: '#000',}}
          />
        </TouchableOpacity>
  
            <Text style={Stylsheet.semibldTxt}>{userData.username}</Text>
            <Text style={Stylsheet.semibldTxt}>{'    '}</Text>
          </View>
          <ScrollView>
  
          <View
            style={{
              alignSelf: 'center',
              marginTop: 40,
              height:300,
              justifyContent: 'space-between',
            }}>
            <TouchableOpacity
              onPress={() => navigation.navigate('UserPhotos',{data:userData})}
              style={Stylsheet.Media_Dbox}>
              <Image
                style={[Stylsheet.media_imgB,{left:4}]}
                source={ImagesCom.img2}
                resizeMode="contain"
              />
  
              <View style={{paddingLeft: 35}}>
                <Text style={[Stylsheet.b0ldTxt, {}]}>Photos Media</Text>
              
                {ViewDeta.map((element) => {
                  return(
                    <Text 
                    style={Stylsheet.Txt2}>
                    {element.photos?element?.photos+' photo added':'There are no photos included in this media type'}
                  </Text>
                  )
                   
                })}
              </View>
            </TouchableOpacity>
  
            <TouchableOpacity
              onPress={() => navigation.navigate('UserVideos',{data:userData})}
              style={Stylsheet.Media_Dbox}>
              <Image
                style={Stylsheet.media_imgB}
                source={ImagesCom.img3}
                resizeMode="contain"
              />
  
              <View style={{paddingLeft: 35}}>
                <Text style={[Stylsheet.b0ldTxt, {}]}>Videos Media </Text>
               
                {ViewDeta.map((element) => {
                  return(
                    <Text 
                    style={Stylsheet.Txt2}>
                    {element.videos?element?.videos+' video added':'There are no videos included in this media type'}
                  </Text>
                  )
                   
                })}
              </View>
            </TouchableOpacity>
  
            <TouchableOpacity
              onPress={() => navigation.navigate('UserDoc',{data:userData})}
              style={Stylsheet.Media_Dbox}>
              <Image
                style={Stylsheet.media_imgB}
                source={ImagesCom.img4}
                resizeMode="contain"
              />
  
              <View style={{paddingLeft: 35}}>
                <Text style={[Stylsheet.b0ldTxt, {}]}>Documents</Text>
                {ViewDeta.map((element) => {
                  return(
                    <Text style={Stylsheet.Txt2}>
                    {element.docs?element?.docs +' document added':'There are no files included in this media type'}

                   </Text>
                  )
                   
                })}
              
              </View>
            </TouchableOpacity>
          </View>
      </ScrollView>

        </View>
      </View>
    );
  };
  
  export default UserMedia;
  