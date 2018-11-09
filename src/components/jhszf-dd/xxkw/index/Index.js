import {Loading, Cell, CellBox, Group, Badge} from 'vux'

import {setDdNavTitle} from '@/util/ddutil.js'

/**
 * 信息刊物 - 列表 - 首页
 */
export default {
  name: 'xxkwListIndex',
  data () {
    return {
        loading: false,

        indexDataList: [
            {
                key: '0',
                title: '每日要讯(紧急情况快报)',
                type: '16',
                icon: 'icon-zl-wendang4',
                count: 0,
            },
            {
                key: '1',
                title: '每日要讯(普刊)',
                type: '7',
                icon: 'icon-zl-wendang2',
                count: 0,
            },
            {
                key: '2',
                title: '决策参阅',
                type: '11',
                icon: 'icon-zl-wendang3',
                count: 0,
            },
            {
                key: '3',
                title: '专报',
                type: '9',
                icon: 'icon-zl-wendang3',
                count: 0,
            },
            {
                key: '4',
                title: '工作情况交流',
                type: '10',
                icon: 'icon-zl-wendang5',
                count: 0,
            },
            {
                key: '5',
                title: '金华政务信息',
                type: '8',
                icon: 'icon-zl-wendang2',
                count: 0,
            }
        ]
    }
  },
  components: {Loading, Cell, CellBox, Group, Badge},

  created: function() {
    setDdNavTitle('信息刊物');
    
    let me = this;
    this.indexDataList.forEach(typeItem => {
        me.queryTypeCount(typeItem);
    });
  },

  methods: {

    /**
     * 列表查询
     */
    queryTypeCount: function(typeItem) {
        //请求参数
        let params = {
            type: typeItem.type,
        };

        let postUrl = BASE_URL + '/officialDealAction!getDocCount.shtml';

        let me = this;

        me.$requestServerForm(postUrl, params).then(({data}) => {

            if(data == undefined || data.fail) {
              me.$log('查询信息刊物数量异常', data);
              me.$vux.toast.text('系统出错啦', 'top')
              return
            } else {
              let resObj = data.docCountContent && JSON.parse(data.docCountContent);

              if(!(resObj && resObj.returninfo && resObj.returninfo.status == '0')) {
                me.$log('查询信息刊物数量出错', data);
                //  me.$vux.toast.text('查询信息刊物数量出错啦', 'top')
                return
              }

              let countObj = resObj.bizdata;
              typeItem.count = countObj && countObj.unreadcount;
            }

          })
    },

    /*点击打开详情*/
    handleOnClickTypeItem: function(record) {
        this.$router.push('/xxkw/list/'+record.type)
        window._global_data = window._global_data || {};
        window._global_data.xxkw_type_title = record.title;
    },

  }

}