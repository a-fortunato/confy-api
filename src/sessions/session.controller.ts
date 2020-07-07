import { Request, Response } from 'express'
import HttpStatus from 'http-status-codes'
import { Types } from 'mongoose'
import { getQueryFindOptions, getRangeForHeader } from '../query.parser'
import SessionModel from './session.model'
import { ISession, PersonType } from './session.interface'
import { getTypeColor } from '../types/type.parser'

export async function allSessions(req: Request, res: Response) {
  try {
    const totalSessionsAmount = await SessionModel.estimatedDocumentCount()
    const findOptions = getQueryFindOptions(req, totalSessionsAmount)
    const sessions = await SessionModel.find({}, null, findOptions).lean()
    res.setHeader(
      'Content-Range',
      `posts ${getRangeForHeader(req.query.range, totalSessionsAmount)}/${totalSessionsAmount}`
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
    const type = req.body.type
    const extraData: Partial<ISession> = {}
    if (!type.color) {
      extraData['type'] = {
        name: type.name,
        color: await getTypeColor(type.name),
      }
    }
    const session = await SessionModel.create({
      ...req.body,
      ...extraData,
    })
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
  const type = req.body.type
  const extraData: Partial<ISession> = {}
  if (type && !type.color) {
    extraData['type'] = {
      name: type.name,
      color: await getTypeColor(type.name),
    }
  }
  const session = await SessionModel.findByIdAndUpdate(
    req.params.id,
    { ...req.body, ...extraData },
    { new: true }
  )
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
