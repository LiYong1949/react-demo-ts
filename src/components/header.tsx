import React, { Component, Fragment } from "react";
import { observer, inject } from 'mobx-react';
import { map as _map, groupBy as _groupBy } from 'lodash';
import { Menu, Avatar, Dropdown, Button, Modal, Row, Col, message } from 'antd';
import { Link } from 'react-router-dom';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import api from '../services/api';
import WarningUnit from '../pages/common/warning';
import './common.less';

export interface IProps {
  history?: any;
}

export interface IState {
  isVisibleModal?: boolean;
  applications?: any;
  selectedApplication: any;
  applicationHashs?: any;
  appLoading?: boolean;
}

declare var global: any;
@inject("appStore")
@observer
class Home extends Component<IProps, IState> {
  constructor(props: any) {
    super(props);

    global._PROPS = {...props};

    let currentSelectedApp = global.G_LOCALSTORAGE_GET('_SELECT_APP');
    let initSelectedApplication = {
      id: null,
      uuid: null,
      name: null,
    };

    if (currentSelectedApp && currentSelectedApp.name) {
      initSelectedApplication = { ...currentSelectedApp };
    }

    this.state = {
      isVisibleModal: false,
      appLoading: false,
      applications: [], // 所有应用
      applicationHashs: {}, // 所有应用
      selectedApplication: initSelectedApplication, // 已选择的应用
    }
  }

  componentDidMount() {
    global.G_SET_DOCUMENT_TITLE();
    let token = global.G_LOCALSTORAGE_GET('_TOKEN');
    if (!token) {
      this.props.history.push('/login');
    } else {
      this.handleGetUserApplications();
    }
  }

  // 获取当前人员所属应用
  handleGetUserApplications = async () => {

    this.setState({ appLoading: true });

    let { errcode, data }: any = await api.getMineInfo();

    if (errcode >= 0) {

      global.G_LOCALSTORAGE_SET('_USERINFO', data.user);

      let applications = data.user.Applications;

      let applicationHashs = _groupBy(applications, o => o.company);

      this.setState({
        applications,
        applicationHashs,
        appLoading: false,
      });

      // 无任何应用权限时，清理残余的应用记录
      if (applications.length === 0) {
        global.G_LOCALSTORAGE_REMOVE('_SELECT_APP');
      }

    }

  }

