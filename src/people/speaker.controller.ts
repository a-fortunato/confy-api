import { Request, Response } from 'express'
import HttpStatus from 'http-status-codes'
import { Role } from './person.interface'
import PersonModel from './person.model'

export async function allSpeakers(req: Request, res: Response) {
  await PersonModel.find({ role: Role.Speaker }, (err: any, speakers) => {
    if (err) {
      res.status(HttpStatus.BAD_REQUEST).send('Error!\n' + err)
    } else {
      res.status(HttpStatus.OK).send(speakers)
    }
  })
}
