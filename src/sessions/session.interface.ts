import { Document } from 'mongoose'

export interface ISession extends Document {
  title: string
  startsAt: Date
  endsAt: Date
  type: {
    name: string
    color: string
  }
  description?: string
  speaker?: string[]
  venue?: string // Building name / Company name etc.
  address?: string // Room # / Street Address
  seats?: number // Venue capacity
  attendees?: string[]
}

export enum PersonType {
  'Attendee',
  'Speaker',
}
