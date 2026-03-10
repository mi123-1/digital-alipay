<template>
	<view class="index-container" @touchstart="touchStart" @touchend="touchEnd">
		<!-- 顶部区域 -->
		<view class="top-section">
			<view class="top-image">
				<image src="/static/logo.png" mode="aspectFill"></image>
			</view>
			<view class="top-subtitle">支付宝数字钱币、储存、提取、秒到账</view>
		</view>
		
		<!-- 主内容区域 -->
		<view class="main-section">
			<!-- 钱包卡片 -->
			<view class="wallet-card">
				<!-- 余额区域 -->
				<view class="balance-header">
					<text class="balance-label">钱包余币</text>
				</view>
				<view class="balance-amount">
					{{showBalance ? balance : '******'}}
				</view>
				
				<!-- 操作按钮 -->
				<view class="operation-buttons">
					<view class="row-buttons">
						<button class="btn recharge-btn" @click="goToRecharge">储存</button>
						<button class="btn withdraw-btn" @click="goToWithdraw">
						<text>提取</text>
						<view class="bonus-tag">送10%</view>
					</button>
					</view>
					
					<!-- 余币宝区域 -->
					<view class="yubibao-section">
						<view class="yubibao-header">
							<text class="yubibao-title">余币宝</text>
							<text class="yubibao-rate">日利率: 0.1%</text>
						</view>
						<view class="yubibao-balance">
							{{showYubiBalance ? yubibaoBalance : '******'}}
						</view>
						<view class="yubibao-actions">
							<button class="btn yubibao-btn in-btn" @click="showYubiInDialog = true">转入</button>
							<button class="btn yubibao-btn out-btn" @click="showYubiOutDialog = true">转出</button>
						</view>
					</view>
					
					<button class="btn transfer-btn" @click="goToTransfer">转币</button>
				</view>
				
				<!-- 底部信息 -->
			<view class="card-footer">
				<view class="footer-text">www.zfbsz.app</view>
			</view>
			</view>
			
			<!-- 空白卡片 -->
			<view class="blank-card"></view>
			
			<!-- 余币宝转入弹窗 -->
			<view class="modal-overlay" v-if="showYubiInDialog" @click="showYubiInDialog = false">
				<view class="modal-content" @click.stop>
					<view class="modal-header">
						<text class="modal-title">转入余币宝</text>
						<view class="modal-close" @click="showYubiInDialog = false">×</view>
					</view>
					<view class="modal-body">
						<text class="modal-label">转入金额</text>
						<input 
							type="number" 
							v-model="yubiInAmount" 
							placeholder="请输入转入金额" 
							class="amount-input" 
							@keyup.enter="yubiIn"
						/>
						<text class="balance-hint">可用余额: ¥{{balance}}</text>
					</view>
					<view class="modal-footer">
						<button class="modal-btn cancel-btn" @click="showYubiInDialog = false">取消</button>
						<button class="modal-btn confirm-btn" @click="yubiIn">确定</button>
					</view>
				</view>
			</view>
			
			<!-- 余币宝转出弹窗 -->
			<view class="modal-overlay" v-if="showYubiOutDialog" @click="showYubiOutDialog = false">
				<view class="modal-content" @click.stop>
					<view class="modal-header">
						<text class="modal-title">转出余币宝</text>
						<view class="modal-close" @click="showYubiOutDialog = false">×</view>
					</view>
					<view class="modal-body">
						<text class="modal-label">转出金额</text>
						<input 
							type="number" 
							v-model="yubiOutAmount" 
							placeholder="请输入转出金额" 
							class="amount-input" 
							@keyup.enter="yubiOut"
						/>
						<text class="balance-hint">余币宝余额: ¥{{yubibaoBalance}}</text>
					</view>
					<view class="modal-footer">
						<button class="modal-btn cancel-btn" @click="showYubiOutDialog = false">取消</button>
						<button class="modal-btn confirm-btn" @click="yubiOut">确定</button>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { getFormattedBalance, addTransaction, yubiBaoIn, yubiBaoOut, calculateYubiBaoBalance, calculateYubiBaoInterest, refreshBalance } from '../../utils/wallet';
