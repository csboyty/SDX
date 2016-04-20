var clothCOR=(function(config,functions){
    return{
        submitForm:function(form){
            var me=this;
            functions.showLoading();
            $(form).ajaxSubmit({
                dataType:"json",
                success:function(response){
                    if(response.resultCode==200){
                        $().toastmessage("showSuccessToast",config.messages.optSuccess);
                        setTimeout(function(){
                            window.location.href="course/mgr";
                        },3000);
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

    $("#myForm").validate({
        ignore:[],
        rules:{
            thumbnail:{
                required:true
            }
        },
        messages:{
            thumbnail:{
                required:config.validErrors.required
            }
        },
        submitHandler:function(form) {
            clothCOR.submitForm(form);
        }
    });
});
