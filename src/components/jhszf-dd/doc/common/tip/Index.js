import {Loading, Popup, PopupHeader, Tab, TabItem, Group, CellBox} from 'vux'
import ListEmptyIcon from '@/components/jhszf-dd/common/list-empty-icon'
import H5Pdf from '@/components/jhszf-dd/common/h5-pdf/Index.vue';

/**
 * 公文详情 - 小贴士
 */
export default {

  name: 'docTodoDetailTip',

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
        toMeTipList: [],        //  我的小贴士
        meSendTipList: [],      //  我发送的小贴士
        tipType: 0,           //  当前选中的贴士类型

        detailVisible: false,
        detailData: {},
    }
  },

  components: {Loading, Popup, PopupHeader, Tab, TabItem, ListEmptyIcon, Group, CellBox, H5Pdf},

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
        contenttype: '1',
      };
      let postUrl = BASE_URL + '/officialDealAction!getOfficialMobileRecordList.shtml';
      
      this.loading = true;

      this.$requestServer(postUrl, params).then(({data}) => {
        
        this.loading = false;
        if(data == undefined || data.fail) {
            this.$log('查询附件异常', data);
            this.$vux.toast.text('系统出错啦', 'top')
            return
        } else {          
          
          let resObj = data.recordList && JSON.parse(data.recordList);

          if(!(resObj && resObj.returninfo && resObj.returninfo.status == '0')) {
            this.$log('查询附件出错', data);
            this.$vux.toast.text('查询附件出错啦', 'top')
            return
          }
          
          let results = resObj && resObj.bizdata && resObj.bizdata.mobileRecordList;

          let toMeTipList = [];
          let meSendTipList = [];

          results && results.map((item, index) => {
            if(item.type === '1') {
              toMeTipList.push(item);
            } else {
              meSendTipList.push(item);
            }
          })

          this.toMeTipList = toMeTipList;
          this.meSendTipList = meSendTipList;
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
     * 显示小贴士内容详情
     */
    showTipDetail: function(record) {
      this.$log('showTipDetail', record);
      
      if(record.isread === '0') {
        //  如果小贴士未读 则更改阅读状态
        this.changeTipReadStatus(record)
      }

      this.detailVisible = true;

      if(record.contenttype !== '1') {
        record.pdfSrc = {
          url: record.fileurl,
          password: '',
        }
      }

      this.detailData = record;
    },

    /**
     * 更改小贴士阅读状态
     */
    changeTipReadStatus: function(record) {
      
      let params = {
        sysPendingsId: record.tipid,
      };
      let postUrl = BASE_URL + '/officialDealAction!changeTipStatus.shtml';
      
      this.loading = true;

      this.$requestServer(postUrl, params).then(({data}) => {
        
        this.loading = false;
        if(data == undefined || data.fail) {
            this.$log('小贴士更改阅读状态异常', data);
            this.$vux.toast.text('系统出错啦', 'top')
            return
        } else {          
          
          let resObj = data.changTipStatus && JSON.parse(data.changTipStatus);

          if(!(resObj && resObj.status == '0')) {
            this.$log('小贴士更改阅读状态出错', data);
            this.$vux.toast.text('小贴士更改阅读状态出错啦', 'top')
            return
          }
          
          this.query();
        }
      })
    },

    /**
     * 关闭小贴士详情
     */
    closeTipDetailPop: function() {
      this.detailVisible = false;
    },

  }

}