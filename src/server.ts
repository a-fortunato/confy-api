import bodyParser from 'body-parser'
import cors, { CorsOptions } from 'cors'
import express, { Application } from 'express'
import connectDB from '../config/database'
import { welcomeMessage } from './service'
import {
  addAttendees,
  addSession,
  addSpeakers,
  allSessions,
  deleteSession,
  getSession,
  updateSession,
} from './sessions/session.controller'
import {
  addPerson,
  allPeople,
  deletePerson,
  getPerson,
  updatePerson,
} from './people/person.controller'
import { allSpeakers } from './people/speaker.controller'
import { allTypes } from './types/type.controller'
import { eventInfo } from './event/event.controller'

const PORT = process.env.PORT || 3000

const app: Application = express()

connectDB()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const corsOptions: CorsOptions = {
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
}
app.use(cors(corsOptions))

app.get('/', welcomeMessage)

app.get('/sessions', allSessions)
app.post('/sessions', addSession)
app.get('/sessions/:id', getSession)
app.put('/sessions/:id', updateSession)
app.delete('/sessions/:id', deleteSession)
app.post('/sessions/:id/speaker', addSpeakers)
app.post('/sessions/:id/attendee', addAttendees)
app.get('/types', allTypes)

app.get('/people', allPeople)
app.post('/people', addPerson)
app.get('/people/:id', getPerson)
app.put('/people/:id', updatePerson)
app.delete('/people/:id', deletePerson)
app.get('/speakers', allSpeakers)

app.get('/events', eventInfo)
app.get('/events/:id', eventInfo)

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`)
})
