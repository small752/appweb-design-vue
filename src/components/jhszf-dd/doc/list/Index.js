import {ViewBox, Loading, Popup, XButton, LoadMore, Icon} from 'vux'
import ListEmptyIcon from '@/components/jhszf-dd/common/list-empty-icon'
import DocTodoDetail from '../common/detail/Index.vue'

import {setDdNavTitle} from '@/util/ddutil.js'

export default {
  name: 'docListIndex',
  data () {
    return {
        docType: window.BASE_DOC_TYPE,  //  docType:公文类型 1: 待办  2:已办  3:文件共享  5:我的关注

        loading: false,
        hasMore: false,
        dataSource: [],
        pageIndex: 0,
        pageSize: 20,
        lastRecordTimestamp: '',

        detailProps: {
            visible: false,
            docid: '',
            docTitle: '',
        }
    }
  },
  components: {ViewBox, Loading, Popup, XButton, LoadMore, Icon, ListEmptyIcon, DocTodoDetail},

  created: function() {
    
    if(this.docType == '1') {
        setDdNavTitle('待办公文');
    } else if(this.docType == '2') {
        setDdNavTitle('已办公文');
    } else if(this.docType == '3') {
        setDdNavTitle('文件共享');
    } else if(this.docType == '5') {
        setDdNavTitle('我的关注');
    }
    this.queryList(0);    
  },

  methods: {

    /**
     * 列表查询
     */
    queryList: function(pageIndex, pageSize) {
        //请求参数
        let params = {};

        if(this.docType == '1') {
            params.type = 4;
            params.readstatus = 2;
            params.handletype = 0;

            params.pageIndex = pageIndex == undefined ? this.pageIndex : pageIndex;
            params.pagesize = pageSize == undefined ? this.pageSize : pageSize;
            params.currentdatetime = this.lastRecordTimestamp;
        } else if(this.docType == '2') {
            params.type = 4;
            params.readstatus = 2;
            params.handletype = 1;

            params.pageIndex = pageIndex == undefined ? this.pageIndex : pageIndex;
            params.pagesize = pageSize == undefined ? this.pageSize : pageSize;
            params.currentdatetime = this.lastRecordTimestamp;
        } else if(this.docType == '3') {
            params.type = 4;
            params.readstatus = 2;
            params.handletype = 2;

            params.pageIndex = pageIndex == undefined ? this.pageIndex : pageIndex;
            params.pagesize = pageSize == undefined ? this.pageSize : pageSize;
            params.currentdatetime = this.lastRecordTimestamp;
        } else if(this.docType == '5') {
            params.type = 0;
            params.tipsType = 7;
            params.readstatus = '';
            params.handletype = '';

            params.pageIndex = pageIndex == undefined ? this.pageIndex : pageIndex;
            params.pagesize = pageSize == undefined ? this.pageSize : pageSize;
            params.currentdatetime = this.lastRecordTimestamp;
        }

        this.loading = true;

        //当请求第一页数据时 清空之前数据
        if(params.pageIndex == 0) {
            this.dataSource = [];
            this.hasMore = true;
        }

        this.$http.post(BASE_URL + '/officialDealAction!getOfficialList.shtml', params).then(({data}) => {
            let me = this;
            this.loading = false;
            if(data.fail) {
                me.$log('列表查询异常', data);
                this.hasMore = false;
                this.$vux.toast.text('列表查询出错啦', 'top')
            } else {

                if(me.docType != '5') {

                    let rowDatas = data.rowDatas;

                    rowDatas.map(function(item) {
                        me.dataSource.push({
                            ...item
                        });
                    });

                    if(rowDatas.length < params.pagesize) {
                        this.hasMore = false;
                    } else {
                        this.hasMore = true;
                    }

                } else {

                    let resObj = data.myAttentionList && JSON.parse(data.myAttentionList);

                    if(!(resObj && resObj.returninfo && resObj.returninfo.status == '0')) {
                        me.$log('我的关注列表查询出错', data);
                        me.$vux.toast.text('我的关注列表查询出错啦', 'top')
                        return
                    }

                    let rowDatas = resObj.bizdata && resObj.bizdata.doclist;

                    rowDatas.map(function(item) {
                        me.dataSource.push({
                            ...item
                        });
                    });

                    if(rowDatas.length < params.pagesize) {
                        this.hasMore = false;
                    } else {
                        this.hasMore = true;
                    }

                }

            }
        })
    },

    /*点击打开详情*/
    linkToDetail: function(record) {
        this.detailProps.visible = true;
        this.detailProps.docid = record.docid;
        this.detailProps.docTitle = record.title;
    },

    closeDetailPop: function() {
        this.detailProps.visible = false;
    },

    /*关注和取消关注*/
    attentionChange: function(record) {

        let params = {
            sysPendingsId: record.docid
        };
        let postUrl = '';
        if(record.signstatus == '0') {
            postUrl = BASE_URL + '/officialDealAction!addAttention.shtml';
            params.type = '0';
        } else {
            postUrl = BASE_URL + '/officialDealAction!removeAttention.shtml';
            params.type = '1';
        }

        this.$http.post(postUrl, params).then(({data}) => {
            
            if(data.fail) {
                this.$vux.toast.text(record.signstatus == '0' ? '添加关注出错啦' : '取消关注出错啦', 'top')
            } else {
                this.$vux.toast.text(record.signstatus == '0' ? '添加关注成功' : '取消关注成功', 'top')

                this.dataSource.map(function(item) {
                    if(item.docid == record.docid) {
                        item.signstatus = record.signstatus == '0' ? '1' : '0';
                    }
                });
            }
        })
    },

    queryMore: function() {
        if(!this.hasMore) return;
        this.queryList(++this.pageIndex);
    }

  }

}