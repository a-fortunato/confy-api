import { Request, Response } from 'express'
import HttpStatus from 'http-status-codes'
import { getTypes } from './type.parser'

export async function allTypes(req: Request, res: Response) {
  try {
    const types = await getTypes()
    res.setHeader('Content-Range', `posts 0-${types.length}/${types.length}`)
    res.status(HttpStatus.OK).send(types)
  } catch (e) {
    console.error(e)
    res.status(HttpStatus.BAD_REQUEST).send('Error!\n' + e)
  }
}
