/**
 * 频道的相关请求列表
 */
import request from '@/utils/request'

/**
 * 获取所有频道列表
 */
export const getAllChannels = () => {
  return request({
    method: 'GET',
    url: '/app/v1_0/channels'
  })
}

/**
 * 重置用户登录状态下的频道列表
 */
export const addUserChannel = channels => {
  return request({
    method: 'PATCH',
    url: '/app/v1_0/user/channels',
    data: {
      channels
    }
  })
}

/**
 * 删除指定用户频道
 */
export const deleteUserChannel = channelId => {
  return request({
    method: 'DELETE',
    url: `/app/v1_0/user/channels/${channelId}`
  })
}
