import { Document } from 'mongoose'

export interface IEvent extends Document {
  name?: string
  organization?: string
  venue?: string
  city?: string
  startingDate?: Date
  endingDate?: Date
}
