/** 公共配置 */

// API接口前缀
export const baseApi = "/api";

/** 图片路径处理 */
export function handleImgUri(imgUrl){
    return this.baseApi + "/" + imgUrl;
}

   //字符串转为时间
var toDate = function (v, t) {
    if (v == undefined||v==null) {
        return null;
    }
    if (v.constructor == Date) {
        return v;
    } else if (v.constructor == Number) {
        t = 2;
    } else if (v.constructor == String) {
        if (/\([\d|\-]*\)/.test(v)) {
            t = 2;
            v = parseInt(this.getInt(v), 10);
        } else if (/^[+/-]?[\d]*$/.test(v)) {
            t = 2;
            v = parseInt(this.getInt(v), 10);
        }
    } else {
        return null;
    }
    t = t || 1; //
    if (t == 1) {
        v = v.replace(/[^\d|^\-|^\\|^:|^\.]/g, " ");
        v = v.replace(/-/g, "/").replace(/\s+/g," ");
        var date = new Date(v);
        if (!date.valueOf()) {
            var ay = v.split(/\-|\/|\s|:|\./g);//IE
            date = new Date(ay[0] || 0, ay[1] || 0, ay[2] || 0, ay[3] || 0, ay[4] || 0, ay[5] || 0, ay[6] || 0);
        }
        return date;
    } else {
        var date = new Date(v);
        return date;
    }
};
export function dateFormat(fmt, date) {
    let ret;
    const opt = {
        "Y+": date.getFullYear().toString(),        // 年
        "m+": (date.getMonth() + 1).toString(),     // 月
        "d+": date.getDate().toString(),            // 日
        "H+": date.getHours().toString(),           // 时
        "M+": date.getMinutes().toString(),         // 分
        "S+": date.getSeconds().toString()          // 秒
        // 有其他格式化字符需求可以继续添加，必须转化成字符串
    };
    for (let k in opt) {
        ret = new RegExp("(" + k + ")").exec(fmt);
        if (ret) {
            fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
        };
    };
    return fmt;
}

 //几月前后
  export function addMonths (v, n) {
    v = toDate(v);
    if (v) {
        v = new Date(v.valueOf());
        v.setMonth(v.getMonth() + n);
        
        return dateFormat('YYYY-mm-dd',v);           
    }
}

export function compareDate(dateTime1,dateTime2)
{
    var formatDate1 = new Date(dateTime1);
    var formatDate2 = new Date(dateTime2);
    if(formatDate1 > formatDate2)
    {
        return true;
    }
    else
    {
        return false;
    }
}



