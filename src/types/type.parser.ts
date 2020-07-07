import { IdType, Type } from './type.interface'
import SessionModel from '../sessions/session.model'

export async function getTypes(): Promise<IdType[]> {
  try {
    const sessions = await SessionModel.find().lean()
    const allTypes = sessions.map(session => ({
      ...session.type,
      id: getTypeId(session.type.name),
    }))

    return Array.from(new Set(allTypes.map(type => type.id))).reduce((all: IdType[], id) => {
      const type = allTypes.find(type => type.id === id && !!type.color)
      if (type) {
        all.push(type)
      }
      return all
    }, [])
  } catch (e) {
    console.error(e)
    return []
  }
}

export async function getTypesColorMap(): Promise<Record<string, string>> {
  const types = await getTypes()
  return types.reduce((acc: Record<string, string>, currentType) => {
    acc[currentType.id] = currentType.color
    return acc
  }, {})
}

export function getTypeId(typeName: Type['name']): IdType['id'] {
  return typeName.toLowerCase().replace(/ /g, '')
}

export function getRandomColor(): Type['color'] {
  return '#' + Math.floor(Math.random() * 16777215).toString(16)
}

export async function getTypeColor(typeName: Type['name']): Promise<Type['color']> {
  const colorsMap = await getTypesColorMap()
  return colorsMap[getTypeId(typeName)] || getRandomColor()
}
