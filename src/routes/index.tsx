/*
 * @Descripttion: 
 * @Author: qingzi.wang
 * @Date: 2021-03-08 17:14:02
 */ 
import React from 'react';
import { Provider } from 'mobx-react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import stores from '../stores/index';
import App from '../pages/app';
import Login from '../pages/common/login';
import ConsolePage from '../pages/console/home'
import NoMatch from '../pages/common/noMatch';

const configRoutes = [
  {
    path: '/',
    exact: true,
    main: App,
  },
  {
    path: '/login',
    exact: true,
    main: Login,
    meta:{
      require: false
    }
  },
  {
    path: '/console',
    exact: true,
    main: ConsolePage,
    meta:{
      require: true
    }
  },
  {
    path: '*',
    exact: true,
    main: NoMatch,
  }
];

const Routes = () => (
  <Provider {...stores}>
    <Router>
      <Switch>
        {
          configRoutes.map((route, index) => {
              return <Route key={index} exact={route.exact} path={route.path} component={route.main} />
          })
        }
      </Switch>
    </Router>
  </Provider>
)

export default Routes;