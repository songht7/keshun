var api = {
  "formal": {
    "apiurl": "", //接口
    "domain": "",
    "appName": "CKS 科顺",
  },
  "dev": {
    "apiurl": "https://www.codesystem.com.cn/cks_api", //接口
    "domain": "",
    "appName": "CKS 科顺",
    "ai": "jjlsdjksafh-wx25f61e4ffcead9c7-wxcead9c7-wx69ecaa1a4fb809ff-213123fdsajkfhkj"
  }
}
var lks = "dev";
export default {
  Interface: {
    "site": lks,
    "apiurl": api[lks]["apiurl"],
    "domain": api[lks]["domain"],
    "appName": api[lks]["appName"],
    "mapkey": "6TABZ-OO2WW-7TVRV-RIDWK-2IGQZ-LJF3Q",
    "Itype": "minipro",
    "deadline": 2, //token失效时间n小时
    "addr": {
      "getToken": "/api/InterfaceUser/GetToken?itype=minipro", //GetToken
      "getOpenId": "/api/WxAppletsLoginAndRegister/GetOpenIdByCode", //获取openid
      "register": "/api/WxAppletsLoginAndRegister/Register", //注册
      "login": "/api/WxAppletsLoginAndRegister/Login", //登录
      "carList": "/api/Car/QueryByPage", //车辆列表
      "carAdd": "/api/Car/Add", //车辆添加【post】
      "carUpdate": "/api/Car/Update", //车辆修改【post】
      "carDelete": "/api/Car/Delete", //车辆删除【post】
      "dropdownList": "/api/DropdownList/QueryInfo", //列表信息[type:CarrierNo承运商]
      "driverList": "/api/Driver/QueryByPage", //司机列表
      "driverAdd": "/api/Driver/Add", //司机添加【post】
      "driverUpdate": "/api/Driver/Update", //司机修改【post】
      "driverDelete": "/api/Driver/Delete", //司机删除【post】
    }
  }
}