export default {
	data() {
		return {
			showBalance: true,
			balance: 0.00,
			touchStartTime: 0,
			// 余币宝相关
			yubibaoBalance: 0.00,
			showYubiBalance: true,
			showYubiInDialog: false,
			showYubiOutDialog: false,
			yubiInAmount: '',
			yubiOutAmount: ''
		}
	},
		
	onLoad() {
		this.calculateBalance();
		this.calculateYubiBaoBalance();
		this.checkYubiBaoInterest();
	},
		
	onShow() {
		// 页面显示时重新计算余额
		this.calculateBalance();
		this.calculateYubiBaoBalance();
		this.checkYubiBaoInterest();
	},
		
	methods: {
		// 计算当前余额
		calculateBalance() {
			// 确保将字符串转换为数字
			this.balance = parseFloat(getFormattedBalance());
		},
		
		toggleBalance() {
			this.showBalance = !this.showBalance
		},
		
		refreshBalance() {
			// 使用新的refreshBalance函数强制刷新余额缓存
			refreshBalance();
			this.calculateBalance();
			alert('余额已更新');
		},
		
		// 触摸开始事件
		touchStart() {
			this.touchStartTime = Date.now();
		},
		
		// 触摸结束事件
		touchEnd() {
			const touchDuration = Date.now() - this.touchStartTime;
			// 如果触摸时间超过2秒，刷新余额
			if (touchDuration > 2000) {
				this.refreshBalance();
			}
		},
		goToRecharge() {
			window.location.href = '/pages/recharge/recharge.html';
		},
		goToWithdraw() {
			window.location.href = '/pages/withdraw/withdraw.html';
		},
		goToTransfer() {
			window.location.href = '/pages/transfer/transfer.html';
		},
		goToQRCode() {
			window.location.href = '/pages/qrcode/qrcode.html';
		},
		goToReceiveQRCode() {
			window.location.href = '/pages/receive-qrcode/receive-qrcode.html';
		},
		goToOrders() {
			window.location.href = '/pages/orders/orders.html';
		},
		goToWalletAddress() {
			alert('钱包地址管理');
		},
		goToSettings() {
			alert('设置功能');
		},
		
		// 计算余币宝余额
		calculateYubiBaoBalance() {
			// 确保将字符串转换为数字
			this.yubibaoBalance = parseFloat(calculateYubiBaoBalance());
		},
		
		// 检查并结算余币宝利息
		checkYubiBaoInterest() {
			const interest = calculateYubiBaoInterest();
			if (interest > 0) {
				alert(`余币宝利息已结算: ¥${interest.toFixed(2)}`);
				// 重新计算余额
				this.calculateBalance();
			}
		},
		
		// 余币宝转入
		yubiIn() {
			const amount = parseFloat(this.yubiInAmount);
			if (isNaN(amount) || amount <= 0) {
				alert('请输入正确的转入金额');
				return;
			}
			
			const currentBalance = parseFloat(this.balance);
			if (amount > currentBalance) {
				alert('余额不足');
				return;
			}
			
			// 从钱包扣除金额
			addTransaction({
				amount: -amount,
				type: 'yubibao_in',
				title: '转入余币宝',
				description: '转入余币宝'
			});
			
			// 转入余币宝
			yubiBaoIn(amount);
			
			// 更新余额
			this.calculateBalance();
			this.calculateYubiBaoBalance();
			
			// 关闭弹窗
			this.showYubiInDialog = false;
			this.yubiInAmount = '';
			
			alert('转入成功');
		},
		
		// 余币宝转出
		yubiOut() {
			const amount = parseFloat(this.yubiOutAmount);
			if (isNaN(amount) || amount <= 0) {
				alert('请输入正确的转出金额');
				return;
			}
			
			const currentYubiBalance = parseFloat(this.yubibaoBalance);
			if (amount > currentYubiBalance) {
				alert('余币宝余额不足');
				return;
			}
			
			// 从余币宝扣除金额
			yubiBaoOut(amount);
			
			// 增加到钱包余额
			addTransaction({
				amount: amount,
				type: 'yubibao_out',
				title: '余币宝转出',
				description: '余币宝转出'
			});
			
			// 更新余额
			this.calculateBalance();
			this.calculateYubiBaoBalance();
			
			// 关闭弹窗
			this.showYubiOutDialog = false;
			this.yubiOutAmount = '';
			
			alert('转出成功');
		},
		
		// 切换余币宝余额显示
		toggleYubiBalance() {
			this.showYubiBalance = !this.showYubiBalance;
		}

	}
}
</script>

