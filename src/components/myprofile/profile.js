import React from "react";
import axios from "axios";
import { Actions } from 'react-native-router-flux';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { StatusBar, StyleSheet, PixelRatio, Image, TouchableOpacity, ActivityIndicator, Platform } from "react-native";
import { Container, Header, Title, Left, Right, Button, Body, Content, Text, Footer, FooterTab, Tab, Tabs, TabHeading, View, Icon } from "native-base";
import ImgUser from '../../assets/user.png';
import { AsyncStorage, Dimensions } from 'react-native';
import Icon1 from 'react-native-vector-icons/EvilIcons';
import ImagePicker from 'react-native-image-picker';
import { domain } from '../../config/configApp'

export default class profile extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      isRefreshing: false,
      phones: '',

      dataProfile: dataProfile,
      dataUploadPic: dataUploadPic,

      avatarSource: null,
      urlPic: null,
      defaultURL: 'https://iccapp-minio.icc.co.th:9000/tms/tracking/profile/default/default.jpg',

    }

    // Text.defaultProps.allowFontScaling = false;

    this.selectPhotoTapped = this.selectPhotoTapped.bind(this);

  }


  componentDidMount = async () => {
    await AsyncStorage.getItem('phone', (err, result) => {
      this.setState({ phones: result })
      console.log('####pageMyprofile', this.state.phones);
    });
    this.callApiProfile(this.state.phones) //Method for API call
  }

  callApiProfile(phones) {
    axios({
      method: 'get',
      url: `${domain}/myprofile/profile/${phones}`,
      headers: { 'Content-Type': 'application/json' }
    })
      .then(res => {
        const dataProfile = res.data
        this.setState({ loading: false, dataProfile: dataProfile })
      })
      .catch(error => {
        this.setState({ loading: false, error: 'Something just went wrong' })
        alert(error)
        console.log(error)
      });
  }

  callApiUploadPic(phones, urlpic) {
    const bodyFormData = new FormData();
    // Platform.OS === "android" ? urlpic : urlpic.replace("file://", "")
    bodyFormData.append('user_id', phones)
    bodyFormData.append('image', {
      uri: urlpic,
      name: `${phones}.jpg`,
      type: 'image/jpg'
    })

    axios({
      method: 'post',
      url: `${domain}/user/uploadimage`,
      data: bodyFormData,
      headers: { 'Content-Type': 'multipart/form-data' }
    })
      .then(res => {
        const dataUploadPic = res.data
        this.setState({ dataUploadPic: dataUploadPic })
        console.log('UploadPicSuccessed', this.state.dataUploadPic.result)
      })
      .catch(error => {
        this.setState({ error: 'Something just went wrong' })
        alert(error)
        console.log(error)
      });
  }

  selectPhotoTapped() {
    const options = {
      quality: 1.0,
      maxWidth: 500,
      maxHeight: 500,
      storageOptions: {
        skipBackup: true,
      },
    };

    ImagePicker.showImagePicker(options, (response) => {
      // console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled photo picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        let source = { uri: response.uri };
        let urlPic = response.uri

        // You can also display the image using data:
        // let source = { uri: 'data:image/jpeg;base64,' + response.data };

        this.setState({
          avatarSource: source,
          urlPic: urlPic,
        });

        this.callApiUploadPic(this.state.phones, this.state.urlPic)
      }
    });
  }


  render() {
    if (this.state.loading) {
      return (
        <View style={{ width: "100%", height: "100%" }} >
          <ActivityIndicator style={{ color: "#fff" }} />
        </View>
      );
    }
    return (

      <View style={styles.box}>
        <View style={styles.boxAvatar}>
          <TouchableOpacity onPress={this.selectPhotoTapped.bind(this)}>
            <View
              style={[
                styles.avatar,
                styles.avatarContainer,
                { marginLeft: 0 },
              ]}
            >
              {this.state.dataProfile.data.image_url == null ? (
                <Image style={styles.imageUser} source={{ uri: this.state.defaultURL }} />
              ) : (
                  <Image style={styles.avatar} source={{ uri: this.state.dataProfile.data.image_url + '?' + Math.random() }} />
                )}
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: hp('1.2%') }}>
              <Icon1 name='camera' style={{ fontSize: hp('4%'), marginRight: wp('0.5%'), color: '#646464' }}></Icon1>
              <Text style={{ fontSize: hp('1.75%'), color: "#646464", fontWeight: '700', textAlign: 'center' }}>แก้ไขรูปภาพ</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.boxContent}>
          <Text style={styles.title}>{this.state.dataProfile.data.user_id}</Text>
          <Text style={styles.description}>{this.state.dataProfile.data.first_name} {this.state.dataProfile.data.last_name}</Text>
        </View>
      </View>


    );
  }
}

const dataProfile = {
  "result": "",
  "status": "",
  "message": "",
  "data": {
    "user_id": "",
    "first_name": "",
    "last_name": "",
    "mobile_phone": "",
    "email": "",
    "id_card": "",
    "platform": "",
    "image_url": ""
  }
}

const dataUploadPic = {
  "result": "",
  "data": {
    "url": ""
  }
}

const { height, width } = Dimensions.get('window');
//////////////////////////////////////////////////////
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
  },
  imageUser: {
    width: width > 320 ? 140 : 100,
    height: height > 570 ? 140 : 100,
    resizeMode: 'contain',
    // marginLeft: 15,
  },
  box: {
    paddingHorizontal: '5%',
    paddingTop: '2%',
    paddingBottom: '6%',
    // marginBottom: 0,
    backgroundColor: 'white',
    flexDirection: 'row',
    borderBottomWidth: wp('0.75%'),
    borderBottomColor: '#F5F5F5'
  },
  boxContent: {
    width: wp('50%'),
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 0,
  },
  title: {
    fontSize: hp('2.5%'),
    color: "#474747",
  },
  description: {
    fontSize: hp('2%'),
    color: "#646464",
  },
  /////////////////////UploadPic/////////////////
  boxAvatar: {
    width: wp('40%'),
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarContainer: {
    borderColor: '#9B9B9B',
    borderWidth: 1 / PixelRatio.get(),
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    borderRadius: width > 320 ? 70 : 50,
    width: width > 320 ? 140 : 100,
    height: height > 570 ? 140 : 100,
  },

});