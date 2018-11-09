import Vue from 'vue'
import {querystring, cookie} from 'vux'

/**
 * 通用异步请求数据方法
 */
Vue.prototype.$log = function (...arg) {
  console.info('global console:', arg)
}

/**
 * 通用异步请求数据方法
 */
Vue.prototype.$requestServer = function (url, params = {}, options = {}) {
  options = {
    emulateJSON: true,
    ...options,
    headers: {
      ...options.headers
    }
  }

  params = commonRequestParamHandle(params)

  return Vue.http.post(url, params, options)
    .then(checkStatus)
    .then(ret => (ret))
    .catch(err => {
      console.info('err', err)
      return err
    })
}

/**
 * 通用异步请求数据方法
 */
Vue.prototype.$requestServerForm = function (url, params = {}, options = {}) {
  options = {
    emulateJSON: true,
    ...options,
    headers: {
      ...options.headers,
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }

  params = commonRequestParamHandle(params)

  return Vue.http.post(url, querystring.stringify(params), options)
    .then(checkStatus)
    .then(ret => (ret))
    .catch(err => {
      console.info('err', err)
      return err
    })
}

function checkStatus (response) {
  if (response.status >= 200 && response.status < 300) {
    return response
  }
  const error = new Error(response.statusText)
  error.response = response
  throw error
}

/**
 * 通用操作请求参数
 * @param  params 请求参数
 */
function commonRequestParamHandle (params = {}) {
  //  添加指定cookie字段到请求参数中
  let cookieFields = window.cookie_fields || []
  if (cookieFields && cookieFields.length > 0) {
    cookieFields.forEach(field => {
      let cookieValue = cookie.get(field) || ''
      params[field] = cookieValue
    })
  }

  return params
}

if (window._ === undefined) {
  window._ = function (...arg) {
    console.info('global console:', arg)
  }
}
