import React, { Component } from 'react'
import {Link, hashHistory} from 'react-router';
import {ListView, Flex, WingBlank, WhiteSpace, Button, Toast} from 'antd-mobile';
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
        Toast.loading('加载中...',0,()=>{},true);
        pageIndex++;

        // let self = this;
        let url = 'http://mockdata/' + type + '?page=0' +'&count=' + this.state.count;
        Axios.get(url).then((res) => {
          if(!this.ignoreLastFetch){
              Toast.hide();
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

    componentDidUpdate(prevProps) {
        // 上面步骤3，通过参数更新数据
        let oldType = prevProps.params.type;
        let type = this.props.params.type;
        if (type !== oldType){
            // 如果路由获取不到参数，获取推荐数据
            if(typeof(type) == 'undefined'){
              this.getData('playing');
            }
            // 否则获取相应栏目数据，根据type查询
            else {
              this.getData(type);
            }
        }
    }

    //滑动到底部
    onEndReached = (event) => {
      //如果正在加载，返回
      if(this.state.isLoading){
        return;
      }

      Toast.loading('加载中...',0,()=>{},true);

      console.log('bottom');

      let url = 'http://mockdata/' + this.props.params.type + '?page=0' +'&count=' + this.state.count;
      Axios.get(url).then((res) => {
        if(!this.ignoreLastFetch){
            Toast.hide();
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
          <WingBlank size="lg">
            <Flex>
              <div className="filmlist-news-img">
                  <img width="100%" src={rowData.cover.origin} alt=""/>
              </div>
              <div className="filmlist-news-con">
                  <h4>{rowData.name}</h4>
                  <p className="filmlist-time-bar">{rowData.intro}</p>
              </div>
              <div className="filmlist-news-right">
                <Button type="ghost" inline size="small"
                   onClick={() =>{hashHistory.push(`film/${rowData.id}`)}}>
                  更多
                </Button>
              </div>
            </Flex>
          </WingBlank>


        );
      };


      return (

        <div>
          <WhiteSpace size='lg'/>
          <WingBlank size="lg">
            <Flex>
              <Flex.Item>
                <Link className="filmlist-type-link"
                  activeClassName="filmlist-active"
                  to="/filmlist/playing">
                  正在热映
                </Link>
              </Flex.Item>
              <Flex.Item>
                <Link className="filmlist-type-link"
                activeClassName="filmlist-active"
                 to="/filmlist/coming">
                 即将上映
               </Link>
             </Flex.Item>
            </Flex>
          </WingBlank>
          <WhiteSpace size='lg'/>
          <ListView ref="lv"
                    dataSource={this.state.dataSource}
                    renderHeader={''}
                    renderFooter={() => (
                      <div style={{paddingBottom: '20px'}}>
                        <Button type="ghost" inline size="small">
                          查看更多
                        </Button>
                      </div>)}
                    renderRow={row}
                    renderSeparator={separator}
                    className="am-list"
                    pageSize={7}
                    useBodyScroll
                    scrollRenderAheadDistance={500}
                    scrollEventThrottle={20}
                    onScroll={() => { console.log('scroll'); }}
                    onEndReached={this.onEndReached}
                    onEndReachedThreshold={10}
                  />

        </div>
      );

    }


}

export default  FilmList
