var api = {
  "formal": {
    "apiurl": "https://api.jobpgroup.com", //接口
    "domain": "http://expo.bdmartech.com",
    "appName": "CKS 科顺",
  },
  "dev": {
    "apiurl": "https://api.jobpgroup.com", //接口
    "domain": "http://expo.bdmartech.com",
    "appName": "CKS 科顺",
    "ai":"jjlsdjksafh-wx25f61e4ffcead9c7-wxcead9c7-wx69ecaa1a4fb809ff-213123fdsajkfhkj"
  }
}
var lks = "dev";
export default {
  Interface: {
    "site": lks,
    "apiurl": api[lks]["apiurl"],
    "domain": api[lks]["domain"],
    "appName": api[lks]["appName"],
    "addr": {
      "slideShow": "/v2/ApiHome-slideShow.htm", //列表http://api.alein.lc/v4/ApiItem-item.htm?id=1
    }
  }
}