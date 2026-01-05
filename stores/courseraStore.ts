import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { CourseraCertificateModel } from '~/models/courseraModel'

export const useCourseraStore = defineStore(
  'courseraStore',
  () => {
    const certificates = ref<CourseraCertificateModel[]>([])

    const setCertificates = (data: CourseraCertificateModel[]) => {
      certificates.value = data.map(cert => {
        const existing = certificates.value.find(c => c._id === cert._id)

  return {
          ...cert,
          warning: existing?.warning ?? null,
        }
      })
    }

    const addCertificate = (cert: CourseraCertificateModel) => {
      const exists = certificates.value.find(c => c._id === cert._id)
      if (!exists) {
        certificates.value.unshift(cert)
      }
    }

    const clearCertificates = () => {
      certificates.value = []
    }

    return {
      certificates,
      setCertificates,
      addCertificate,
      clearCertificates,
    }
  },
  {
    persist: true,
  },
)
