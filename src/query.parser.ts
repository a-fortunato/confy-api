import { QueryFindOptions } from 'mongoose'
import { Request } from 'express'

const FALLBACK_RANGE = '[0, 9]'

function parseRange(range: string = FALLBACK_RANGE): [number, number] {
  return JSON.parse(range)
}

export function getQueryFindOptions({ query }: Request): QueryFindOptions {
  const findOptions: QueryFindOptions = {}
  const [rangeFrom, rangeTo] = parseRange(query.range)
  findOptions.limit = rangeTo + 1 - rangeFrom
  findOptions.skip = rangeFrom

  return findOptions
}

export function getRangeForHeader(range?: string): string {
  const rangeArray: [number, number] = parseRange(range)
  return rangeArray.join('-')
}
