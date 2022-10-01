import { expect, test } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/vue'
import InputNameFirst from '@/components/formFields/InputNameFirst.vue'

test('default props render', async () => {
  render(InputNameFirst, { props: { } })

  expect(screen.getByLabelText('First Name')).toBeTruthy()
  expect(screen.getByPlaceholderText('Enter your first name...')).toBeTruthy()

  cleanup()
})

test('passed props render', async () => {
  render(InputNameFirst, { props: { labeltext: 'Last Name', placeholder: 'Enter your last name...' } })

  expect(screen.getByLabelText('Last Name')).toBeTruthy()
  expect(screen.getByPlaceholderText('Enter your last name...')).toBeTruthy()

  cleanup()
})

// test('input updates v-model', async () => {
//   render(InputUsername)

//   const input = screen.getByLabelText('Username *')
//   await fireEvent.update(input, 'Fred')

//   expect(input._value).toEqual('Fred')
// })
