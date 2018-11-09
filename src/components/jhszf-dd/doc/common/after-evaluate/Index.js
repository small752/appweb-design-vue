import {Loading, Popup, PopupHeader, Group, CellBox, CheckIcon, InlineXNumber } from 'vux'

let ScoreNumber = {
  template: '<InlineXNumber \
    v-model="currentValue" \
    style="float: right;" \
    :min="0" \
    :max="max" \
    width="50px" />',
  props: ['value', 'defaultValue', 'max'],
  data: function () {
    return {
      currentValue: 0,
      min: 0,
    }
  },

  components: {InlineXNumber},

  created: function() {
    if(this.value === 0) {
      this.currentValue = this.defaultValue;
      this.$emit('input', this.currentValue)
    } else {
      this.currentValue = this.value;
    }
    
  },

  beforeDestroy: function() {
    this.currentValue = 0;
    this.$emit('input', this.currentValue)
  },

  watch: {

    currentValue (newValue, old) {
      if (newValue !== '') {
        if (typeof this.min !== 'undefined' && this.currentValue < this.min) {
          this.currentValue = this.min
        }
        if (this.max && this.currentValue > this.max) {
          this.currentValue = this.max
        }
      }
      this.$emit('input', this.currentValue)
    },

    value (newValue) {
      this.currentValue = newValue
      this.$emit('on-change', newValue)
    },
  },

}

/**
 * 公文详情 - 事后考评
 */
export default {

  name: 'docTodoDetailAfterEvaluate',

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

  components: {Loading, Popup, PopupHeader, Group, CellBox, CheckIcon, InlineXNumber, ScoreNumber},

  created: function() {
    this.query();
  },

  methods: {

    /**
     * 查询数据
     */
    query: function() {
      
      let params = {
        sysPendingsId: this.docid,
        type: '0',
      };
      let postUrl = BASE_URL + '/officialDealAction!getAfterEvaluationContent.shtml';
      
      this.loading = true;

      this.$requestServer(postUrl, params).then(({data}) => {
        
        this.loading = false;
        if(data == undefined || data.fail) {
            this.$log('查询事后考评异常', data);
            this.$vux.toast.text('系统出错啦', 'top')
            return
        } else {          
          
          let resObj = data.afterEvaluationContent && JSON.parse(data.afterEvaluationContent);

          if(!(resObj && resObj.returninfo && resObj.returninfo.status == '0')) {
            this.$log('查询事后考评出错', data);
            this.$vux.toast.text('查询事后考评出错啦', 'top')
            return
          }
          
          this.$log('事后考评', resObj);

          let results = resObj && resObj.bizdata && resObj.bizdata.evaluationRecordLt;

          results && results.map((item) => {
            item.isCut = item.isCheck === 1
          })

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
     * 点击确认按钮
     */
    submitForm: function() {
      let me = this;
      this.$vux.confirm.show({
        content: '确定要提交吗?',
        onConfirm () {

          let sub_arr = me.dataSource.map((item) => {
            return {
              deductScore: item.deductScore,
              documentTypeLargeId: item.documentTypeLargeId,
              deductScore: item.deductScore,
              documentTypeLargeName: item.documentTypeLargeName,
              entityId: item.entityId,
              evaluationItemsId: item.evaluationItemsId,
              evaluationItemsName: item.evaluationItemsName,
              id: item.id,
              isCheck: item.isCut ? '1' : '0',
              score: item.score,
              totalScore: item.totalScore,
            }
          })

          let params = {
            evaluationresult: JSON.stringify(sub_arr),
          };
          let postUrl = BASE_URL + '/officialDealAction!reportEvaluationResult.shtml';
          
          me.loading = true;
    
          me.$requestServer(postUrl, params).then(({data}) => {
            me.loading = false;
            if(data == undefined || data.fail) {
              me.$log('事后考评异常', data);
              me.$vux.toast.text('系统出错啦', 'top')
              return
            } else {
              let resObj = data.eResult && JSON.parse(data.eResult);

              if(!(resObj && resObj.status == '0')) {
                me.$log('事后考评出错', data);
                me.$vux.toast.text('事后考评出错啦', 'top')
                return
              }

              me.$vux.toast.text('事后考评成功', 'top')
              me.$emit('handleOnClose')
            }

          })

        }
      })
    },

  }

}
