import { Request, Response } from 'express'
import HttpStatus from 'http-status-codes'
import { Types } from 'mongoose'
import { getQueryFindOptions, getRangeForHeader } from '../query.parser'
import SessionModel from './session.model'
import { PersonType } from './session.interface'

export async function allSessions(req: Request, res: Response) {
  try {
    const findOptions = getQueryFindOptions(req)
    const sessions = await SessionModel.find({}, null, findOptions).lean()
    const totalSessionsAmount = await SessionModel.estimatedDocumentCount()
    res.setHeader(
      'Content-Range',
      `posts ${getRangeForHeader(req.query.range)}/${totalSessionsAmount}`
    )
    const updatedSessions = sessions.map(session => ({ ...session, id: session._id }))
    res.status(HttpStatus.OK).send(updatedSessions)
  } catch (e) {
    console.error(e)
    res.status(HttpStatus.BAD_REQUEST).send('Error!\n' + e)
  }
}

export async function addSession(req: Request, res: Response) {
  try {
    const session = await SessionModel.create(req.body)
    res.status(HttpStatus.CREATED).send(session)
  } catch (e) {
    console.error(e)
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('Error creating session.\n' + e)
  }
}

export async function getSession(req: Request, res: Response) {
  if (!Types.ObjectId.isValid(req.params.id)) {
    return res.status(HttpStatus.BAD_REQUEST).send(`${req.params.id} is not a valid id`)
  }
  const session = await SessionModel.findById(req.params.id)
  if (!session) {
    return res.status(HttpStatus.NOT_FOUND).send('Session was not found')
  }
  res.status(HttpStatus.OK).send(session)
}

export async function updateSession(req: Request, res: Response) {
  const session = await SessionModel.findByIdAndUpdate(req.params.id, req.body, { new: true })
  if (!session) {
    return res.status(HttpStatus.NOT_FOUND).send('Session was not found')
  }
  res.status(HttpStatus.OK).send(session)
}

export async function deleteSession(req: Request, res: Response) {
  if (!Types.ObjectId.isValid(req.params.id)) {
    return res.status(HttpStatus.BAD_REQUEST).send(`${req.params.id} is not a valid id`)
  }
  try {
    const deletedSession = await SessionModel.findByIdAndDelete(req.params.id)
    res.status(HttpStatus.OK).send(deletedSession)
  } catch (e) {
    console.error(e)
    res.status(HttpStatus.BAD_REQUEST).send('Error deleting session.\n' + e)
  }
}

export async function addPeople(
  sessionId: string,
  peopleIdsList: string[],
  peopleType: PersonType
) {
  const type = peopleType == PersonType.Attendee ? 'attendees' : 'speaker'
  return SessionModel.findByIdAndUpdate(
    sessionId,
    {
      $addToSet: { [type]: { $each: peopleIdsList } },
    },
    { new: true }
  )
}

export async function addSpeakers(req: Request, res: Response) {
  try {
    const updatedSession = await addPeople(req.params.id, req.body, PersonType.Speaker)
    res.status(HttpStatus.OK).send(updatedSession)
  } catch (e) {
    console.error(e)
    res.status(HttpStatus.BAD_REQUEST).send('There was an error adding speakers\n' + e)
  }
}

export async function addAttendees(req: Request, res: Response) {
  try {
    const updatedSession = await addPeople(req.params.id, req.body, PersonType.Attendee)
    res.status(HttpStatus.OK).send(updatedSession)
  } catch (e) {
    console.error(e)
    res.status(HttpStatus.BAD_REQUEST).send('There was an error adding attendees\n' + e)
  }
}

export async function allTypes(req: Request, res: Response) {
  try {
    const sessions = await SessionModel.find().lean()
    const types = sessions.map(session => ({ ...session.type, id: session.type.name }))
    res.setHeader('Content-Range', `posts 0-${types.length}/${types.length}`)
    res.status(HttpStatus.OK).send(types)
  } catch (e) {
    res.status(HttpStatus.BAD_REQUEST).send('Error!\n' + e)
  }
}
