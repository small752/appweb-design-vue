import {Loading, Group, Radio, PopupHeader, Sticky, querystring} from 'vux'

import {checkDDAuthLogin, setDDAuthLogin, setDdMenu, setDdNavTitle} from '@/util/ddutil.js'

export default {
  name: 'ddLogin',

  data () {
    return {
        loading: true,
        corpId: '',           //  钉钉企业号
        accessToken: '',      //  钉钉企业秘钥
        authCode: '',         //  钉钉用户临时码
        choseUser: false,     //  是否打开选择用户界面
        selectUser: [],       //  多用户时选择的用户
        userList: [],         //  选择用户界面的用户列表
    }
  },
  components: {Loading, Group, Radio, PopupHeader, Sticky},

  created: function() {
    setDdMenu();
    setDdNavTitle('钉钉免登中');
    this.ddOauthLogin();
  },

  methods: {
    
    /**
     * 钉钉免登 获取钉钉环境配置
     */
    ddOauthLogin: function() {
      
      if(checkDDAuthLogin()) return;
      
      this.loading = true;

      this.$http.post(BASE_URL + '/officialDealAction!ddAuthJsConfig.shtml', {}).then(({data}) => {
        console.info('ddAuthJsConfig', data);
        let me = this;
        let dd = window.dd;
        if(data.fail || data.result == 'fail') {
          this.loading = false;
          this.$vux.toast.text('钉钉授权初始化出错啦', 'top')
        } else {

          let corpId = data.info && data.info.corpId;
          let accessToken = data.info && data.info.accessToken;

          this.corpId = corpId;
          this.accessToken = accessToken;

          dd.runtime.permission.requestAuthCode({
            corpId: me.corpId,
            onSuccess: function(result) {
              me.authCode = result.code;
              //校验用户身份免登
              me.valiUserAccess(accessToken, result.code);
            },
            onFail : function(err) {
              alert(JSON.stringify(err));
            }
         
          });
        }
      })
    },

    /**
     * 根据用户临时码获取用户信息并登陆
     */
    valiUserAccess: function(accessToken, authCode) {
      
      let params = {
        accessToken,
        code: authCode,
      };

      let options = {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      };

      this.$http.post(BASE_URL + '/officialDealAction!valiUserAccess.shtml', querystring.stringify(params), options).then(({data}) => {
        console.info('valiUserAccess', data);

        this.loading = false;
        if(data.fail || data.result == 'fail') {
          this.$vux.toast.text('获取钉钉用户信息出错啦', 'top')
        } else {
          
          if(data.result === 'succsess') {
            setDDAuthLogin(data);
            this.$router.push('/default_4321')
          } else if(data.result === 'chose') {

            this.choseUser = true;
            let userListArr = [];

            data.info.forEach((item, index) => {
              userListArr.push({
                key: item.userId + '',
                value: item.userName,
              })
            });

            this.userList = userListArr;
          }

        }
      })
    },

    /**
     * 多用户时选择用户切换
     */
    changeUserSelect: function(value) {
      this.selectUser = value;
    },

    /**
     * 确定切换用户时
     */
    handleOnSelectUserLogin: function() {
      console.info('确定切换用户时', this.authCode);
      if(this.selectUser !== undefined && this.selectUser !== '') {

        let params = {
          userId: this.selectUser,
        };
  
        let options = {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          }
        };
        
        this.loading = true;

        this.$http.post(BASE_URL + '/officialDealAction!ajaxLogin.shtml', querystring.stringify(params), options).then(({data}) => {
  
          this.loading = false;

          if(data.fail || data.result == 'fail') {
            this.$vux.toast.text('用户登陆出错啦', 'top')
          }

          if(data && data.result == 'succsess') {
            setDDAuthLogin(data);
            this.$router.push('/default_4321')
          }

        });
      } else {
        this.$vux.toast.text('请选择一个用户', 'top')
      }
    }
  }

}