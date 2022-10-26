<script setup>
  import { onMounted, ref, watch } from 'vue'

  const props = defineProps({
    newLinkData: {
      type: Object,
    }
  })

  const isLoading = ref(true)
  const socials = ref([])

  onMounted(() => {
    const username = 'olen.d' // TODO: pass this in as a prop
    readSocials(username)
  })

  const addSocial = () => {
    socials.value.push(props.newLinkData)
    socials.value.sort((a, b) => a.order - b.order)
  }

  const readSocials = async username => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/social/user/${username}`)
      const data = await response.json()

      socials.value = data.social
      isLoading.value = false
    } catch (error) {
      console.log(`TheListSocial ERROR:\n${error}`)
    }
  }

  watch(() => props.newLinkData, (newLinkData, prevNewLinkData) => {
    if (newLinkData !== prevNewLinkData) {
      addSocial()
    }
  })
</script>

<template>
  <div class="the-list-social">
    <div class="none-found" v-if="!isLoading && socials.length < 1">
      <p>No social media links were found.</p>
    </div>
    <table v-if="socials.length > 0">
      <thead>
        <tr>
          <th scope="col">Icon</th>
          <th scope="col">Anchor</th>
          <th scope="col">URI</th>
          <th scope="col">Sort Priority</th>
        </tr>
      </thead>
      <tbody id="socials" v-if="!isLoading">
        <tr v-for="{ _id, anchor, uri, icon, order } in socials" :key="_id" :id="_id">
          <td><i :class="icon" class="table-icon"></i></td>
          <td>{{ anchor }}</td>
          <td>{{ uri }}</td>
          <td>{{ order }}</td>
          <td><i @click="updateSkill" class="fas fa-edit edit" :data-id="_id"></i></td>
          <td><i @click="confirmDeleteSkill" class="fas fa-times delete" :data-id="_id" :data-name="anchor"></i></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
