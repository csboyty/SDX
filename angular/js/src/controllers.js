/**
 * Created with JetBrains WebStorm.
 * User: ty
 * Date: 14-7-24
 * Time: 下午3:12
 * To change this template use File | Settings | File Templates.
 */
var controllers=angular.module("controllers",["services","models"]);

controllers.controller("login",['$scope',"Config",
    function($scope,Config){
        $scope.showNext=false;

        $scope.toNext=function(){
            $scope.mainVars.contentTemplate=Config.viewUrls.choosePic;
        }
}]);
controllers.controller("choosePic",['$scope',"Config","Clothes","Storage",
    function($scope,Config,Clothes,Storage){
        $scope.showSubmit=false;

        Clothes.query(function(data){
            $scope.items=data.items;
            if(data.hasNoMore){
                Storage.lastLoadedCount=Config.hasNoMoreFlag;
            }

        });

        $scope.selectPic=function(index){
            var hasSelected=false;
            $scope.items[index].selected=!$scope.items[index].selected;

            for(var i= 0,len=$scope.items.length;i<len;i++){
                if($scope.items[i].selected){
                    hasSelected=true;
                    break;
                }
            }

            if(hasSelected){
                $scope.showSubmit=true;
            }else{
                $scope.showSubmit=false;
            }
        };
        $scope.toLogin=function(){
            $scope.mainVars.contentTemplate=Config.viewUrls.login;
            $scope.mainVars.uid=0;
        };
        $scope.submitSelect=function(){
            var selects=[];
            for(var i= 0,len=$scope.items.length;i<len;i++){
                if($scope.items[i].selected){
                    selects.push($scope.items[i].id)
                }
            }

            $scope.mainVars.contentTemplate=Config.viewUrls.autoSkip;
        };
}]);

controllers.controller("autoSkip",['$scope',"$interval","Config",
    function($scope,$interval,Config){
        $scope.time=5;
        var inter=$interval(function(){
            if($scope.time>0){
                $scope.time--;
            }else{
                $interval.cancel(inter);
                $scope.mainVars.contentTemplate=Config.viewUrls.login;
            }
        },1000);
    }]);



