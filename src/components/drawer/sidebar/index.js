import React, { Component } from "react";
import axios from "axios";
import { domain } from '../../../config/configApp'
import { Image, FlatList, StyleSheet, TouchableOpacity, ScrollView, Platform, Dimensions } from "react-native";
import { Actions } from 'react-native-router-flux';
import { withNavigation, StackActions, NavigationActions } from 'react-navigation';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Modal from "react-native-modal";
import { Content, Text, ListItem, Icon, Container, Left, Right, Badge, Footer, View, Item, CardItem } from "native-base";
import Icon1 from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import Icon3 from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon4 from 'react-native-vector-icons/AntDesign';
import Icon5 from 'react-native-vector-icons/Entypo';
import styles from "./style";
const drawerCover = require("../../../assets/icon-TLD.png");
const ImgExit = require("../../../assets/exit.png");
import PackageJson from '../../../../package'
import { AsyncStorage } from 'react-native';
import {
  SCLAlert,
  SCLAlertButton
} from 'react-native-scl-alert'
import ImgLogout from '../../../assets/exit.png';
import Img from '../../../assets/new-logo-TLD.png';
import { bindActionCreators, createStore } from 'redux';
import { connect } from 'react-redux';
import { resetRedux } from '../../../actions/index';

const resetAction = StackActions.reset({
  index: 1,
  actions: [
    NavigationActions.navigate({ routeName: 'SplashScreen' }),
    NavigationActions.navigate({ routeName: 'LoginScreen' }),
  ],
});
class SideBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shadowOffsetWidth: 1,
      shadowRadius: 4,
      phones: '',
      show: false,
      visibleModal: null,
      dataContactUs: dataContactUs,
    };
    console.disableYellowBox = true
    // Text.defaultProps.allowFontScaling = false;


  }

  componentDidMount = async () => {
    await this.callApiContactUs()
  }

  handleClose = () => {
    this.setState({ show: false })
  }

  onButtonLogout = () => {
    this.setState({ show: true })
  }

  onButtonContact = () => {
    this.setState({ visibleModal: 1 })
  }

  logOut = () => {
    this.props.resetRedux()
    AsyncStorage.clear()
    // this.callAsyncStorage()
    // this.props.navigation.navigate('LoginScreen')
    this.props.navigation.dispatch(resetAction)
  }

  callApiContactUs() {
    axios({
      method: 'get',
      url: `${domain}/contactus/contact/TIGER`,
      headers: { 'Content-Type': 'application/json' }
    })
      .then(res => {
        const dataContactUs = res.data
        this.setState({ dataContactUs: dataContactUs })
      })
      .catch(error => {
        this.setState({ error: 'Something just went wrong' })
        alert(error)
        console.log(error)
      });
  }

  renderModalContentContact = () => (
    <View style={styles.popup}>
      <View style={styles.popupContent2}>
        <ScrollView contentContainerStyle={styles.modalInfo}>
          <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center' }}>
            <View style={styles.cardImage}>
              <Image style={styles.Imgerror} source={Img} />
            </View>
            <View style={{ justifyContent: 'center' }}>
              <Text style={styles.position1}>ติดต่อสอบถามได้ที่</Text>
              <Text></Text>
              <Text style={styles.position1}>{this.state.dataContactUs.data.tel}</Text>

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

  render() {
    return (
      <Container>
        <Content
          contentContainerStyle={{ flexGrow: 1, flexDirection: 'column', backgroundColor: "#fcfcfc" }}>
          <Image source={drawerCover} style={styles.drawerCover} />

          <ListItem button noBorder onPress={() => {
            this.props.navigation.closeDrawer()
          }}>
            <Left>
              <Icon4 active name='back' style={{ color: "#777", fontSize: hp('3.5%'), width: wp('8%') }} />
              <Text style={styles.text}>
                Back
                  </Text>
            </Left>
          </ListItem>

          <ListItem button noBorder onPress={() => {
            this.props.navigation.navigate('DrawerHomeScreen')
          }}>
            <Left>
              <Icon1 active name='home' style={{ color: "#777", fontSize: hp('3.5%'), width: wp('8%') }} />
              <Text style={styles.text}>
                Home
                  </Text>
            </Left>
          </ListItem>

          <ListItem button noBorder onPress={() => {
            this.props.navigation.navigate('DrawerAddressShowScreen')
          }}>
            <Left>
              <Icon3 active name='map-marker-multiple' style={{ color: "#777", fontSize: hp('3.5%'), width: wp('8%') }} />
              <Text style={styles.text}>
                Address
                  </Text>
            </Left>
          </ListItem>

          <ListItem button noBorder onPress={() => {
            this.props.navigation.navigate('DrawerMyProfileScreen')
          }}>
            <Left>
              <Icon2 active name='person-pin' style={{ color: "#777", fontSize: hp('3.5%'), width: wp('8%') }} />
              <Text style={styles.text}>
                Profile
                  </Text>
            </Left>
          </ListItem>

          <ListItem button noBorder onPress={() => {
            // Actions.refresh({ key: 'drawerMenu', open: value => !value });
            this.props.navigation.navigate('DrawerTrackingTabScreen')
          }}>
            <Left>
              <Icon2 active name='local-shipping' style={{ color: "#777", fontSize: hp('3.5%'), width: wp('8%') }} />
              <Text style={styles.text}>
                Tracking
              </Text>
            </Left>
          </ListItem>

          <ListItem button noBorder onPress={() => {
            this.onButtonContact()
          }}>
            <Left>
              <Icon2 active name='contact-phone' style={{ color: "#777", fontSize: hp('3%'), width: wp('8%') }} />
              <Text style={styles.text}>
                Contact Us
              </Text>
            </Left>
          </ListItem>

          <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', borderTopWidth: hp('0.5%'), borderColor: '#d3d3d3', backgroundColor: '#F5F5F5', padding: wp('4%'), marginTop: hp('2%') }}>
            <TouchableOpacity
              onPress={() => {
                this.onButtonLogout()
              }}>
              <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                {/* <Image source={ImgExit} style={styles.image} /> */}
                <Icon5 name='log-out' style={{ color: "#999", fontSize: hp('6%') }} />
                <Text style={{ color: '#999', marginTop: hp('2%'), textAlign: 'center' }}>
                  Log out
                  </Text>
              </View>
            </TouchableOpacity>

          </View>

          <View style={{ justifyContent: 'flex-end', alignItems: 'center', backgroundColor: '#23527c' }}>
            <Text style={{ color: '#fff', fontSize: isIphoneX ? hp('1.5%') : hp('1.5%'), paddingVertical: wp('3%') }}>
              Version {PackageJson.version} TigerTracking Application
                </Text>
          </View>

        </Content>


        <SCLAlert
          onRequestClose={this.handleClose}
          headerIconComponent={<Image source={ImgLogout} style={{ height: hp('7%'), width: wp('14%') }} />}
          show={this.state.show}
          title="ยืนยัน"
          // titleStyle={{fontWeight: 'bold'}}
          subtitle="ออกจากระบบหรือไม่"
          subtitleStyle={{ color: '#999' }}
        >
          <SCLAlertButton textStyle={{ color: '#fff' }} theme='danger' onPress={this.logOut}>ยืนยันออกจากระบบ</SCLAlertButton>
          <SCLAlertButton textStyle={{ color: '#5a6775' }} containerStyle={{ backgroundColor: '#d5d5d5' }} onPress={this.handleClose}>ยกเลิก</SCLAlertButton>
        </SCLAlert>

        <Modal
          isVisible={this.state.visibleModal === 1}
          backdropColor='#00000057'
          animationIn='fadeIn'
          animationInTiming={300}
          animationOut='fadeOut'
          animationOutTiming={400}
          onBackdropPress={() => this.setState({ visibleModal: null })}>
          {this.renderModalContentContact()}
        </Modal>


      </Container>
    );
  }
}

mapStateToProps = (state) => {
  return {
    badgeCount: state.badgeCount,
  };
}

matchDispatchToProps = (dispatch) => {
  return bindActionCreators({ resetRedux: resetRedux }, dispatch)
}

export default withNavigation(connect(mapStateToProps, matchDispatchToProps)(SideBar))


const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;
const platform = Platform.OS;
const isIphoneX = platform === "ios" && (deviceHeight === 812 || deviceWidth === 812 || deviceHeight === 896 || deviceWidth === 896);

const dataContactUs = {
  "result": '',
  "status": '',
  "message": "",
  "data": {
    "id": "",
    "name_thai": "",
    "name_english": "",
    "address_thai": "",
    "address_english": "",
    "email": "",
    "tel": "",
    "fax": ""
  }
}


