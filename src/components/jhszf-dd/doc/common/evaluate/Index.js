import {Loading, Popup, PopupHeader, FormPreview} from 'vux'

/**
 * 公文详情 - 考评结果
 */
export default {

  name: 'docTodoDetailEvaluate',

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

  components: {Loading, Popup, PopupHeader, FormPreview},

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
      let postUrl = BASE_URL + '/officialDealAction!getEvaluationResult.shtml';
      
      this.loading = true;

      this.$requestServer(postUrl, params).then(({data}) => {
        
        this.loading = false;
        if(data == undefined || data.fail) {
            this.$log('查询考评结果异常', data);
            this.$vux.toast.text('系统出错啦', 'top')
            return
        } else {          
          
          let resObj = data.evaluationResult && JSON.parse(data.evaluationResult);

          if(!(resObj && resObj.returninfo && resObj.returninfo.status == '0')) {
            this.$log('查询考评结果出错', data);
            this.$vux.toast.text('查询考评结果出错啦', 'top')
            return
          }
          
          this.$log('考评结果', resObj);

          let results = resObj && resObj.bizdata && resObj.bizdata.evaluationRecordDetails;

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
        newList.push({
          label: (index+1) + '. ' + item.evaluationItemsName,
          value: '-' + item.deductScore,
        })
      })

      return newList
    },

  }

}