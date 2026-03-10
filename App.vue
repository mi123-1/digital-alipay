<script>
	import { getTransactions, saveTransactions, getYubiBaoData, saveYubiBaoData } from './utils/wallet';
	export default {
		onLaunch: function() {
			console.log('App Launch')
			this.checkLoginStatus()
		},
		onShow: function() {
			console.log('App Show')
			this.checkLoginStatus()
		},
		onHide: function() {
			console.log('App Hide')
			// 应用进入后台时保存数据
			this.saveAppData()
		},
		onUnload: function() {
			console.log('App Unload')
			// 应用退出时保存数据
			this.saveAppData()
		},
		methods: {
			checkLoginStatus() {
				// 获取当前页面栈
				const pages = getCurrentPages()
				// 获取当前页面路径
				const currentPage = pages[pages.length - 1]
				const currentPath = currentPage?.route
				
				// 检查是否已登录
				const isLogin = uni.getStorageSync('isLogin')
				
				// 如果已登录且当前在登录页面，跳转到首页
			if (isLogin && currentPath === 'pages/login/login') {
				uni.switchTab({
					url: '/pages/index/index'
				})
				return
			}
				
				// 这里可以添加更多页面的登录检查逻辑
				// 例如：如果需要登录的页面而未登录，可以跳转到登录页面
			},
			
			// 保存应用数据
			saveAppData() {
				try {
					// 保存交易记录
					const transactions = getTransactions();
					saveTransactions(transactions);
					
					// 保存余币宝数据
					const yubibaoData = getYubiBaoData();
					saveYubiBaoData(yubibaoData);
					
					console.log('应用数据保存成功');
				} catch (error) {
					console.error('保存应用数据失败:', error);
				}
			}
		}
	}
</script>

<style>
	/*每个页面公共css */
	page {
		background-color: #F8F8F8 !important;
	}
	

</style>
