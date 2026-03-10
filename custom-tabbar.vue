<template>
	<view class="custom-tabbar">
		<!-- 导航内容 -->
		<view class="tabbar-content">
			<!-- 兑换 -->
			<view class="tabbar-item" @click="switchTab('/pages/exchange/exchange')">
				<image class="tabbar-icon" :src="currentPath === '/pages/exchange/exchange' ? '/static/payment-method.png' : '/static/payment-method.png'" mode="aspectFit"></image>
				<text class="tabbar-text" :class="{ active: currentPath === '/pages/exchange/exchange' }">兑换</text>
			</view>
			
			<!-- 订单 -->
			<view class="tabbar-item" @click="switchTab('/pages/orders/orders')">
				<image class="tabbar-icon" :src="currentPath === '/pages/orders/orders' ? '/static/order.png' : '/static/order.png'" mode="aspectFit"></image>
				<text class="tabbar-text" :class="{ active: currentPath === '/pages/orders/orders' }">订单</text>
			</view>
			
			<!-- 首页占位 -->
			<view class="tabbar-item tabbar-home-placeholder"></view>
			
			<!-- 消息 -->
			<view class="tabbar-item" @click="switchTab('/pages/messages/messages')">
				<image class="tabbar-icon" :src="currentPath === '/pages/messages/messages' ? '/static/communication.png' : '/static/communication.png'" mode="aspectFit"></image>
				<text class="tabbar-text" :class="{ active: currentPath === '/pages/messages/messages' }">消息</text>
			</view>
			
			<!-- 我的 -->
			<view class="tabbar-item" @click="switchTab('/pages/mine/mine')">
				<image class="tabbar-icon" :src="currentPath === '/pages/mine/mine' ? '/static/avatar.png' : '/static/avatar.png'" mode="aspectFit"></image>
				<text class="tabbar-text" :class="{ active: currentPath === '/pages/mine/mine' }">我的</text>
			</view>
		</view>
		
		<!-- 突出的首页按钮 -->
		<view class="home-btn-container">
			<view class="home-btn" @click="switchTab('/pages/index/index')">
				<image class="home-icon" src="/static/alipay.png" mode="aspectFit"></image>
			</view>
		</view>
		
		<!-- 底部红色弧线 -->
		<view class="bottom-curve"></view>
	</view>
</template>

<script>
export default {
	name: 'custom-tabbar',
	data() {
		return {
			currentPath: ''
		};
	},
	mounted() {
		this.getCurrentPath();
		// 监听页面切换
		uni.onTabItemTap((res) => {
			this.currentPath = '/' + res.pagePath;
		});
	},
	methods: {
		getCurrentPath() {
			const pages = getCurrentPages();
			if (pages.length > 0) {
				this.currentPath = '/' + pages[pages.length - 1].route;
			}
		},
		switchTab(url) {
				// 提取页面路径，去掉开头的斜杠
				const pagePath = url.replace(/^\//, '');
				uni.switchTab({
					url: `/${pagePath}`
				});
			}
	}
};
</script>

<style scoped>
.custom-tabbar {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	z-index: 999;
	display: flex;
	flex-direction: column;
	align-items: center;
}

/* 导航内容 */
.tabbar-content {
	width: 100%;
	height: 80rpx;
	background-color: #FFFFFF;
	display: flex;
	justify-content: space-around;
	align-items: center;
	position: relative;
	/* 添加底部灰色边框 */
	border-top: 1rpx solid #E0E0E0;
}

/* 导航项 */
.tabbar-item {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		padding-top: 10rpx;
	}

.tabbar-icon {
	width: 50rpx;
	height: 50rpx;
}

.tabbar-text {
	font-size: 24rpx;
	color: #999999;
	margin-top: 5rpx;
}

.tabbar-text.active {
	color: #000000;
	font-weight: bold;
}

/* 首页占位 */
.tabbar-home-placeholder {
	flex: 1;
	height: 100%;
}

/* 首页按钮容器 */
.home-btn-container {
	position: absolute;
	bottom: 0;
	left: 50%;
	transform: translateX(-50%) translateY(0);
	display: flex;
	align-items: center;
	justify-content: center;
	/* 调整容器高度，确保底部对齐 */
	height: 80rpx;
}

/* 突出的首页按钮 */
	.home-btn {
		width: 110rpx;
		height: 110rpx;
		background-color: #FFFFFF;
		border: none;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
		box-shadow: none;
		cursor: pointer;
		/* 图标上移 */
		transform: translateY(-10rpx);
		/* 底部对齐其他图标 */
		bottom: 0;
		position: absolute;
		/* 去掉红色渐变，使用纯色背景 */
		background-color: #FFFFFF;
	}

	.home-icon {
		width: 100rpx;
		height: 100rpx;
		z-index: 1;
	}

/* 底部弧线 */
.bottom-curve {
	width: 100%;
	height: 20rpx;
	position: relative;
	background-color: #FFFFFF;
}

.bottom-curve::before {
	content: '';
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
	height: 0;
	background-color: transparent;
	border-radius: 2rpx;
}

.bottom-curve::after {
	content: '';
	position: absolute;
	bottom: 0;
	left: 50%;
	transform: translateX(-50%);
	width: 200rpx;
	height: 20rpx;
	/* 隐藏分割线 */
	border-bottom: 0;
	border-radius: 50%;
}
</style>