import React from "react";
import axios from "axios";
import { Actions } from 'react-native-router-flux';
import StepIndicator from 'react-native-step-indicator';
import Modal from "react-native-modal";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import {
  StatusBar, StyleSheet, ScrollView, Image, TouchableHighlight, ActivityIndicator, RefreshControl,
  TouchableOpacity,
  Dimensions, View, FlatList
} from "react-native";
import { Text } from "native-base";
import Icon1 from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import Icon3 from 'react-native-vector-icons/MaterialCommunityIcons';
import ImgUser from './../../assets/user.png';
import ImgBox from "./../../assets/box.png";
import ImgBox2 from "./../../assets/box2.png";
import ImgQrcode from './../../assets/blackberry-qr-code-variant.png'
import { AsyncStorage } from 'react-native';
import { domain } from '../../config/configApp'


export default class sendProgress extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      isRefreshing: false,
      phones: '',

      dataMyParcelList: dataMyParcelList,

      dataMyParcel: dataMyParcel,

      visibleModal: null,
      userSelected: [],

      foundParcel: false,
    }

    // Text.defaultProps.allowFontScaling = false;

  }

  componentDidMount = async () => {
    await AsyncStorage.getItem('phone', (err, result) => {
      this.setState({ phones: result })
      console.log('####pageTrackingProgress', this.state.phones);
    });
    this.callApiMyParcelList(this.state.phones) //Method for API call
  }

  callApiMyParcelList(phones) {
    axios({
      method: 'get',
      url: `${domain}/tracking/myparcellist/${phones}/Intransit`,
      headers: { 'Content-Type': 'application/json' }
    })
      .then(res => {
        const dataMyParcelList = res.data
        this.setState({ loading: false, dataMyParcelList: dataMyParcelList, foundParcel: true })
      })
      .catch(error => {
        this.setState({ loading: false, error: 'Something just went wrong' })
        // alert(error)
        // console.log(error)
      });
  }

  callApiMyParcel(phones, userSelected) {
    axios({
      method: 'get',
      url: `${domain}/tracking/myparcel/${phones}/${userSelected.no}`,
      headers: { 'Content-Type': 'application/json' }
    })
      .then(res => {
        const dataMyParcel = res.data
        this.setState({ loading: false, dataMyParcel: dataMyParcel })
      })
      .catch(error => {
        this.setState({ loading: false, error: 'Something just went wrong' })
        // alert(error)
        // console.log(error)
      });
  }

  renderItem = ({ item }) => {
    return (
      <ScrollView contentContainerStyle={{ flex: 1 }}>
        <TouchableOpacity style={styles.card} onPress={() => { this.clickEventListener(item) }}>
          <View style={styles.cardImage}>
            <Image style={styles.imageBox} source={ImgBox} />
            <Text style={{ fontSize: hp('2%'), textAlign: 'center', color: '#999999', marginTop: hp('1%') }}>{item.total_box} กล่อง</Text>
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.dateId}>[ {item.create_date} ]</Text>
            <Text style={styles.nameId}>{item.no}</Text>
            <View style={styles.span}></View>
            <Text style={styles.nameStatus}>{item.status_desc}</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    )
  }

  onRefresh(phones) {
    this.setState({ isRefreshing: true })
    axios({
      method: 'get',
      url: `${domain}/tracking/myparcellist/${phones}/Intransit`,
      headers: { 'Content-Type': 'application/json' }
    })
      .then(res => {
        const dataMyParcelList = res.data
        this.setState({ isRefreshing: false, dataMyParcelList: dataMyParcelList })
      })
      .catch(error => {
        this.setState({ isRefreshing: false, error: 'Something just went wrong' })
        // alert(error)
        // console.log(error)
      });
  }

  clickEventListener = (item) => {
    this.setState({ userSelected: item }, () => {
      this.callApiMyParcel(this.state.phones, this.state.userSelected) //Method for API call
      this.setState({ visibleModal: 1 })
    });
  }

  renderModalContentParcel = (currentslabels, labels) => (
    <View style={styles.popup}>
      <View style={styles.popupContent}>
        <ScrollView contentContainerStyle={styles.modalInfo}>
          <View style={{ flex: 1, flexDirection: 'row', padding: wp('5%'), alignItems: 'center' }}>
            <View style={styles.cardImage}>
              <Image style={styles.imageBox} source={ImgBox} />
              <Text style={{ fontSize: hp('2%'), textAlign: 'center', color: '#999999', marginTop: hp('1.2%') }}>{this.state.userSelected.total_box} กล่อง</Text>
            </View>
            <View style={{ flex: 1, flexDirection: 'column', marginLeft: wp('5%'), marginRight: 0, justifyContent: 'center' }}>
              <Text style={styles.position}>{this.state.dataMyParcel.data.shipping.receiver_id}</Text>
              <View style={styles.span}></View>
              <Text style={styles.position}>{this.state.dataMyParcel.data.shipping.name}</Text>
              <Text style={styles.position}>{this.state.dataMyParcel.data.shipping.phone}</Text>
              <Text style={styles.position}>{this.state.dataMyParcel.data.shipping.address}</Text>
            </View>
          </View>
          <View style={{ flex: 1, alignItems: 'center', width: wp('100%'), height: hp('30%') }}>
            <StepIndicator
              customStyles={stepIndicatorStyles}
              stepCount={3}
              direction='vertical'
              currentPosition={currentslabels}
              labels={labels.map(item => item.title)}
            />
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
  )

  render() {
    const labels =
      [
        {
          title: !this.state.dataMyParcel.data.job.create_date ? null : `${this.state.dataMyParcel.data.job.create_date} \n รับสินค้าเข้าระบบ`
        },
        {
          title: !this.state.dataMyParcel.data.job.receive_date ? null : `${this.state.dataMyParcel.data.job.receive_date} \n รอนำส่งสินค้า`
        },
        {
          title: !this.state.dataMyParcel.data.job.delivery_date ? null : `${this.state.dataMyParcel.data.job.delivery_date} \n จัดส่งสินค้าเรียบร้อย`
        }
      ]

    const res = labels.filter(a => {
      return a.title
    })
    let currentslabels = res.length

    if (this.state.loading) {
      return (
        <View style={{ width: "100%", height: "100%" }} >
          <ActivityIndicator style={{ color: "#fcfcfc" }} />
        </View>
      );
    }

    let MyParcelList;
    if (this.state.foundParcel) {
      MyParcelList =
        <FlatList
          style={styles.userList}
          data={this.state.dataMyParcelList.data.jobs}
          extraData={this.state}
          refreshControl={
            <RefreshControl
              refreshing={this.state.isRefreshing}
              onRefresh={this.onRefresh.bind(this, this.state.phones)}
            />}
          renderItem={this.renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
    } else {
      MyParcelList =
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Image style={{ width: wp('30%'), height: hp('15%'), resizeMode: 'contain', marginBottom: hp('4%') }} source={ImgBox2} />
          <Text style={{ marginTop: 0, fontSize: hp('2.5%'), color: '#d6d6d6', fontFamily: 'kanit', fontWeight: 'bold' }}>ไม่พบรายการสินค้า</Text>
        </View>
    }

    return (

      <View style={styles.screen}>

        {MyParcelList}

        <Modal
          isVisible={this.state.visibleModal === 1}
          backdropColor='#00000057'
          animationIn='zoomIn'
          animationInTiming={1200}
          animationOut='zoomOutUp'
          animationOutTiming={600}
          onBackdropPress={() => this.setState({ visibleModal: null })}>
          {this.renderModalContentParcel(currentslabels, labels)}
        </Modal>

      </View>


    );
  }
}

