import { expect, test } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/vue'
import InputPassword from '@/components/formFields/InputPassword.vue'

test('default props render', async () => {
  render(InputPassword, { props: { } })

  expect(screen.getByLabelText('Password')).toBeTruthy()
  expect(screen.getByPlaceholderText('Enter your password...')).toBeTruthy()

  cleanup()
})

test('passed props render', async () => {
  render(InputPassword, { props: { labeltext: 'Secret Code', placeholder: 'Enter your secret code...' } })

  expect(screen.getByLabelText('Secret Code')).toBeTruthy()
  expect(screen.getByPlaceholderText('Enter your secret code...')).toBeTruthy()

  cleanup()
})

test('input updates v-model', async () => {
  render(InputPassword)

  const input = screen.getByLabelText('Password')
  await fireEvent.update(input, 'superS3cretC0de')

  expect(input._value).toEqual('superS3cretC0de')

  cleanup()
})
