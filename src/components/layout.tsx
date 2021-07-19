import { Component } from "react";
import { Layout } from 'antd';
import { observer, inject } from 'mobx-react';
import HeaderUnit from './header';
import WarningUnit from '../pages/common/warning';
import './common.less';

const { Header, Content, Footer } = Layout;

const LayoutUnit = (WrappedComponent: any, MenuComponent?: any) => {

  let thisYear = (new Date()).getFullYear();

  @inject("appStore")
  @observer
  class HOC extends Component {

    // eslint-disable-next-line
    constructor(props: any) {
      super(props);
    }

    render() {

      let { appStore }: any = this.props;

      if (appStore.appLoading) {
        return <WarningUnit mode="loading" data="科技向善，数据为先" style={{fontSize: 24, paddingTop: '20%'}} />
      }

      return (
        <Layout className="d-layout">
          <Header className="d-layout-header-container">
            <HeaderUnit {...this.props} />
          </Header>
          <Content className="d-layout-body-container">
            {
              MenuComponent ?
                (
                  <div className="d-content-container">
                    {/* 菜单+内容体 */
                      WrappedComponent && <WrappedComponent {...this.props} />
                    }
                  </div>
                )
              :
                (
                  <div className="d-content-container d-max-container">
                    {/* 仅内容体 */
                      WrappedComponent && <WrappedComponent {...this.props} />
                    }
                  </div>
                )
            }
          </Content>
          <Footer className="d-layout-footer">北京富能通科技有限公司技术支持 © {thisYear}</Footer>
        </Layout>
      )
    }
  }

  return HOC;

}

export default LayoutUnit;