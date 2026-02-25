// @ts-ignore
import Cookies from 'js-cookie'

//这里是一些cookies的方法

const TokenKey = 'XM-Token'

export function getToken() {
  return Cookies.get(TokenKey)
}

//保存并设置时间
export function setCookieTime(key:any,val:any,day:any) {
  return Cookies.set(key, val,{ expires: day })
}

export function getCookie(Key:string) {
  return Cookies.get(Key)
}
export function setCookies(key:any,val:any) {
  return Cookies.set(key, val)
}

export function removeCookies(key:string) {
  return Cookies.remove(key)
}

