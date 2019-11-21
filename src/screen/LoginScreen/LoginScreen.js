import React, { Component } from 'react';
import axios from "axios";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Modal from "react-native-modal";
import AnimateLoadingButton from 'react-native-animate-loading-button';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview'
import { Actions } from 'react-native-router-flux';
import { withNavigation, StackActions, NavigationActions } from 'react-navigation';
import { StatusBar, StyleSheet, View, Image, TextInput, TouchableOpacity, ScrollView, BackHandler, KeyboardAvoidingView } from 'react-native';
import { Text, Icon, Left, Body, Right, Form, Button, Title, Item, Input } from 'native-base';
import Icon1 from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/FontAwesome5';
import Img from '../../assets/new-logo-TLD.png';
import Imgwarning from '../../assets/exclamation-mark.png';
import Imgerror from '../../assets/error.png';
import CopyrightCom from '../../components/footer/copyrightCom';
import { AsyncStorage } from 'react-native';
import { domain, notify_jobstatus } from '../../config/configApp'
import firebase from 'react-native-firebase';
import { bindActionCreators, createStore } from 'redux';
import { connect } from 'react-redux';
import badgeCountReducer from '../../reducers/badgeCountReducer';
import { setBadge } from '../../actions/index';

class LoginScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      isRefreshing: false,
      visibleModal: null,

      mobilephone: '',
      password: '',

      resCheckUserAccount: resCheckUserAccount,
      resGenToken: resGenToken,
      dataResponeToken: dataResponeToken,

      dataMessageList: dataMessageList,

      token: ''

    };

    console.disableYellowBox = true
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }

  handleBackPress = () => {
    return true;  // Do nothing when back button is pressed
  }

  //1
  async checkPermission() {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
      this.getToken();
    } else {
      this.requestPermission();
    }
  }

  //3
  async getToken() {
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    if (!fcmToken) {
      fcmToken = await firebase.messaging().getToken();
      if (fcmToken) {
        // user has a device token
        await AsyncStorage.setItem('fcmToken', fcmToken);
        console.log('fcmToken-add-token', fcmToken);
        this.callApiUpdateTokenMessage(this.state.mobilephone, fcmToken)
      } else {
        console.log('fcmToken-maidai', fcmToken);
        console.log('gggggggggggggggggggggggggggggggggggggggggggggg');
      }
    } else {
      console.log('fcmToken-mee-law', fcmToken);
      console.log('eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee');
      this.callApiUpdateTokenMessage(this.state.mobilephone, fcmToken)
    }
  }

  //2
  async requestPermission() {
    try {
      await firebase.messaging().requestPermission();
      // User has authorised
      this.getToken();
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
      url: `${domain}/notification/messagenotifylist/${notify_jobstatus}/${mobilephone}`,
      headers: { 'Content-Type': 'application/json' }
    })
      .then(res => {
        const dataMessageList = res.data
        this.setState({ loading: false, dataMessageList: dataMessageList })

        const daataa = this.state.dataMessageList.data.message_nofity
        const datares = daataa.filter(a => {
          return a.read_message_status == 'N'
        })
        const resCount = datares.length
        this.props.setBadge(resCount)

      })
      .catch(error => {
        this.setState({ loading: false, error: 'Something just went wrong', spinner: false })
        // alert(error)
        console.log(error)
      });
  }

  callApiUpdateTokenMessage = (mobile, tokenID) => {
    axios({
      method: 'post',
      url: `${domain}/notification/updatetokenmessage`,
      headers: { 'Content-Type': 'application/json' },
      data: {
        user_id: `${mobile}`,
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

  callApiCheckUserAccount(mobilephone, password) {
    this.loadingButton.showLoading(true);
    axios({
      method: 'get',
      url: `${domain}/user/checkuseraccount/${mobilephone}/${password}`,
      headers: { 'Content-Type': 'application/json' }
    })
      .then(res => {
        const resCheckUserAccount = res.data
        this.setState({
          resCheckUserAccount: resCheckUserAccount,
        })
        console.log('########LoginCheckUserAccount########', this.state.resCheckUserAccount.message)

        this.callApiGentoken(mobilephone)
      })
      .catch(error => {
        console.log(error)
        this.setState({ visibleModal: 3 })
        this.loadingButton.showLoading(false);
        // const err = JSON.parse(error.request._response)
        // alert("Mobbile phone OR Password Not Correct")
      });
  }

  callApiGentoken(mobilephone) {
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
        console.log('########GenToken########', this.state.resGenToken.result)
        console.log('########GenToken########', this.state.resGenToken.token)

        AsyncStorage.setItem('token', this.state.resGenToken.token)
        AsyncStorage.setItem('phone', mobilephone)

        this.checkPermission()
        this.callApiBadgeCount(mobilephone)

        this.props.navigation.navigate('DrawerHomeScreen')
        this.loadingButton.showLoading(false);

      })
      .catch(error => {
        console.log(error)
        const err = JSON.parse(error.request._response)
        this.loadingButton.showLoading(false);
      });
  }

  onButtonLogin(mobilephone, password) {
    if (!mobilephone || mobilephone.length < 10) {
      this.setState({ visibleModal: 1 })
    } else if (!password) {
      this.setState({ visibleModal: 2 })
    } else if (password.length < 4) {
      this.setState({ visibleModal: 4 })
    } else {
      this.callApiCheckUserAccount(mobilephone, password)
    }
  }

  renderModalContentMobile = () => (
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
              <Text style={styles.position1}>กรุณาใส่เบอร์โทรศัพท์ !</Text>
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

  renderModalContentLogin = () => (
    <View style={styles.popup}>
      <View style={styles.popupContent2}>
        <ScrollView contentContainerStyle={styles.modalInfo}>
          <View style={{ flex: 1, flexDirection: 'column', padding: wp('2.5%'), alignItems: 'center' }}>
            <View style={styles.cardImage}>
              <Image style={styles.Imgerror} source={Imgerror} />
            </View>
            <View style={{ justifyContent: 'center' }}>
              <Text style={styles.position}>ผิดพลาด</Text>
              <View style={styles.span}></View>
              <Text style={styles.position1}>เบอร์โทรศัพท์ หรือ รหัสผ่าน {"\n\n"}ไม่ถูกต้อง !</Text>
            </View>
          </View>
        </ScrollView>
      </View>

      <View style={{ justifyContent: 'flex-end' }}>
        <View style={styles.popupButtons}>
          <TouchableOpacity onPress={() => this.setState({ visibleModal: null })} style={styles.btnClose2}>
            <Text style={styles.txtClose}>ปิด</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  checkmobile = (mobilephone) => {

    let mobile = mobilephone.replace(/[.*+?^${}()|[\]\\]|,|-|#/g, "")
    this.setState({ mobilephone: mobile })

  }

  render() {

    return (
      <View style={styles.screen}>
        <StatusBar barStyle="dark-content" hidden={false} backgroundColor="#F5F5F5" translucent={false} />

        <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: hp('3.5%') }}>

          <View style={styles.logoContainer}>
            <Image style={styles.logo} source={Img} />
          </View>

          <View style={styles.container}>
            <View style={styles.inputContainer}>
              <Icon1 name='mobile' style={styles.inputIcon} style={{ paddingLeft: wp('4.5%'), fontSize: hp('3.75%') }} />
              <TextInput style={styles.inputs}
                placeholder="เบอร์โทรศัพท์"
                placeholderTextColor="#c9c9c9"
                keyboardType="phone-pad"
                maxLength={10}
                defaultValue={this.state.mobilephone}
                underlineColorAndroid='transparent'
                onChangeText={(mobilephone) => { this.checkmobile(mobilephone) }}
              />
            </View>

            <View style={styles.inputContainer}>
              <Icon2 name='key' style={styles.inputIcon} style={{ paddingLeft: wp('4%'), fontSize: hp('2.25%') }} />
              <TextInput style={styles.inputs}
                placeholder="รหัสผ่าน"
                placeholderTextColor="#c9c9c9"
                secureTextEntry={true}
                maxLength={25}
                underlineColorAndroid='transparent'
                onChangeText={(password) => this.setState({ password })} />
            </View>

            {/* <TouchableOpacity style={[styles.buttonContainer, styles.loginButton]} onPress={() => this.onButtonLogin(this.state.mobilephone,this.state.password) }>
            <Text style={styles.loginText}>เข้าสู่ระบบ</Text>
        </TouchableOpacity> */}

            <View style={{ marginBottom: hp('3.25%') }}>
              <AnimateLoadingButton
                ref={c => (this.loadingButton = c)}
                width={wp('60%')}
                height={hp('6%')}
                title="เข้าสู่ระบบ"
                titleFontSize={hp('2%')}
                titleColor='white'
                backgroundColor="#23527c"
                borderRadius={30}
                onPress={() => this.onButtonLogin(this.state.mobilephone, this.state.password)}
              />
            </View>

            <TouchableOpacity style={styles.buttonContainer2} transparent primary onPress={() => this.props.navigation.navigate('ReceiveOtpScreen', { changePass: 'newPass' })}>
              <Text style={{ fontSize: hp('1.9%'), textDecorationLine: 'underline', color: '#999999' }}>ลืมรหัสผ่าน ?</Text>
            </TouchableOpacity>


            <TouchableOpacity style={styles.buttonContainer3} transparent primary onPress={() => this.props.navigation.navigate('ReceiveOtpScreen', { changePass: '' })}>
              <Icon1 name='user-plus' style={{ fontSize: hp('2.75'), color: '#5b5b5b', marginRight: wp('1.25%') }} />
              <Text style={{ fontSize: hp('2%'), color: '#5b5b5b', marginLeft: wp('1.25%'), fontWeight: 'bold' }}>สมัครสมาชิก</Text>
            </TouchableOpacity>

          </View>

          {/* <View>
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
          {this.renderModalContentMobile()}
        </Modal>

        <Modal
          isVisible={this.state.visibleModal === 2}
          backdropColor='#00000057'
          animationIn='fadeIn'
          animationInTiming={300}
          animationOut='fadeOut'
          animationOutTiming={400}
          onBackdropPress={() => this.setState({ visibleModal: null })}>
          {this.renderModalContentPassword()}
        </Modal>

        <Modal
          isVisible={this.state.visibleModal === 3}
          backdropColor='#00000057'
          animationIn='fadeIn'
          animationInTiming={300}
          animationOut='fadeOut'
          animationOutTiming={400}
          onBackdropPress={() => this.setState({ visibleModal: null })}>
          {this.renderModalContentLogin()}
        </Modal>

        <Modal
          isVisible={this.state.visibleModal === 4}
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

export default withNavigation(connect(mapStateToProps, matchDispatchToProps)(LoginScreen))

const resCheckUserAccount = {
  "result": "",
  "status": "",
  "messsage": ""
}

const resGenToken = {
  "result": "",
  "status": "",
  "token": "",
  "expireDatetime": ""
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
  "data": {
    "user_id": "",
    "message_nofity": [
      {
        "job_no": "",
        "seq_no": "",
        "job_status": "",
        "message_id": "",
        "message_title": "",
        "message_body": "",
        "send_message_status": "",
        "send_message_date": "",
        "read_message_status": "",
        "read_message_date": "",
        "active_status": "",
        "create_date": "",
        "update_date": ""
      }
    ]
  }
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#F5F5F5',
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 0,
  },
  logo: {
    width: wp('60%'),
    height: hp('12.5%'),
    resizeMode: 'contain',
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
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
    alignItems: 'center',
    // borderColor: '#efefef',
    // borderWidth: 1
  },
  inputs: {
    width: wp('50%'),
    height: hp('6%'),
    marginLeft: wp('4%'),
    borderBottomColor: '#FFFFFF',
    fontSize: hp('1.75%')
  },
  inputIcon: {
    width: wp('7.5%'),
    height: hp('3.25%'),
    marginLeft: wp('4%'),
    justifyContent: 'center'
  },
  buttonContainer: {
    height: hp('6%'),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp('3.25%'),
    width: wp('60%'),
    borderRadius: 30,
  },
  buttonContainer2: {
    height: hp('6%'),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp('3.25%'),
    width: wp('30%'),
    borderRadius: 30,
  },
  buttonContainer3: {
    height: hp('6%'),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp('3.25%'),
    width: wp('37.5%'),
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
  popupContent2: {
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
});