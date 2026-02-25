
// 这里可以封装自己需要经常使用的方法

//获取字符串中所有中文
export function getChinese(str: string): string{
    const reg = /[\u4e00-\u9fa5，。？！：；、]/g;
    const result = str.match(reg);
    return result ? result.join('') : '';
}


//获取用户Id
export function  getUserId(): string {
    return 'apple'+ new Date().getTime();
}
//格式转换
export function formatDate(date:Date) {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
}

export function getTimeAgo(timeStr:string):string {
    const now = new Date();
    const time = new Date(timeStr);
    // @ts-ignore
    const diff = now - time;

    const minute = 60 * 1000;
    const hour = 60 * minute;
    const day = 24 * hour;
    const month = 30 * day;
    const year = 12 * month;

    if (diff < minute) {
        return '刚刚';
    } else if (diff < hour) {
        return Math.floor(diff / minute) + '分钟前';
    } else if (diff < day) {
        return Math.floor(diff / hour) + '小时前';
    } else if (diff < month) {
        return Math.floor(diff / day) + '天前';
    } else if (diff < year) {
        return Math.floor(diff / month) + '个月前';
    } else {
        return Math.floor(diff / year) + '年前';
    }
}

