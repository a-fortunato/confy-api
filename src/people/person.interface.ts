import { Document } from 'mongoose'

export interface IPerson extends Document {
  email: string
  fullName: string
  nickName: string
  avatar?: { src: string }
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
