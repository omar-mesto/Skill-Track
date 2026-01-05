export interface ProfileQRData {
  profileUrl: string
  qrCode: string
}

export interface ProfileQRResponse {
  success: boolean
  message: string
  data: ProfileQRData
}
