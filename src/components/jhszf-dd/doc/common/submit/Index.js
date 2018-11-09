import {Loading, Popup, PopupHeader, Group, CellBox, Cell, Selector, Checklist, XTextarea, XSwitch} from 'vux'

import DocTodoDetailSubmitEvaluate from '../submit-evaluate/Index.vue'
import DocTodoDetailSubmitSelfEvaluate from '../submit-self-evaluate/Index.vue'

/**
 * 公文详情 - 提交
 */
export default {

  name: 'docTodoDetailSubmit',

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
    docfileid: {                  //  公文对应文件编号
    },
    docTitle: {                  //  公文标题
      type: String,
      required: true
    },
    isWfStepEndExecuter: {    //  当前是否是步骤最后处理人
      type: Boolean,
      required: true
    }
  },

  data () {
    return {
        loading: false,

        bizdata: {},

        selfEvaluateProps: {            //  自评窗口是否显示
          visible: false,
          selfEvaluationResult: {},
        }, 
        evaluateProps: {                //  考评窗口是否显示
          visible: false,
          evaluationResult: [],
        },
        
        nextSteppersonPop: {            //  下一步骤处理人属性
          visible: false,
          step: {},
          options: [],
        },

    }
  },

  components: {
    Loading, Popup, PopupHeader,
    Group, CellBox, Cell, Selector, Checklist, XTextarea, XSwitch,
    DocTodoDetailSubmitEvaluate,
    DocTodoDetailSubmitSelfEvaluate,
  },

  created: function() {
    this.query();
  },

  methods: {

    /**
     * 查询公文历史签批数据
     */
    query: function() {

      let docTypeMap = ['', '4', '4', '4', '4', '7'];

      let params = {
        sysPendingsId: this.docid,
        type: docTypeMap[this.docType],
      };
      let postUrl = BASE_URL + '/officialDealAction!getNextOfficialProcess.shtml';
      
      this.loading = true;

      this.$requestServer(postUrl, params).then(({data}) => {
        
        this.loading = false;
        if(data == undefined || data.fail) {
            this.$log('查询下一步骤异常', data);
            this.$vux.toast.text('系统出错啦', 'top')
            return
        } else {          
          
          let resObj = data.nextOfficialProcess && JSON.parse(data.nextOfficialProcess);

          if(!(resObj && resObj.returninfo && resObj.returninfo.status == '0')) {
            this.$log('查询下一步骤出错', data);
            this.$vux.toast.text('查询下一步骤出错啦', 'top')
            return
          }
          
          _('下一步骤', resObj);

          let bizdata = (resObj && resObj.bizdata) || {};

          let nextStepLt = bizdata.nextStepLt || [];

          if(bizdata.curStepStepsSelectMode !== 'ALL') {
            if(nextStepLt.length > 0) {
              bizdata.nextStepId = nextStepLt[0].id;
              this.nextSteppersonPop.step = nextStepLt[0];
            }
          }

          bizdata.msgContent = '您有一条待办公文《' + this.docTitle + '》需要处理!';
          
          this.bizdata = bizdata;

          //  判断是否显示考评界面
          let evaluationRecordResult = bizdata.evaluationRecordLt;
          
          if(evaluationRecordResult && evaluationRecordResult.length > 0) {
            this.evaluateProps.evaluationResult = evaluationRecordResult;
            this.evaluateProps.visible = true;
          }

          //  判断是否显示自评窗口
          let selfEvaluationRecordResult = bizdata.selfEvaluationRecordResult;

          if(selfEvaluationRecordResult != undefined) {
            this.selfEvaluateProps.selfEvaluationResult = selfEvaluationRecordResult;
            this.selfEvaluateProps.visible = true;
          }

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
     * 表单提交
     */
    handleOnSubmit: function() {
      let me = this;
      this.$vux.confirm.show({
        content: '确定要提交吗?',
        onConfirm () {

          let submit_obj = {
            sysPendingsId: me.docid,
            type: me.docType,
            docfileid: me.docfileid,
          };

          let nextexecutemodesStr = '';     //  下一步骤编号
          let nextpersonidStr = '';     //  下一步骤处理人编号
          let opinionStr = me.bizdata.messagestr;        //  处理意见
          let tipscontent = me.bizdata.tipstr;        //  小贴士
          let isMsg = me.bizdata.isMsg ? '1' : '0';        //  是否短信提醒
          let msgContent = me.bizdata.msgContent;        //  短信提醒内容

          let nextStepLt = me.bizdata.nextStepLt || [];

          let nextStepCount = 0;  //  下一步骤数量

          //  当前是步骤最后处理人时
          if(me.isWfStepEndExecuter) {
            //  必须选择下一步骤处理人

            //  当前是多步骤时
            if(me.bizdata.curStepStepsSelectMode == 'ALL') {
              nextStepLt.map((item) => {
                if(item.nextpersonvalue && item.nextpersonvalue.length > 0) {
                  nextexecutemodesStr += item.id + ':' + item.type + ';'
                  nextpersonidStr += item.id + ':' + item.nextpersonvalue + ';'
                  nextStepCount++
                }
              })
            } else {
              let nextStepId = me.bizdata.nextStepId || '';

              nextStepLt.map((item) => {
                if(item.id == nextStepId && item.nextpersonvalue && item.nextpersonvalue.length > 0) {
                  nextexecutemodesStr += item.id + ':' + item.type + ';'
                  nextpersonidStr += item.id + ':' + item.nextpersonvalue + ';'
                  nextStepCount++
                }
              })
            }

            if(nextStepCount == 0) {
              me.$vux.toast.text('请选择处理人', 'top')
              return
            }

            if(!(opinionStr && opinionStr.length > 0)) {
              me.$vux.toast.text('请输入处理意见', 'top')
              return
            }

          }

          if(isMsg == '1' && !(msgContent && msgContent.length > 0)) {
            me.$vux.toast.text('请输入短信内容', 'top')
            return
          }

          submit_obj.nextexecutemodes = nextexecutemodesStr;
          submit_obj.nextpersonid = nextpersonidStr;
          submit_obj.opinion = opinionStr;
          submit_obj.tipscontent = tipscontent;
          submit_obj.isMsg = isMsg;
          submit_obj.msgContent = msgContent;

          _('提交数据', submit_obj)

          let params = {
            ...submit_obj
          };
          let postUrl = BASE_URL + '/officialDealAction!sendOfficialProcess.shtml';
          
          me.loading = true;
    
          me.$requestServer(postUrl, params).then(({data}) => {
            me.loading = false;
            if(data == undefined || data.fail) {
              me.$log('提交异常', data);
              me.$vux.toast.text('系统出错啦', 'top')
              return
            } else {
              let resObj = data.officialProcess && JSON.parse(data.officialProcess);

              if(!(resObj && resObj.returninfo && resObj.returninfo.status == '0')) {
                me.$log('提交出错', data);
                me.$vux.toast.text('提交出错啦', 'top')
                return
              }

              me.$vux.toast.text('提交成功', 'top')
              me.$emit('handleOnSubmitSuccess')
            }

          })

        }

      });

    },
    
    /**
     * 关闭小贴士详情
     */
    closeSelvEvaluatePop: function() {
      this.selfEvaluateVisible = false;
    },

    /**
     * 下一步骤下拉框选择变更时
     */
    handleOnNextstepmodeChange: function(value) {
      let me = this;
      let nextStepLt = this.bizdata.nextStepLt || [];

      nextStepLt.map((item) => {
        if(item.id === value) {
          me.nextSteppersonPop.step = item;
        }
      })

    },

    /**
     * 获取设置某一步骤的下拉框选项
     */
    getOneStepOpts: function(step) {
      return [
        {
          key: step.id,
          value: step.name,
        }
      ]
    },

    /**
     * 获取设置下一步骤的下拉框选项
     */
    getAllStepOpts: function() {

      let opts = [];

      let nextStepLt = this.bizdata.nextStepLt || [];

      nextStepLt.map((item) => {
        opts.push({
          key: item.id,
          value: item.name,
        });
      })

      return opts;
    },

    /**
     * 显示下一步骤处理人
     */
    handleOnOpenNextperson: function(step) {

      let executersArr = step.executers && step.executers.split(',')
      let executersNameArr = step.executersName && step.executersName.split(',')

      let options = []

      for (let i = 0; i < executersArr.length; i++) {
        options.push({
          key: executersArr[i],
          value: executersNameArr[i],
        })
      }

      let nextpersonarr = step.nextpersonvalue && step.nextpersonvalue.split(',')

      this.nextSteppersonPop = {
        visible: true,
        step,
        options,
        nextpersonarr,
      }
    },

    /**
     * 步骤人员关系下拉框选项
     */
    getOneStepTypeOpts: function() {
      return [
        {
          key: 'SEQUENCE',
          value: '串行',
        },
        {
          key: 'PARALLED',
          value: '并行',
        }
      ]
    },

    /**
     * 下一步骤处理人选择确定时
     */
    handleOnChangeNextperson: function() {
      let {nextpersonarr, options, step} = this.nextSteppersonPop

      let nextpersonarrnamearr = [];

      nextpersonarr.map((item) => {

        let iname = ''
        options.map((oi) => {
          if(oi.key === item) {
            iname = oi.value
          }
        })

        nextpersonarrnamearr.push(iname)
      })

      step.nextpersonstr = nextpersonarrnamearr.join(',')
      step.nextpersonvalue = nextpersonarr.join(',')

      this.nextSteppersonPop.visible = false;
    },

    /**
     * 关闭下一步骤处理人选择窗口
     */
    closeNextsteppersonPop: function() {
      this.nextSteppersonPop.visible = false;
    },

    /**
     * 提交 - 考评窗口关闭
     */
    handleOnSubmitEvaluateClose: function() {
      this.evaluateProps.visible = false;
    },

    /**
     * 提交 - 考评窗口取消
     */
    handleOnSubmitEvaluateCancle: function() {
      this.evaluateProps.visible = false;
      this.$emit('handleOnClose')
    },

    /**
     * 提交 - 自评窗口关闭
     */
    handleOnSubmitSelfEvaluateClose: function() {
      this.selfEvaluateProps.visible = false;
    },

    /**
     * 提交 - 自评窗口取消
     */
    handleOnSubmitSelfEvaluateCancle: function() {
      this.selfEvaluateProps.visible = false;
      this.$emit('handleOnClose')
    },

  }

}