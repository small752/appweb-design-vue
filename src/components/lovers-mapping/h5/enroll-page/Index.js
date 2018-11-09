import {Loading, Popup, XButton, XDialog, XSwitch, Group, XInput} from 'vux'

export default {
  name: 'EnrollPage',
  data () {
    return {
        loading: false,

        formProps: {
            visible: false,
        }
    }
  },
  components: {Loading, Popup, XButton, XDialog, XSwitch, Group, XInput},

  created: function() {
    // this.queryDetail()
  },

  methods: {

    /**
     * 列表查询
     */
    queryDetail: function() {
        //请求参数
        let params = {};
        let postUrl = BASE_URL + '/officialDealAction!getSelfEvaluationResult.shtml';
        this.loading = true;
        let me = this;

        this.$requestServer(postUrl, params).then(({data}) => {
            
            me.loading = false;
            if(data.errorCode != 9000) {
                me.$log('详情查询异常', data);
                me.$vux.toast.text('详情查询出错啦', 'top')
            } else {

            }
        })
    },

    /**
     * 更改报名窗口显隐
     */
    changeEnrollModal: function() {
        this.formProps.visible = !this.formProps.visible
    },

  }

}