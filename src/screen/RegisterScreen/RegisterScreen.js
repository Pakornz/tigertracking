import React, { Component } from 'react';
import axios from "axios";
import Modal from "react-native-modal";
import AnimateLoadingButton from 'react-native-animate-loading-button';
import ImagePicker from 'react-native-image-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Actions } from 'react-native-router-flux';
import { withNavigation, StackActions, NavigationActions } from 'react-navigation';
import AwesomeAlert from 'react-native-awesome-alerts';
import { StatusBar, StyleSheet, View, Image, TextInput, ScrollView, TouchableOpacity, Platform, PixelRatio, Dimensions } from 'react-native';
import { Container, Header, Content, Text, Icon, Left, Body, Right, Form, Button, Title, Item, Input, Footer } from 'native-base';
import Icon1 from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/FontAwesome5';
import Icon3 from 'react-native-vector-icons/Ionicons';
import Icon4 from 'react-native-vector-icons/AntDesign';
import Icon5 from 'react-native-vector-icons/MaterialIcons';
import Icon6 from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon7 from 'react-native-vector-icons/EvilIcons';
import ImgUser from '../../assets/user.png';
import CopyrightCom from '../../components/footer/copyrightCom';
import Imgwarning from '../../assets/exclamation-mark.png';
import Imgsuccess from '../../assets/checkedAlert.png';
import Imgerror from '../../assets/error.png';
import { AsyncStorage } from 'react-native';
import { domain, isIphoneX } from '../../config/configApp'
import RNFetchBlob from "react-native-fetch-blob";
import firebase from 'react-native-firebase';
import { bindActionCreators, createStore } from 'redux';
import { connect } from 'react-redux';
import badgeCountReducer from '../../reducers/badgeCountReducer';
import { setBadge } from '../../actions/index';

class RegisterScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      isRefreshing: false,
      visibleModal: null,

      dataPassConfirm: this.props.navigation.state.params.dataPassConfirm,
      // dataPassConfirm:{},

      resGenUser: resGenUser,
      resGenOldCustomerSkyfrog: resGenOldCustomerSkyfrog,
      resGenToken: resGenToken,
      dataUploadPic: dataUploadPic,
      dataResponeToken: dataResponeToken,

      dataMessageList: dataMessageList,

      firstname: '',
      lastname: '',
      mobilephone: '',
      email: '',
      password: '',
      conpassword: '',

      avatarSource: null,
      defaultURL: 'https://iccapp-minio.icc.co.th:9000/tms/tracking/profile/default/default.jpg',

      // OldCustomerSkyfrog:false

    }
    console.disableYellowBox = true

  }

  //1
  async checkPermission(mobilephone) {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
      this.getToken(mobilephone);
    } else {
      this.requestPermission(mobilephone);
    }
  }

  //3
  async getToken(mobilephone) {
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    if (!fcmToken) {
      fcmToken = await firebase.messaging().getToken();
      if (fcmToken) {
        // user has a device token
        await AsyncStorage.setItem('fcmToken', fcmToken);
        console.log('fcmToken-add-token', fcmToken);
        this.callApiUpdateTokenMessage(mobilephone, fcmToken)
      } else {
        console.log('fcmToken-maidai', fcmToken);
        console.log('gggggggggggggggggggggggggggggggggggggggggggggg');
      }
    } else {
      console.log('fcmToken-mee-law', fcmToken);
      console.log('eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee');
      this.callApiUpdateTokenMessage(mobilephone, fcmToken)
    }
  }

  //2
  async requestPermission(mobilephone) {
    try {
      await firebase.messaging().requestPermission();
      // User has authorised
      this.getToken(mobilephone);
    } catch (error) {
      // User has rejected permissions
      console.log('permission rejected');
    }
  }

  // async createNotificationListeners() {
  //   /*
  //   * Triggered when a particular notification has been received in foreground
  //   * */
  //   this.notificationListener = firebase.notifications().onNotification((notification) => {
  //     const { title, body } = notification;
  //     // this.showSimpleMessage(title, body);
  //     this.popup.show({
  //       onPress: function () { console.log('Pressed') },
  //       appIconSource: require('./../../assets/icon-TLD.png'),
  //       appTitle: 'TigerTracking',
  //       timeText: 'Now',
  //       title: title,
  //       body: body,
  //       slideOutTime: 5000
  //     });
  //   });

  //   /*
  //   * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
  //   * */
  //   // this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
  //   //     const { title, body } = notificationOpen.notification;
  //   //     this.showSimpleMessage(title, body);
  //   // });

  //   /*
  //   * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
  //   * */
  //   // const notificationOpen = await firebase.notifications().getInitialNotification();
  //   // if (notificationOpen) {
  //   //     const { title, body } = notificationOpen.notification;
  //   //     this.showSimpleMessage(title, body);
  //   // }
  //   /*
  //   * Triggered for data only payload in foreground
  //   * */
  //   this.messageListener = firebase.messaging().onMessage((message) => {
  //     //process data message
  //     console.log(JSON.stringify(message));
  //   });
  // }

  callApiBadgeCount(mobilephone) {
    axios({
      method: 'get',
      url: `https://webapidev.icc.co.th:3000/tms/messagenotify/messagenotify/${mobilephone}`,
      headers: { 'Content-Type': 'application/json' }
    })
      .then(res => {
        const dataMessageList = res.data
        this.setState({ loading: false, dataMessageList: dataMessageList })

        const daataa = this.state.dataMessageList.data
        const datares = daataa.filter(a => {
          return a.read_status == 'N'
        })
        const resCount = datares.length
        this.props.setBadge(resCount)

      })
      .catch(error => {
        this.setState({ loading: false, error: 'Something just went wrong', spinner: false })
        // alert(error)
        console.log('BadgeAPi error')
      });
  }


  callApiUpdateTokenMessage = (mobile, tokenID) => {
    axios({
      method: 'post',
      url: `https://webapidev.icc.co.th:3000/tms/messagenotify/updatetokenmessage`,
      headers: { 'Content-Type': 'application/json' },
      data: {
        mobile_phone: `${mobile}`,
        token_message: `${tokenID}`
      }
    })
      .then(res => {
        const dataResponeToken = res.data
        this.setState({ loading: false, dataResponeToken: dataResponeToken, spinner: false })
        console.log(this.state.dataResponeToken.message);

      })
      .catch(error => {
        this.setState({ loading: false, error: 'Something just went wrong', spinner: false })
        // alert(error)
        console.log(error)
      });
  }

  callApiUploadPic(firstname, lastname, mobilephone, email, submitpassword, platform, avatarSource) {
    this.loadingButton.showLoading(true);
    const bodyFormData = new FormData();
    // Platform.OS === "android" ? urlpic : urlpic.replace("file://", "")
    bodyFormData.append('user_id', mobilephone)
    bodyFormData.append('image', {
      uri: avatarSource,
      name: `${mobilephone}.jpg`,
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
        console.log('UploadPicSuccessed', this.state.dataUploadPic)

        this.callApiGenUser(firstname, lastname, mobilephone, email, submitpassword, platform, this.state.dataUploadPic.data.url)
      })
      .catch(error => {
        this.setState({ error: 'Something just went wrong' })
        alert(error)
        console.log(error)
        this.loadingButton.showLoading(false);
      });
  }

  callApiUploadPic2(firstname, lastname, mobilephone, email, submitpassword, platform, avatarSource) {
    this.loadingButton.showLoading(true);

    const fs = RNFetchBlob.fs;
    let imagePath = null;
    RNFetchBlob.config({
      fileCache: true
    })
      .fetch("GET", `${avatarSource}`)
      // the image is now dowloaded to device's storage
      .then(resp => {
        // the image path you can use it directly with Image component
        imagePath = 'file://' + resp.path();
        console.log('imagebaseeeeeee', imagePath);

        this.callApiUploadPic(firstname, lastname, mobilephone, email, submitpassword, platform, imagePath)

        return resp.readFile("base64");
      })
      .then(base64Data => {
        // remove the file from storage
        return fs.unlink(imagePath);
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
        let source = response.uri

        this.setState({
          avatarSource: source,
        });

      }
    });
  }

  callApiGenUser(firstname, lastname, mobilephone, email, submitpassword, platform, avatarSource) {
    this.loadingButton.showLoading(true);
    axios({
      method: 'post',
      url: `${domain}/register/genuseraccount`,
      headers: { 'Content-Type': 'application/json' },
      data: {
        firstname: `${firstname}`,
        lastname: `${lastname}`,
        mobile_phone: `${mobilephone}`,
        email: `${email}`,
        password: `${submitpassword}`,
        platform: `${platform}`,
        image_url: avatarSource
      }
    })
      .then(res => {
        const resGenUser = res.data
        this.setState({
          resGenUser: resGenUser,
        })
        console.log('########Register########', this.state.resGenUser.message)

        this.callApiCheckOldCustomerSkyfrog(mobilephone, firstname, lastname)

      })
      .catch(error => {
        this.setState({ visibleModal: 4 })
        this.loadingButton.showLoading(false);
      });

  }

  callApiCheckOldCustomerSkyfrog(mobilephone, firstname, lastname) {
    axios({
      method: 'post',
      url: `${domain}/register/transferoldcustomerskyfrog`,
      headers: { 'Content-Type': 'application/json' },
      data: {
        mobile_phone: `${mobilephone}`,
      }
    })
      .then(res => {
        const resGenOldCustomerSkyfrog = res.data
        this.setState({
          resGenOldCustomerSkyfrog: resGenOldCustomerSkyfrog,
        })
        console.log('########CheckOldCustomerSkyfrog########', this.state.resGenOldCustomerSkyfrog.result)

        this.callApiGentoken(mobilephone, firstname, lastname)
      })
      .catch(error => {
        // console.log(error)
        // const err = JSON.parse(error.request._response)
        // alert(err.message)
        this.callApiGentoken(mobilephone, firstname, lastname)
      });
  }

  callApiGentoken(mobilephone, firstname, lastname) {
    axios({
      method: 'post',
      url: `${domain}/authen/gentoken`,
      headers: { 'Content-Type': 'application/json' },
      data: {
        userId: `${mobilephone}`,
        adminSecretKey: `TDL123`,
        expireDay: `30`
      }
    })
      .then(res => {
        const resGenToken = res.data
        this.setState({
          resGenToken: resGenToken,
        })
        console.log('########phone########', mobilephone)
        console.log('########GenToken########', this.state.resGenToken.token)

        AsyncStorage.clear()
        AsyncStorage.setItem('token', this.state.resGenToken.token)
        AsyncStorage.setItem('phone', mobilephone)

        this.checkPermission(mobilephone)
        this.callApiBadgeCount(mobilephone)

        this.setState({ visibleModal: 5 })

      })
      .catch(error => {
        console.log(error)
        const err = JSON.parse(error.request._response)
        this.loadingButton.showLoading(false);
      });
  }

  goGo = () => {
    console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^', this.state.resGenOldCustomerSkyfrog.result);

    if (this.state.resGenOldCustomerSkyfrog.result) {
      this.props.navigation.navigate('DrawerHomeScreen')
      this.loadingButton.showLoading(false);
    } else {
      const dataPass = {
        firstname: this.state.firstname,
        lastname: this.state.lastname,
        mobile_phone: this.state.dataPassConfirm.mobile_phone,
      }
      this.props.navigation.navigate('AddressInsertScreen', { dataPass: dataPass })
      this.loadingButton.showLoading(false);
    }

  }

  onButtonCreateUser(firstname, lastname, mobilephone, email, submitpassword, platform, avatarSource) {
    if (!firstname || !lastname) {
      this.setState({ visibleModal: 1 })
    } else if (!submitpassword) {
      this.setState({ visibleModal: 2 })
    } else if (submitpassword.length < 4) {
      this.setState({ visibleModal: 6 })
    } else if (submitpassword == "falsePass") {
      this.setState({ visibleModal: 3 })
    } else {
      if (avatarSource !== null) {
        console.log('########avatarSourceTRUE########', `${avatarSource}`)
        this.callApiUploadPic(firstname, lastname, mobilephone, email, submitpassword, platform, avatarSource)
      } else {
        console.log('########avatarSourceFALSE########', `${avatarSource}`)
        this.callApiUploadPic2(firstname, lastname, mobilephone, email, submitpassword, platform, this.state.defaultURL)
        // this.callApiGenUser(firstname, lastname, mobilephone, email, submitpassword, platform, avatarSource)

      }
    }

  }


  renderModalContentName = () => (
    <View style={styles.popup}>
      <View style={styles.popupContent}>
        <ScrollView contentContainerStyle={styles.modalInfo}>
          <View style={{ flex: 1, flexDirection: 'column', padding: wp('2.5%'), alignItems: 'center' }}>
            <View style={styles.cardImage}>
              <Image style={styles.Imgwarning} source={Imgwarning} />
            </View>
            <View style={{ justifyContent: 'center' }}>
              <Text style={styles.position}>คำเตือน</Text>
              <View style={styles.span}></View>
              <Text style={styles.position1}>กรุณาใส่ชื่อ - นามสกุล !</Text>
            </View>
          </View>
        </ScrollView>
      </View>

      <View style={{ justifyContent: 'flex-end' }}>
        <View style={styles.popupButtons}>
          <TouchableOpacity onPress={() => this.setState({ visibleModal: null })} style={styles.btnClose}>
            <Text style={styles.txtClose}>ปิด</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  renderModalContentPutPassword = () => (
    <View style={styles.popup}>
      <View style={styles.popupContent}>
        <ScrollView contentContainerStyle={styles.modalInfo}>
          <View style={{ flex: 1, flexDirection: 'column', padding: wp('2.5%'), alignItems: 'center' }}>
            <View style={styles.cardImage}>
              <Image style={styles.Imgwarning} source={Imgwarning} />
            </View>
            <View style={{ justifyContent: 'center' }}>
              <Text style={styles.position}>คำเตือน</Text>
              <View style={styles.span}></View>
              <Text style={styles.position1}>กรุณาใส่รหัสผ่าน !</Text>
            </View>
          </View>
        </ScrollView>
      </View>

      <View style={{ justifyContent: 'flex-end' }}>
        <View style={styles.popupButtons}>
          <TouchableOpacity onPress={() => this.setState({ visibleModal: null })} style={styles.btnClose}>
            <Text style={styles.txtClose}>ปิด</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  renderModalContentPassword = () => (
    <View style={styles.popup}>
      <View style={styles.popupContent}>
        <ScrollView contentContainerStyle={styles.modalInfo}>
          <View style={{ flex: 1, flexDirection: 'column', padding: wp('2.5%'), alignItems: 'center' }}>
            <View style={styles.cardImage}>
              <Image style={styles.Imgwarning} source={Imgwarning} />
            </View>
            <View style={{ justifyContent: 'center' }}>
              <Text style={styles.position}>คำเตือน</Text>
              <View style={styles.span}></View>
              <Text style={styles.position1}>รหัสผ่านไม่ตรงกัน !</Text>
            </View>
          </View>
        </ScrollView>
      </View>

      <View style={{ justifyContent: 'flex-end' }}>
        <View style={styles.popupButtons}>
          <TouchableOpacity onPress={() => this.setState({ visibleModal: null })} style={styles.btnClose}>
            <Text style={styles.txtClose}>ปิด</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  renderModalContentP4ss = () => (
    <View style={styles.popup}>
      <View style={styles.popupContent}>
        <ScrollView contentContainerStyle={styles.modalInfo}>
          <View style={{ flex: 1, flexDirection: 'column', padding: wp('2.5%'), alignItems: 'center' }}>
            <View style={styles.cardImage}>
              <Image style={styles.Imgwarning} source={Imgwarning} />
            </View>
            <View style={{ justifyContent: 'center' }}>
              <Text style={styles.position}>คำเตือน</Text>
              <View style={styles.span}></View>
              <Text style={styles.position1}>กรุณาใส่รหัสผ่านมากกว่า 4 ตัว !</Text>
            </View>
          </View>
        </ScrollView>
      </View>

      <View style={{ justifyContent: 'flex-end' }}>
        <View style={styles.popupButtons}>
          <TouchableOpacity onPress={() => this.setState({ visibleModal: null })} style={styles.btnClose}>
            <Text style={styles.txtClose}>ปิด</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  renderModalContentMobileUsed = () => (
    <View style={styles.popup}>
      <View style={styles.popupContent}>
        <ScrollView contentContainerStyle={styles.modalInfo}>
          <View style={{ flex: 1, flexDirection: 'column', padding: wp('2.5%'), alignItems: 'center' }}>
            <View style={styles.cardImage}>
              <Image style={styles.Imgerror} source={Imgerror} />
            </View>
            <View style={{ justifyContent: 'center' }}>
              <Text style={styles.position}>ผิดพลาด</Text>
              <View style={styles.span}></View>
              <Text style={styles.position1}>เบอร์โทรศัพท์นี้ถูกใช้ลงทะเบียนไปแล้ว !</Text>
            </View>
          </View>
        </ScrollView>
      </View>

      <View style={{ justifyContent: 'flex-end' }}>
        <View style={styles.popupButtons}>
          <TouchableOpacity onPress={() => { this.setState({ visibleModal: null }), this.props.navigation.navigate('LoginScreen') }} style={styles.btnClose2}>
            <Text style={styles.txtClose}>ปิด</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  renderModalContentRegister = () => (
    <View style={styles.popup}>
      <View style={styles.popupContent}>
        <ScrollView contentContainerStyle={styles.modalInfo}>
          <View style={{ flex: 1, flexDirection: 'column', padding: wp('2.5%'), alignItems: 'center' }}>
            <View style={styles.cardImage}>
              <Image style={styles.Imgsuccess} source={Imgsuccess} />
            </View>
            <View style={{ justifyContent: 'center' }}>
              <Text style={styles.position}>สำเร็จ</Text>
              <View style={styles.span}></View>
              <Text style={styles.position1}>สมัครใช้งานเรียบร้อย !</Text>
            </View>
          </View>
        </ScrollView>
      </View>

      <View style={{ justifyContent: 'flex-end' }}>
        <View style={styles.popupButtons}>
          <TouchableOpacity onPress={() => { this.setState({ visibleModal: null }), this.goGo() }} style={styles.btnClose3}>
            <Text style={styles.txtClose}>ปิด</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  render() {

    let submitpassword;
    if (this.state.password == this.state.conpassword) {
      submitpassword = this.state.password
    } else {
      submitpassword = "falsePass"
    }

    let platform;
    if (Platform.OS === 'ios') {
      platform = 'iOS'
    } else {
      platform = 'Android'
    }

    return (

      <View style={styles.screen}>

        <View>
          <Header style={{ backgroundColor: '#efefef', marginBottom: 0 }}>
            <StatusBar barStyle="dark-content" hidden={false} backgroundColor="#efefef" translucent={false} />

            <Left>
              <TouchableOpacity style={{ paddingHorizontal: wp('2%'), paddingVertical: hp('1.5%') }} transparent onPress={() => this.props.navigation.navigate('LoginScreen')}>
                <Icon3 name='ios-arrow-back' size={wp('7%')} color='#778899' />
              </TouchableOpacity>
            </Left>
            <Body>
              <Title style={{ fontSize: isIphoneX ? hp('2%') : hp('2.5%'), color: '#778899' }}>Register</Title>
            </Body>
            <Right />
          </Header>
        </View>

        <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: hp('3.5%') }}>

          <View style={styles.logoContainer}>
            <TouchableOpacity onPress={this.selectPhotoTapped.bind(this)}>
              <View
                style={[
                  styles.avatar,
                  styles.avatarContainer,
                  { marginLeft: 0 },
                ]}
              >
                {this.state.avatarSource === null ? (
                  <Image style={styles.imageUser} source={{ uri: this.state.defaultURL }} />
                ) : (
                    <Image style={styles.avatar} source={{ uri: this.state.avatarSource }} />
                  )}
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: hp('1.2%') }}>
                <Icon7 name='camera' style={{ fontSize: hp('4%'), marginRight: wp('0.5%'), color: '#646464' }}></Icon7>
                <Text style={{ fontSize: hp('2%'), color: "#646464", fontWeight: '700', textAlign: 'center' }}>แก้ไขรูปภาพ</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.container}>

            <View style={styles.inputContainer}>
              <Icon5 name='person' style={styles.inputIcon} style={{ paddingLeft: wp('4.5%'), fontSize: hp('2.5%') }} />
              <TextInput style={styles.inputs}
                placeholder="ชื่อ"
                placeholderTextColor="#c9c9c9"
                underlineColorAndroid='transparent'
                onChangeText={(firstname) => this.setState({ firstname })} />
            </View>

            <View style={styles.inputContainer}>
              <Icon5 name='person' style={styles.inputIcon} style={{ paddingLeft: wp('4.5%'), fontSize: hp('2.5%') }} />
              <TextInput style={styles.inputs}
                placeholder="นามสกุล"
                placeholderTextColor="#c9c9c9"
                underlineColorAndroid='transparent'
                onChangeText={(lastname) => this.setState({ lastname })} />
            </View>

            <View style={styles.inputContainer}>
              <Icon4 name='mobile1' style={styles.inputIcon} style={{ paddingLeft: wp('4.5%'), fontSize: hp('2.5%') }} />
              <TextInput style={styles.inputs}
                placeholder="เบอร์โทรศัพท์"
                placeholderTextColor="#c9c9c9"
                keyboardType="phone-pad"
                underlineColorAndroid='transparent'
                value={this.state.dataPassConfirm.mobile_phone}
              />
            </View>

            <View style={styles.inputContainer}>
              <Icon5 name='email' style={styles.inputIcon} style={{ paddingLeft: wp('4.5%'), fontSize: hp('2.5%') }} />
              <TextInput style={styles.inputs}
                placeholder="อีเมลล์"
                placeholderTextColor="#c9c9c9"
                keyboardType="email-address"
                underlineColorAndroid='transparent'
                onChangeText={(email) => this.setState({ email })} />
            </View>

            <View style={styles.inputContainer}>
              <Icon1 name='lock' style={styles.inputIcon} style={{ paddingLeft: wp('5.75%'), fontSize: hp('2.5%') }} />
              <TextInput style={styles.inputs}
                placeholder="รหัสผ่าน"
                placeholderTextColor="#c9c9c9"
                secureTextEntry={true}
                maxLength={25}
                underlineColorAndroid='transparent'
                onChangeText={(password) => this.setState({ password })} />
            </View>

            <View style={styles.inputContainer}>
              <Icon1 name='lock' style={styles.inputIcon} style={{ paddingLeft: wp('5.75%'), fontSize: hp('2.5%') }} />
              <TextInput style={styles.inputs}
                placeholder="ยืนยันรหัสผ่าน"
                placeholderTextColor="#c9c9c9"
                secureTextEntry={true}
                maxLength={25}
                underlineColorAndroid='transparent'
                onChangeText={(conpassword) => this.setState({ conpassword })} />
            </View>

            {/* <TouchableOpacity  style={[styles.buttonContainer, styles.loginButton]} 
          onPress={() => this.onButtonCreateUser(
            this.state.firstname,
            this.state.lastname,
            this.state.dataPassConfirm.mobile_phone,
            this.state.email,
            submitpassword,
            platform,
            this.state.avatarSource
          )}>
          <Text style={styles.loginText}>สมัครใช้งาน</Text>
        </TouchableOpacity> */}

            <View style={{ marginTop: hp('3.5%'), marginBottom: hp('3.5%') }}>
              <AnimateLoadingButton
                ref={c => (this.loadingButton = c)}
                width={wp('60%')}
                height={hp('6%')}
                title="สมัครใช้งาน"
                titleFontSize={hp('2%')}
                titleColor='white'
                backgroundColor="#23527c"
                borderRadius={30}
                onPress={() => this.onButtonCreateUser(
                  this.state.firstname,
                  this.state.lastname,
                  this.state.dataPassConfirm.mobile_phone,
                  this.state.email,
                  submitpassword,
                  platform,
                  this.state.avatarSource
                )}
              />
            </View>

          </View>

          {/* <View style={{flex:1,justifyContent:'flex-end'}}>
          <CopyrightCom/>
        </View> */}

        </KeyboardAwareScrollView>

        <Modal
          isVisible={this.state.visibleModal === 1}
          backdropColor='#00000057'
          animationIn='fadeIn'
          animationInTiming={300}
          animationOut='fadeOut'
          animationOutTiming={400}
          onBackdropPress={() => this.setState({ visibleModal: null })}>
          {this.renderModalContentName()}
        </Modal>

        <Modal
          isVisible={this.state.visibleModal === 2}
          backdropColor='#00000057'
          animationIn='fadeIn'
          animationInTiming={300}
          animationOut='fadeOut'
          animationOutTiming={400}
          onBackdropPress={() => this.setState({ visibleModal: null })}>
          {this.renderModalContentPutPassword()}
        </Modal>

        <Modal
          isVisible={this.state.visibleModal === 3}
          backdropColor='#00000057'
          animationIn='fadeIn'
          animationInTiming={300}
          animationOut='fadeOut'
          animationOutTiming={400}
          onBackdropPress={() => this.setState({ visibleModal: null })}>
          {this.renderModalContentPassword()}
        </Modal>

        <Modal
          isVisible={this.state.visibleModal === 4}
          backdropColor='#00000057'
          animationIn='fadeIn'
          animationInTiming={300}
          animationOut='fadeOut'
          animationOutTiming={400}
          onBackdropPress={() => this.setState({ visibleModal: null })}>
          {this.renderModalContentMobileUsed()}
        </Modal>

        <Modal
          isVisible={this.state.visibleModal === 5}
          backdropColor='#00000057'
          animationIn='fadeIn'
          animationInTiming={300}
          animationOut='fadeOut'
          animationOutTiming={400}>
          {this.renderModalContentRegister()}
        </Modal>

        <Modal
          isVisible={this.state.visibleModal === 6}
          backdropColor='#00000057'
          animationIn='fadeIn'
          animationInTiming={300}
          animationOut='fadeOut'
          animationOutTiming={400}
          onBackdropPress={() => this.setState({ visibleModal: null })}>
          {this.renderModalContentP4ss()}
        </Modal>

      </View>

    );
  }
}

