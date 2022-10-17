import { expect, test } from 'vitest'
import { cleanup, render, screen } from '@testing-library/vue'
import AlertMessage from '@/components/AlertMessage.vue'

test('default props and slots render', async () => {
  render(AlertMessage, { props: { }, slots: { default: 'The clouds roll in storm by storm' } })

  expect(screen.getByText('The clouds roll in storm by storm')).toBeTruthy()

  cleanup()
})

test('passed title prop renders', async () => {
  render(AlertMessage, { props: { title: 'Bohemian Rhapsody' } })

  expect(screen.getByText('Bohemian Rhapsody')).toBeTruthy()

  cleanup()
})
