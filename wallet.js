// 缓存相关
let balanceCache = null;
let lastCacheTime = 0;
const CACHE_DURATION = 5000; // 缓存5秒

// 生成唯一ID
export function generateId() {
  return (Date.now().toString(36) + Math.random().toString(36).substr(2, 5)).toUpperCase();
}

// 从本地存储获取交易记录
export function getTransactions() {
  try {
    const stored = localStorage.getItem('transactions');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('获取交易记录失败:', error);
    return [];
  }
}

// 保存交易记录到本地存储
export function saveTransactions(transactions) {
  try {
    localStorage.setItem('transactions', JSON.stringify(transactions));
    // 清除余额缓存，确保下次计算时重新获取
    balanceCache = null;
    return true;
  } catch (error) {
    console.error('保存交易记录失败:', error);
    return false;
  }
}

// 计算余额（避免浮点数精度问题）
export function calculateBalance(transactions = []) {
  if (!transactions || !Array.isArray(transactions)) {
    return 0;
  }
  
  // 忽略交易相关的交易类型，只计算钱包相关的交易
  const balance = transactions.reduce((sum, item) => {
    // 交易相关的类型：trade_buy, trade_sell
    // 注意：trade_coin_in和trade_coin_out应该影响钱包余额
    const tradeTypes = ['trade_buy', 'trade_sell'];
    if (!tradeTypes.includes(item.type)) {
      return sum + Math.round(item.amount * 100);
    }
    return sum;
  }, 0) / 100;
  
  // 确保余额不会小于0
  return Math.max(0, balance);
}

// 计算余额并格式化为两位小数
export function getFormattedBalance() {
  // 检查缓存是否有效
  const now = Date.now();
  if (balanceCache && (now - lastCacheTime) < CACHE_DURATION) {
    return balanceCache;
  }
  
  const transactions = getTransactions();
  const balance = calculateBalance(transactions);
  const formattedBalance = balance.toFixed(2);
  
  // 更新缓存
  balanceCache = formattedBalance;
  lastCacheTime = now;
  
  return formattedBalance;
}

// 计算余币宝余额
export function calculateYubiBaoBalance() {
  const transactions = getTransactions();
  
  // 计算转入余币宝的总金额
  const yubiBaoIn = transactions.reduce((sum, item) => {
    if (item.type === 'yubibao_in') {
      return sum + item.amount;
    }
    return sum;
  }, 0);
  
  // 计算转出余币宝的总金额
  const yubiBaoOut = transactions.reduce((sum, item) => {
    if (item.type === 'yubibao_out') {
      return sum + item.amount;
    }
    return sum;
  }, 0);
  
  // 计算余币宝余额
  const balance = yubiBaoIn - yubiBaoOut;
  
  // 确保余额不会小于0
  return Math.max(0, balance);
}

// 添加交易记录
export function addTransaction(transaction) {
  if (!transaction || !transaction.amount || !transaction.type) {
    throw new Error('交易信息不完整');
  }
  
  // 确保交易有唯一ID
  if (!transaction.id) {
    transaction.id = generateId();
  }
  
  // 确保交易有时间戳
  if (!transaction.date || !transaction.time) {
    const now = new Date();
    transaction.date = now.toISOString().split('T')[0];
    transaction.time = now.toTimeString().slice(0, 8);
  }
  
  const transactions = getTransactions();
  transactions.unshift(transaction);
  saveTransactions(transactions);
  
  return transaction;
}

// 格式化金额显示
export function formatAmount(amount) {
  return parseFloat(amount).toFixed(2);
}

// 获取最近的交易记录
export function getRecentTransactions(limit = 10) {
  const transactions = getTransactions();
  return transactions.slice(0, limit);
}

// 清除所有交易记录
export function clearTransactions() {
  try {
    localStorage.removeItem('transactions');
    balanceCache = null;
    return true;
  } catch (error) {
    console.error('清除交易记录失败:', error);
    return false;
  }
}

// 余币宝转入
export function yubiBaoIn(amount) {
  // 这里可以添加余币宝转入的逻辑
  // 目前只是添加交易记录
  addTransaction({
    amount: amount,
    type: 'yubibao_in',
    title: '转入余币宝',
    description: '转入余币宝'
  });
}

// 余币宝转出
export function yubiBaoOut(amount) {
  // 这里可以添加余币宝转出的逻辑
  // 目前只是添加交易记录
  addTransaction({
    amount: -amount,
    type: 'yubibao_out',
    title: '余币宝转出',
    description: '余币宝转出'
  });
}

// 计算余币宝利息
export function calculateYubiBaoInterest() {
  // 这里可以添加余币宝利息计算的逻辑
  // 目前只是返回0
  return 0;
}

// 强制刷新余额缓存
export function refreshBalance() {
  balanceCache = null;
}