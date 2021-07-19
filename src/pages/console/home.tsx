import React, { Component } from 'react';
import LayoutHOC from '../../components/layout';
import { message, Menu } from 'antd';


declare var global: any;

export interface IStates {
  loading: boolean,
  type: string,
}

class Home extends Component<any,IStates>{
    constructor(props:any){
        super(props);

        this.state = {
            loading:false,
            type:''
        }
    }

    componentDidMount(){
        
    }

    componentWillMount(){

    }

    render(){
        const state = this.state;

        return (
          <div className="d-gateway">
            哈哈哈
          </div>
        );
    }
}

export default LayoutHOC(Home, <div />);