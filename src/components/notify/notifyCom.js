import React from "react";
import axios from "axios";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import {
    StyleSheet, ScrollView, Image, ActivityIndicator, RefreshControl,
    TouchableOpacity,
    TouchableHighlight,
    Text, FlatList, AsyncStorage
} from "react-native";
import { View } from "native-base";
import Modal from "react-native-modal";
import ImageOpen from './../../assets/emailopen.png';
import ImageNoOpen from './../../assets/emailnoopen.png';
import ImageEmail from './../../assets/email-filled-closed-envelope.png';
import { bindActionCreators, createStore } from 'redux';
import { connect } from 'react-redux';
import badgeCountReducer from '../../reducers/badgeCountReducer';
import { increaseBadge, decreaseBadge } from './../../actions/index';
import { SwipeListView } from 'react-native-swipe-list-view';
import { domain, notify_jobstatus } from '../../config/configApp'

class notifyCom extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            isRefreshing: false,
            BadgeCount: null,
            phones: "",

            dataMessageList: dataMessageList,
            dataResponeMessage: dataResponeMessage,
            dataResponeDeleteMessage: dataResponeDeleteMessage,

            foundNotification: false,
            spinner: false,
            visibleModal: null,
            messageid: null,
            messagebody: null,
        }

    }

    async componentDidMount() {
        await AsyncStorage.getItem('phone', (err, result) => {
            this.setState({ phones: result })
            console.log('####pageNotification', this.state.phones);
        });

        this.callApiMessageNotifyList(this.state.phones) //Method for API call
    }


    // decrease = async (badge) => {
    //     if (badge == 0 || badge == null) {
    //         null
    //     } else {
    //         let decrease = Number(badge) - 1
    //         this.setState({ BadgeCount: decrease })
    //         await this.setState({ BadgeCount: decrease })
    //         AsyncStorage.getItem('badge')
    //             .then(data => {
    //                 data = JSON.parse(data);
    //                 data = Number(this.state.BadgeCount)
    //                 console.log(data);
    //                 AsyncStorage.setItem('badge', JSON.stringify(data));
    //             }).done();
    //     }
    // }


    callApiMessageNotifyList(mobile_phone) {
        // this.setState({spinner:true})
        axios({
            method: 'get',
            url: `${domain}/notification/messagenotifylist/${notify_jobstatus}/${mobile_phone}`,
            headers: { 'Content-Type': 'application/json' }
        })
            .then(res => {
                const dataMessageList = res.data
                this.setState({ loading: false, dataMessageList: dataMessageList, foundNotification: true, spinner: false })

                // const daataa = this.state.dataMessageList.data
                // const datares = daataa.filter(a => {
                //     return a.read_status == 'N'
                // })
                // const resCount = datares.length
                // this.setState({ BadgeCount: resCount })
            })
            .catch(error => {
                this.setState({ loading: false, error: 'Something just went wrong', spinner: false })
                // alert(error)
                console.log(error)
            });
    }

    onRefresh = (mobile_phone) => {
        // this.setState({ isRefreshing: true })
        axios({
            method: 'get',
            url: `${domain}/notification/messagenotifylist/${notify_jobstatus}/${mobile_phone}`,
            headers: { 'Content-Type': 'application/json' }
        })
            .then(res => {
                const dataMessageList = res.data
                this.setState({ isRefreshing: false, dataMessageList: dataMessageList, spinner: false })

                // const daataa = this.state.dataMessageList.data
                // const datares = daataa.filter(a => {
                //     return a.read_status == 'N'
                // })
                // const resCount = datares.length
                // this.setState({ BadgeCount: resCount })
            })
            .catch(error => {
                this.setState({ isRefreshing: false, error: 'Something just went wrong', spinner: false })
                // alert(error)
                console.log(error)
            });
        console.log('###########', 'onRefresh')
    }

    clickEventListener = (messageid, messagebody) => {
        this.setState({ messageid: messageid, messagebody: messagebody }, () => {
            console.log('%%%%%%%%%%%%%%%%%', this.state.messageid);
            console.log('%%%%%%%%%%%%%%%%%', this.state.messagebody);
            this.setState({ visibleModal: 1 })
        });
    }

    openM = (job_no, seq_no) => {
        axios({
            method: 'post',
            url: `${domain}/notification/updatemessagenotifyread`,
            headers: { 'Content-Type': 'application/json' },
            data: {
                subject_id: `${notify_jobstatus}`,
                user_id: `${this.state.phones}`,
                job_no: `${job_no}`,
                seq_no: seq_no,
            }
        })
            .then(res => {
                const dataResponeMessage = res.data
                this.setState({ loading: false, dataResponeMessage: dataResponeMessage, spinner: false })
                this.props.decreaseBadge()
                console.log(dataResponeMessage.message)
                this.onRefresh(this.state.phones)
            })
            .catch(error => {
                this.setState({ loading: false, error: 'Something just went wrong', spinner: false })
                // alert(error)
                console.log(error)
            });
    }

    deleteM = (job_no, seq_no) => {
        axios({
            method: 'delete',
            url: `${domain}/notification/deletemessagenotify`,
            headers: { 'Content-Type': 'application/json' },
            data: {
                subject_id: `${notify_jobstatus}`,
                user_id: `${this.state.phones}`,
                job_no: `${job_no}`,
                seq_no: seq_no,
            }
        })
            .then(res => {
                const dataResponeDeleteMessage = res.data
                this.setState({ loading: false, dataResponeDeleteMessage: dataResponeDeleteMessage, spinner: false })
                console.log(dataResponeDeleteMessage.message)
                this.onRefresh(this.state.phones)
            })
            .catch(error => {
                this.setState({ loading: false, error: 'Something just went wrong', spinner: false })
                // alert(error)
                console.log(error)
            });
    }

    renderModalContentEmail = (messageid, messagebody) => (
        <View style={styles.popup}>
            <View style={styles.popupContent}>
                <ScrollView contentContainerStyle={styles.modalInfo}>
                    <View style={{ flex: 1, flexDirection: 'column', padding: wp('5%'), alignItems: 'center' }}>
                        <View style={styles.cardImage}>
                            <Image style={styles.imageBox} source={ImageOpen} />
                        </View>
                        <View style={{ marginTop: 20, justifyContent: 'center' }}>
                            <Text style={styles.position}>{messageid}</Text>
                        </View>
                        <View style={{ marginTop: 20, justifyContent: 'center' }}>
                            <Text style={styles.position2}>{messagebody}</Text>
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
    )

    renderItem = ({ item }) => {
        //this.clickEventListener(item.message_id, item.body)
        const noopenmail =
            <TouchableHighlight underlayColor={'white'} style={styles.notificationBox} onPress={() => { this.clickEventListener(item.message_title, item.message_body), this.openM(item.job_no, item.seq_no) }}>
                <View style={{ flexDirection: 'row' }}>
                    <Image style={styles.icon}
                        source={ImageNoOpen} />
                    <View style={{ flexDirection: 'column' }}>
                        <View>
                            <Text style={styles.date_Id}>[ {item.create_date} ]</Text>
                        </View>
                        <Text numberOfLines={1} ellipsizeMode='tail' style={styles.title_email}>{item.message_title}</Text>
                        <Text numberOfLines={1} ellipsizeMode='tail' style={styles.description_email}>{item.message_body}</Text>
                    </View>
                </View>
            </TouchableHighlight>

        const openmail =
            <TouchableHighlight underlayColor={'white'} style={styles.notificationBox} onPress={() => { this.clickEventListener(item.message_title, item.message_body) }}>
                <View style={{ flexDirection: 'row' }}>
                    <Image style={styles.icon}
                        source={ImageOpen} />
                    <View style={{ flexDirection: 'column' }}>
                        <View>
                            <Text style={styles.date_Id}>[ {item.create_date} ]</Text>
                        </View>
                        <Text numberOfLines={1} ellipsizeMode='tail' style={styles.title_email}>{item.message_title}</Text>
                        <Text numberOfLines={1} ellipsizeMode='tail' style={styles.description_email}>{item.message_body}</Text>
                    </View>
                </View>
            </TouchableHighlight>

        let viewSelectN;
        let viewSelectY;

        if (item.read_message_status == 'N') {
            viewSelectN = noopenmail
        } else {
            viewSelectY = openmail
        }

        return (
            <ScrollView contentContainerStyle={{ flex: 1 }}>
                {viewSelectN}
                {viewSelectY}
            </ScrollView>
        )
    }

    renderHiddenItem = ({ item }) => {

        return (
            <ScrollView contentContainerStyle={{ flex: 1 }}>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                    <TouchableOpacity style={{ flex: 1 }} onPress={() => { this.deleteM(item.job_no, item.seq_no) }}>
                        <View style={styles.notificationBoxSwipeStart}>
                            <Text style={{ color: 'white', fontSize: hp('2.5%'), textAlign: 'center' }}>ลบ</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={{ flex: 1 }} onPress={() => { this.deleteM(item.job_no, item.seq_no) }}>
                        <View style={styles.notificationBoxSwipeEnd}>
                            <Text style={{ color: 'white', fontSize: hp('2.5%'), textAlign: 'center' }}>ลบ</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        )
    }

    render() {
        if (this.state.loading) {
            return (
                <View style={{ width: "100%", height: "100%" }} >
                    <ActivityIndicator style={{ color: "#fff" }} />
                </View>
            );
        }

        let NotificationList;
        if (this.state.foundNotification) {
            NotificationList =
                <SwipeListView
                    style={styles.notificationList}
                    data={this.state.dataMessageList.data.message_nofity}
                    renderItem={this.renderItem}
                    renderHiddenItem={this.renderHiddenItem}
                    leftOpenValue={75}
                    rightOpenValue={-75}
                    keyExtractor={(item, index) => index.toString()}
                />
            // <FlatList
            //     style={styles.notificationList}
            //     data={this.state.dataMessageList.data}
            //     extraData={this.state}
            //     refreshControl={
            //         <RefreshControl
            //             refreshing={this.state.isRefreshing}
            //             onRefresh={this.onRefresh.bind(this, this.state.phones)}
            //         />}
            //     renderItem={this.renderItem}
            //     keyExtractor={(item, index) => index.toString()}
            // />
        } else {
            NotificationList =
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Image style={{ width: wp('20%'), height: hp('10%'), resizeMode: 'contain', marginBottom: hp('4%') }} source={ImageEmail} />
                    <Text style={{ marginTop: 0, fontSize: hp('2.5%'), color: '#d6d6d6', fontFamily: 'kanit', fontWeight: 'bold' }}>ไม่พบรายการข้อความ</Text>
                </View>
        }

        return (

            <View style={styles.screen}>

                {NotificationList}

                <Modal
                    isVisible={this.state.visibleModal === 1}
                    backdropColor='#00000057'
                    animationIn='zoomIn'
                    animationInTiming={1200}
                    animationOut='zoomOutUp'
                    animationOutTiming={600}
                    onBackdropPress={() => this.setState({ visibleModal: null })}>
                    {this.renderModalContentEmail(this.state.messageid, this.state.messagebody)}
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
    return bindActionCreators({ decreaseBadge: decreaseBadge }, dispatch)
}

export default connect(mapStateToProps, matchDispatchToProps)(notifyCom)


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

const dataResponeMessage = {
    "result": "",
    "status": "",
    "message": ""
}

const dataResponeDeleteMessage = {
    "result": "",
    "status": "",
    "message": ""
}

const styles = StyleSheet.create({
    spinnerTextStyle: {
        color: '#FFF'
    },
    screen: {
        flex: 1,
        backgroundColor: "#fcfcfc",
    },
    logo: {
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',
        width: wp('40%'),
        height: hp('20%'),
        resizeMode: 'contain',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#fcfcfc",
    },
    box: {
        padding: wp('3%'),
        paddingLeft: wp('5%'),
        backgroundColor: '#fcfcfc',
        flexDirection: 'row',
        borderBottomWidth: wp('0.75%'),
        borderBottomColor: '#d8d8d8',
        backgroundColor: '#23527c'
    },
    title: {
        fontSize: hp('2.5%'),
        color: "#fff", //474747
    },
    notificationList: {
        flex: 1,
        paddingHorizontal: wp('2%')
    },
    notificationBox: {
        marginVertical: hp('1%'),
        marginHorizontal: wp('1%'),
        backgroundColor: "#fff",
        height: hp('15%'),
        padding: wp('5%'),
        borderWidth: wp('0.5%'),
        borderColor: '#eee',
        borderRadius: 10,
        flexDirection: 'row',
    },
    notificationBoxSwipeStart: {
        flex: 1,
        justifyContent: 'center',
        alignSelf: 'flex-start',
        marginVertical: hp('1%'),
        marginHorizontal: wp('1%'),
        backgroundColor: "#cb3837",
        width: wp('17%'),
        height: hp('12.5%'),
        padding: wp('2%'),
        borderWidth: wp('0.5%'),
        borderColor: '#eee',
        borderRadius: 10,
    },
    notificationBoxSwipeEnd: {
        flex: 1,
        justifyContent: 'center',
        alignSelf: 'flex-end',
        marginVertical: hp('1%'),
        marginHorizontal: wp('1%'),
        backgroundColor: "#cb3837",
        width: wp('17%'),
        height: hp('12.5%'),
        padding: wp('2%'),
        borderWidth: wp('0.5%'),
        borderColor: '#eee',
        borderRadius: 10,
    },
    icon: {
        width: wp('13%'),
        height: hp('10%'),
        resizeMode: 'contain',
    },
    title_email: {
        fontSize: hp('2%'),
        color: "#646464",
        marginLeft: wp('5%'),
        marginRight: wp('11.25%'),
    },
    description_email: {
        fontSize: hp("1.75%"),
        color: "#646464",
        marginTop: hp('1.25%'),
        marginLeft: wp('5%'),
        marginRight: wp('11.25%'),
    },
    date_Id: {
        fontSize: hp('1.6%'),
        alignSelf: 'flex-end',
        color: "#999999",
        marginBottom: hp('1%')
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
    position2: {
        color: "#999999",
        fontFamily: 'kanit',
        fontSize: hp('2.5%'),
    },
    imageBox: {
        width: wp('20%'),
        height: hp('10%'),
        resizeMode: 'contain'
    },
});