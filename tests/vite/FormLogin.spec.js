import { expect, test, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/vue'
import { createTestingPinia } from '@pinia/testing'

import { useAuthStore } from '@/store/auth.js'

import FormLogin from '@/components/FormLogin.vue'

test('default props render', async () => {
  render(FormLogin, { props: { }, global: { plugins: [createTestingPinia({ createSpy: vi.fn })] } })

  expect(screen.getByRole('heading', { level: 5, name: 'Sign In' })).toBeTruthy()
  expect(screen.getByLabelText('Username')).toBeTruthy()
  expect(screen.getByPlaceholderText('Enter your username...')).toBeTruthy()
  expect(screen.getByRole('button', { name: 'Sign In'})).toBeTruthy()
  expect(screen.getByText('Forgot your password?')).toBeTruthy()

  cleanup()
})

test('passed props render', async () => {
  render(FormLogin, { props: { formName: 'Login', submitButtonAction: 'Submit' } })

  expect(screen.getByRole('heading', { level: 5, name: 'Login' })).toBeTruthy()
  expect(screen.getByRole('button', { name: 'Submit'})).toBeTruthy()
  cleanup()
})

test('inputs update v-model', async () => {
  render(FormLogin)

  const inputUsername = screen.getByLabelText('Username')
  const inputPassword = screen.getByLabelText('Password')

  await fireEvent.update(inputUsername, 'Jeff.Amazon')

  expect(inputUsername._value).toEqual('Jeff.Amazon')

  await fireEvent.update(inputPassword, 'secretCode1!')

  expect(inputPassword._value).toEqual('secretCode1!')
  cleanup()
})
