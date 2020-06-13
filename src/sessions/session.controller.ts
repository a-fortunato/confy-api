import { Request, Response } from 'express'
import HttpStatus from 'http-status-codes'
import { Types } from 'mongoose'
import SessionModel from './session.model'

export async function allSessions(req: Request, res: Response) {
  await SessionModel.find((err: any, sessions) => {
    if (err) {
      res.status(HttpStatus.BAD_REQUEST).send('Error!\n' + err)
    } else {
      res.status(HttpStatus.OK).send(sessions)
    }
  })
}

export async function addSession(req: Request, res: Response) {
  try {
    const session = await SessionModel.create(req.body)
    res.status(HttpStatus.CREATED).send(session)
  } catch (e) {
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
  const session = SessionModel.findByIdAndUpdate(req.params.id, req.body, { new: true })
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
    res.status(HttpStatus.BAD_REQUEST).send('Error deleting session.\n' + e)
  }
}

export async function addSpeakers(req: Request, res: Response) {
  try {
    const speakerIds: string[] = req.body.speaker
    const updatedSession = SessionModel.findByIdAndUpdate(
      req.params.id,
      {
        $push: { speaker: { $each: speakerIds } },
      },
      { new: true }
    )
    res.status(HttpStatus.OK).send(updatedSession)
  } catch (e) {
    res.status(HttpStatus.BAD_REQUEST).send('There was an error updating session\n' + e)
  }
}

export async function addAttendees(req: Request, res: Response) {
  try {
    const attendeesIds: string[] = req.body.speaker
    const updatedSession = SessionModel.findByIdAndUpdate(
      req.params.id,
      {
        $push: { attendees: { $each: attendeesIds } },
      },
      { new: true }
    )
    res.status(HttpStatus.OK).send(updatedSession)
  } catch (e) {
    res.status(HttpStatus.BAD_REQUEST).send('There was an error updating session\n' + e)
  }
}

/*
 */
