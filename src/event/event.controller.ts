import { Request, Response } from 'express'
import HttpStatus from 'http-status-codes'
import EventModel from './event.model'
import { IEvent } from './event.interface'

const exampleEvent = {
  name: process.env.EVENT_NAME,
  city: process.env.EVENT_CITY,
  startingDate: process.env.EVENT_STARTING_DATE && new Date(process.env.EVENT_STARTING_DATE),
  endingDate: process.env.EVENT_ENDING_DATE && new Date(process.env.EVENT_ENDING_DATE),
  organization: process.env.EVENT_ORGANIZATION,
}

async function getEvent(): Promise<IEvent> {
  await EventModel.findByIdAndDelete('5f038d80eda78b68ec7fa7ac')
  const events = await EventModel.find()
  if (!events.length) {
    return await EventModel.create(exampleEvent)
  }
  return events[0]
}

export async function eventInfo(req: Request, res: Response) {
  const event = await getEvent()
  res.status(HttpStatus.OK).send(event)
}