<style scoped>
.index-container {
	display: flex;
	flex-direction: column;
	min-height: 100vh;
	background: linear-gradient(to bottom, #000000, white);
	padding-top: var(--status-bar-height);
	box-sizing: border-box;
}

/* 顶部区域 */
.top-section {
	padding: 100rpx 30rpx 30rpx;
	display: flex;
	flex-direction: row;
	align-items: center;
	position: relative;
}

.top-image {
	width: 120rpx;
	height: 120rpx;
	border-radius: 16rpx;
	overflow: hidden;
	z-index: 10;
}

.top-image image {
	width: 100%;
	height: 100%;
}

.top-subtitle {
	font-size: 32rpx;
	color: rgba(255, 255, 255, 0.9);
	text-align: left;
	line-height: 44rpx;
	margin-left: 20rpx;
	font-weight: 500;
	flex: 1;
}

/* 主内容区域 */
.main-section {
	flex: 1;
	padding: 0 30rpx;
	margin-top: 20rpx;
	position: relative;
}

/* 钱包卡片 */
.wallet-card {
	background-color: rgba(255, 255, 255, 0.6);
	border-radius: 50rpx;
	padding: 60rpx 30rpx;
	box-shadow: none;
	margin-bottom: 0;
	position: absolute;
	width: 84%;
	top: calc(158px + var(--status-bar-height));
	left: 30rpx;
	z-index: 1;
	min-height: calc(80vh - 350px);
}

/* 空白卡片 */
.blank-card {
	background-color: rgba(255, 255, 255, 0.8);
	border-radius: 50rpx;
	padding: 0;
	box-shadow: 0 5rpx 20rpx rgba(0, 0, 0, 0.08);
	margin-bottom: 30rpx;
	overflow: hidden;
	min-height: 580rpx;
	background-image: url('/static/ScreenShot_2025-12-24_101802_928.png');
	background-repeat: no-repeat;
	background-size: cover;
	position: absolute;
	width: calc(100% - 60rpx);
	top: 0;
	z-index: 0;
}

/* 余额区域 */
.balance-header {
	text-align: center;
	margin-bottom: 20rpx;
}

.balance-label {
	font-size: 32rpx;
	color: #666;
}

.balance-amount {
		font-size: 80rpx;
		font-weight: bold;
		color: #333;
		text-align: center;
		margin-bottom: 40rpx;
	}

/* 操作按钮 */
.operation-buttons {
	padding: 0;
}

.row-buttons {
	display: flex;
	justify-content: space-between;
	margin-bottom: 16rpx;
	overflow: visible;
}

.btn {
	height: 90rpx;
	border-radius: 15rpx;
	font-size: 34rpx;
	font-weight: bold;
	display: flex;
	align-items: center;
	justify-content: center;
	position: relative;
	margin-bottom: 16rpx;
	width: 100%;
	overflow: visible;
}

.row-buttons .btn {
	width: 48%;
	margin-bottom: 0;
}

.recharge-btn {
	background-color: #000000;
	color: white;
	border: none;
}

.withdraw-btn {
	background-color: white;
	color: #333;
	border: 2rpx solid #E8E8E8;
}

/* 送10%标签样式 */
		.bonus-tag {
			position: absolute;
			top: -20rpx;
			right: -20rpx;
			transform: rotate(0deg);
			background-color: #FF5252;
			color: white;
			font-size: 20rpx;
			font-weight: bold;
			padding: 3rpx 10rpx;
			border-radius: 15rpx;
			z-index: 999;
			box-sizing: border-box;
			overflow: visible;
			min-width: 60rpx;
			text-align: center;
		}

.transfer-btn {
		background-color: white;
		color: #333;
		border: 2rpx solid #E8E8E8;
	}

	.receive-btn {
		background-color: #07C160;
		color: white;
		border: none;
	}
	
	/* 余币宝区域 */
	.yubibao-section {
		background-color: rgba(255, 255, 255, 0.8);
		border-radius: 20rpx;
		padding: 30rpx;
		margin: 20rpx 0;
		box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
	}
	
	.yubibao-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20rpx;
	}
	
	.yubibao-title {
		font-size: 34rpx;
		font-weight: bold;
		color: #333;
	}
	
	.yubibao-rate {
		font-size: 28rpx;
		color: #ff4757;
		font-weight: 600;
	}
	
	.yubibao-balance {
		font-size: 50rpx;
		font-weight: bold;
		color: #333;
		text-align: center;
		margin-bottom: 30rpx;
	}
	
	.yubibao-actions {
		display: flex;
		justify-content: space-between;
	}
	
	.yubibao-btn {
		width: 48%;
		margin-bottom: 0;
	}
	
	.yubibao-btn.in-btn {
		background-color: #000000;
		color: white;
		border: none;
	}
	
	.yubibao-btn.out-btn {
		background-color: white;
		color: #333;
		border: 2rpx solid #E8E8E8;
	}
	
	/* 弹窗样式 */
	.modal-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 9999;
	}
	
	.modal-content {
	background-color: white;
	border-radius: 30rpx;
	width: 90%;
	max-width: 600rpx;
	overflow: hidden;
}
	
	.modal-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 30rpx;
		border-bottom: 2rpx solid #f0f0f0;
	}
	
	.modal-title {
		font-size: 34rpx;
		font-weight: bold;
		color: #333;
	}
	
	.modal-close {
		font-size: 40rpx;
		color: #999;
		cursor: pointer;
	}
	
	.modal-body {
		padding: 30rpx;
	}
	
	.modal-label {
		display: block;
		font-size: 30rpx;
		color: #666;
		margin-bottom: 20rpx;
	}
	
	.amount-input {
	width: 100%;
	height: 80rpx;
	border: 2rpx solid #E8E8E8;
	border-radius: 15rpx;
	padding: 0 0rpx;
	font-size: 32rpx;
	margin-bottom: 20rpx;
}
	
	.balance-hint {
		font-size: 26rpx;
		color: #999;
		text-align: right;
	}
	
	.modal-footer {
		display: flex;
		border-top: 2rpx solid #f0f0f0;
	}
	
	.modal-btn {
		flex: 1;
		height: 90rpx;
		border: none;
		font-size: 32rpx;
		font-weight: 600;
	}
	
	.cancel-btn {
		background-color: #f5f5f5;
		color: #666;
		border-right: 2rpx solid #f0f0f0;
	}
	
	.confirm-btn {
		background-color: #000000;
		color: white;
	}

/* 底部信息 */
.card-footer {
	margin-top: 40rpx;
	text-align: center;
}

.footer-text {
	font-size: 26rpx;
	color: #999;
}


</style>