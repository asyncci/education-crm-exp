import express, { Express, Request, Response } from 'express'
import morgan from 'morgan'
import cors from 'cors'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import { config } from './config'
import { publicRoutes } from './src/publicRoutes'
import { privateRoutes } from './src/privateRoutes'
import { serve, setup } from 'swagger-ui-express'
import validator from 'swagger-express-validator'

const swaggerDoc = require('./swagger.json')

const app: Express = express()

app.use(morgan('dev'))
app.use(cors())

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use('/docs', serve, setup(swaggerDoc))
app.use(validator({ schema: swaggerDoc }));

// Bun.env.MONGODB = 'mongodb://localhost:27017/';

if (!Bun.env.MONGODB) {
    throw new Error('Provide the "MONGODB" env variable (link to database server)')
}

await mongoose.connect(Bun.env.MONGODB)
    .then(() => console.log('Successfuly connected to MongoDB'))
    .catch((err) => {
        throw new Error(`Can't connect to database: ${err}`)
    });

app.use('', publicRoutes)
app.use('', privateRoutes)

app.listen(config.port, () => {
    console.log(`Running on ${config.port}`)
})
