import React, { Component } from "react";
import { connect } from "react-redux";
import {
    View,
    BackHandler,
    Alert,
} from "react-native";
import Navigator from './navigator';
import NavigationService from "./navigationService";
import { NavigationActions } from 'react-navigation';
import SplashScreen from "react-native-splash-screen";

@connect(({ page, cart }) => ({
    pageData: page.portal.result.info,
    cartNum: cart.totalNum.result.total_num
}))
class App extends Component {
    async componentDidMount() {
        BackHandler.addEventListener("hardwareBackPress", this.onBackPress);
        const { dispatch } = this.props
        dispatch({
            type: "page/portal"
        })
        dispatch({
            type: "user/initUserinfoStorage"
        })
        dispatch({
            type: "wechat/isWXAppInstalled"
        })
        dispatch({
            type: "area/list",
            payload: { level: 2, tree: 1 }
        })
        SplashScreen.hide();
    }
    componentWillUnmount() {
        BackHandler.removeEventListener("hardwareBackPress", this.onBackPress);
    }
    onBackPress = () => {
        const { dispatch, navigation } = this.props;
        if (navigation.index > 0) {
            dispatch(NavigationActions.back());
            return true;
        } else {
            Alert.alert(
                '退出应用',
                '确认退出应用吗?',
                [
                    { text: '取消', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                    { text: '确认', onPress: () => BackHandler.exitApp() },
                ],
                { cancelable: false }
            )
            return true;
        }
    }
    render() {
        const { cartNum, pageData } = this.props;
        return (
            <View style={{ flex: 1 }}>
                <Navigator 
                    screenProps={{
                        cartNum,
                        homeTitle: pageData.name
                    }}
                    ref={navigatorRef => {
                        NavigationService.setTopLevelNavigator(navigatorRef);
                    }}
                />
            </View>
        )

    }

}

export default App;
