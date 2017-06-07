import React, { Component } from 'react';
import {bindActionCreators} from 'redux';
import { NavBar, Icon } from 'antd-mobile';
import {Link} from 'react-router';
import Axios from 'axios';
import * as actionCreators from '../actions/actions';
import {connect} from 'react-redux';
// 主容器
class App extends Component{
    constructor(props){
        super(props);
        console.log('-------App--------')
        console.log('主容器App执行getInitialState')
        this.state = {
            navActive:false,
            nav:[],        //导航数据
            data:[]
        }
        this.toggleNav = this.toggleNav.bind(this);
        this.getNavBarText = this.getNavBarText.bind(this);
    }

    // NavBar按钮点击，切换Nav的显示和隐藏，且用于与Nav组件通信
    toggleNav(){
      this.setState({
        navActive : !this.state.navActive
      })
    }

    componentDidMount(){
        console.log('-------App--------')
        console.log('主容器App执行componentDidMount')
        // 初始化导航数据
        let url = 'http://mockdata/nav';
        let self = this;
        let NavData = localStorage.getItem('NavData');
        // 如果导航数据在本地存在，则不请求远程数据
        if(NavData != null){
            self.setState({nav:JSON.parse(NavData)})
        }else{
            Axios.get(url).then(function(res){
                self.setState({nav:res.data.data})
                localStorage.setItem("NavData", JSON.stringify(res.data.data));
            })
        }
    }

    getNavBarText(){
      // let textArr = this.props.navBarText;
      // let len = textArr.length;
      // if(len != 0){
      //   return textArr[len - 1].text;
      // }else{
      //   return "芝麻电影"
      // }
      return this.props.navBarText;
    }

    render(){

      return(
          <div>
        
            <NavBar leftContent="search"
            mode="light"
            onLeftClick={() => console.log('onLeftClick')}
            rightContent={[
              <Icon key="0" type="search" style={{ marginRight: '0.32rem' }} />,
              <Icon key="1" type="ellipsis" />,
            ]}>{this.getNavBarText()}</NavBar>
            {React.cloneElement(this.props.children, this.props)}
          </div>
        )
    }

}
//融合state 进  props，这样组件可以使用store中的数据，通过this.props
//即返回props
function mapStateToProps(state){
    return {
      position: state.setScrollTest, //setScrollTest 为 reducer的函数名
      navBarText : state.navBarSetTest //navBarSetTest 为 reducer的函数名
    }
}

//融合dispatch 进 props，这样组件可以通过this.props来调用dispatch
//即返回action,调用方式 this.props.actions. 相应的actions
function mapDispatchToProps(dispatch){
    return {actions:bindActionCreators(actionCreators, dispatch)};
}

// 将App组件 于 redux进行连接
export default  connect(mapStateToProps, mapDispatchToProps)(App)
