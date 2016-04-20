var userMgr=(function(config,functions){
    /**
     * 创建datatable
     * @returns {*|jQuery}
     */
    function createTable(){

        var ownTable=$("#myTable").dataTable({
            "bServerSide": true,
            "sAjaxSource": config.ajaxUrls.userGetAll,
            "bInfo":true,
            "bProcessing":true,
            "bLengthChange": false,
            "bFilter": false,
            "bSort":false,
            "bAutoWidth": false,
            "iDisplayLength":config.perLoadCounts.table,
            "sPaginationType":"full_numbers",
            "oLanguage": {
                "sUrl":config.dataTable.langUrl
            },
            "aoColumns": [
                { "mDataProp": "userId"},
                { "mDataProp": "opt",
                    "fnRender":function(oObj){
                        return '<a target="_blank" href="showUserChoose.html?id='+oObj.aData.userId+'">查看选择</a>&nbsp;';
                    }
                }
            ] ,
            "fnServerParams": function ( aoData ) {
                /*aoData.push({
                    name:"title",
                    value:$("#search").val()
                })*/
            },
            "fnServerData": function(sSource, aoData, fnCallback) {

                //回调函数
                $.ajax({
                    "dataType":'json',
                    "type":"get",
                    "url":sSource,
                    "data":aoData,
                    "success": function (response) {
                        if(response.success===false){
                            functions.ajaxReturnErrorHandler(response.error_code);
                        }else{
                            var json = {
                                "sEcho" : response.sEcho
                            };

                            for (var i = 0, iLen = response.aaData.length; i < iLen; i++) {
                                response.aaData[i].opt="opt";
                            }

                            json.aaData=response.aaData;
                            json.iTotalRecords = response.iTotalRecords;
                            json.iTotalDisplayRecords = response.iTotalDisplayRecords;
                            fnCallback(json);
                        }

                    }
                });
            },
            "fnFormatNumber":function(iIn){
                return iIn;
            }
        });

        return ownTable;
    }

    return {
        ownTable:null,
        createTable:function(){
            this.ownTable=createTable();
        },
        tableRedraw:function(){
            this.ownTable.fnSettings()._iDisplayStart=0;
            this.ownTable.fnDraw();
        },
        submitForm:function(form){
            var me=this;
            functions.showLoading();
            $(form).ajaxSubmit({
                dataType:"json",
                success:function(response){
                    if(response.resultCode==200){
                        $().toastmessage("showSuccessToast",config.messages.optSuccess);
                    }else{
                        functions.ajaxReturnErrorHandler(response.message);
                    }
                },
                error:function(){
                    functions.ajaxErrorHandler();
                }
            });
        },
        delete:function(id){
            functions.showLoading();
            var me=this;
            $.ajax({
                url:config.ajaxUrls.userDelete.replace(":id",id),
                type:"delete",
                dataType:"json",
                success:function(response){
                    if(response.resultCode==200){
                        $().toastmessage("showSuccessToast",config.messages.optSuccess);
                        me.ownTable.fnDraw();
                        functions.hideLoading();
                    }else{
                        functions.ajaxReturnErrorHandler(response.message);
                    }

                },
                error:function(){
                    functions.ajaxErrorHandler();
                }
            });
        }
    }
})(config,functions);

$(document).ready(function(){

    userMgr.createTable();
    $("#searchBtn").click(function(e){
        userMgr.tableRedraw();
    });
    $("#myTable").on("click","a.delete",function(){
        if(confirm(config.messages.confirmDelete)){
            userMgr.delete($(this).attr("href"));
        }
        return false;
    });
    $("#myForm").validate({
        ignore:[],
        rules:{
            userId:{
                required:true,
                maxlength:32
            }
        },
        messages:{
            userId:{
                required:config.validErrors.required,
                maxlength:config.validErrors.maxLength.replace("${max}",32)
            }
        },
        submitHandler:function(form) {
            userMgr.submitForm(form);
        }
    });
});

