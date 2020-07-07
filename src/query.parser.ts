import { QueryFindOptions } from 'mongoose'
import { Request } from 'express'

const fallbackRange = (total = 9) => `[0, ${total}]`

function parseRange(queryRange?: string, totalAmount?: number): [number, number] {
  const range = queryRange || fallbackRange(totalAmount)
  return JSON.parse(range)
}

export function getQueryFindOptions({ query }: Request, total?: number): QueryFindOptions {
  const findOptions: QueryFindOptions = {}
  const [rangeFrom, rangeTo] = parseRange(query.range, total)
  const [sort = '', sortOrder = ''] = query.sort && JSON.parse(query.sort)
  findOptions.limit = rangeTo + 1 - rangeFrom
  findOptions.skip = rangeFrom
  if (sort && sortOrder) {
    findOptions.sort = {
      [sort]: (sortOrder as string).toLowerCase(),
    }
  }

  return findOptions
}

export function getRangeForHeader(range?: string, total?: number): string {
  const rangeArray: [number, number] = parseRange(range, total)
  return rangeArray.join('-')
}