const dataMyParcelList = {
  "result": "",
  "status": "",
  "message": "",
  "data": {
    "user_id": "",
    "jobs": [
      {
        "no": "",
        "create_date": "",
        "receive_date": "",
        "delivery_date": "",
        "status": "",
        "status_desc": "",
        "total_box": ""
      }
    ]
  }
}

const dataMyParcel = {
  "result": "",
  "status": "",
  "message": "",
  "data": {
    "user_id": "",
    "job": {
      "no": "",
      "create_date": "",
      "receive_date": "",
      "delivery_date": "",
      "status": "",
      "status_desc": "",
      "total_box": ""
    },
    "shipping": {
      "receiver_id": "",
      "name": "",
      "phone": "",
      "address": "",
      "subdistrict": "",
      "district": "",
      "pronvince": "",
      "zipcode": ""
    }
  }
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#fcfcfc",
    // borderTopWidth: 3,
    // borderTopColor: '#d8d8d8'
  },
  //////////////////////Boxlist/////////////////////////
  userList: {
    flex: 1,
  },
  cardContent: {
    marginLeft: wp('5%'),
    // marginTop:10,
    // marginBottom:10,
    // alignSelf:'center',
    width: wp('50%'),
  },
  imageBox: {
    width: wp('20%'),
    height: hp('10%'),
    resizeMode: 'contain'
  },
  card: {
    // shadowColor: '#00000021',
    // shadowOffset: {
    //   width: 0,
    //   height: 6,
    // },
    // shadowOpacity: 0.37,
    // shadowRadius: 7.49,
    // elevation: 12,

    marginVertical: hp('2%'),
    marginHorizontal: wp('6%'),
    backgroundColor: "#fff",
    flexBasis: '46%',
    padding: wp('5%'),
    borderWidth: wp('0.75'),
    borderColor: '#eee',
    borderRadius: 20,
    flexDirection: 'row',
  },
  span: {
    borderBottomWidth: wp('0.5%'),
    borderBottomColor: '#eee',
    marginRight: 0,
    marginVertical: hp('1.2%'),
  },
  dateId: {
    fontSize: hp('1.6%'),
    flex: 1,
    alignSelf: 'flex-end',
    color: "#999999",
    fontFamily: 'kanit',
    marginBottom: hp('1.5%')
  },
  nameId: {
    fontSize: hp('2.2%'),
    flex: 1,
    alignSelf: 'flex-start',
    color: "#778899",
    fontFamily: 'kanit',
  },
  nameStatus: {
    fontSize: hp('2.2%'),
    flex: 1,
    alignSelf: 'flex-start',
    color: "#778899",
    fontFamily: 'kanit',
  },
  /////////////////////modals///////////////////////
  popup: {
    backgroundColor: 'white',
    marginHorizontal: wp('5%'),
    borderRadius: 20,
  },
  popupOverlay: {
    backgroundColor: "#00000057",
    flex: 1,
    justifyContent: 'center'
  },
  popupContent: {
    //alignItems: 'center',
    margin: wp('2%'),
    height: hp('60%'),
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
    backgroundColor: '#20b2aa',
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
    color: "#999999",
    fontFamily: 'kanit',
    fontSize: hp('2%'),
  },
  /////////////////////UploadPic/////////////////
});

const stepIndicatorStyles = {
  stepIndicatorSize: hp('4%'),
  currentStepIndicatorSize: hp('5%'),
  separatorStrokeWidth: 2,
  currentStepStrokeWidth: 3,
  stepStrokeCurrentColor: '#7eaec4',
  stepStrokeWidth: 3,
  stepStrokeFinishedColor: '#7eaec4',
  stepStrokeUnFinishedColor: '#dedede',
  separatorFinishedColor: '#7eaec4',
  separatorUnFinishedColor: '#dedede',
  stepIndicatorFinishedColor: '#7eaec4',
  stepIndicatorUnFinishedColor: '#ffffff',
  stepIndicatorCurrentColor: '#ffffff',
  stepIndicatorLabelFontSize: 0,
  currentStepIndicatorLabelFontSize: 0,
  stepIndicatorLabelCurrentColor: 'transparent',
  stepIndicatorLabelFinishedColor: 'transparent',
  stepIndicatorLabelUnFinishedColor: 'transparent',
  labelColor: '#999999',
  labelSize: hp('2%'),
  currentStepLabelColor: '#7eaec4'
}