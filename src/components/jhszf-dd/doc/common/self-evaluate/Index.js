import {Loading, Popup, PopupHeader, FormPreview, Checker, CheckerItem} from 'vux'

/**
 * 公文详情 - 自评结果
 */
export default {

  name: 'docTodoDetailSelfEvaluate',

  props: {
    visible: {
      type: Boolean,
      required: true
    },
    docType: {                  //  docType:公文类型 1: 待办  2:已办  3:文件共享  5:我的关注
      type: String,
      required: true
    },
    docid: {                  //  公文编号
      type: String,
      required: true
    },
  },

  data () {
    return {
        loading: false,
        dataSource: [],     //  列表数据
    }
  },

  components: {Loading, Popup, PopupHeader, FormPreview, Checker, CheckerItem},

  created: function() {
    this.query();
  },

  methods: {

    /**
     * 查询公文历史签批数据
     */
    query: function() {

      let params = {
        sysPendingsId: this.docid,
        requestsource: '0',
      };
      let postUrl = BASE_URL + '/officialDealAction!getSelfEvaluationResult.shtml';
      
      this.loading = true;

      this.$requestServer(postUrl, params).then(({data}) => {
        
        this.loading = false;
        if(data == undefined || data.fail) {
            this.$log('查询自评结果异常', data);
            this.$vux.toast.text('系统出错啦', 'top')
            return
        } else {          
          
          let resObj = data.selfResult && JSON.parse(data.selfResult);

          if(!(resObj && resObj.returninfo && resObj.returninfo.status == '0')) {
            this.$log('查询自评结果出错', data);
            this.$vux.toast.text('查询自评结果出错啦', 'top')
            return
          }
          
          let results = resObj && resObj.bizdata && resObj.bizdata.selfEvaluationRecordResults;

          this.dataSource = results || [];
        }
      })
    },

    /**
     * 关闭详情页
     */
    closePop: function() {
      this.$emit('handleOnClose')
    },
    
    /**
     * 格式化自评结果项目
     */
    formEvaluateList: function(list) {
      let newList = [];

      list && list.length > 0 && list.map((item, index) => {

        let valueStr = ''

        if(item.checkOneValue === 1) {
          valueStr = item.checkboxOneName || ''
        } else if(item.checkTwoValue === 1) {
          valueStr = item.checkboxTwoName || ''
        } else if(item.checkThreeValue === 1) {
          valueStr = item.checkboxThreeName || ''
        }

        newList.push({
          label: (index+1) + '. ' + item.selfEvaluationItemsName,
          value: valueStr,
        })
      })

      return newList
    },

  }

}