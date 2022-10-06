import { expect, test } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/vue'
import InputEmail from '@/components/formFields/InputEmail.vue'

test('default props render', async () => {
  render(InputEmail, { props: { } })

  expect(screen.getByLabelText('Email Address')).toBeTruthy()
  expect(screen.getByPlaceholderText('Enter your email address...')).toBeTruthy()

  cleanup()
})

test('passed props render', async () => {
  render(InputEmail, { props: { labeltext: 'Street Address', placeholder: 'Enter your street address...' } })

  expect(screen.getByLabelText('Street Address')).toBeTruthy()
  expect(screen.getByPlaceholderText('Enter your street address...')).toBeTruthy()

  cleanup()
})

test('input updates v-model', async () => {
  render(InputEmail)

  const input = screen.getByLabelText('Email Address')
  await fireEvent.update(input, 'fred@loosenuts.com')

  expect(input._value).toEqual('fred@loosenuts.com')

  cleanup()
})
