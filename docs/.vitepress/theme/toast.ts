import { ref } from 'vue'

export interface ToastState {
  show: boolean
  message: string
  type: 'success' | 'info' | 'warning'
}

export const toastState = ref<ToastState>({
  show: false,
  message: '',
  type: 'success'
})

let toastTimeout: any = null

export function showToast(message: string, type: 'success' | 'info' | 'warning' = 'success', duration: number = 2500) {
  if (toastTimeout) {
    clearTimeout(toastTimeout)
  }
  toastState.value = {
    show: true,
    message,
    type
  }
  toastTimeout = setTimeout(() => {
    toastState.value.show = false
  }, duration)
}
