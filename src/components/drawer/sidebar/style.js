const React = require("react-native");
const { Platform, Dimensions } = React;
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;

export default {
  screen: {
    height: hp('100%'),
    width: wp('70%')
  },
  drawerCover: {
    alignSelf: "stretch",
    height: deviceHeight / 6.5,
    width: null,
    position: "relative",
    // marginBottom: 0,
    resizeMode: 'contain',
    margin: wp('3%')
  },
  drawerImage: {
    position: "absolute",
    left: Platform.OS === "android" ? deviceWidth / 10 : deviceWidth / 9,
    top: Platform.OS === "android" ? deviceHeight / 13 : deviceHeight / 12,
    width: wp('40%'),
    height: hp('10%'),
    resizeMode: "cover"
  },
  text: {
    fontWeight: Platform.OS === "ios" ? "500" : "400",
    fontSize: hp('2%'),
    marginLeft: wp('4%')
  },
  badgeText: {
    fontSize: Platform.OS === "ios" ? 13 : 11,
    fontWeight: "400",
    textAlign: "center",
    marginTop: Platform.OS === "android" ? -3 : undefined
  },
  image: {
    width: wp('15%'),
    height: hp('20%'),
    resizeMode: 'contain'
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
    height: hp('50%'),
  },
  popupContent2: {
    //alignItems: 'center',
    margin: wp('2.5%'),
    height: hp('40%'),
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
    backgroundColor: '#23527c',
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
  },
  position1: {
    color: "#999999",
    fontSize: hp('1.8%'),
    fontFamily: 'kanit',
    textAlign: 'center',
    fontSize: hp('2%'),
  },
  Imgwarning: {
    width: 70,
    height: 70,
    resizeMode: 'contain',
  },
  Imgerror: {
    width: wp('50%'),
    height: hp('10%'),
    resizeMode: 'contain',
    marginBottom: 10
  },
};
