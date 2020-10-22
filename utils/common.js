var api = {
  "formal": {
    "apiurl": "https://api.jobpgroup.com", //接口
    "domain": "http://expo.bdmartech.com",
    "appName": "CKS 科顺",
  },
  "dev": {
    "apiurl": "http://118.178.145.27:8099", //接口
    "domain": "http://expo.bdmartech.com",
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
    "addr": {
      "carAdd": "/api/Car/Add", //车辆添加【post】
      "carUpdate": "/api/Car/Update", //车辆修改【post】
      "carDelete": "/api/Car/Delete", //车辆删除【post】
    }
  }
}