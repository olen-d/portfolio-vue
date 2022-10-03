import { expect, test } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/vue'
import InputNameLast from '@/components/formFields/InputNameLast.vue'

test('default props render', async () => {
  render(InputNameLast, { props: { } })

  expect(screen.getByLabelText('Last Name')).toBeTruthy()
  expect(screen.getByPlaceholderText('Enter your last name...')).toBeTruthy()

  cleanup()
})

test('passed props render', async () => {
  render(InputNameLast, { props: { labeltext: 'First Name', placeholder: 'Enter your first name...' } })

  expect(screen.getByLabelText('First Name')).toBeTruthy()
  expect(screen.getByPlaceholderText('Enter your first name...')).toBeTruthy()

  cleanup()
})

test('input updates v-model', async () => {
  render(InputNameLast)

  const input = screen.getByLabelText('Last Name')
  await fireEvent.update(input, 'Ted')

  expect(input._value).toEqual('Ted')

  cleanup()
})
