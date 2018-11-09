import {Loading, PopupHeader, Actionsheet, querystring} from 'vux'
import H5Pdf from '@/components/jhszf-dd/common/h5-pdf/Index.vue';

import DocTodoDetailHistory from '../history/Index.vue';
import DocTodoDetailInfo from '../info/Index.vue';
import DocTodoDetailAttachment from '../attachment/Index.vue';
import DocTodoDetailTip from '../tip/Index.vue';
import DocTodoDetailAuditguide from '../auditguide/Index.vue';
import DocTodoDetailSelfEvaluate from '../self-evaluate/Index.vue';
import DocTodoDetailEvaluate from '../evaluate/Index.vue';
import DocTodoDetailAfterEvaluate from '../after-evaluate/Index.vue';
import DocTodoDetailSubmit from '../submit/Index.vue';

export default {
  name: 'docTodoDetail',
  
  props: {
    docType: {                  //  docType:公文类型 1: 待办  2:已办  3:文件共享  5:我的关注
      type: String,
      required: true
    },
    docid: {                  //  公文编号
      type: String,
      required: true
    },
    docTitle: {                  //  公文标题
      type: String,
    },
  },

  data () {
    return {
        loading: false,
        handleVisible: false,//详情页操作指示是否显示
        handleMenus: [],//详情页操作的菜单项
        detailData: {},//详情数据
        pdfVisible: true,
        pdfPassword: '',

        detailHistoryVisible: false,        //  历史签批
        detailInfoVisible: false,           //  意见
        detailAttachmentVisible: false,     //  附件窗口
        detailTipVisible: false,            //  小贴士窗口
        detailAuditguideVisible: false,     //  考核标准窗口
        detailVisibleSelfEvaluate: false,   //  自评结果窗口
        detailVisibleEvaluate: false,       //  考评结果窗口
        detailVisibleAfterEvaluate: false,  //  事后考评窗口
        detailVisibleSubmit: false,         //  提交窗口
    }
  },

  computed: {
    pdfSrc: function() {
      return {
        url: this.detailData.docContent,
        password: this.pdfPassword,
      }
    }
  },

  components: {
    Loading, PopupHeader, Actionsheet, H5Pdf,
    DocTodoDetailHistory,
    DocTodoDetailInfo,
    DocTodoDetailAttachment,
    DocTodoDetailTip,
    DocTodoDetailAuditguide,
    DocTodoDetailSelfEvaluate,
    DocTodoDetailEvaluate,
    DocTodoDetailAfterEvaluate,
    DocTodoDetailSubmit,
  },

  created: function() {
    this.queryDetail();
  },

  methods: {

    /**
     * 查询详情数据
     */
    queryDetail: function() {

      let params = {
        sysPendingsId: this.docid
      };
      let postUrl = BASE_URL + '/officialDealAction!openDetailPage.shtml';

      if(this.docType == '5') {
        postUrl = BASE_URL + '/officialDealAction!openAttentionDetailPage.shtml';
        params.isNeedpdf = '1';
        params.pagetype = '1';
        params.type = '0';
      }
      
      this.loading = true;
      this.$http.post(postUrl, params).then(({data}) => {
        
        let me = this;
        this.loading = false;
        if(data.fail) {
            me.$log('详情查询异常', data);
            this.$vux.toast.text('详情查询出错啦', 'top')
            this.closeDetailPop();
        } else {
          let officialDetailDTO = data.officialDetailDTO || {};

          if(this.docType == '5') {
            let resObj = data.openAttentionDetailPage && JSON.parse(data.openAttentionDetailPage);

            if(!(resObj && resObj.returninfo && resObj.returninfo.status == '0')) {
              me.$log('详情查询出错啦', data);
              me.$vux.toast.text('详情查询出错啦', 'top')
              this.closeDetailPop();
              return;
            }

            officialDetailDTO = resObj && resObj.bizdata;

            if(officialDetailDTO.filePw && officialDetailDTO.filePw.length > 0) {
              this.pdfVisible = false;
              this.decryptPw(officialDetailDTO.filePw);
            }
          } else {
            this.pdfPassword = officialDetailDTO.filePw;
          }

          console.info('详情数据', officialDetailDTO);

          this.detailData = officialDetailDTO;
          // this.detailData.docContent = '/joa_v3_group/servlet/docFileServlet?id=' + officialDetailDTO.docFileId;

          this.handleMenus = [
            {
              label: '请选择',
              type: 'info',
              value: 'select',
            },
            {
              label: '签批历史',
              type: 'primary',
              value: 'history',
            },
            {
              label: '意见信息',
              type: 'primary',
              value: 'info',
            },
            {
              label: '附件',
              type: 'primary',
              value: 'attachment',
            },
            {
              label: '小贴士',
              type: 'primary',
              value: 'tip',
            },
          ];

          if(officialDetailDTO.isSeeSelfEvaluation && this.docType != '5') {
            this.handleMenus.push({
              label: '自评结果',
              type: 'primary',
              value: 'self_evaluate',
            });
          }
          
          if(officialDetailDTO.isSeeEvaluation && this.docType != '5') {
            this.handleMenus.push({
              label: '考评结果',
              type: 'primary',
              value: 'evaluate',
            });
            
            if(this.docType == '2') {
              this.handleMenus.push({
                label: '事后考评',
                type: 'primary',
                value: 'after_evaluate',
              });
            }
          }
          
          if(officialDetailDTO.isAutoTk && officialDetailDTO.auditGuide && this.docType != '5') {
            this.handleMenus.push({
              label: '考评标准',
              type: 'primary',
              value: 'auditguide',
            });
          }
          
          if(this.docType === '1') {
            this.handleMenus.push({
              label: '提交',
              type: 'warn',
              value: 'submit',
            });
          }
          
          if(this.docType == '5') {
            this.handleMenus.push({
              label: '取消关注',
              type: 'warn',
              value: 'unattention',
            });
          }

          if(officialDetailDTO.isAutoTk && officialDetailDTO.auditGuide) {
            //  打开 考核标准
            this.detailAuditguideVisible = true;
          }
          
          if(officialDetailDTO.tipsCount > 0) {
            this.$vux.confirm.show({
              content: '您有新的小贴士, 是否现在查看?',
              onConfirm () {
                me.detailTipVisible = true;
              }
            })
          }
        }
      })
    },

    /**
     * 文件密码解密
     */
    decryptPw: function(filePw) {
      let me = this;
      let postUrl = BASE_URL + '/officialDealAction!systemAesDecrypt.shtml';
      let params = {
        encryptStr: filePw,
      };

      let options = {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      };

      me.$requestServer(postUrl, querystring.stringify(params), options).then(({data}) => {
        me.loading = false;
        if(data == undefined || data.fail) {
          me.$log('文件密码解密异常', data);
          me.$vux.toast.text('系统出错啦', 'top')
          return
        } else {
          this.pdfPassword = data + '';
          this.pdfVisible = true;
        }

      })
    },

    /**
     * 取消关注
     */
    unattention: function() {
      let me = this;
      let postUrl = BASE_URL + '/officialDealAction!removeAttention.shtml';
      let params = {
        sysPendingsId: this.docid,
        type: '0',
      };

      let options = {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      };

      me.$requestServer(postUrl, querystring.stringify(params), options).then(({data}) => {
        me.loading = false;
        if(data == undefined || data.fail) {
          me.$log('取消关注异常', data);
          me.$vux.toast.text('系统出错啦', 'top')
          return
        } else {
          let resObj = data.removeAttention && JSON.parse(data.removeAttention);

          if(!(resObj && resObj.status == '0')) {
            me.$log('取消关注出错', data);
            me.$vux.toast.text('取消关注出错啦', 'top')
            return
          }

          me.$vux.toast.text('取消关注成功', 'top')
          this.$emit('closeDetailPop')
          this.$emit('refreshList', 0)
        }

      })
    },

    /**
     * 关闭详情页
     */
    closeDetailPop: function() {
      this.$emit('closeDetailPop')
    },

    /**
     * 打开详情页操作界面
     */
    openDetailHandle: function() {
      this.handleVisible = true;
    },

    /**
     * 操作菜单点击时
     */
    handleOnMenuClick: function(menuKey, menuItem) {
      
      if(menuKey === 'history') {
        //  打开签批历史
        this.detailHistoryVisible = true;
      } else if(menuKey === 'info') {
        //  打开意见信息
        this.detailInfoVisible = true;
      } else if(menuKey === 'attachment') {
        //  打开 附件
        this.detailAttachmentVisible = true;
      } else if(menuKey === 'tip') {
        //  打开 小贴士
        this.detailTipVisible = true;
      } else if(menuKey === 'auditguide') {
        //  打开 考核标准
        this.detailAuditguideVisible = true;
      } else if(menuKey === 'self_evaluate') {
        //  打开 自评结果
        this.detailVisibleSelfEvaluate = true;
      } else if(menuKey === 'evaluate') {
        //  打开 考评结果
        this.detailVisibleEvaluate = true;
      } else if(menuKey === 'after_evaluate') {
        //  打开 事后考评
        this.detailVisibleAfterEvaluate = true;
      } else if(menuKey === 'submit') {
        //  打开 提交
        this.detailVisibleSubmit = true;
      } else if(menuKey === 'unattention') {
        //  取消关注
        this.unattention();
      }
    },

    /**
     * 关闭公文历史签批
     */
    handleOnCloseHistory: function() {
      this.detailHistoryVisible = false;
    },

    /**
     * 关闭公文 - 意见信息
     */
    handleOnCloseInfo: function() {
      this.detailInfoVisible = false;
    },

    /**
     * 关闭公文 - 附件
     */
    handleOnCloseAttachment: function() {
      this.detailAttachmentVisible = false;
    },

    /**
     * 关闭公文 - 小贴士
     */
    handleOnCloseTip: function() {
      this.detailTipVisible = false;
    },

    /**
     * 关闭公文 - 考核标准
     */
    handleOnCloseAuditguide: function() {
      this.detailAuditguideVisible = false;
    },

    /**
     * 关闭公文 - 自评结果
     */
    handleOnCloseSelfEvaluate: function() {
      this.detailVisibleSelfEvaluate = false;
    },

    /**
     * 关闭公文 - 考评结果
     */
    handleOnCloseEvaluate: function() {
      this.detailVisibleEvaluate = false;
    },

    /**
     * 关闭公文 - 事后考评
     */
    handleOnCloseAfterEvaluate: function() {
      this.detailVisibleAfterEvaluate = false;
    },

    /**
     * 关闭公文 - 提交
     */
    handleOnCloseSubmit: function() {
      this.detailVisibleSubmit = false;
    },

    /**
     * 关闭公文 - 提交成功
     */
    handleOnCloseSubmitSuccess: function() {
      this.detailVisibleSubmit = false;
      this.$emit('closeDetailPop')
      this.$emit('refreshList', 0)
    },
  
  }

}