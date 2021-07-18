
import { observable, action, makeObservable, runInAction } from 'mobx';
// import api from '../services/api';

class AppStore {

  @observable public applications: any[] = [];
  @observable public users: any[] = [];
  @observable public auths: any[] = [];

  @observable public qiniuToken?: string;
  @observable public appLoading?: boolean;

  constructor() {
    makeObservable(this); // 需要observable的值，默认全部（mobx6引入）
  }

  /**
   * 加载提示控制
   */
   @action.bound
  handleAppLoading() {
    this.appLoading = true;
    setTimeout(() => {
      this.appLoading = false;
    }, 200);
  }
}

export default new AppStore();