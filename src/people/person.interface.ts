import { Document } from 'mongoose'

export interface IPerson extends Document {
  email: string
  firstName: string
  lastName: string
  fullName: string
  photoUrl?: string
  website?: string
  role?: Role
  // company
  // position
  // location
  // about
  // bio
}

export enum Role {
  Attendee,
  Speaker,
  // Admin,
}
