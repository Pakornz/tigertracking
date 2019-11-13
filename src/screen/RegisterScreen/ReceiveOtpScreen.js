import React, { Component } from 'react';
import axios from "axios";
import Modal from "react-native-modal";
import AnimateLoadingButton from 'react-native-animate-loading-button';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Actions } from 'react-native-router-flux';
import { withNavigation, StackActions, NavigationActions } from 'react-navigation';
import { StatusBar, StyleSheet, View, Image, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView } from 'react-native';
import { Container, Header, Content, List, ListItem, Text, Icon, Left, Body, Right, Form, Button, Title, Item, Input, Footer } from 'native-base';
import Icon1 from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/FontAwesome5';
import Icon3 from 'react-native-vector-icons/Ionicons';
import Img from '../../assets/new-logo-TLD.png';
import Imgwarning from '../../assets/exclamation-mark.png';
import CopyrightCom from '../../components/footer/copyrightCom';
import { domain, isIphoneX } from '../../config/configApp'

class ReceiveOtpScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      isRefreshing: false,
      mobilephone: '',
      visibleModal: null,

      resCheckUser: resCheckUser,
      resGenOtp: resGenOtp,

      changePass: this.props.navigation.state.params.changePass,

    };
    console.disableYellowBox = true
    console.log('###############', this.state.changePass)
  }

  callApiCheckUserAccount(mobilephone) {
    this.loadingButton.showLoading(true);
    axios({
      method: 'get',
      url: `${domain}/user/checkuser/${mobilephone}`,
      headers: { 'Content-Type': 'application/json' }
    })
      .then(res => {
        const resCheckUser = res.data
        this.setState({
          resCheckUser: resCheckUser,
        })
        console.log('########RecieveCheckUser########', this.state.resCheckUser.message)
        this.setState({ visibleModal: 2 })
        this.loadingButton.showLoading(false);
      })
      .catch(error => {
        // console.log(error)
        // const err = JSON.parse(error.request._response)
        this.callApiGenOtp(mobilephone)
      });
  }

  callApiCheckUser(mobilephone) {
    this.loadingButton.showLoading(true);
    axios({
      method: 'get',
      url: `${domain}/user/checkuser/${mobilephone}`,
      headers: { 'Content-Type': 'application/json' }
    })
      .then(res => {
        const resCheckUser = res.data
        this.setState({
          resCheckUser: resCheckUser,
        })
        console.log('########RecieveCheckUser########', this.state.resCheckUser.message)
        this.callApiGenOtp(mobilephone)
      })
      .catch(error => {
        // console.log(error)
        // const err = JSON.parse(error.request._response)
        this.setState({ visibleModal: 1 })
        this.loadingButton.showLoading(false);
      });
  }

  callApiGenOtp(mobilephone) {
    axios({
      method: 'post',
      url: `${domain}/register/genotp`,
      headers: { 'Content-Type': 'application/json' },
      data: {
        mobile_phone: `${mobilephone}`
      }
    })
      .then(res => {
        const resGenOtp = res.data
        this.setState({
          resGenOtp: resGenOtp,
        })
        console.log('########Recieve########', this.state.resGenOtp.message)

        const dataPass = {
          mobile_phone: this.state.resGenOtp.data.mobile_phone,
          ref: this.state.resGenOtp.data.ref,
          otp: this.state.resGenOtp.data.otp,
          changePass: this.state.changePass
        }

        this.props.navigation.navigate('ConfirmOtpScreen', { dataPass: dataPass })
        this.loadingButton.showLoading(false);

      })
      .catch(error => {
        // console.log(error)
        // const err = JSON.parse(error.request._response)
        // alert(err.message)
        this.setState({ visibleModal: 1 })
        this.loadingButton.showLoading(false);
      });
  }

  onButtonReceive(mobilephone) {

    if (!mobilephone || mobilephone.length < 10) {
      this.setState({ visibleModal: 1 })
    } else {
      if (!this.state.changePass) {
        this.callApiCheckUserAccount(mobilephone)
      } else {
        this.callApiCheckUser(mobilephone)
      }
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
              <Text style={styles.position1}>เบอร์โทรศัพท์ ไม่ถูกต้อง !</Text>
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

  renderModalContentMobile2 = () => (
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
              <Text style={styles.position1}>เบอร์โทรศัพท์นี้ถูกใช้ลงทะเบียนไปแล้ว !</Text>
            </View>
          </View>
        </ScrollView>
      </View>

      <View style={{ justifyContent: 'flex-end' }}>
        <View style={styles.popupButtons}>
          <TouchableOpacity onPress={() => { this.setState({ visibleModal: null }), this.props.navigation.navigate('LoginScreen') }} style={styles.btnClose}>
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

        <View>
          <Header style={{ backgroundColor: '#efefef' }}>
            <StatusBar barStyle="dark-content" hidden={false} backgroundColor="#efefef" translucent={false} />

            <Left>
              <TouchableOpacity style={{ paddingHorizontal: wp('2%'), paddingVertical: hp('1.5%') }} transparent onPress={() => this.props.navigation.navigate('LoginScreen')}>
                <Icon3 name='ios-arrow-back' size={wp('7%')} color='#778899' />
              </TouchableOpacity>
            </Left>
            <Body>
              <Title style={{ fontSize: isIphoneX ? hp('2.0%') : hp('2.5%'), color: '#778899' }}>Receive OTP</Title>
            </Body>
            <Right />
          </Header>
        </View>

        <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: hp('3.5%') }}>

          <View style={styles.logoContainer}>
            <Image style={styles.logo} source={Img} />
          </View>

          <View style={styles.container}>
            <View style={styles.inputContainer}>
              <Icon1 name='mobile' style={styles.inputIcon} style={{ paddingLeft: wp('4.5%'), fontSize: hp('3.75%') }} />
              <TextInput style={styles.inputs}
                placeholder="เบอร์โทรศัพท์"
                keyboardType="phone-pad"
                underlineColorAndroid='transparent'
                maxLength={10}
                defaultValue={this.state.mobilephone}
                onChangeText={(mobilephone) => { this.checkmobile(mobilephone) }} />
            </View>

            {/* <TouchableOpacity style={[styles.buttonContainer, styles.loginButton]} onPress={() => this.onButtonReceive(this.state.mobilephone)}>
          <Text style={styles.loginText}>ตกลง</Text>
        </TouchableOpacity> */}

            <View style={{ marginTop: hp('2.5%'), marginBottom: hp('3.5%') }}>
              <AnimateLoadingButton
                ref={c => (this.loadingButton = c)}
                width={wp('60%')}
                height={hp('6%')}
                title="ตกลง"
                titleFontSize={hp('2%')}
                titleColor='white'
                backgroundColor="#23527c"
                borderRadius={30}
                onPress={() => this.onButtonReceive(this.state.mobilephone)}
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
          {this.renderModalContentMobile2()}
        </Modal>

      </View>

    );
  }
}

export default withNavigation(ReceiveOtpScreen)


const resCheckUser = {
  "result": "",
  "status": "",
  "message": ""
}

const resGenOtp = {
  "result": "",
  "status": "",
  "message": "",
  "data": {
    "mobile_phone": "",
    "otp": "",
    "ref": ""
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
    alignItems: 'center'
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