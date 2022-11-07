import { expect, test } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/vue'
import LoginForm from '@/components/LoginForm.vue'

test('default props render', async () => {
  render(LoginForm, { props: { } })

  expect(screen.getByRole('heading', { level: 5, name: 'Sign In' })).toBeTruthy()
  expect(screen.getByLabelText('Username')).toBeTruthy()
  expect(screen.getByPlaceholderText('Enter your username...')).toBeTruthy()
  expect(screen.getByRole('button', { name: 'Sign In'})).toBeTruthy()
  expect(screen.getByText('Forgot your password?')).toBeTruthy()

  cleanup()
})

test('passed props render', async () => {
  render(LoginForm, { props: { formName: 'Login', submitButtonAction: 'Submit' } })

  expect(screen.getByRole('heading', { level: 5, name: 'Login' })).toBeTruthy()
  expect(screen.getByRole('button', { name: 'Submit'})).toBeTruthy()
  cleanup()
})

test('inputs update v-model', async () => {
  render(LoginForm)

  const inputUsername = screen.getByLabelText('Username')
  const inputPassword = screen.getByLabelText('Password')

  await fireEvent.update(inputUsername, 'Jeff.Amazon')

  expect(inputUsername._value).toEqual('Jeff.Amazon')

  await fireEvent.update(inputPassword, 'secretCode1!')

  expect(inputPassword._value).toEqual('secretCode1!')
  cleanup()
})
