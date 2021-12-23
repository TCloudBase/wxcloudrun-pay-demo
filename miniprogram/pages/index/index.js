const app = getApp()
var that = null
Page({
	data: {
		payinfo:{}
	},
	onLoad() {
		that = this
		this.initpayid()
	},
	/**
	 * 微信支付-生成订单
	 */
	async doorder(){
		wx.showLoading({ title: '生成订单中'})
		const result = await this.call('unifiedorder',{
			paytext:"微信云托管支付测试",
			fee:1
		})
		wx.hideLoading()
		console.log(result)
		if(result?.respdata?.result_code == "SUCCESS"){
			this.savestatus('订单已生成',result.respdata.payment)
		}
	},
	/**
	 * 微信支付-发起退款
	 */
	async refund(){
		wx.showLoading({ title: '发起退款中'})
		const result = await this.call('refund',{
			paytext:"微信云托管支付测试",
			fee:1,
			refundfee:1,
			refundtext:"测试退款"
		})
		wx.hideLoading()
		console.log(result)
		if(result?.respdata?.result_code == "SUCCESS"){
			this.savestatus('订单退款中')
		}
	},
	/**
	 * 微信支付-查询退款
	 */
	async queryrefund(){
		wx.showLoading({ title: '查询退款中'})
		const result = await this.call('queryrefund',{})
		wx.hideLoading()
		console.log(result)
		const {cash_fee,total_fee} = result?.respdata||{}
		wx.showModal({
		  content:`已退款${cash_fee/100}元；共退款：${total_fee/100}元`,
		  showCancel:false
		})
	},
	/**
	 * 微信支付-关闭订单
	 */
	async closepay(){
		wx.showLoading({ title: '关闭订单中'})
		const result = await this.call('closeorder',{})
		wx.hideLoading()
		console.log(result)
		if(result?.respdata?.result_code == "SUCCESS"){
			this.savestatus('订单已关闭')
		}
	},
	/**
	 * 微信支付-查询订单
	 */
	async queryorder(){
		wx.showLoading({ title: '查询订单中'})
		const result = await this.call('queryorder',{})
		wx.hideLoading()
		console.log(result)
		const {out_trade_no,trade_state_desc} = result?.respdata||{}
		wx.showModal({
		  content:`${out_trade_no}；订单状态：${trade_state_desc}`,
		  showCancel:false
		})
		if(trade_state_desc.indexOf('订单发生过退款')==0){
			this.savestatus('订单已退款')
		} else {
			this.savestatus(trade_state_desc)
		}
	},
	/**
	 * 微信支付-前端支付
	 */
	dopay() {
		wx.requestPayment({
			...this.data.payinfo.ment,
			success(res) {
				console.log('支付成功',res)
				that.queryorder()
			},
			fail(err) {
				console.log('支付失败',err)
				that.queryorder()
			}
		})
	},
	/**
	 * 重置订单号
	 */
	resetpayid() {
		wx.showModal({
			title: '确认重置',
			content: '当前付款信息无法回滚，请务必在关闭订单或者退款完成状态重置',
			success(res) {
				if (res.confirm) {
					that.initpayid(true)
				}
			}
		})
	},
	/**
	 * 初始化订单号，从本地存储存取
	 */
	initpayid(flag = false) {
		let pinfo = wx.getStorageSync('PAYINFO')
		if (pinfo == null || pinfo == '' || flag) {
			pinfo = {
				id: new Date().getTime(),
				status: '初始化'
			}
			wx.setStorageSync('PAYINFO', pinfo)
		}
		this.setData({
			payinfo: pinfo
		})
	},
	/**
	 * 保存订单的状态，以方便下次打开
	 */
	savestatus(text,ment=null){
		const pinfo = this.data.payinfo
		pinfo.status = text
		ment!=null?pinfo.ment = ment:null
		this.setData({
			payinfo: pinfo
		})
		wx.setStorageSync('PAYINFO', pinfo)
	},
	/**
	 * 封装的云托管接口
	 */
	async call(method=null,data={}) {
		const {id} = this.data.payinfo
		try{
			const result = await wx.cloud.callContainer({
				config: {
					env: "" // 微信云托管环境ID
				},
				path: "/",
				header: {
					"X-WX-SERVICE": "",  // 服务名称
					"content-type": "application/json"
				},
				method: "POST",
				data: {
					payid: id,
					method: method,
					...data
				}
			})
			return result.data
		} catch(e){
			return new Error('服务错误',e)
		}
	}
})