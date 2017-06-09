import React, { Component } from 'react'
import {Link, hashHistory} from 'react-router';
import {Carousel, Card, WhiteSpace, Button, Toast} from 'antd-mobile';
import Axios from 'axios';
import './index.css';

class Home extends Component{
    constructor(props){
        super(props);
        this.ignoreLastFetch = false;
        this.state = {
          data: ['', '', ''],
          initialHeight: 200,
          playingData : [],   //正在上映数据
          comingData : [],   //即将上映数据
          loading : true   //loading参数
        }
    }

    getData(){
        Toast.loading('加载中...',0,()=>{},true);
        let self = this;
        let url = 'http://mockdata/filmlist';
        Axios.get(url).then(function(res){
            let data = res.data;
                Toast.hide();
                self.setState({
                    playingData : data.playingData,
                    comingData : data.comingData,
                    data : data.slider.data,
                    loading : false
                })
        })

    }

    componentDidMount(){
        this.props.actions.navBarSet("芝麻电影");
        this.getData();
    }

    componentWillUnmount () {

    }

    getFilmList(data){
      let nodes = data.map(function(dData){
        return(
          <Link key={dData.id} to={`/film/${dData.id}`}>
            <WhiteSpace size="xl" />
            <Card key={dData.id}>
              <Card.Body>
                <img width="100%" src={dData.cover.origin} alt=""/>
              </Card.Body>
              <Card.Footer content={dData.name} extra={dData.grade} />
            </Card>
          </Link>
        )
      })

      return (
        <div className="film-list">
          {nodes}
        </div>
      )
    }

    render(){
        const hProp = this.state.initialHeight ? { height: this.state.initialHeight } : {};
        return(
            <div className="main-con">
              <Carousel
                className="my-carousel"
                autoplay={true}
                infinite
                selectedIndex={1}
                swipeSpeed={35}
              >
                {this.state.data.map((dd, ii) => (
                  <Link to={dd.url} key={ii} style={hProp}>
                    <img src={dd.imgUrl}
                      alt="" onLoad={() => {
                        // fire window resize event to change height
                        window.dispatchEvent(new Event('resize'));
                        this.setState({
                          initialHeight: null,
                        });
                      }}
                    />
                 </Link>
                ))}
              </Carousel>

              {this.getFilmList(this.state.playingData)}
              <WhiteSpace size="lg" />
              <Button type="ghost" inline size="small"
                onClick={() =>{hashHistory.push('/filmlist/playing')}}>
                更多热映电影
              </Button>


              {this.getFilmList(this.state.comingData)}
              <WhiteSpace size="lg" />
                <Button type="ghost" inline size="small"
                   onClick={() =>{hashHistory.push('/filmlist/coming')}}>
                  更多即将上映电影
                </Button>

            </div>
        )
    }

}

export default  Home
