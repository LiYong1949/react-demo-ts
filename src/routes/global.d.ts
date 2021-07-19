import dayjs from 'dayjs';

const globalAny: any = global;
const { NODE_ENV } = process.env;

// 服务端地址
globalAny.G_SERVER_HOST = (NODE_ENV === 'production') ? '' : 'http://127.0.0.1:8779';

globalAny.G_SYSTEM_TITLE = {
    name: 'Funenc-React-Template',
    subName: ''
};

// 全局自定义props对象
globalAny._PROPS = null;

// 拆分url的params部分
globalAny.G_SPLIT_URL_PARAMS = () => {

    let nowUrl = window.location.pathname;
    let nowUrlArray = nowUrl.split('?')[0].split('/'); //根目录会是两个空串["",""]
    let realKeys = nowUrlArray.filter(Boolean);

    return realKeys;
};

// 设置网页标题
globalAny.G_SET_DOCUMENT_TITLE = (title) => {

    let titleStr = 'Fuenc React Template';
    return document.title = title ? `${title} - ${titleStr}` : titleStr;

}

/**
 * 处理本地信息（读）
 */
globalAny.G_LOCALSTORAGE_GET = (name) => {

    let dataStr = localStorage.getItem(name);
    let hash = {};

    if (dataStr) {
        hash = JSON.parse(dataStr);
        return hash.data;
    }

    return false;

}

/**
 * 处理本地信息（写）
 * _APPLICATIONS // 应用列表
 * _SELECT_APP_UUID  // 已选择应用
 * _TOKEN  // 认证信息
 * _USER  // 人员信息
 */
globalAny.G_LOCALSTORAGE_SET = (name, datas) => {

    let saveData = {
        data: datas
    };

    localStorage.setItem(name, JSON.stringify(saveData));

    return true;

}

// 时间格式化
globalAny.G_DATE_FORMAT = (time, type, defaultValue) => {
    if (time) {
        if (type === 'fullTimes') {
            return dayjs(time).format('YYYY-MM-DD HH:mm:ss');
        } else if (type === 'fullTimeToMinute') {
            return dayjs(time).format('YYYY-MM-DD HH:mm');
        } else if (type === 'fullTimeToMini') {
            return dayjs(time).format('YYYYMMDDHHmmss');
        } else if (type === 'year') {
            return dayjs(time).format('YYYY');
        } else {
            return dayjs(time).format('YYYY-MM-DD');
        }
    } else {
        return defaultValue || '/';
    }
};