  handleJumpToLogin = () => {

    Modal.confirm({
      title: '确定要退出本次登录吗？',
      icon: <ExclamationCircleOutlined />,
      content: '退出后需要重新登录',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        global.G_LOCALSTORAGE_CLEAR(); // 清理所有存储信息
        this.props.history.push('/login');
      }
    });

  }

  handleJumpToPage = (page: string) => {
    this.props.history.push(page);
  }

  // 模态框
  handleIsVisibleModal = () => {
    this.setState({ isVisibleModal: !this.state.isVisibleModal })
  }

  // 选择应用
  handleSelectedApplication = async (application: any) => {

    let { selectedApplication } = this.state;
    let { appStore }: any = this.props;

    if (selectedApplication && application && application.id !== selectedApplication.id) {
      message.success(`已切换至：${application.name}`, 1);
      global.G_LOCALSTORAGE_SET('_SELECT_APP', application);
      await appStore.handleAppLoading();
    } else {
      message.warning('已在此应用不建议切换', 1);
    }

  }

  render() {

    let { state } = this;

    let userInfo = global.G_LOCALSTORAGE_GET('_USERINFO');
    let realKeys = global.G_SPLIT_URL_PARAMS();

    let defaultSelectedKeys = realKeys[0];

    let lastName;
    let isConsoleAuth = false;
    let isStatisticsAuth = false;
    let isDictionaryAuth = false;

    if (userInfo) {

      let { name: userName, Auths:userAuths = [] } = userInfo;

      if (userName) {
        lastName = (userName).substr(userName.length-2, 2);
      }

      // 需要有管理权限
      if (userAuths.includes('SYSTEM_ADMINISTRATOR')) {
        isConsoleAuth = true;
      }

      if (userAuths.includes('STATISTICAL_ANALYSIS')) {
        isStatisticsAuth = true;
      }

      if (userAuths.includes('DATA_DICTIONARY')) {
        isDictionaryAuth = true;
      }

    }

    let userInfoDOMs = (
      <div className="d-header-panel">
        <Avatar size={64} style={{ color: '#f56a00', backgroundColor: '#fde3cf', marginBottom: 10 }}>{lastName || 'F'}</Avatar>
        <ul>
          <li>
            <strong>{ userInfo.name }</strong>
            <div style={{color: 'gray', marginBottom: 10, marginTop: 3, fontSize: 12}}>富能通科技</div>
          </li>
          <li>
            <Button onClick={this.handleJumpToPage.bind(this, '/change-password')} type="text" block>修改密码</Button>
          </li>
          <li>
            <Button onClick={this.handleJumpToLogin} type="link" danger block>退出</Button>
          </li>
        </ul>
      </div>
    );

    return (
      <div className="d-header">
        <div className="d-header-left">
          <span className="d-logo">
            <img src='https://docs.cq-tct.com/funenc/transparent-logo.png' alt="logo" />
          </span>
          <span className="d-header-title">{ global.G_SYSTEM_TITLE.name }</span>
          <span className="d-header-company">{ global.G_SYSTEM_TITLE.subName }</span>
        </div>
        <nav className="d-header-nav">
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={defaultSelectedKeys}>
            <Menu.Item key="package">
              <Link to="/package">包版本管理</Link>
            </Menu.Item>
            <Menu.Item key="data-dictionary">
              <Link to="/data-dictionary">数据字典</Link>
            </Menu.Item>
            {
              isStatisticsAuth && (
                <Menu.Item key="statistics">
                  <Link to="/statistics">统计分析</Link>
                </Menu.Item>
              )
            }
            {
              isConsoleAuth && (
                <Menu.Item key="console">
                  <Link to="/console">控制台</Link>
                </Menu.Item>
              )
            }
          </Menu>
        </nav>
        <div className="d-header-right-box">
          <ul>
            <li className="d-header-project">
              <span style={{color: 'rgba(255, 255, 255, 0.65)'}}>
                {
                  state.selectedApplication && (
                    <>
                      {
                        state.selectedApplication.company && <span style={{opacity: .5}}>{state.selectedApplication.company} · </span>
                      }
                      {
                        state.selectedApplication.name || '请选择应用'
                      }
                    </>
                  )
                }
              </span>
              <span className="d-header-link-orange" onClick={this.handleIsVisibleModal}>【切换】</span>
            </li>
            <li className="d-header-user">
              <Dropdown overlay={userInfoDOMs} placement="bottomRight">
                <div style={{cursor: 'pointer'}}>
                  <Avatar size="small" style={{ color: '#f56a00', backgroundColor: '#fde3cf' }}>{lastName || 'F'}</Avatar>
                  <span className="d-name">{userInfo.name || '同学'}</span>
                </div>
              </Dropdown>
            </li>
          </ul>
        </div>
        <Modal
          title={null}
          footer={null}
          width={800}
          visible={state.isVisibleModal}
          onCancel={this.handleIsVisibleModal}
        >
          <div style={{minHeight: 300}}>

            {
              !state.appLoading && state.applications.length === 0 && (
                <WarningUnit data="当前无任何应用权限！" style={{paddingTop: '10%'}} />
              )
            }

            {
              state.appLoading && (
                <WarningUnit mode="loading" data="数据加载中..." style={{paddingTop: '15%', fontSize: 18}} />
              )
            }

            {
              !state.appLoading && state.applications.length > 0 && (
                <>
                  {
                    _map(state.applicationHashs, (applications, company) => {

                      return (
                        <Fragment key={company}>
                          <div className="d-header-project-title">{company}<small>（{applications.length}）</small></div>
                          <Row>
                            {
                              applications.map((application: any) => {
                                return (
                                  <Col
                                    key={ application.id }
                                    span={8}
                                    onClick={this.handleSelectedApplication.bind(this, application)}
                                    className="d-header-project-item d-link"
                                  >
                                    { application.name }
                                  </Col>
                                )
                              })
                            }
                          </Row>
                        </Fragment>
                      )

                    })
                  }
                </>
              )
            }

          </div>
        </Modal>
      </div>
    );
  }
}

export default Home;