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
            itemsStyle:[],
            currentScrollNum:0
        };

        Clothes.query({userId:Storage.userId},function(data){
            $scope.items.push(data.object);
            $scope.scroll.itemsStyle.push("visible");
            if(data.object.length<Config.perLoadCount.list){
                Storage.lastLoadedCount=Config.hasNoMoreFlag;
            }else{
                Clothes.query({userId:Storage.userId},function(data){
                    $scope.items.push(data.object);
                    $scope.scroll.itemsStyle.push("hidden");
                    if(data.object.length<Config.perLoadCount.list){
                        Storage.lastLoadedCount=Config.hasNoMoreFlag;
                    }
                });
            }
        });


        $scope.selectPic=function(event){
            var hasSelected=false,
                targetEl=event.target,
                targetClassName=targetEl.className,
                pIndex= 0,index = 0,indexArray;

            if(targetClassName.indexOf("imageContainer")!=-1||targetClassName.indexOf("image")!=-1){
                if(!targetEl.dataset.index){
                    targetEl=targetEl.parentElement;
                }
                indexArray=targetEl.dataset.index.split(",");
                pIndex=indexArray[0];
                index=indexArray[1];
                $scope.items[pIndex][index].selected=!$scope.items[pIndex][index].selected;

                for(var i= 0,len=$scope.items.length;i<len;i++){
                    for(var j= 0,length=$scope.items[i].length;j<length;j++){
                        if($scope.items[i][j].selected){
                            hasSelected=true;
                            break;
                        }
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
            if($scope.scroll.currentScrollNum<$scope.scroll.itemsStyle.length-1){
                $scope.scroll.itemsStyle[$scope.scroll.currentScrollNum]="hidden";
                $scope.scroll.currentScrollNum++;
                $scope.scroll.itemsStyle[$scope.scroll.currentScrollNum]="visible";
            }

            if(Storage.lastLoadedCount!=Config.hasNoMoreFlag){
                Clothes.query({userId:Storage.userId},function(data){
                    $scope.items.push(data.object);
                    $scope.scroll.itemsStyle.push("hidden");
                    if(data.object.length<Config.perLoadCount.list){
                        Storage.lastLoadedCount=Config.hasNoMoreFlag;
                    }
                });
            }
        };
        $scope.swipeRight=function(){
            if($scope.scroll.currentScrollNum-1>=0){
                $scope.scroll.itemsStyle[$scope.scroll.currentScrollNum]="hidden";
                $scope.scroll.currentScrollNum--;
                $scope.scroll.itemsStyle[$scope.scroll.currentScrollNum]="visible";
            }
        };
        $scope.submitSelect=function(){
            var selects=[];
            for(var i= 0,len=$scope.items.length;i<len;i++){
                for(var j= 0,length=$scope.items[i].length;j<length;j++){
                    if($scope.items[i][j].selected){
                        selects.push($scope.items[i][j].id);
                    }
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



