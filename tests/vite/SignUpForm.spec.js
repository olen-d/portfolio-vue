import { expect, test, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/vue'
import { createTestingPinia } from '@pinia/testing'

import { useAuthStore } from '@/store/auth.js'

import SignUpForm from '@/components/SignUpForm.vue'

test('default props render', async () => {
  render(SignUpForm, { props: { }, global: { plugins: [createTestingPinia({ createSpy: vi.fn })] } })

  expect(screen.getByRole('heading', { level: 5, name: 'Sign Up' })).toBeTruthy()
  expect(screen.getByLabelText('First Name')).toBeTruthy()
  expect(screen.getByPlaceholderText('Enter your first name...')).toBeTruthy()
  expect(screen.getByLabelText('Last Name')).toBeTruthy()
  expect(screen.getByPlaceholderText('Enter your last name...')).toBeTruthy()
  expect(screen.getByLabelText('Email Address')).toBeTruthy()
  expect(screen.getByPlaceholderText('Enter your email address...')).toBeTruthy()
  expect(screen.getByLabelText('Username')).toBeTruthy()
  expect(screen.getByPlaceholderText('Enter your username...')).toBeTruthy()
  expect(screen.getByRole('button', { name: 'Sign Up'})).toBeTruthy()

  cleanup()
})

test('passed props render', async () => {
  render(SignUpForm, { props: { formName: 'Register', submitButtonAction: 'Submit' } })

  expect(screen.getByRole('heading', { level: 5, name: 'Register' })).toBeTruthy()
  expect(screen.getByRole('button', { name: 'Submit'})).toBeTruthy()
  cleanup()
})

test('inputs update v-model', async () => {
  render(SignUpForm)

  const inputFirstName = screen.getByLabelText('First Name')
  const inputLastName = screen.getByLabelText('Last Name')
  const inputEmailAddress = screen.getByLabelText('Email Address')
  const inputUsername = screen.getByLabelText('Username')
  const inputPassword = screen.getByLabelText('Password')

  await fireEvent.update(inputFirstName, 'Jeff')

  expect(inputFirstName._value).toEqual('Jeff')

  await fireEvent.update(inputLastName, 'Amazon')

  expect(inputLastName._value).toEqual('Amazon')

  await fireEvent.update(inputEmailAddress, 'jeff@amazon.com')

  expect(inputEmailAddress._value).toEqual('jeff@amazon.com')

  await fireEvent.update(inputUsername, 'Jeff.Amazon')

  expect(inputUsername._value).toEqual('Jeff.Amazon')

  await fireEvent.update(inputPassword, 'secretCode1!')

  expect(inputPassword._value).toEqual('secretCode1!')
  cleanup()
})
