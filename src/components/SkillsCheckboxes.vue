<script setup>
  import { onMounted, ref, watch } from 'vue'

  const emits = defineEmits(['checkedSkillsWereCleared', 'updateSkills'])
  const props = defineProps({
    initialCheckedSkills: {
      type: Array,
      default: []
    },
    shouldClearCheckedSkills: {
      type: Boolean,
      default: false
    }
  })

  const checkedSkills = ref([])
  const error = ref('')
  const loading = ref(false)
  const skills = ref([])

  const onChange = () => {
    emits('updateSkills', checkedSkills.value)
  }

  const readSkills = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/skills/sort/type+name`)

      if (response.ok) {
        const data = await response.json()
        loading.value = false
        skills.value = data.skills
      } else {
        throw new Error('Network response was not ok. Unable to fetch. ')
        }
    } catch(err) {
      error.value = err.toString()
      loading.value = false
    }
  }

  watch(() => props.initialCheckedSkills, (newInitialCheckedSkills, prevInitialCheckedSkills) => {
    Array.isArray(newInitialCheckedSkills)
      ? (checkedSkills.value = props.initialCheckedSkills)
      : (checkedSkills.value = []) // Handle no skills returned from the API call
      emits('updateSkills', checkedSkills.value)
  })

  watch(() => props.shouldClearCheckedSkills, (newShouldClearCheckedSkills, prevShouldClearCheckedSkills) => {
    if (newShouldClearCheckedSkills) {
      checkedSkills.value = []
      emits('checkedSkillsWereCleared')
    }
  })

  onMounted(() => {
    readSkills()
        Array.isArray(props.initialCheckedSkills)
      ? (checkedSkills.value = props.initialCheckedSkills)
      : (checkedSkills.value = [])
      emits('updateSkills', checkedSkills.value)
  })
</script>

<template>
  <div class="skills-checkboxes">
    <div class="skills-heading">
      Skills
    </div>
    <div class="skills">
      <div
        class="skill u-third-width"
        v-for="{ _id, name } in skills"
        :key="_id"
      >
        <input
          type="checkbox"
          v-model="checkedSkills"
          :id="name"
          :value="_id"
          @change="onChange"
        />
        <label class="skill-label" :for="name">{{ name }}</label>
      </div>
    </div>
  </div>
</template>

<style scoped>
.skills-checkboxes {
  margin-bottom: 1.5rem;
}

.skills-heading {
  font-weight: 600;
}

.skills {
  justify-content: flex-start;
}

.skill {
  margin-top: 1.5rem;
}

.skill input,
.skill label {
  display: inline-block;
  font-weight: 400;
  margin-bottom: 0rem;
  vertical-align: middle;
  text-align: left;
}

.skill label {
  margin-left: 1rem;
}
</style>
