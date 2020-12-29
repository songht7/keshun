/**
数据验证（表单验证）
来自 grace.hcoder.net 
作者 hcoder 深海
*/
module.exports = {
	error: '',
	check: function (data, rule) {
		for (var i = 0; i < rule.length; i++) {
			if (!rule[i].checkType) {
				return true;
			}
			if (!rule[i].name) {
				return true;
			}
			if (!rule[i].errorMsg) {
				return true;
			}
			if (!data[rule[i].name]) {
				this.error = rule[i].errorMsg;
				return false;
			}
			switch (rule[i].checkType) {
				case 'string':
					var reg = new RegExp('^.{' + rule[i].checkRule + '}$');
					if (!reg.test(data[rule[i].name])) {
						this.error = rule[i].errorMsg;
						return false;
					}
					break;
				case 'int':
					var reg = new RegExp('^(-[1-9]|[1-9])[0-9]{' + rule[i].checkRule + '}$');
					if (!reg.test(data[rule[i].name])) {
						this.error = rule[i].errorMsg;
						return false;
					}
					break;
					break;
				case 'between':
					if (!this.isNumber(data[rule[i].name])) {
						this.error = rule[i].errorMsg;
						return false;
					}
					var minMax = rule[i].checkRule.split(',');
					minMax[0] = Number(minMax[0]);
					minMax[1] = Number(minMax[1]);
					if (data[rule[i].name] > minMax[1] || data[rule[i].name] < minMax[0]) {
						this.error = rule[i].errorMsg;
						return false;
					}
					break;
				case 'betweenD':
					var reg = /^-?[1-9][0-9]?$/;
					if (!reg.test(data[rule[i].name])) {
						this.error = rule[i].errorMsg;
						return false;
					}
					var minMax = rule[i].checkRule.split(',');
					minMax[0] = Number(minMax[0]);
					minMax[1] = Number(minMax[1]);
					if (data[rule[i].name] > minMax[1] || data[rule[i].name] < minMax[0]) {
						this.error = rule[i].errorMsg;
						return false;
					}
					break;
				case 'betweenF':
					var reg = /^-?[0-9][0-9]?.+[0-9]+$/;
					if (!reg.test(data[rule[i].name])) {
						this.error = rule[i].errorMsg;
						return false;
					}
					var minMax = rule[i].checkRule.split(',');
					minMax[0] = Number(minMax[0]);
					minMax[1] = Number(minMax[1]);
					if (data[rule[i].name] > minMax[1] || data[rule[i].name] < minMax[0]) {
						this.error = rule[i].errorMsg;
						return false;
					}
					break;
				case 'same':
					if (data[rule[i].name] != rule[i].checkRule) {
						this.error = rule[i].errorMsg;
						return false;
					}
					break;
				case 'notsame':
					if (data[rule[i].name] == rule[i].checkRule) {
						this.error = rule[i].errorMsg;
						return false;
					}
					break;
				case 'greater':
					if (data[rule[i].name].length == rule[i].checkRule) {
						this.error = rule[i].errorMsg;
						return false;
					}
					break;
				case 'email':
					var reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
					if (!reg.test(data[rule[i].name])) {
						this.error = rule[i].errorMsg;
						return false;
					}
					break;
				case 'phoneno':
					var reg = /^1[0-9]{10,10}$/;
					if (!reg.test(data[rule[i].name])) {
						this.error = rule[i].errorMsg;
						return false;
					}
					break;
				case 'zipcode':
					var reg = /^[0-9]{6}$/;
					if (!reg.test(data[rule[i].name])) {
						this.error = rule[i].errorMsg;
						return false;
					}
					break;
				case 'reg':
					var reg = new RegExp(rule[i].checkRule);
					if (!reg.test(data[rule[i].name])) {
						this.error = rule[i].errorMsg;
						return false;
					}
					break;
				case 'in':
					if (rule[i].checkRule.indexOf(data[rule[i].name]) == -1) {
						this.error = rule[i].errorMsg;
						return false;
					}
					break;
				case 'notnull':
					if (data[rule[i].name] == null || data[rule[i].name].length < 1) {
						this.error = rule[i].errorMsg;
						return false;
					}
					break;
				case 'isCarLicens':
					var leng = data[rule[i].name].length;
					// console.log("isCarLicens::", leng)
					if (leng && leng == 7) {
						var reg = /[京津冀晋蒙辽吉黑沪苏浙皖闽赣鲁豫鄂湘粤桂琼川贵云渝藏陕甘青宁新使]{1}[A-Z]{1}[0-9a-zA-Z]{5}$/u;
						if (!reg.test(data[rule[i].name])) {
							this.error = rule[i].errorMsg;
							return false;
						}
					} else if (leng && leng == 8) {
						//小型新能源车
						var reg = /[京津冀晋蒙辽吉黑沪苏浙皖闽赣鲁豫鄂湘粤桂琼川贵云渝藏陕甘青宁新]{1}[A-Z]{1}[DFG]{1}[0-9a-zA-Z]{5}$/u;
						//大型新能源车
						var reg2 = /[京津冀晋蒙辽吉黑沪苏浙皖闽赣鲁豫鄂湘粤桂琼川贵云渝藏陕甘青宁新]{1}[A-Z]{1}[0-9a-zA-Z]{5}[DFG]{1}$/u;
						if (reg.test(data[rule[i].name]) || reg2.test(data[rule[i].name])) {} else {
							this.error = rule[i].errorMsg;
							return false;
						}
					} else {
						this.error = rule[i].errorMsg;
						return false;
					}
					break;
			}
		}
		return true;
	},
	isNumber: function (checkVal) {
		var reg = /^-?[1-9][0-9]?.?[0-9]*$/;
		return reg.test(checkVal);
	}
}