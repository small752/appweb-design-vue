import {Loading, Popup, PopupHeader, Group, Checker, CheckerItem, PopupRadio, XInput, XTextarea} from 'vux'

/**
 * 公文详情 - 提交 - 自评
 */
export default {

  name: 'docTodoDetailSubmitSelfEvaluate',

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
    selfEvaluationResult: {    //  自评选项
      type: Object,
      required: true
    }
  },

  data () {
    return {
        loading: false,
        selfEvaluateObject: {},
    }
  },

  components: {Loading, Popup, PopupHeader, Group, Checker, CheckerItem, PopupRadio, XInput, XTextarea},

  created: function() {

    let selfEvaluateObject = this.selfEvaluationResult;

    // 初始化自评选项的值
    let selfEvaluationRecordValueDTOs = selfEvaluateObject.selfEvaluationRecordValueDTOs || [];

    if(selfEvaluationRecordValueDTOs && selfEvaluationRecordValueDTOs.length > 0) {
      selfEvaluationRecordValueDTOs.forEach(element => {
        if(element.checkOneValue === 1) {
          element.value = 'one'
        } else if(element.checkTwoValue === 1) {
          element.value = 'two'
        } else if(element.checkThreeValue === 1) {
          element.value = 'three'
        } 
      });
    }

    this.selfEvaluateObject = selfEvaluateObject;
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

          let selfEvaluationRecordValueDTOs = [];

          me.selfEvaluateObject.selfEvaluationRecordValueDTOs && me.selfEvaluateObject.selfEvaluationRecordValueDTOs.map((item) => {

            let itemValueObj = {
              checkOneValue: item.checkOneValue == undefined ? undefined : '0',
              checkTwoValue: item.checkTwoValue == undefined ? undefined : '0',
              checkThreeValue: item.checkThreeValue == undefined ? undefined : '0',
            };
            if(item.value == 'one') {
              itemValueObj.checkOneValue = '1';
            } else if(item.value == 'two') {
              itemValueObj.checkTwoValue = '1';
            } else if(item.value == 'three') {
              itemValueObj.checkThreeValue = '1';
            }

            selfEvaluationRecordValueDTOs.push({
              id: item.id,
              selfEvaluationItemsId: item.selfEvaluationItemsId,
              selfEvaluationItemsName: item.selfEvaluationItemsName,
              checkboxOneName: item.checkboxOneName,
              checkboxTwoName: item.checkboxTwoName,
              checkboxThreeName: item.checkboxThreeName,
              ...itemValueObj,
            })
          })

          let evaluate_submit_obj = {
            id: me.selfEvaluateObject.id,
            entityId: me.selfEvaluateObject.entityId,
            selfEvaluationTypeId: me.selfEvaluateObject.selfEvaluationTypeId,
            selfEvaluationTypeName: me.selfEvaluateObject.selfEvaluationTypeName,
            selfEvaluationTypeName: me.selfEvaluateObject.selfEvaluationTypeName,
            isSelfEvaluation: me.selfEvaluateObject.isSelfEvaluation,
            qualityGrade: me.selfEvaluateObject.qualityGrade,
            comments: me.selfEvaluateObject.comments,
            memo: me.selfEvaluateObject.memo,
            selfEvaluationRecordValueDTOs: JSON.stringify(selfEvaluationRecordValueDTOs),
          };

          let params = {
            selfevaluationresult: JSON.stringify([evaluate_submit_obj]),
          };
          let postUrl = BASE_URL + '/officialDealAction!reportSelfEvaluationResult.shtml';
          
          me.loading = true;
    
          me.$requestServer(postUrl, params).then(({data}) => {
            me.loading = false;
            if(data == undefined || data.fail) {
              me.$log('自评异常', data);
              me.$vux.toast.text('系统出错啦', 'top')
              return
            } else {
              let resObj = data.selfEvaluationResult && JSON.parse(data.selfEvaluationResult);

              if(!(resObj && resObj.status == '0')) {
                me.$log('自评出错', data);
                me.$vux.toast.text('自评出错啦', 'top')
                return
              }

              me.$vux.toast.text('自评成功', 'top')
              me.$emit('handleOnClose')
            }

          })

        }

      });

    },

    /**
     * 获取自评选项的下拉框内容
     */
    getSelfEvaluateListOpts: function(obj) {
      let opts = [];

      if(obj.checkboxOneName != undefined && obj.checkboxOneName != '') {
        opts.push({
          key: 'one',
          value: obj.checkboxOneName
        });
      }

      if(obj.checkboxTwoName != undefined && obj.checkboxTwoName != '') {
        opts.push({
          key: 'two',
          value: obj.checkboxTwoName
        });
      }

      if(obj.checkboxThreeName != undefined && obj.checkboxThreeName != '') {
        opts.push({
          key: 'three',
          value: obj.checkboxThreeName
        });
      }
      return opts;
    }

  }

}