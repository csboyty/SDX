/**
 * Created with JetBrains WebStorm.
 * User: ty
 * Date: 14-7-23
 * Time: 下午3:38
 * To change this template use File | Settings | File Templates.
 */
var services=angular.module("services",["ngResource","toaster"]);

/* *
 * constant类型的service中的值不会被改变，value定义的service中的值可以被改变
 */
services.constant("Config",{
    perLoadCount:{
        list:10
    },
    hasNoMoreFlag:-1,//作品、评论、资源等没有更多的标志,当没有更多的时候将其的loadId设置为-1
    viewUrls:{
        "login":"views/login.html",
        "choosePic":"views/choosePic.html",
        "autoSkip":"views/autoSkip.html"
    },
    messages:{  //错误提示
        errorTitle:"错误提示",
        successTitle:"成功提示",
        networkError:"网络连接失败，请稍后重试！",
        systemError:"系统发生错误，请稍后重试！"
    },
    ajaxUrls:{
        baseUrl:"",
        accountIsExist:"data/json/accountIsExist.json",
        submitSelect:"",
        clothesLoad:"data/json/items.json"
    }
});
services.constant("App",{
    version:"1.0"
});
services.service("AjaxErrorHandler",["toaster","Config",function(toaster,Config){
    this.ajaxReturnErrorHandler=function(message){
        toaster.pop('error',Config.messages.errorTitle,message,null,null);
    };

    this.ajaxErrorHandler=function(){
        toaster.pop('error',Config.messages.errorTitle,Config.messages.networkError,null,null);
    };
}]);

services.service("CFunctions",["$rootScope",
    function($rootScope){
        this.getFileInfo=function(fileName){
            var extPos=fileName.lastIndexOf(".");
            var pathPost=fileName.lastIndexOf("/");
            return {
                filePath:pathPost!=-1?fileName.substring(0,pathPost+1):"",
                filename:fileName.substring(pathPost+1,extPos),
                ext:fileName.substring(extPos+1)
            }
        };
        /**
         * 格式化日期
         * @param format {string} 格式化
         * y:四位数的年份
         * m:两位数的月份
         * d:两位数的日期
         * h:两位数的时间
         * i:两位数的分钟
         * s:两位数的秒钟
         * 支持格式:
         * @param dateTime {number} 毫秒表示的日期
         * @returns string {string}格式好的字符串日期，默认是2014-09-10 12:03:23格式
         */
        this.formatDate=function(format,dateTime){
            var string,currentDate,year,month,day, h, m, s,fYear,fMonth,fDay,fH,fM,fS;

            if(typeof format ==="number"){
                dateTime=format;
                format=null;
            }

            currentDate =dateTime?new Date(dateTime):new Date();
            fYear=currentDate.getFullYear();
            year=fYear.toString().slice(2);
            fMonth=month=currentDate.getMonth()+1;
            fDay=day=currentDate.getDate();
            fH=h=currentDate.getHours();
            fM=m=currentDate.getMinutes();
            fS=s=currentDate.getSeconds();

            if(fMonth<10){
                fMonth="0"+fMonth;
            }
            if(fDay<10){
                fDay="0"+fDay;
            }
            if(fH<10){
                fH="0"+fH;
            }
            if(fM<10){
                fM="0"+fM;
            }
            if(fS<10){
                fS="0"+fS;
            }

            switch(format){
                case "y-m-d":
                    string=fYear+"-"+fMonth+"-"+fDay;
                    break;
                case "y-m-d h:m":
                    string=fYear+"-"+fMonth+"-"+fDay+" "+fH+":"+fM;
                    break;
                case "y/m/d h:m:s":
                    string=fYear+"/"+fYear+"/"+day+" "+fH+":"+fH+":"+fH;
                    break;
                case "y/m/d h:m":
                    string=fYear+"/"+fMonth+"/"+fDay+" "+fH+":"+fM;
                    break;
                default :
                    string=fYear+"-"+fMonth+"-"+fDay+" "+fH+":"+fM+":"+fS;
                    break;
            }

            return string;
        };
        this.arrayIndexOf=function(array,content,key){
            for(var i= 0,len=array.length;i<len;i++){
                if(key){
                    if(array[i][key]==content){
                        return i;
                    }
                }else{
                    if(array[i]==content){
                        return i;
                    }
                }

            }

            return -1;
        };
        this.trim=function(content){
            if(content!=undefined){
                return content.replace(/(^\s*)|(\s*$)/g, "");
            }else{
                return "";
            }
        }
    }]);


services.service("Storage",function(){
    this.lastLoadedCount=0;
});

services.factory('safeApply', ["$rootScope",function($rootScope) {
    return function(scope, fn) {
        fn = angular.isFunction(fn) ? fn : angular.noop;
        scope = scope && scope.$apply ? scope : $rootScope;
        fn();
        if (!scope.$$phase) {
            scope.$apply();
        }
    }
}]);


