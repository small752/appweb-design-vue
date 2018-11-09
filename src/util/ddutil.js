/* eslint-disable */

/**
 * 钉钉免登状态
 */
export function checkDDAuthLogin() {
  let oa_user_auth_value = sessionStorage.getItem("oa_user_auth");//是否经过免登
  let dd = window.dd;
  if(dd == undefined || dd.version == undefined || dd.version == '') {
    return true;
  }
  if(oa_user_auth_value == undefined || oa_user_auth_value == "" || oa_user_auth_value == null) {
    return false;
  } else {
    return true;
  }
}

/**
 * 钉钉免登状态
 */
export function setDDAuthLogin(ddAuthObj) {
    sessionStorage.setItem("oa_user_auth", ddAuthObj);
  }

/**
 * 钉钉菜单设置
 */
export function setDdMenu() {
  let dd = window.dd;
  dd.version && dd.ready(function() {
			
    dd.biz.navigation.setRight({
      show: true, //控制按钮显示， true 显示， false 隐藏， 默认true
      control: true, //是否控制点击事件，true 控制，false 不控制， 默认false
      text: '首页', //控制显示文本，空字符串表示显示默认文本
      onSuccess : function(result) {
        // window.location = globalStore.indexUrl;
        dd.biz.navigation.close({})
      }
    })
  })
}

/**
 * 钉钉导航标题设置
 */
export function setDdNavTitle( title ) {
  let dd = window.dd;
  document.title = title;
  dd.version && dd.ready( function(){
    dd.biz.navigation.setTitle({
      // 控制标题文本，空字符串表示显示默认文本
      title: title
    })
  })
}
