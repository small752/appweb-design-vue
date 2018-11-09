import {Loading, Popup, PopupHeader, Group, CellBox, CheckIcon, InlineXNumber} from 'vux'

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
 * 公文详情 - 提交 - 考评
 */
export default {

  name: 'docTodoDetailSubmitEvaluate',

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
    evaluationResult: {    //  考评选项
      type: Array,
      required: true
    }
  },

  data () {
    return {
        loading: false,
        dataSource: [],
    }
  },

  components: {Loading, Popup, PopupHeader, Group, CellBox, CheckIcon, InlineXNumber, ScoreNumber},

  created: function() {
    let dataSource = [];
    this.evaluationResult && this.evaluationResult.map((item) => {
      dataSource.push({
        ...item,
        isCut: item.isCheck === 1,
      })
    })

    this.dataSource = dataSource;
  },

  methods: {

    /**
     * 关闭详情页
     */
    closePop: function() {
      this.$emit('handleOnCancle')
    },

    /**
     * 表单提交
     */
    handleOnSubmit: function() {
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
              me.$log('考评异常', data);
              me.$vux.toast.text('系统出错啦', 'top')
              return
            } else {
              let resObj = data.eResult && JSON.parse(data.eResult);

              if(!(resObj && resObj.status == '0')) {
                me.$log('考评出错', data);
                me.$vux.toast.text('考评出错啦', 'top')
                return
              }

              me.$vux.toast.text('考评成功', 'top')
              me.$emit('handleOnClose')
            }

          })

        }

      });

    },

  }

}