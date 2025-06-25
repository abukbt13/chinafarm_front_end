<script setup>
import { ref, defineEmits } from 'vue'
import axios from 'axios'

const emit = defineEmits(['saved'])

const crop = ref('')
const startDate = ref('')
const endDate = ref('')
const description = ref('')
const success = ref(false)
const errors = ref({})

const saveCrop = async () => {
  errors.value = {}
  try {
    const response = await axios.post('http://127.0.0.1:8000/api/crops', {
      crop: crop.value,
      start_date: startDate.value,
      end_date: endDate.value || null,
      description: description.value
    }, {
      withCredentials: true
    })

    if (response.status === 201) {
      emit('saved') // 👈 emit event to parent
      crop.value = ''
      startDate.value = ''
      endDate.value = ''
      description.value = ''
    }
  } catch (err) {
    if (err.response?.status === 422) {
      errors.value = err.response.data.errors
    } else {
      console.error(err)
    }
  }
}
</script>
