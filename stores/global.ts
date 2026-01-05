import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useGlobalStore = defineStore('globalStore', () => {
    const token = ref('')
    const name = ref('')
    const email = ref('')
    const id = ref('')
    const position = ref('')
    const logout = () => {
        token.value = ''
        id.value = ''
        role.value = undefined
        name.value = ''
        position.value = ''
    }

    const resetToken = ref('')
    const role = ref<string>()

    return { role, token, name, email, resetToken, logout, id, position }
}, {
    persist: {
        pick: ['token', 'position', 'role', 'name', 'email', 'resetToken', 'id'],
    },

})
