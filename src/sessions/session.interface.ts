import { Document } from 'mongoose'
import { Type } from '../types/type.interface'

export interface ISession extends Document {
  title: string
  startsAt: Date
  endsAt: Date
  type: Type
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
