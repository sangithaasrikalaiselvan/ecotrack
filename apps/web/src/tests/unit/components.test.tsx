import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { GreenScoreRing } from '@/components/shared/GreenScoreRing'
import { CarbonCard } from '@/components/shared/CarbonCard'

vi.mock('framer-motion', () => ({
  useReducedMotion: () => true,
}))

describe('GreenScoreRing', () => {
  it('renders score value', () => {
    render(<GreenScoreRing score={75} size="md" />)
    expect(screen.getByText('75')).toBeInTheDocument()
  })

  it('renders 0 score without crashing', () => {
    render(<GreenScoreRing score={0} size="sm" />)
    expect(screen.getByText('0')).toBeInTheDocument()
  })
})

describe('CarbonCard', () => {
  it('renders title and value', () => {
    render(<CarbonCard title="Total" value={310} unit="kg" icon="🌡️" subtext="this month" />)
    expect(screen.getByText('Total')).toBeInTheDocument()
    expect(screen.getByText('310')).toBeInTheDocument()
  })

  it('renders subtext', () => {
    render(<CarbonCard title="Score" value={55} unit="" icon="🌿" subtext="above average" />)
    expect(screen.getByText('above average')).toBeInTheDocument()
  })
})
