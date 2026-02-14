import { apiRequest } from '../api-client'

export type RecipientType = 'all' | 'students' | 'teachers'

export interface SendNotificationRequest {
  title: string
  description: string
  recipient_type: RecipientType
}

export interface SendNotificationResponse {
  notifications_created: number
  notifications_sent: number
  notifications_failed: number
  recipient_type: RecipientType
}

/** Send notification from dashboard — used on Dashboard Home page */
export const sendNotification = async (
  data: SendNotificationRequest
): Promise<SendNotificationResponse> => {
  return apiRequest<SendNotificationResponse>('/api/notifications/send', {
    method: 'POST',
    body: data,
  })
}
