import React, { Component } from 'react'
import {Link, hashHistory} from 'react-router';
import {ListView, Flex, WingBlank, WhiteSpace, Button, Toast} from 'antd-mobile';
import Axios from 'axios';
import './index.css';

class FilmList extends Component{
    constructor(props){
        super(props);
        const dataSource = new ListView.DataSource({ //必须有rowHasChanged
          rowHasChanged:(row1, row2) => row1 !== row2,
        });

        this.rData = [];

        this.state = {
          dataSource:dataSource.cloneWithRows({}),
          isLoading: true,
          count: 7,
        }

    }

    /*
    ** @params type 为路由参数，如：coming
    ** @params page 为页数
    */
    getData(type, page){
        this.setState({
          isLoading : true
        })
        Toast.loading('加载中...',0,()=>{},true); //开始加载提示
        let url = `http://mockdata/${type}?page=${page}&count=${this.state.count}`;
        // page++;
        Axios.get(url).then((res) => {
              Toast.hide();
              this.rData = [...this.rData, ...res.data.data];
              this.setState({
                  dataSource : this.state.dataSource.cloneWithRows(this.rData),
                  isLoading : false
              })
        })
    }

    componentDidMount(){
      this.props.actions.navBarSet("全部影片");
      window.scrollTo(0,0);
      this.getData(this.props.params.type, 0);

    }

    componentDidUpdate(prevProps) {
        let oldType = prevProps.params.type;
        let type = this.props.params.type;
        if (type !== oldType){
           this.refs.lv.refs.listview.scrollTo(0, 0); //listview 滚动到顶部
           this.rData = []; //清空上一个的数据
           this.getData(type, 0);
        }
    }

    //滑动到底部
    onEndReached = (event) => {
      if(this.state.isLoading){//如果正在加载，返回
        return;
      }
      Toast.loading('加载中...',0,()=>{},true);
      let type = this.props.params.type;
      this.getData(type, 0)
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
        let {cover, name, intro, id} = rowData;
        return (
          <WingBlank size="lg">
            <Flex>
              <div className="filmlist-news-img">
                  <img width="100%" src={cover.origin} alt=""/>
              </div>
              <div className="filmlist-news-con">
                  <h4>{name}</h4>
                  <p className="filmlist-time-bar">{intro}</p>
              </div>
              <div className="filmlist-news-right">
                <Button type="ghost" inline size="small"
                   onClick={() =>{hashHistory.push(`film/${id}`)}}>
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
                      <div style={{ padding: 30, textAlign: 'center' }}>
                        {this.state.isLoading ? '加载中...' : '查看更多'}
                      </div>)}
                    renderRow={row}
                    renderSeparator={separator}
                    className="am-list"
                    pageSize={7}
                    style={{
                      height: document.documentElement.clientHeight*4/5,
                      overflow: 'auto'

                    }}
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
