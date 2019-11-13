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
import Icon4 from 'react-native-vector-icons/AntDesign';
import Icon5 from 'react-native-vector-icons/MaterialIcons';
import Icon6 from 'react-native-vector-icons/MaterialCommunityIcons';
import Img from '../../assets/new-logo-TLD.png';
import Imgwarning from '../../assets/exclamation-mark.png';
import Imgsuccess from '../../assets/checkedAlert.png';
import CopyrightCom from '../../components/footer/copyrightCom';
import { AsyncStorage } from 'react-native';
import { domain, isIphoneX } from '../../config/configApp'

class RePasswordScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      isRefreshing: false,
      visibleModal: null,

      password: '',
      conpassword: '',

      dataPassConfirm: this.props.navigation.state.params.dataPassConfirm,

      resChangePassword: resChangePassword,
      resGenToken: resGenToken,

    };
    console.disableYellowBox = true
    console.log('###############', this.state.dataPassConfirm)
  }

  callApiChangePassword(mobilephone, new_password) {
    this.loadingButton.showLoading(true);
    axios({
      method: 'post',
      url: `${domain}/user/updatepassword`,
      headers: { 'Content-Type': 'application/json' },
      data: {
        user_id: `${mobilephone}`,
        new_password: `${new_password}`,
      }
    })
      .then(res => {
        const resChangePassword = res.data
        this.setState({
          resChangePassword: resChangePassword,
        })
        console.log('########RePassword########', this.state.resChangePassword.message)

        this.callApiGentoken(mobilephone)
      })
      .catch(error => {
        // console.log(error)
        // const err = JSON.parse(error.request._response)
        // alert(err.message)
        this.loadingButton.showLoading(false);
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
        console.log('########GenToken########', this.state.resGenToken.token)
        console.log('########phone########', mobilephone)

        AsyncStorage.clear()
        AsyncStorage.setItem('token', this.state.resGenToken.token)
        AsyncStorage.setItem('phone', mobilephone)

        this.setState({ visibleModal: 2 })


      })
      .catch(error => {
        console.log(error)
        const err = JSON.parse(error.request._response)
        this.loadingButton.showLoading(false);
      });
  }

  onButtonUpdatePassword(mobilephone, new_password) {
    if (!new_password) {
      this.setState({ visibleModal: 1 })
    } else if (new_password.length < 4) {
      this.setState({ visibleModal: 3 })
    } else if (new_password == "falsePass") {
      this.setState({ visibleModal: 4 })
    } else {
      this.callApiChangePassword(mobilephone, new_password)
    }
  }

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

  renderModalContentNewPassword = () => (
    <View style={styles.popup}>
      <View style={styles.popupContent2}>
        <ScrollView contentContainerStyle={styles.modalInfo}>
          <View style={{ flex: 1, flexDirection: 'column', padding: wp('2.5%'), alignItems: 'center' }}>
            <View style={styles.cardImage}>
              <Image style={styles.Imgsuccess} source={Imgsuccess} />
            </View>
            <View style={{ justifyContent: 'center' }}>
              <Text style={styles.position}>สำเร็จ</Text>
              <View style={styles.span}></View>
              <Text style={styles.position1}>เปลี่ยนรหัสผ่านเรียบร้อย !</Text>
            </View>
          </View>
        </ScrollView>
      </View>

      <View style={{ justifyContent: 'flex-end' }}>
        <View style={styles.popupButtons}>
          <TouchableOpacity onPress={() => { this.setState({ visibleModal: null }), this.props.navigation.navigate('DrawerHomeScreen') }} style={styles.btnClose2}>
            <Text style={styles.txtClose}>ปิด</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  renderModalContentNewP4ss = () => (
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

  render() {

    let new_password;
    if (this.state.password == this.state.conpassword) {
      new_password = this.state.password
    } else {
      new_password = "falsePass"
    }

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
              <Title style={{ fontSize: isIphoneX ? hp('2%') : hp('2.5%'), color: '#5b5b5b' }}>New Password</Title>
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
              <Icon6 name='key-variant' style={styles.inputIcon} style={{ paddingLeft: wp('4.5%'), fontSize: hp('2.5%') }} />
              <TextInput style={styles.inputs}
                placeholder="รหัสผ่านใหม่"
                placeholderTextColor="#c9c9c9"
                secureTextEntry={true}
                maxLength={25}
                underlineColorAndroid='transparent'
                onChangeText={(password) => this.setState({ password })} />
            </View>

            <View style={styles.inputContainer}>
              <Icon6 name='key-variant' style={styles.inputIcon} style={{ paddingLeft: wp('4.5%'), fontSize: hp('2.5%') }} />
              <TextInput style={styles.inputs}
                placeholder="ยืนยันรหัสผ่านใหม่"
                placeholderTextColor="#c9c9c9"
                secureTextEntry={true}
                maxLength={25}
                underlineColorAndroid='transparent'
                onChangeText={(conpassword) => this.setState({ conpassword })} />
            </View>

            {/* <TouchableOpacity  style={[styles.buttonContainer, styles.loginButton]} onPress={() => this.onButtonUpdatePassword(this.state.dataPassConfirm.mobile_phone,new_password)}>
          <Text style={styles.loginText}>ตกลง</Text>
        </TouchableOpacity> */}

            <View style={{ marginTop: hp('2.5%'), marginBottom: hp('3.5%') }}>
              <AnimateLoadingButton
                ref={c => (this.loadingButton = c)}
                width={wp('60%')}
                height={hp('6%')}
                title="เปลี่ยนรหัสผ่าน"
                titleFontSize={hp('2%')}
                titleColor='white'
                backgroundColor="#23527c"
                borderRadius={30}
                onPress={() => this.onButtonUpdatePassword(this.state.dataPassConfirm.mobile_phone, new_password)}
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
          {this.renderModalContentPassword()}
        </Modal>

        <Modal
          isVisible={this.state.visibleModal === 2}
          backdropColor='#00000057'
          animationIn='fadeIn'
          animationInTiming={300}
          animationOut='fadeOut'
          animationOutTiming={400}>
          {this.renderModalContentNewPassword()}
        </Modal>

        <Modal
          isVisible={this.state.visibleModal === 3}
          backdropColor='#00000057'
          animationIn='fadeIn'
          animationInTiming={300}
          animationOut='fadeOut'
          animationOutTiming={400}
          onBackdropPress={() => this.setState({ visibleModal: null })}>
          {this.renderModalContentNewP4ss()}
        </Modal>

        <Modal
          isVisible={this.state.visibleModal === 4}
          backdropColor='#00000057'
          animationIn='fadeIn'
          animationInTiming={300}
          animationOut='fadeOut'
          animationOutTiming={400}
          onBackdropPress={() => this.setState({ visibleModal: null })}>
          {this.renderModalContentPutPassword()}
        </Modal>

      </View>

    );
  }
}

export default withNavigation(RePasswordScreen)

const resChangePassword = {
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
    marginVertical: hp('2.5%'),
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
  inputs2: {
    width: wp('50%'),
    height: hp('6%'),
    marginLeft: wp('2.5%'),
    borderBottomColor: '#FFFFFF',
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
  Imgsuccess: {
    width: wp('17.5%'),
    height: hp('8.75'),
    resizeMode: 'contain',
  },
});