/* PostId 对应 1是科顺员工（物流干事） 2是承运商 3是司机 4科顺员工（商务）
 * 科顺员工（物流干事）Cks = 1
 * 承运商 Forward = 2
 * 司机   Driver = 3
 * 科顺员工（商务） Business = 4
 */
var api = {
  "formal": {
    "apiurl": "https://tms.keshun.com.cn", //接口
    "imgurl": "https://tms.keshun.com.cn", //图片域名
    "domain": "",
    "appName": "CKS 科顺",
    "ai": "jjlsdjksafh-wx25f61e4ffcead9c7-wxcead9c7-wx69ecaa1a4fb809ff-213123fdsajkfhkj"
  },
  "dev": {
    "apiurl": "https://tms.keshun.com.cn", //接口 https://www.codesystem.com.cn/cks_api
    "imgurl": "https://tms.keshun.com.cn", //图片域名
    "domain": "",
    "appName": "CKS 科顺",
    "ai": "jjlsdjksafh-wx25f61e4ffcead9c7-wxcead9c7-wx69ecaa1a4fb809ff-213123fdsajkfhkj"
  }
}
var lks = "dev";
export default {
  Interface: {
    "siteType": lks, //发布类型
    "apiurl": api[lks]["apiurl"],
    "imgurl": api[lks]["imgurl"],
    "domain": api[lks]["domain"],
    "appName": api[lks]["appName"],
    "tmplIds1": ['B66_D9NkrnVDAizTMyRdiA30JARndj9XaV-7w2r1G8A'], //订阅id 司机 物流系统异常告警通知
    "tmplIds2": ['WOuSGOStDcSThrsFPsYzb5lVqDH58NClQqBq4hCqo2s'], //车辆入场通知
    "tmplIds3": ['L1-kaHy258MuLl1Ed89JX6Zx7J_0dGGL-Z_Rwut37p0'], //排队到号通知
    "source": 'JK',
    "mapkey": "6TABZ-OO2WW-7TVRV-RIDWK-2IGQZ-LJF3Q", //腾讯地图mapkey
    "Itype": "minipro",
    "deadline": 2, //token失效时间n小时
    "gpsInterval": lks == 'dev' ? (1000 * 60 * 5) : (1000 * 60 * 5), //GPS上传间隔（毫秒*秒*分*时） (1000 * 60 * 60 * 2)
    "addr": {
      "getToken": "/api/InterfaceUser/GetToken?itype=minipro", //GetToken
      "getOpenId": "/api/WxAppletsLoginAndRegister/GetOpenIdByCode", //获取openid【post】
      "getVerify": "/api/Message/GetVerify_Response", //发送验证码
      "register": "/api/WxAppletsLoginAndRegister/Register", //注册
      "login": "/api/WxAppletsLoginAndRegister/Login", //登录
      "uploadImage": "/api/File/UploadImage", //图片上传【post】
      "uploadImageForReceiptInMinipro": "/api/File/UploadImageForReceiptInMinipro", //图片上传（回单使用）【post】
      "imageList": "/api/Order/OrderCarImageList", //获取图片 OrderID
      "notice": "/api/Notice/QueryList", //获取公告信息
      "carList": "/api/Car/QueryByPage", //车辆列表
      "carAdd": "/api/Car/Add", //车辆添加【post】
      "carUpdate": "/api/Car/Update", //车辆修改【post】
      "carDelete": "/api/Car/Delete", //车辆删除【post】
      "dropdownList": "/api/DropdownList/QueryInfo", //列表信息[type:CarrierNo承运商,term:承运商Id（承运商对应车辆或司机）]
      "addCarAndDriver": "/api/Order/AddCarAndDriver", //分配司机车辆
      "driverList": "/api/Driver/QueryByPage", //司机列表
      "driverAdd": "/api/Driver/Add", //司机添加【post】
      "driverUpdate": "/api/Driver/Update", //司机修改【post】
      "driverDelete": "/api/Driver/Delete", //司机删除【post】
      "batchDeliveryOrderOut": "/api/Order/BatchDeliveryOrderOut", //批量转出交货单【post】
      "deliveryOrderIn": "/api/Order/DeliveryOrderIn", //转入交货单【post】
      "uploadReceipt": "/api/ReceiptImage/UploadReceipt", //上传回单【post】
      "updateForwarder": "/api/Order/UpdateForwarder", //手动分配承运商【post】
      "orderList": "/api/Order/QueryByPage", //获取订单列表
      "orderList2": "/api/Order/GetOrderInfo", //获取订单列表(分配车辆司机用)(只显示 待处理，已派车)
      "deliveryList": "/api/Order/GetDeliveryOrderList", //根据条件获取交货单列表
      "getOrderByDNNO": "/api/Order/GetOrderByDNNO", //根据DN单号查询订单信息
      "orderGPS": "/api/OrderGPS/SelectOrderTrackGPSInfo", //根据订单号查询订单所有的跟踪信息【post】
      "uploadOrderGPS": "/api/OrderGPS/UploadOrderGPS", //根据订单号保存经度纬度地址信息【post】
      "uploadPhoneGPS": "/api/OrderGPS/UploadPhoneGPS", //根据用户手机号找到订单保存经度纬度地址信息【post】
      "signWHGroup": "/api/AccessSign/SignWHGroup", //获取可签到的仓库组合【post】
      "sign": "/api/AccessSign/Sign", //签到【post】
      "signInfo": "/api/AccessSign/SignInfo", //获取签到数据
      "queryInfoApplets": "/api/AccessSign/QueryInfoApplets", //获取厂内排队信息
    }
  }
}