import React, { Component } from 'react';
import {bindActionCreators} from 'redux';
import { NavBar, Icon, Drawer, List } from 'antd-mobile';
import {Link} from 'react-router';
import Axios from 'axios';
import * as actionCreators from '../actions/actions';
import {connect} from 'react-redux';
// 主容器
class App extends Component{
    constructor(props){
        super(props);
        this.state = {
            open: false,
            position: 'left',
            nav:[], //导航数据
            data:[]
        }
        this.getNavBarText = this.getNavBarText.bind(this);
    }

    onOpenChange = (...args) => {
      this.setState({ open: !this.state.open });
    }

    componentDidMount(){
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
      return this.props.navBarText;
    }

    render(){
      const sidebar = (<List>
      {this.state.nav.map((i, index) => {
        return (
          <List.Item key={index}  align="middle" onClick={this.onOpenChange}
           arrow="horizontal">
            <Link className="app-nav-link" to={i.link}>{i.name}</Link>
          </List.Item>);
      })}
     </List>);

     const drawerProps = {
        open: this.state.open,
        position: this.state.position,
        onOpenChange: this.onOpenChange,
      };

      return(
          <div>
            <NavBar leftContent=""
            mode="dark"
            iconName={require("../../icon/menu.svg")}
            onLeftClick={this.onOpenChange}
            rightContent={[
              <Link key="0" to="/search" style={{ marginRight: '0.32rem' }}>
                <Icon key="0" color="#fff" type="search" />
              </Link>,
              <Link key="1" to="/user">
                <Icon key="1" color="#fff" type={require("../../icon/user.svg")} />
              </Link>

            ]}>
            {this.getNavBarText()}
           </NavBar>

          <Drawer
             className="my-drawer"
             style={{ minHeight: document.documentElement.clientHeight - 80 }}
             dragHandleStyle={{ display: 'none' }}
             contentStyle={{ color: '#A6A6A6', textAlign: 'center', paddingTop: 0}}
             sidebar={sidebar}
             {...drawerProps}>
             {React.cloneElement(this.props.children, this.props)}
          </Drawer>

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
