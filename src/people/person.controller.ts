import { Request, Response } from 'express'
import HttpStatus from 'http-status-codes'
import { Types } from 'mongoose'
import { getQueryFindOptions, getRangeForHeader } from '../query.parser'
import PersonModel from './person.model'

export async function allPeople(req: Request, res: Response) {
  try {
    const findOptions = getQueryFindOptions(req)
    const people = await PersonModel.find({}, null, findOptions).lean()
    const totalPeopleAmount = await PersonModel.estimatedDocumentCount()
    res.setHeader(
      'Content-Range',
      `posts ${getRangeForHeader(req.query.range)}/${totalPeopleAmount}`
    )
    const updatedPeople = people.map(person => ({ ...person, id: person._id }))
    res.status(HttpStatus.OK).send(updatedPeople)
  } catch (e) {
    res.status(HttpStatus.BAD_REQUEST).send('Error!\n' + e)
  }
}

export async function addPerson(req: Request, res: Response) {
  try {
    const person = await PersonModel.create(req.body)
    res.status(HttpStatus.CREATED).send(person)
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error)
  }
}

export async function getPerson(req: Request, res: Response) {
  if (!Types.ObjectId.isValid(req.params.id)) {
    return res.status(HttpStatus.BAD_REQUEST).send(`${req.params.id} is not a valid id`)
  }
  const person = await PersonModel.findById(req.params.id)
  if (!person) {
    res.status(HttpStatus.NOT_FOUND).send('Person was not found')
  }
  res.status(HttpStatus.OK).send(person)
}

export async function updatePerson(req: Request, res: Response) {
  const person = await PersonModel.findByIdAndUpdate(req.params.id, req.body, { new: true })
  if (!person) {
    res.status(HttpStatus.NOT_FOUND).send('Person was not found')
  }
  res.status(HttpStatus.OK).send(person)
}

export async function deletePerson(req: Request, res: Response) {
  if (!Types.ObjectId.isValid(req.params.id)) {
    return res.status(HttpStatus.BAD_REQUEST).send(`${req.params.id} is not a valid id`)
  }
  try {
    const deletedPerson = await PersonModel.findByIdAndDelete(req.params.id)
    res.status(HttpStatus.OK).send(deletedPerson)
  } catch (e) {
    res.status(HttpStatus.BAD_REQUEST).send('Error deleting person.\n' + e)
  }
}
