import React, { Component } from 'react'
import {Link} from 'react-router';
import {ListView} from 'antd-mobile';
// import {Item, Loading, Button} from '../../components';
import Axios from 'axios';
import './index.css';

let pageIndex = 0;

class FilmList extends Component{
    constructor(props){
        super(props);
        const dataSource = new ListView.DataSource({ //必须定了rowHasChanged
          rowHasChanged:(row1, row2) => row1 !== row2,
        });

        this.state = {
          dataSource:dataSource.cloneWithRows({}),
          isLoading: true,
          count: 7,
        }

    }

    // type 为通过url传的参数
    getData(type, pageIndex){
        //数据返回之前，重新设置state,因为不同路由使用的一个组件，切换时，需要重置状态
        this.setState({
          isLoading : true   //loading参数
        })

        pageIndex++;

        // let self = this;
        let url = 'http://mockdata/' + type + '?page=0' +'&count=' + this.state.count;
        Axios.get(url).then((res) => {
          if(!this.ignoreLastFetch){
              this.rData = res.data.data;
              this.setState({
                  dataSource : this.state.dataSource.cloneWithRows(this.rData),
                  isLoading : false
              })
          }
        })

        // Axios.get(url).then(function(res){
        //     if(!self.ignoreLastFetch){
        //         this.rData = res.data.data;
        //         self.setState({
        //             dataSource : self.state.dataSource.cloneWithRows(this.rData),
        //             isLoading : false
        //         })
        //     }
        // })

    }

    componentDidMount(){
      this.props.actions.navBarSet("全部影片");
      this.getData(this.props.params.type, 0);
    }

    //滑动到底部
    onEndReached = (event) => {
      //如果正在加载，返回
      if(this.state.isLoading){
        return;
      }

      this.setState({
        isLoading : true   //loading参数
      })

      console.log('bottom');

      let url = 'http://mockdata/' + this.props.params.type + '?page=0' +'&count=' + this.state.count;
      Axios.get(url).then((res) => {
        if(!this.ignoreLastFetch){
            this.rData = [...this.rData, ...res.data.data];
            this.setState({
                dataSource : this.state.dataSource.cloneWithRows(this.rData),
                isLoading : false
            })
        }
      })
    }

    render(){
      const separator = (sectionID, rowID) => (
        <div key={`${sectionID}-${rowID}`}
          style={{
            backgroundColor: '#F5F5F9',
            height: 8,
            borderTop: '1px solid #ECECED',
            borderBottom: '1px solid #ECECED',
          }}
        />
      );

      const row = (rowData, sectionID, rowID) => {
        return (
            <Item key={rowData.id} data={rowData} />
        );
      };


      return (

        <div></div>
      );

    }


}

export default  FilmList
