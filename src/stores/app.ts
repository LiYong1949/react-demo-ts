
import { observable, action, makeObservable, runInAction } from 'mobx';
import api from '../services/api';

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
   * 获取七牛token
   * @param type （forced 强制更新数据）
   */
   @action.bound
   async handleGetQiniuToken (type: string) {
 
     let newQiniuToken = this.qiniuToken;
 
     if (!newQiniuToken || type === 'forced') {
 
       let res: any = await api.getQiniuToken();
 
       const { qiniuToken } = res.data;
   
       runInAction(() => {
 
         newQiniuToken = qiniuToken;
   
         this.qiniuToken = qiniuToken;
   
       })
 
     }
 
     return newQiniuToken;
 
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