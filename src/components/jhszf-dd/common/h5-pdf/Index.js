import {Loading, Toast, XCircle} from 'vux'
import VuePdf from 'vue-pdf'

export default {
  name: 'h5Pdf',
  props: {
    src: {
      required: true,
      default: function () {
        return { url: '', password: ''}
      }
    },
    defaultPage: {}
  },
  data () {
    return {
        loading: true,
        loadPercent: 0,               //  加载进度
        page: 1,                      //  当前页码 
        total: 0,                     //  pdf总页数
        touchStartX: '',              //  手指滑动起始点
        touchEndX: '',                //  手指滑动结束点
    }
  },
  components: {Loading, Toast, XCircle, VuePdf},

  methods: {

    /**
     * 详情页的PDF文件密码
     */
    detailPdfPassword: function(updatePassword, reason) {
      updatePassword(this.src.password);
    },

    /**
     * 详情页的PDF文件加载进度条
     */
    detailPdfProgress: function(range) {
      _('detailPdfProgress', range)
      this.loadPercent = parseInt(range * 100) || 0;
      if(range == 1) {
        this.loading = false;
      }
    },

    /**
     * 详情页上PDF的滑动监听
     */
    detailPdfTouchstart: function(e) {
      let touchNode = e.touches && e.touches.length > 0 && e.touches[0];
      this.touchStartX = touchNode && touchNode.clientX;
    },
    
    detailPdfTouchend: function(e) {
      let touchNode = e.changedTouches && e.changedTouches.length > 0 && e.changedTouches[0];
      this.touchEndX = touchNode && touchNode.clientX;

      if(this.touchEndX != undefined && this.touchEndX != '') {
        if(this.touchEndX > this.touchStartX) {
          //向前翻一页
          if(this.page == 1) {
            this.$vux.toast.text('已经是第一页', 'top')
          } else {
            this.page--;
          }
          
        } else if(this.touchEndX < this.touchStartX) {
          //向后翻一页
          if(this.page == this.total) {
            this.$vux.toast.text('已经是最后一页', 'top')
          } else {
            this.page++;
          }
          
        }
      }

      this.touchStartX = '';
      this.touchEndX = '';
    },

    /**
     * 获取PDF文件总页数
     */
    detailPdfNumpages: function(total) {
      this.total = total;
    },
  
    /**
     * pdf加载出错
     */
    pdfLoadError: function(e) {
      this.$vux.toast.text('PDF加载出错啦', 'top')
      this.$log('pdfLoadError', e);
      this.loading = false;
    }
  }

}