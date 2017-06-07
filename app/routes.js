import React, { Component } from 'react'
import {Route, IndexRoute, Redirect, hashHistory, browserHistory} from 'react-router';
import {App, Home, FilmList, Search, User, Detail} from './containers';

export default (
    <Route path="/" component={App}>
        <IndexRoute component={Home} /> //首页
        <Route path="/home" component={Home} />  //栏目切换
        <Route path="/filmlist/:type" component={FilmList} /> //电影列表
        <Route path="/film/:id" component={Detail} /> //电影详情
        <Route path="/search" component={Search} /> //搜索
        <Route path="/user" component={User} /> //用户中心
        <Redirect from='*' to='/' />
    </Route>
)
