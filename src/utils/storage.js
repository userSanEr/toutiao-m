/**
 * 本地存储模块
 */
export const getItem = name => {
  const data = window.localStorage.getItem(name)
  // 为什么要在try catch中进行转化，因为data可能不是data格式字符串
  try {
    // 尝试把data转为js对象
    return JSON.parse(data)
  } catch (err) {
    // data不是JSON格式的字符串，原样返回
    return data
  }
}

export const setItem = (name, value) => {
  // 如果value是对象，就把value转为json字符串
  if (typeof value === 'object') {
    value = JSON.stringify(value)
  }
  window.localStorage.setItem(name, value)
}

export const removeItem = name => {
  window.localStorage.removeItem(name)
}
