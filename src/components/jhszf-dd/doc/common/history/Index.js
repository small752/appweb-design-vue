import {Loading, Popup, PopupHeader, Timeline, TimelineItem, XButton} from 'vux'
import H5Pdf from '@/components/jhszf-dd/common/h5-pdf/Index.vue';
import ListEmptyIcon from '@/components/jhszf-dd/common/list-empty-icon'

/**
 * 公文详情 - 历史签批
 */
export default {

  name: 'docTodoDetailHistory',

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

        detailVisible: false,
        detailData: {},
    }
  },

  computed: {
    pdfSrc: function() {

      let url = this.detailData.fileurl;

      // // 本地开发环境测试代码
      // if(process.env.NODE_ENV === 'development') {
      //   url = url.replace('http://112.12.60.112:10009/jhszf', '/joa_v3_group')
      // }

      return {
        url: url,
        password: '',
      }
    }
  },

  components: {Loading, Popup, PopupHeader, Timeline, TimelineItem, XButton, H5Pdf, ListEmptyIcon},

  created: function() {
    this.queryHistoryList();
  },

  methods: {

    /**
     * 查询公文历史签批数据
     */
    queryHistoryList: function() {

      let docTypeMap = ['', '4', '4', '4', '4', '7'];

      let params = {
        sysPendingsId: this.docid,
        type: docTypeMap[this.docType],
        contenttype: '0',
      };
      let postUrl = BASE_URL + '/officialDealAction!getOfficialMobileRecordList.shtml';
      
      this.loading = true;

      this.$requestServer(postUrl, params).then(({data}) => {
        
        this.loading = false;
        if(data == undefined || data.fail) {
            this.$vux.toast.text('系统出错啦', 'top')
            return
        } else {          
          
          let recordListObj = data.recordList && JSON.parse(data.recordList);

          if(!(recordListObj && recordListObj.returninfo && recordListObj.returninfo.status == '0')) {
            this.$vux.toast.text('查询历史签批出错啦', 'top')
            return
          }
          
          let results = recordListObj && recordListObj.bizdata && recordListObj.bizdata.mobileRecordList;

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
    
    openHistoryDetailPop: function(record) {
      this.detailVisible = true;
      this.detailData = record;
    },

    closeHistoryDetailPop: function() {
      this.detailVisible = false;
      this.detailData = {};
    }
  }

}