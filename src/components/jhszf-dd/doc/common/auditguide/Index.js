import {Loading, XDialog, PopupHeader} from 'vux'

/**
 * 公文详情 - 考核标准
 */
export default {

  name: 'docTodoDetailAuditguide',

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
    content: {                  //  考核标准内容 - base64
      type: String,
      required: true
    },
  },

  data () {
    return {
        loading: false,
        htmlContent: '',
    }
  },

  components: {Loading, XDialog, PopupHeader},

  created: function() {
    this.decode64();
  },

  methods: {

    /**
     * 考核标准内容解码
     */
    decode64: function() {
      let htmlContent = strAnsi2Unicode(decode64(this.content));
      this.htmlContent = htmlContent;
    },

    /**
     * 关闭详情页
     */
    closePop: function() {
      this.$emit('handleOnClose')
    },
    
  }

}