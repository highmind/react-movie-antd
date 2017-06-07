import React, { Component } from 'react'
// import {List, NavBar, Nav, Slider, Loading, Icon} from '../../components';
import Axios from 'axios';
import './index.css';
//首页页面
class Search extends Component{
    constructor(props){
        super(props);
        this.state = {
        }
        this.props.actions.navBarSet("搜索电影")
    }


    componentDidMount(){

    }

    componentDidUpdate(prevProps) {


    }

    componentWillUnmount () {


    }


    render(){
        return(

            <div className="main-con">
              Search
            </div>
        )
    }

}


export default  Search
