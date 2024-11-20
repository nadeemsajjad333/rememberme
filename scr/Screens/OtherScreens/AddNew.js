import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  FlatList,
  Alert,
  Modal,
  Dimensions,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import React, {useState, version} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Stylsheet from '../../constant/Stylsheet';
import {ImagesCom} from '../../constant/images';
import {Colors} from '../../constant/colors';
import Button from '../../constant/button';
import ImagePicker from 'react-native-image-crop-picker';
import {createThumbnail} from 'react-native-create-thumbnail';
import {AllPostApi, FileUploaded, RegisterApi} from '../../component/APIscreen';
import DocumentPicker from 'react-native-document-picker';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {useSelector} from 'react-redux';
import Progress_Bar from '../../component/Progress_Bar';
import Loading from '../../component/Loading';
import crashlytics from '@react-native-firebase/crashlytics';
import AndroidToast from '../../component/AndroidToast';

const AddNew = ({navigation}) => {
  const user = useSelector(state => state.user.user);
  // console.log('NEW MEDIA redux data',user)
  const [Membermodal, setMembermodal] = useState(false);

  const [Allchange, setAllchange] = useState('');
  const [thumbnailUri, setThumbnailUri] = useState([]);
  const [thumbnailimgs, setThumbnailimgs] = useState([]);
  const [loader, setLoader] = useState(false);
  const [pickedDocument, setPickedDocument] = useState([]);
  const [pdfUploaded, setPdfUploaded] = useState(false);
  const [img, setimg] = useState([]);
  const [title, setTitle] = useState('');
  const [descrip, setDescrip] = useState('');
  const [videoarry, setVideoarry] = useState([]);

  const [progress, setProgress] = useState(0);

  const startUpload = () => {
    if (thumbnailimgs) {
      setLoader(true);
      const uploadInterval = setInterval(() => {
        setProgress(prevProgress => {
          const newProgress = prevProgress + 0.05;
          if (newProgress >= 1) {
            clearInterval(uploadInterval);
            setLoader(false);
          }
          return newProgress;
        });
      }, 180);
    }
  };

  const selectimg = () => {
    if (img.length < 6) {
      ImagePicker.openPicker({
        multiple: true,
        cropping: true,
        width: 300,
        height: 400,
      }).then(image => {
        setimg([...image, ...img]);
      });
    } else {
      Platform.OS == 'android'
        ? ToastAndroid.show('You have selected 6 images', ToastAndroid.SHORT)
        : null;
    }
  };

  const SelectVideo = () => {
    ImagePicker.openPicker({
      mediaType: 'video',
      // multiple:true,
      width: 1000,
      height: 1000,
    })
      .then(video => {
        console.log('video', video);
        setVideoarry([video]);
        createThumbnail({
          url: video.path,
          timeStamp: 10000,
        })
          .then(responce => {
            startUpload();
            console.log('response of thumbnil', responce);
            setThumbnailimgs([responce]);
            thumnailApi(responce);
          })
          .catch(err => Alert.alert(err));
      })
      .catch(err => {
        console.log('err in video select', err);
        crashlytics().recordError(err);
      });
  };

  const thumnailApi = async file => {
    const pic = file.path;
    const formdata = new FormData();
    formdata.append('image', {
      uri: pic,
      type: 'image/jpg',
      name: `image${new Date()}.jpg`,
    });
    RegisterApi({url: 'update-image'}, formdata)
      .then(res => {
        console.log('response of thumbapi', res);

        setThumbnailUri([res]);
      })
      .catch(err => {
        console.log('api error', err);
        crashlytics().recordError(err);
        // setLoader(false);
      });
  };

  const pickDocument = async () => {
    try {
      setLoader(true);
      const doc = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf],
        allowMultiSelection: true,
      });
      console.log('doc response', doc);

      setPickedDocument(doc);
      setPdfUploaded(true);
      setLoader(false);
    } catch (err) {
      setLoader(false);
      if (DocumentPicker.isCancel(err))
        console.log('user cancelled upload ', err);
      else console.log(err);
    }
  };

  const Uploaded = async () => {
    // Check if description and title are provided
    if (!descrip || !title) {
      AndroidToast('All fields and media files are required.');
      return;
    }

    // Check if attachments are provided based on the selected type
    let isAttachmentValid = false;

    if (Allchange == 'img' && img.length > 0) {
      isAttachmentValid = true;
    } else if (Allchange == 'vido' && videoarry.length > 0) {
      isAttachmentValid = true;
    } else if (Allchange == 'doc' && pickedDocument.length > 0) {
      isAttachmentValid = true;
    } else if (
      Allchange != 'img' &&
      Allchange != 'vido' &&
      Allchange != 'doc'
    ) {
      // If no valid attachment type is selected
      AndroidToast('Please select an attachment type.');
      return;
    } else {
      AndroidToast('Please upload at least one attachment.');
      return;
    }

    // Proceed with the file upload only if attachments are valid
    setMembermodal(true);
    const token = user.userdata.api_token;
    const formData = new FormData();

    if (Allchange == 'img') {
      img.forEach(element => {
        if (element.path) {
          formData.append('media[]', {
            uri: element.path,
            type: 'image/jpeg',
            name: 'image' + new Date() + '.jpg',
          });
        }
      });
    } else if (Allchange == 'vido') {
      videoarry.forEach(element => {
        if (element.path) {
          formData.append('media[]', {
            uri: element.path,
            type: 'image/jpeg',
            name: 'image' + new Date() + '.jpg',
          });
        }
      });
      thumbnailimgs.forEach(element => {
        if (element.path) {
          formData.append('thumbnail[]', {
            uri: element.path,
            type: 'image/jpeg',
            name: 'image' + new Date() + '.jpg',
          });
        }
      });
    } else if (Allchange == 'doc') {
      pickedDocument.forEach(element => {
        if (element.uri) {
          formData.append('media[]', {
            uri: element.uri,
            type: 'application/pdf',
            name: 'file.pdf',
          });
        }
      });
    }

    formData.append('description', descrip);
    formData.append('title', title);
    formData.append(
      'type',
      Allchange == 'img'
        ? 'image'
        : Allchange == 'vido'
        ? 'video'
        : Allchange == 'doc'
        ? 'doc'
        : null,
    );

    // Call the API to upload files
    FileUploaded({url: 'add-media', Auth: token}, formData)
      .then(res => {
        setMembermodal(false);
        console.log('response of media upload api', res);
        if (res.status == 'success') {
          navigation.navigate('IndexBottom');
        } else {
          Alert.alert('Exception error');
        }
      })
      .catch(err => {
        console.log('err in uploaded', err);
        crashlytics().recordError(err);
        setMembermodal(false);
      });
  };

  const renderimg = ({item}) => {
    return (
      <Image
        source={{
          uri:
            Allchange == 'img'
              ? item.path
              : Allchange == 'vido'
              ? item.file
              : null,
        }}
        style={{width: 80, height: 80, borderRadius: 10, margin: 5}}
        resizeMode="cover"
      />
    );
  };

  const renderDoc = ({item}) => {
    return (
      <View>
        {pdfUploaded ? (
          <View>
            <FontAwesome name="file-pdf-o" size={70} color="#D92835" />
          </View>
        ) : null}
      </View>
    );
  };

  const Wrapper = Platform.OS === 'ios' ? KeyboardAvoidingView : View;

  return (
    <Wrapper behavior="padding" style={{flex: 1}}>
      <View style={Stylsheet.container}>
        {loader && <Progress_Bar progress={progress} />}
        {Membermodal && <Loading />}
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
          <Text style={Stylsheet.semibldTxt}>Add New</Text>
          <Text style={Stylsheet.semibldTxt}>{'    '}</Text>
        </View>
        <ScrollView>
          <View style={{paddingBottom: 30}}>
            <View
              style={{
                height:
                  Allchange == 'img' ||
                  Allchange == 'vido' ||
                  Allchange == 'doc'
                    ? 590
                    : 450,
                justifyContent: 'space-between',
                marginTop: 30,
              }}>
              <View style={{alignSelf: 'center'}}>
                <Text style={Stylsheet.outtxtinpt}>Title</Text>
                <View style={Stylsheet.textinptBox}>
                  <Image
                    style={Stylsheet.inputicon}
                    source={ImagesCom.user}
                    resizeMode="contain"
                  />

                  <TextInput
                    style={Stylsheet.TextInputS}
                    placeholder="Enter Title"
                    placeholderTextColor={Colors.gray}
                    value={title}
                    onChangeText={Text => {
                      setTitle(Text);
                    }}
                  />
                </View>
              </View>

              <View style={{alignSelf: 'center'}}>
                <Text style={Stylsheet.outtxtinpt}>Description</Text>
                <View
                  style={[
                    Stylsheet.textinptBox,
                    {height: 160, alignItems: 'flex-start'},
                  ]}>
                  <Image
                    style={[Stylsheet.inputicon, {top: 20}]}
                    source={ImagesCom.descrip}
                    resizeMode="contain"
                  />

                  <TextInput
                    style={[
                      Stylsheet.TextInputS,
                      {height: 140, width: 250, marginVertical: 10},
                    ]}
                    placeholder="Write here...."
                    placeholderTextColor={Colors.gray}
                    textAlignVertical="top"
                    numberOfLines={7}
                    multiline={true}
                    value={descrip}
                    onChangeText={Text => {
                      setDescrip(Text);
                    }}
                  />
                </View>
              </View>

              <View style={{alignSelf: 'center'}}>
                <Text style={Stylsheet.outtxtinpt}>Attachments</Text>

                <View
                  style={[
                    Stylsheet.mediaSlct_box,
                    {justifyContent: 'space-evenly'},
                  ]}>
                  <TouchableOpacity
                    onPress={() => {
                      setAllchange('img');
                    }}>
                    <Image
                      style={Stylsheet.mediaSlct_imgs}
                      source={ImagesCom.img}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setAllchange('vido')}>
                    <Image
                      style={Stylsheet.mediaSlct_imgs}
                      source={ImagesCom.video}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setAllchange('doc')}>
                    <Image
                      style={Stylsheet.mediaSlct_imgs}
                      source={ImagesCom.pdf}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {Allchange == 'img' ||
              Allchange == 'vido' ||
              Allchange == 'doc' ? (
                <View style={{alignSelf: 'center'}}>
                  <Text style={Stylsheet.outtxtinpt}>
                    {Allchange == 'img'
                      ? 'Images'
                      : Allchange == 'vido'
                      ? 'Videos'
                      : Allchange == 'doc'
                      ? 'Documents'
                      : null}
                  </Text>
                  <View style={Stylsheet.mediaSlct_box}>
                    <View
                      style={{
                        width: 100,
                        height: 120,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <TouchableOpacity
                        onPress={() => {
                          Allchange == 'img'
                            ? selectimg()
                            : Allchange == 'vido'
                            ? SelectVideo()
                            : Allchange == 'doc'
                            ? pickDocument()
                            : null;
                        }}>
                        <Image
                          style={Stylsheet.mediaSlct_imgsplc}
                          source={ImagesCom.plus2}
                          resizeMode="contain"
                        />
                      </TouchableOpacity>
                    </View>
                    <View
                      style={{
                        height: 120,
                        width: 200,

                        justifyContent: 'center',
                      }}>
                      <View>
                        <FlatList
                          horizontal
                          showsHorizontalScrollIndicator={false}
                          data={
                            Allchange == 'img'
                              ? img
                              : Allchange == 'vido'
                              ? thumbnailUri
                              : null
                          }
                          renderItem={renderimg}
                        />
                        {Allchange == 'doc' ? (
                          <FlatList
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            data={[1]}
                            renderItem={renderDoc}
                          />
                        ) : null}
                      </View>
                    </View>
                  </View>
                </View>
              ) : null}
            </View>

            <View
              style={{
                marginTop:
                  Allchange == 'img' ||
                  Allchange == 'vido' ||
                  Allchange == 'doc'
                    ? 40
                    : 100,
                paddingBottom: Platform.OS === 'ios' ? 50 : 0,
              }}>
              <Button title={'Upload'} onPress={() => Uploaded()} />
            </View>
            <View></View>
          </View>
        </ScrollView>

        {/* modalllllllllllll */}
        {/* <Modal transparent={true} animationType={'none'} visible={loader}>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            flexDirection: 'column',
            justifyContent: 'space-around',
          }}>
          <UIActivityIndicator color="#D92835" size={25} />
        </View>
      </Modal> */}
      </View>
    </Wrapper>
  );
};

export default AddNew;