mapStateToProps = (state) => {
  return {
    badgeCount: state.badgeCount,
  };
}

matchDispatchToProps = (dispatch) => {
  return bindActionCreators({ setBadge: setBadge }, dispatch)
}

export default withNavigation(connect(mapStateToProps, matchDispatchToProps)(RegisterScreen))

const resGenUser = {
  "result": "",
  "status": "",
  "message": ""
}

const resGenOldCustomerSkyfrog = {
  "result": "",
  "status": "",
  "message": ""
}

const resGenToken = {
  "result": "",
  "status": "",
  "token": "",
  "expireDatetime": ""
}

const dataUploadPic = {
  "result": "",
  "data": {
    "url": ""
  }
}

const dataResponeToken = {
  "result": "",
  "status": "",
  "message": ""
}

const dataMessageList = {
  "result": "",
  "status": "",
  "message": "",
  "data": [
    {
      "tel": "",
      "title": "",
      "body": "",
      "message_id": "",
      "send_status": "",
      "read_status": ""
    }
  ]
}


const { height, width } = Dimensions.get('window');

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: wp('3.5%'),
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    marginTop: hp('3.5%'),
  },
  inputContainer: {
    borderBottomColor: '#F5FCFF',
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    borderBottomWidth: wp('0.25%'),
    width: wp('60%'),
    height: hp('6%'),
    marginBottom: hp('2.5%'),
    flexDirection: 'row',
    alignItems: 'center'
  },
  inputs: {
    width: wp('50%'),
    height: hp('6%'),
    marginLeft: wp('4%'),
    borderBottomColor: '#FFFFFF',
    fontSize: hp('1.75%'),
    flex: 1,
  },
  inputIcon: {
    width: wp('7.5%'),
    height: hp('3.25%'),
    marginLeft: wp('4%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    height: hp('6%'),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: hp('3.5%'),
    width: wp('60%'),
    borderRadius: 30,
  },
  loginButton: {
    backgroundColor: "#23527c",
  },
  loginText: {
    color: 'white',
  },
  /////////////////////modals///////////////////////
  popup: {
    backgroundColor: 'white',
    marginHorizontal: wp('5%'),
    borderRadius: 10,
  },
  popupOverlay: {
    backgroundColor: "#00000057",
    flex: 1,
    justifyContent: 'center'
  },
  popupContent: {
    //alignItems: 'center',
    margin: wp('2%'),
    height: hp('30%'),
  },
  popupButtons: {
    paddingVertical: hp('1%'),
    borderTopWidth: hp('0.5%'),
    borderColor: "#eee",
    borderRadius: 10,
    alignItems: 'center'
  },
  btnClose: {
    borderRadius: 10,
    height: hp('5%'),
    width: wp('20%'),
    backgroundColor: '#ffbc33',
    padding: wp('2%'),
    margin: wp('2%'),
  },
  btnClose2: {
    borderRadius: 10,
    height: hp('5%'),
    width: wp('20%'),
    backgroundColor: '#e2574c',
    padding: wp('2%'),
    margin: wp('2%'),
  },
  btnClose3: {
    borderRadius: 10,
    height: hp('5%'),
    width: wp('20%'),
    backgroundColor: '#3db39e',
    padding: wp('2%'),
    margin: wp('2%'),
  },
  txtClose: {
    textAlign: 'center',
    color: "#FFFFFF",
    fontSize: hp('2%'),
  },
  modalInfo: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  position: {
    textAlign: 'center',
    fontSize: hp('2.2%'),
    color: "#999999",
    fontFamily: 'kanit',
    fontWeight: 'bold',
    marginBottom: hp('0.75'),
    marginTop: hp('1.25%')
  },
  position1: {
    color: "#999999",
    fontFamily: 'kanit',
    textAlign: 'center',
    fontSize: hp('2%'),
  },
  Imgwarning: {
    width: wp('17.5%'),
    height: hp('8.75'),
    resizeMode: 'contain',
  },
  Imgerror: {
    width: wp('17.5%'),
    height: hp('8.75'),
    resizeMode: 'contain',
  },
  Imgsuccess: {
    width: wp('17.5%'),
    height: hp('8.75'),
    resizeMode: 'contain',
  },
  imageUser: {
    width: width > 320 ? 140 : 100,
    height: height > 570 ? 140 : 100,
    resizeMode: 'contain',
    // marginLeft: 15,
  },
  /////////////////////UploadPic/////////////////
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