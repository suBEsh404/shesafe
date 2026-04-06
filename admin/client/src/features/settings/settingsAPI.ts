import { apiRequest } from '../../services/apiClient'

export type SettingsPayload = {
  apiHealth: string
  storageUsed: number
  storageTotal: number
  securityLevel: string
}

type SettingsResponse = {
  success: boolean
  data: SettingsPayload
}

type ReviewControlsResponse = {
  success: boolean
  message: string
  data: {
    id: string
    level: string
    reviewedAt: string
  }
}

type GenerateReportResponse = {
  success: boolean
  message: string
  data: {
    id: string
    downloadName: string
    generatedAt: string
  }
}

export const fetchSettings = async (): Promise<SettingsPayload> => {
  const response = await apiRequest<SettingsResponse>('/api/admin/settings', {
    auth: true,
  })
  return response.data
}

export const reviewControls = async (notes?: string): Promise<string> => {
  const response = await apiRequest<ReviewControlsResponse>(
    '/api/admin/settings/review-controls',
    {
      method: 'POST',
      auth: true,
      body: { notes: notes ?? '' },
    },
  )

  return response.data.level
}

export const generateReport = async (): Promise<string> => {
  const response = await apiRequest<GenerateReportResponse>(
    '/api/admin/settings/generate-report',
    {
      method: 'POST',
      auth: true,
      body: { format: 'json' },
    },
  )

  return response.data.downloadName
}
