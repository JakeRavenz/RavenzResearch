import { render, screen } from '@testing-library/react'
import Home from '../page'

jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}))

describe('Home', () => {
  it('renders the welcome heading', () => {
    render(<Home />)
    const heading = screen.getByText(/Welcome to Mently/i)
    expect(heading).toBeInTheDocument()
  })

  it('renders the challenge section', () => {
    render(<Home />)
    const section = screen.getByText(/Frontend Challenge/i)
    expect(section).toBeInTheDocument()
  })
})