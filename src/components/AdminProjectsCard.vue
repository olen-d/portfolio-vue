<script setup>
  import { computed, onMounted, ref } from 'vue'

  const props = defineProps({
    _id: {
      type: String
    },
    deployedLink: {
      type: String
    },
    description: {
      type: String
    },
    title: {
      type: String
    },
    repoLink: {
      type: String
    },
    screenshot: {
      type: String
    },
    skills: {
      type: Array
    },
    priority: {
      type: Number
    },
    show: {
      type: Number
    }
  })

  const publicPath = ref(`${import.meta.env.VITE_ASSETS_HOST}`)
  const skillsData = ref([])
  const skillNamesById = ref([])

  const skillNames = computed(() => {
    let skillNamesOutput = "";
    if (props.skills) {
      props.skills.forEach(skill => {
        let index = skillNamesById.value.map(item => item._id).indexOf(skill)
        if (index > -1) {
          skillNamesOutput += skillNamesById.value[index].name + ", "
        }
      })
    } else {
      skillNamesOutput = 'No skills were found for this project.'
    }
    skillNamesOutput = skillNamesOutput.replace(/,\s*$/, '')
    return skillNamesOutput
  })

  const formatShow = show => {
    if (show == 1) {
      return "Yes"
    } else {
      return "No"
    }
  }

  const readSkills = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/skills`)
      const data = await response.json()

      skillsData.value = data.skills
      mapSkillNames()

    } catch (error) {
      console.log(`ERROR\nAdmin Project Card\n${error}`)
    }
  }

  const mapSkillNames = () => {
    skillsData.value.forEach(skill => {
      let _id = skill._id
      let name = skill.name
      skillNamesById.value.push({ _id, name })
    })
  }

  onMounted(() => {
    readSkills()
  })
</script>

<template>
  <div class="admin-projects-card">
    <div class="screenshot">
      <img
        :src="`${publicPath}/assets/images/${screenshot}`"
        :alt="`Screenshot of ${title}`"
      />
    </div>
    <div class="title">
      {{ title }}
    </div>
    <div class="description">
      {{ description }}
    </div>
    <div class="links">
      <p>
        Deployed at:<br />
        {{ deployedLink }}
      </p>
      <p>
        Code Repository: <br />
        {{ repoLink }}
      </p>
    </div>
    <div class="skills">
      <p>
        Skills: <br />
        {{ skillNames }}
      </p>
    </div>
    <div class="meta">
      <p>Sort Priority: {{ priority }}</p>
      <p>Display: {{ formatShow(show) }}</p>
    </div>
  </div>
</template>

<style scoped>
  .screenshot {
    width: 350px;
  }

  .screenshot img {
    width: 350px;
    object-fit: contain;
  }
</style>
