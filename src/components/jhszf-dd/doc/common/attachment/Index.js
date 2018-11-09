import {Loading, Popup, PopupHeader, Group, CellBox} from 'vux'
import ListEmptyIcon from '@/components/jhszf-dd/common/list-empty-icon'

/**
 * 公文详情 - 附件窗口
 */
export default {

  name: 'docTodoDetailAttachment',

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

  components: {Loading, Popup, PopupHeader, Group, CellBox, ListEmptyIcon},

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
        contenttype: '2',
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
     * 点击文件下载
     */
    clickToDownload: function(record) {
      this.$log('clickToDownload', record)
      if(record && record.fileurl) {
        window.open(record.fileurl, '_blank');
      }
    }
  }

}