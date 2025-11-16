import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useGlobalStore = defineStore('globalStore', () => {
    const token = ref('')
    const name = ref('')
    const email = ref('')
    const logout = () => {
        token.value = ''
        role.value = undefined
    }

    const resetToken = ref('')
    const role = ref<string>()

    return { role, token, name, email, resetToken, logout }
}, {
    persist: {
        pick: ['token', 'role', 'name', 'email', 'resetToken'],
    },

})
