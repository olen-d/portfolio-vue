import { expect, test } from 'vitest'
import { cleanup, render, screen } from '@testing-library/vue'
// import { createTestingPinia } from '@pinia/testing'

// import { useAuthStore } from '@/store/auth.js'

import LoadingIndicator from '@/components/LoadingIndicator.vue'

// TODO: Figure out how to test that the icon was rendered
// test('default props render', async () => {
//   render(LoadingIndicator, { props: { }, global: { plugins: [createTestingPinia({ createSpy: vi.fn })] } })

//   expect(screen.getByText('Something went terribly wrong')).toBeTruthy()

//   cleanup()
// })

test('passed props render', async () => {
  render(LoadingIndicator, { props: { error: 'The server has melted. Please try again later.', loading: false } })

  expect(screen.getByText('The server has melted. Please try again later.')).toBeTruthy()

  cleanup()
})
