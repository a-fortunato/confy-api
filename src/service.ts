import { Request, Response } from 'express'
import HttpStatus from 'http-status-codes'

export function welcomeMessage(req: Request, res: Response) {
  return res.status(HttpStatus.OK).send('Welcome to Confy API Rest!')
}
