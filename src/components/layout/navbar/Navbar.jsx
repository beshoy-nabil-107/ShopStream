import React from 'react'
import { Navbar as BNavbar, Container } from 'react-bootstrap'

export default function Navbar({ children }) {
  return (
    <BNavbar bg="light" expand="md" className="" data-bs-theme="light">
        <Container>
            {children}
        </Container>
    </BNavbar>
  )
}
