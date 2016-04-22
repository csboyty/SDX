/**
 * Created with JetBrains WebStorm.
 * User: ty
 * Date: 14-7-24
 * Time: 下午3:12
 * To change this template use File | Settings | File Templates.
 */
var controllers=angular.module("controllers",["services","models"]);

controllers.controller("login",['$scope',"Config","Storage",
    function($scope,Config,Storage){
        $scope.showNext=false;
        $scope.userId="";
        $scope.toNext=function(){
            $scope.mainVars.contentTemplate=Config.viewUrls.choosePic;
            Storage.userId=$scope.userId;
        }
}]);
controllers.controller("choosePic",['$scope',"$http","Config","Clothes","Storage",
    function($scope,$http,Config,Clothes,Storage){
        $scope.showSubmit=false;

        $scope.items=[];
        $scope.scroll={
            itemsLeft:[],
            currentScrollNum:0
        };

        Clothes.query({userId:Storage.userId},function(data){
            $scope.items.push(data.object);
            $scope.scroll.itemsLeft.push(0);
            if(data.object.length<Config.perLoadCount.list){
                Storage.lastLoadedCount=Config.hasNoMoreFlag;
            }else{
                Clothes.query({userId:Storage.userId},function(data){
                    $scope.items.push(data.object);
                    $scope.scroll.itemsLeft.push("100%");
                    if(data.object.length<Config.perLoadCount.list){
                        Storage.lastLoadedCount=Config.hasNoMoreFlag;
                    }
                });
            }
        });


        $scope.selectPic=function(event){
            var hasSelected=false,
                targetEl=event.target,
                pIndex= 0,index = 0,indexArray;

            if(targetEl.className.indexOf("image")!=-1){
                indexArray=targetEl.dataset.index.split(",");
                pIndex=indexArray[0];
                index=indexArray[1];
                $scope.items[pIndex][index].selected=!$scope.items[pIndex][index].selected;

                for(var i= 0,len=$scope.items.length;i<len;i++){
                    for(var j= 0,length=$scope.items[i].length;j<length;j++)
                    if($scope.items[i][j].selected){
                        hasSelected=true;
                        break;
                    }
                }

                if(hasSelected){
                    $scope.showSubmit=true;
                }else{
                    $scope.showSubmit=false;
                }
            }

        };
        $scope.toLogin=function(){
            $scope.mainVars.contentTemplate=Config.viewUrls.login;
        };
        $scope.swipeLeft=function(){
            if($scope.scroll.currentScrollNum<$scope.scroll.itemsLeft.length-1){
                $scope.scroll.itemsLeft[$scope.scroll.currentScrollNum]="-100%";
                $scope.scroll.currentScrollNum++;
                $scope.scroll.itemsLeft[$scope.scroll.currentScrollNum]="0";
            }

            if(Storage.lastLoadedCount!=Config.hasNoMoreFlag){
                Clothes.query({userId:Storage.userId},function(data){
                    $scope.items.push(data.object);
                    $scope.scroll.itemsLeft.push("100%");
                    if(data.object.length<Config.perLoadCount.list){
                        Storage.lastLoadedCount=Config.hasNoMoreFlag;
                    }
                });
            }
        };
        $scope.swipeRight=function(){
            if($scope.scroll.currentScrollNum-1>=0){
                $scope.scroll.itemsLeft[$scope.scroll.currentScrollNum]="100%";
                $scope.scroll.currentScrollNum--;
                $scope.scroll.itemsLeft[$scope.scroll.currentScrollNum]="0";
            }
        };
        $scope.submitSelect=function(){
            var selects=[];
            for(var i= 0,len=$scope.items.length;i<len;i++){
                if($scope.items[i].selected){
                    selects.push($scope.items[i].id)
                }
            }
            $http({
                url:Config.ajaxUrls.baseUrl+Config.ajaxUrls.submitSelect,
                method:"POST",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data:'userId='+Storage.userId+'&styleIds='+selects.join(",")
            }).success(function(data){
                    $scope.mainVars.contentTemplate=Config.viewUrls.autoSkip;
                });
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



