import React, { Component } from 'react'
import Axios from 'axios'; //引入axios处理ajax
import {Loading, Button} from '../../components';
// 只使用一个组件
// import Button from 'antd-mobile/lib/button'
// import 'antd-mobile/lib/button/style/index.css'
// import {Button} from 'antd-mobile';// 整个引入
import './index.css';
class Detail extends Component{
    constructor(props){
        super(props);
        this.state = {
            data : {},
            actor: [],
            loading : true
        }
    }

    getData(id){
        let url = 'http://mockdata/detail';
        Axios.get(url).then((res) => {
          let filmData = res.data.film;
          this.setState({
              data : filmData,
              actor: filmData.actors,
              loading : false
          })
          this.props.actions.navBarSet(filmData.name)
        })
        window.scrollTo(0, 0);
    }

    componentDidMount(){
        // 初始化数据
        let id = this.props.params.id;
        this.getData(id);
    }

    getActor(data){
       let tmpStr = '';
       data.map(function(dData, index){
         if(index == 0){
           tmpStr += ' ' + dData.name;
         }
         else{
           tmpStr += ' / ' + dData.name;
         }
       })
       return tmpStr;
    }

    render(){
        const data = this.state.data;
        const detailHeadstyle = {backgroundImage: `url(${data.origin})`};
        return(
            <div className="detail-wrap">
                Detail
            </div>

        )
    }

}
export default  Detail;
