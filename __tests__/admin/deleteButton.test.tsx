/**
 * @jest-environment jsdom
 */
import { fireEvent, render, screen } from '@testing-library/react'
import type { ActionState } from '@/app/admin/actions'

// Installed React is 18.3, so useActionState must be stubbed (see forms.test.tsx).
let mockState: ActionState = { ok: false }
let mockPending = false
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useActionState: () => [mockState, '', mockPending],
}))

import DeleteButton from '@/components/admin/DeleteButton'

const action = jest.fn()

beforeEach(() => {
  mockState = { ok: false }
  mockPending = false
})

describe('DeleteButton', () => {
  it('does not offer to submit until the first tap asks for confirmation', () => {
    render(<DeleteButton action={action} label="questo spettacolo" />)
    expect(screen.getByRole('button', { name: 'Elimina questo spettacolo' })).toHaveAttribute('type', 'button')
    expect(screen.queryByRole('button', { name: /Conferma/ })).not.toBeInTheDocument()
  })

  it('asks for confirmation, and cancelling goes back', () => {
    render(<DeleteButton action={action} label="questo spettacolo" />)
    fireEvent.click(screen.getByRole('button', { name: 'Elimina questo spettacolo' }))
    expect(screen.getByText(/Vuoi eliminare questo spettacolo/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Conferma eliminazione' })).toHaveAttribute('type', 'submit')

    fireEvent.click(screen.getByRole('button', { name: 'Annulla' }))
    expect(screen.queryByRole('button', { name: /Conferma/ })).not.toBeInTheDocument()
  })

  it('shows the server error, for example when the row is still in use', () => {
    mockState = { ok: false, error: 'Questo spettacolo ha 2 produzioni: eliminale prima.' }
    render(<DeleteButton action={action} label="questo spettacolo" />)
    expect(screen.getByRole('status')).toHaveTextContent('2 produzioni')
  })

  it('disables the buttons while deleting', () => {
    render(<DeleteButton action={action} label="questa data" />)
    fireEvent.click(screen.getByRole('button', { name: 'Elimina questa data' }))
    mockPending = true
    fireEvent.click(screen.getByRole('button', { name: 'Annulla' }))
    fireEvent.click(screen.getByRole('button', { name: 'Elimina questa data' }))
    expect(screen.getByRole('button', { name: 'Eliminazione…' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Annulla' })).toBeDisabled()
  })
})
