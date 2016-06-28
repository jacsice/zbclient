        $("#add_header").click(function(){
            $("#table_headers:last").append("<tr><td><input class='checkbox_header' type='checkbox' checked/>&nbsp;"+
            "<input type='text' class='form-control'>&nbsp;:&nbsp;<input type='text' class='form-control'>"+
            "&nbsp;<a><span class='glyphicon glyphicon-remove' aria-hidden='true' onclick=remove_this(this)></span></a>"+
            "</td></tr>");
        });

        $("#add_param").click(function(){
            $("#table_params:last").append("<tr><td><input class='checkbox_param' type='checkbox' checked onchange='rebuild_url()'/>&nbsp;"+
            "<input type='text' class='form-control' onblur='rebuild_url()'/>&nbsp;=&nbsp;<input type='text' class='form-control' onblur='rebuild_url()'/>"+
            "&nbsp;<a><span class='glyphicon glyphicon-remove' aria-hidden='true' onclick=remove_this(this)></span></a>"+
            "</td></tr>");
        });

        $('#url').on('input blur',function(){
           $("#table_params tr").empty();
           var input_url = $(this).val();
           var params_arr = new Array();
           var params = input_url.split('?');

           if(input_url.indexOf('http://') != 0){
                $(this).val("http://" + input_url);
           }

           if(params.length > 1){
                params = params[1].split('&');
                for(var i=0;i<params.length;i++){
                    var data = params[i].split('=');
                    var key = data[0];
                    if(data.length == 2){
                        var value = data[1];
                    }else{
                        var value = '';
                    }
                    $("#table_params:last").append("<tr><td><input class='checkbox_param' type='checkbox' onchange='rebuild_url()' checked/>&nbsp;"+
                        "<input type='text' class='form-control' value='"+ key +"' onblur='rebuild_url()'>&nbsp;=&nbsp;"+
                        "<input type='text' class='form-control' value='"+ value +"' onblur='rebuild_url()'>"+
                        "&nbsp;<a><span class='glyphicon glyphicon-remove' aria-hidden='true' onclick=remove_this(this)></span></a>"+
                        "</td></tr>");
                }
           }
        });

        $("#send").click(function(){
            var method = $("#now_method").html();
            var url = $("#url").val();
            var data = {};
            data['headers'] = JSON.stringify(rebuild_headers());
            data['url'] = url;
            data['method'] = method;
            $.ajax({
              url: '/client/format/',
              type: 'POST',
              dataType: 'json',
              data: data,
              beforeSend: function () {
                $("#send").attr('disabled', 'disabled');
              },
              success:function(data) {
                    var status_css = '';
                    if (data.http_code == 200){
                        status_css = 'alert-success';
                    }else{
                        status_css = 'alert-danger';
                    }
                    $("#status_code").addClass(status_css).show();
                    $("#status_code").html(data.http_code);
                    $("#send").removeAttr('disabled');
                    $("#result").html(JSON.stringify(data.result, null, 4));
                    $('#result').JSONView($("#result").html());
              },
            });
            $("#send").removeAttr('disabled');
        });



        $(".method").click(function(){
            $("#now_method").html($(this).html());
        });

        function remove_this(obj){
            $(obj).parent().parent().remove();
            rebuild_url();
        }

        function rebuild_url(){
            var domain = $("#url").val().split("?")[0] + "?";
            $(".checkbox_param:checkbox:checked").each(function(){
                var key = $(this).next();
                var value = $(this).next().next();
                param = key.val() + "=" + value.val() + "&";
                domain += param;
            });
            $("#url").val(domain.substring(0, domain.length-1));
        }

        function rebuild_headers(){
            var headers = {};
            $(".checkbox_header:checkbox:checked").each(function(){
                var key = $(this).next().val();
                var value = $(this).next().next().val();

                if(key.length > 0 && value.length > 0){
                    headers[key] = value;
                }
            });
            return headers;
        }