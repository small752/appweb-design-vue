import {Loading, PopupHeader, Actionsheet, Popup} from 'vux'
import H5Pdf from '@/components/jhszf-dd/common/h5-pdf/Index.vue';

/**
 * 信息刊物详情
 */
export default {
  name: 'xxkwDetail',
  
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    sysPendingsId: {
      type: String,
      required: true
    },
    docTitle: {
      type: String,
      required: true
    }
  },

  data () {
    return {
        loading: false,
        detailData: {},//详情数据
        pdfVisible: false,
        pdfPassword: '',
    }
  },

  computed: {
    pdfSrc: function() {
      return {
        url: this.detailData.pdfUrl,
        password: this.pdfPassword,
      }
    }
  },

  components: {
    Loading, PopupHeader, Actionsheet, H5Pdf, Popup
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
        sysPendingsId: this.sysPendingsId,
        filetype: 2
      };
      let postUrl = BASE_URL + '/officialDealAction!downLoadDoc.shtml';

      this.loading = true;

      let me = this;

      me.$requestServerForm(postUrl, params).then(({data}) => {
        
        me.loading = false;
        if(data == undefined || data.fail) {
          me.$log('查询信息刊物详情异常', data);
          me.$vux.toast.text('系统出错啦', 'top')
          me.hasMore = false;
          return
        } else {
          let resObj = data.downLoadDocFile && JSON.parse(data.downLoadDocFile);

          if(!(resObj && resObj.returninfo && resObj.returninfo.status == '0')) {
            me.$log('查询信息刊物详情出错', data);
            me.$vux.toast.text((resObj.returninfo && resObj.returninfo.description) || '查询信息刊物详情出错啦', 'top')
            me.hasMore = false;
            return
          }

          let pdfUrl = resObj.bizdata && resObj.bizdata.docContent;

          me.detailData.pdfUrl = pdfUrl;
          me.pdfVisible = true;
        }
      })
    },

    /**
     * 关闭详情页
     */
    closeDetailPop: function() {
      this.$emit('closeDetailPop')
    },

  }

}