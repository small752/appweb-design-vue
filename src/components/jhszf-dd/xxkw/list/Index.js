import {Loading, Cell, CellBox, Group, LoadMore, ViewBox, PopupHeader, Sticky} from 'vux'

import XxkwDetail from '../detail/Index.vue'

/**
 * 信息刊物 - 列表
 */
export default {
  name: 'xxkwList',

  props: {
    type: {
        type: String,
        required: true
    }
  },
  data () {
    return {
        loading: false,
        hasMore: true,
        dataSource: [],
        pageIndex: 0,
        pageSize: 20,
        lastRecordTimestamp: '',

        typeTitle: '',

        detailProps: {
            visible: false,
            docid: '',
            docTitle: '',
        }
    }
  },

  components: {Loading, Cell, CellBox, Group, LoadMore, ViewBox, XxkwDetail, PopupHeader, Sticky},

  created: function() {
    this.typeTitle = window._global_data && window._global_data.xxkw_type_title;
  },

  methods: {

    /**
     * 列表查询
     */
    queryList: function(pageIndex) {

      if(this.loading) return;

      //请求参数
      let params = {
          type: this.type,
          keyword: '',
      };

      if(pageIndex == '0') {
          this.dataSource = [];
          this.hasMore = true;
          this.lastRecordTimestamp = '';
      }

      params.pagesize = this.pageSize;
      params.currentdatetime = this.lastRecordTimestamp;

      let postUrl = BASE_URL + '/officialDealAction!getDocList.shtml';

      let me = this;
      me.loading = true;

      me.$requestServerForm(postUrl, params).then(({data}) => {

        me.loading = false;

        if(data == undefined || data.fail) {
          me.$log('查询信息刊物列表异常', data);
          me.$vux.toast.text('系统出错啦', 'top')
          me.hasMore = false;
          return
        } else {
          let resObj = data.docListContent && JSON.parse(data.docListContent);

          if(!(resObj && resObj.returninfo && resObj.returninfo.status == '0')) {
            me.$log('查询信息刊物列表出错', data);
            me.$vux.toast.text('查询信息刊物列表出错啦', 'top')
            me.hasMore = false;
            return
          }

          let dataSource = resObj.bizdata && resObj.bizdata.doclist;

          if(dataSource && dataSource.length > 0) {
            this.lastRecordTimestamp = dataSource[dataSource.length-1].createdatetime;
          }

          dataSource.map(function(item) {
            me.dataSource.push({
                ...item
            });
        });

          if(dataSource.length < params.pagesize) {
            me.hasMore = false;
          } else {
            me.hasMore = true;
          }
        }

      })
    },

    queryMore: function() {
      if(!this.hasMore) return;
      if(this.loading) return;
      this.queryList();
    },

    /*点击打开详情*/
    handleOnClickTypeItem: function(record) {
      let detailProps = {
        visible: true,
        docid: record.docid,
        docTitle: record.title,
      }

      this.detailProps = detailProps;
    },

    /*关闭详情*/
    closeDetailPop: function() {
      this.detailProps.visible = false;
    },

    backToXxkwIndex: function() {
      this.$router.push('/xxkw/index')
    },

  }

}