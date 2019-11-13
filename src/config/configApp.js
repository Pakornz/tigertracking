let domainTDL = `https://webapi6.icc.co.th:7022/tms`
let domainHisher = `https://webapi.icc.co.th:7005/hisher`

export const domain = `${domainTDL}`
export const domainHis = `${domainHisher}`

// APP VERSION ANDROID 1.6
// APP VERSION iOS 1.4
// versionCodeAndroid 7
// versionCodeIOS 6
// Android 1.6
// iOS 1.4

import { Platform, Dimensions } from "react-native";

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;
const platform = Platform.OS;
export const isIphoneX = platform === "ios" && (deviceHeight === 812 || deviceWidth === 812 || deviceHeight === 896 || deviceWidth === 896);
