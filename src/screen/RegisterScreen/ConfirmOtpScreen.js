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

class ConfirmOtpScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      isRefreshing: false,
      visibleModal: null,

      resConfirmOtp: resConfirmOtp,

      dataPassReceive: this.props.navigation.state.params.dataPass,

      Otp: ''

    };
    console.disableYellowBox = true
    console.log('#######CheckPassConfirm########', this.state.dataPassReceive)
  }

  callApiValidateOtp(Otp, dataPassReceive) {
    this.loadingButton.showLoading(true);
    axios({
      method: 'post',
      url: `${domain}/register/validateotp`,
      headers: { 'Content-Type': 'application/json' },
      data: {
        mobile_phone: `${dataPassReceive.mobile_phone}`,
        otp: `${Otp}`,
        ref: `${dataPassReceive.ref}`
      }
    })
      .then(res => {
        const resConfirmOtp = res.data
        this.setState({ resConfirmOtp: resConfirmOtp })
        console.log('########Confirm########', this.state.resConfirmOtp.message)

        const dataPassConfirm = {
          mobile_phone: dataPassReceive.mobile_phone,
        }

        if (!dataPassReceive.changePass) {
          this.props.navigation.navigate('RegisterScreen', { dataPassConfirm: dataPassConfirm })
          this.loadingButton.showLoading(false);
        } else {
          this.props.navigation.navigate('RePasswordScreen', { dataPassConfirm: dataPassConfirm })
          this.loadingButton.showLoading(false);
        }

      })
      .catch(error => {
        console.log(error)
        const err = JSON.parse(error.request._response)
        this.setState({ visibleModal: 1 })
        console.log('########Confirm########', err.message)
        this.loadingButton.showLoading(false);
      });
  }

  onButtonConfirmOtp(Otp, dataPassReceive) {
    this.callApiValidateOtp(Otp, dataPassReceive)
  }

  renderModalContentOtp = () => (
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
              <Text style={styles.position1}>รหัส OTP ไม่ถูกต้อง !{'\n'}หรือ{'\n'}รหัส OTP เกิน 5 นาที !</Text>
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

  render() {
    return (
      <View style={styles.screen}>

        <View>
          <Header style={{ backgroundColor: '#efefef' }}>
            <StatusBar barStyle="dark-content" hidden={false} backgroundColor="#efefef" translucent={false} />

            <Left>
              <TouchableOpacity style={{ paddingHorizontal: wp('2%'), paddingVertical: hp('1.5%') }} transparent onPress={() => this.props.navigation.navigate('ReceiveOtpScreen')}>
                <Icon3 name='ios-arrow-back' size={wp('7%')} color='#778899' />
              </TouchableOpacity>
            </Left>
            <Body>
              <Title style={{ fontSize: isIphoneX ? hp('2%') : hp('2.5%'), color: '#778899' }}>Confirm OTP</Title>
            </Body>
            <Right />
          </Header>
        </View>

        <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: hp('3.5%') }}>

          <View style={styles.logoContainer}>
            <Image style={styles.logo} source={Img} />
          </View>

          <View style={styles.container}>

            <View style={styles.inputContainer2}>
              <Icon1 name='registered' style={styles.inputIcon2} style={{ paddingLeft: wp('3.5%'), fontSize: hp('2.5%') }} />
              <Text style={styles.inputs2}>{this.state.dataPassReceive.ref}</Text>
            </View>

            <View style={styles.inputContainer}>
              <Icon1 name='mobile' style={styles.inputIcon} style={{ paddingLeft: wp('4.5%'), fontSize: hp('3.75%') }} />
              <TextInput style={styles.inputs}
                placeholder="OTP"
                placeholderTextColor="#c9c9c9"
                underlineColorAndroid='transparent'
                maxLength={6}
                onChangeText={(Otp) => this.setState({ Otp })} />
            </View>

            {/* <TouchableOpacity style={[styles.buttonContainer, styles.loginButton]} onPress={() => this.onButtonConfirmOtp(this.state.Otp,this.state.dataPassReceive)}>
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
                onPress={() => this.onButtonConfirmOtp(this.state.Otp, this.state.dataPassReceive)}
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
          {this.renderModalContentOtp()}
        </Modal>

      </View>

    );
  }
}

export default withNavigation(ConfirmOtpScreen)

const resConfirmOtp = {
  "result": "",
  "status": "",
  "message": ""
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
  inputContainer2: {
    borderBottomColor: '#F5FCFF',
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    borderBottomWidth: wp('0.25%'),
    width: wp('60%'),
    height: hp('6%'),
    marginBottom: hp('2%'),
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputs: {
    width: wp('50%'),
    height: hp('6%'),
    marginLeft: wp('4%'),
    borderBottomColor: '#FFFFFF',
    fontSize: hp('1.75%')
  },
  inputs2: {
    width: wp('50%'),
    marginLeft: wp('3.25%'),
    flex: 1,
    color: '#000',
    fontSize: hp('1.75%')
  },
  inputIcon: {
    width: wp('7.5%'),
    height: hp('3.25%'),
    marginLeft: wp('4%'),
    justifyContent: 'center'
  },
  inputIcon2: {
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
    marginTop: hp('2.5%'),
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