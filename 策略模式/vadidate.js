function validate() {

    var Validator = function (opt) {
        this.cache = [];
        this.strategies = {
            isNonEmpty: function (value, errorMsg) {
                if (value === '') {
                    return errorMsg;
                }
            },
            minLength: function (value, length, errorMsg) {
                if (value.length < length) {
                    return errorMsg;
                }
            },
            isMobile: function (value, errorMsg) {
                if (!Utils.RegexMap.MobileNo.test(value)) {
                    return errorMsg;
                }
            },
            isIdNo: function (value, errorMsg) {
                if (!Utils.RegexMap.CardNo.test(value)) {
                    return errorMsg;
                }
            }
        };
        for (var i in opt) {
            this.strategies[i] = opt[i];
        }
    };
    Validator.prototype.add = function (dom, rules) {
        var that = this;
        for (var i = 0, rule; rule = rules[i++];) {
            (function (rule) {
                var ary = rule.ruleName.split(':');
                var errorMsg = rule.errorMsg;
                that.cache.push(function () {
                    var ruleName = ary.shift();
                    ary.unshift(dom.value);
                    ary.push(errorMsg);
                    return that.strategies[ruleName].apply(dom, ary);
                });
            })(rule);
        }
    };
    Validator.prototype.start = function () {
        for (var i = 0, vlidatorFunc; vlidatorFunc = this.cache[i++];) {
            var errorMsg = vlidatorFunc();
            if (errorMsg) {
                return errorMsg;
            }
        }
    };

    return Validator;
}


// 使用方式
function validtaFunc(){
	var validator = new Validator();

	validator.add( username[0], [{ruleName:'isNonEmpty',errorMsg:'手机号码不能为空'},{ruleName:'isMobile',errorMsg:'请填写正确的手机号码'}]);
	validator.add( password[0], [{ruleName:'isNonEmpty',errorMsg:'密码不能为空'},{ruleName:'minLength:6',errorMsg:'密码不能小于6位数'}]);
	validator.add( conVcode[0], [{ruleName:'isNonEmpty',errorMsg:'短信验证码不能为空'}]);

	var errorMsg = validator.start();
	return errorMsg;
}

btnLogin.on('tap', function() {
    var errorMsg =validtaFunc ();
    if ( errorMsg ){
        $.tips(errorMsg);
        return false;
    }else{
        var data = {
            phone:username.val(),
            pwd:password.val(),
            identifyingCode:conVcode.val()
        }
        get_back(data);
    }

    return false;
});