import { expect, test } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/vue'
import InputUsername from '@/components/formFields/InputUsername.vue'

test('default props render', async () => {
  render(InputUsername, { props: { } })

  expect(screen.getByLabelText('Username')).toBeTruthy()
  expect(screen.getByPlaceholderText('Enter your username...')).toBeTruthy()

  cleanup()
})

test('passed props render', async () => {
  render(InputUsername, { props: { labeltext: 'Login', placeholder: 'Enter your login...' } })

  expect(screen.getByLabelText('Login')).toBeTruthy()
  expect(screen.getByPlaceholderText('Enter your login...')).toBeTruthy()

  cleanup()
})

test('input updates v-model', async () => {
  render(InputUsername)

  const input = screen.getByLabelText('Username')
  await fireEvent.update(input, 'Fred.Swanson')

  expect(input._value).toEqual('Fred.Swanson')

  cleanup()
})
