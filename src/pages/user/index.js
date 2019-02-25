import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    Text,
    Image,
    TouchableOpacity,
} from 'react-native';
import { List } from "antd-mobile-rn";
import { PublicStyles } from '../../utils/style';
import Avatar from "../../components/public/avatar";
import FeatherIcon from "react-native-vector-icons/Feather";
import { connect } from "react-redux";
import Badge from "@react-native-component/react-native-smart-badge";
import { LottieIosRefreshControl, LottieAndroidRefreshControl } from '../../components/refreshControl';
import { ScrollView as ScrollViewLottie } from 'react-native-mjrefresh'
import { AppPlatform } from '../../config';

const Item = List.Item

@connect(({ user, order }) => ({
    login: user.login,
    userInfo: user.self,
    orderNum: order.stateNum.result,
}))
export default class User extends Component {
    componentDidMount() {
        const { navigation } = this.props
        navigation.addListener(
            'didFocus', this.refreshFunc
        );
    }
    refreshFunc = () => {
        const { dispatch, login } = this.props
        if (login) {
            dispatch({ 
                type: 'order/stateNum',
                callback: () => this.lottieRefresh && this.lottieRefresh.finishRefresh() 
            });
        }
    }
    render() {
        return <View style={PublicStyles.ViewMax}>
            {
                AppPlatform === 'ios' ? 
                <ScrollViewLottie
                    scrollEventThrottle={50}
                    refreshControl={(
                        <LottieIosRefreshControl
                            ref={ref => this.lottieRefresh = ref}
                            onRefresh={this.refreshFunc}
                        />
                    )}
                >
                    {
                        this.top()
                    }
                    {
                        this.mid()
                    }
                    {
                        this.bot()
                    }
                </ScrollViewLottie> : 
                <ScrollView
                    scrollEventThrottle={50}
                    refreshControl={(
                        <LottieAndroidRefreshControl 
                            ref={ref => this.lottieRefresh = ref}
                            onRefresh={this.refreshFunc}
                        />
                    )}
                >
                    {
                        this.top()
                    }
                    {
                        this.mid()
                    }
                    {
                        this.bot()
                    }
                </ScrollView>
            }
            <View style={styles.fashopCopyright}>
                <Image 
                    source={require('../../images/fashop/copyright.png')} 
                    mode="aspectFit"    
                    style={styles.fashopCopyrightImg} 
                />
                <Text style={styles.fashopCopyrightText}>提供技术支持</Text>
            </View>
        </View>;
    }
    top() {
        const { login, userInfo, navigation } = this.props;
        return (
            <TouchableOpacity
                style={[PublicStyles.rowBetweenCenter, styles.topWarp]}
                activeOpacity={.8}
                onPress={() => {
                    navigation.navigate(login ? "UserInfo" : "UserLogin")
                }}
            >
                <View style={PublicStyles.rowCenter}>
                    <Avatar
                        avatar={login&&userInfo&&userInfo.profile ? userInfo.profile.avatar : null}
                        size={60}
                        otherStyle={{
                            marginRight: 15,
                        }}
                    />
                    <Text style={[PublicStyles.boldTitle, { fontSize: 20 }]}>
                        {
                            login&&userInfo&&userInfo.profile ? userInfo.profile.nickname : "点击登录"
                        }
                    </Text>
                </View>
                <View style={PublicStyles.rowCenter}>
                    <Text style={PublicStyles.descFour9}>设置</Text>
                    <FeatherIcon
                        name="chevron-right"
                        size={22}
                        color="#CCCCCC"
                    />
                </View>
            </TouchableOpacity>
        )
    }

    mid() {
        let { orderNum = {}, navigation, login } = this.props;
        const orderList = [
            {
                img: require('../../images/user/state_new.png'),
                title: '待付款',
                num: orderNum.state_new,
                path: "OrderList",
                params: {
                    state_type:'state_new'
                }
            }, {
                img: require('../../images/user/state_pay.png'),
                title: '待发货',
                num: orderNum.state_send,
                path: "OrderList",
                params: {
                    state_type:'state_pay'
                }
            }, {
                img: require('../../images/user/state_send.png'),
                title: '已完成',
                num: orderNum.state_success,
                path: "OrderList",
                params: {
                    state_type:'state_success'
                }
            }, {
                img: require('../../images/user/state_unevaluate.png'),
                title: '待评价',
                num: orderNum.state_unevaluate,
                path: "EvaluateList"
            }, {
                img: require('../../images/user/state_refund.png'),
                title: '退款售后',
                num: orderNum.state_refund,
                path: "RefundList"
            }
        ]
        return (
            <View style={{ marginVertical: 10 }}>
                <List>
                    <Item
                        extra={(<Text style={[PublicStyles.descFour9, { marginTop: 3 }]}>全部订单</Text>)}
                        arrow="horizontal"
                        onClick={() => navigation.navigate(login ? 'OrderList' : 'UserLogin')}
                    >
                        <Text style={PublicStyles.boldTitle}>我的订单</Text>
                    </Item>
                </List>
                <View style={styles.midList}>
                    {
                        orderList.map((item, index) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.midItem}
                                onPress={() => {
                                    if(login){
                                        navigation.navigate(item.path, item.params)
                                    }else {
                                        navigation.navigate('UserLogin')
                                    }
                                }}
                            >
                                {
                                    item.num ?
                                    <Badge
                                        textStyle={{ color: '#fff', fontSize: 11 }}
                                        style={{ position: 'absolute', right: 10, top: -10 }}
                                        minHeight={18}
                                        minWidth={18}
                                    >
                                        {
                                            item.num
                                        }
                                    </Badge> : null
                                }
                                <Image style={styles.midImg} source={item.img} />
                                <Text style={PublicStyles.descTwo6}>{item.title}</Text>
                            </TouchableOpacity>
                        ))
                    }
                </View>
            </View>
        )
    }

    bot() {
        const { navigation, login } = this.props;
        const botList = [
            {
                img: require('../../images/user/address.png'),
                title: '地址管理',
                path: "UserAddressList"
            }, {
                img: require('../../images/user/collect.png'),
                title: '商品收藏',
                path: "CollectGoods"
            }
        ]
        return (
            <List>
                {
                    botList.map((item, index) => (
                        <Item
                            key={index}
                            arrow="horizontal"
                            onClick={() => navigation.navigate(login ? item.path : 'UserLogin')}
                        >
                            <View style={PublicStyles.rowCenter}>
                                <Image style={styles.botImg} source={item.img} />
                                <Text style={PublicStyles.title}>{item.title}</Text>
                            </View>
                        </Item>
                    ))
                }
            </List>
        )
    }
}

const styles = StyleSheet.create({
    topWarp: {
        height: 100,
        paddingLeft: 15,
        paddingRight: 10,
        backgroundColor: '#fff'
    },
    midList: {
        flexDirection: 'row',
        alignItems: "center",
        height: 75,
        backgroundColor: '#fff'
    },
    midItem: {
        flex: 1,
        alignItems: "center"
    },
    midImg: {
        width: 22,
        height: 22,
        marginBottom: 9
    },
    botImg: {
        width: 22,
        height: 22,
        marginRight: 10
    },
    fashopCopyright: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 15
    },
    fashopCopyrightImg: {
        height: 16,
        width: 50,
        marginRight: 5
    },
    fashopCopyrightText: {
        color: '#cccccc',
        fontSize: 13,
    }
});
