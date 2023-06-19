import fastify from 'fastify'
import {PrismaClient} from '@prisma/client'
import cors from '@fastify/cors'

const prisma = new PrismaClient()
const app = fastify()

app.register(cors)

app.get("/tasks/all", async function (request, response){
   const tasks = await prisma.task
                             .findMany()
   response.send(tasks)
})

app.get("/tasks/completed", async function (request, response){
   const tasks = await prisma.task
                             .findMany({where: {completed:true}})
   response.send(tasks)
})
app.get("/tasks/pending", async function (request, response){
   const tasks = await prisma.task
                             .findMany({where: {completed:false}})
   response.send(tasks)
})

app.post("/tasks", async function (request, response){
   const body = request.body
   const name = body.name

   const newTask = await prisma.task.create({
      data: {
         name
      }
   })
   response.status(201).send(newTask)
})


app.delete("/tasks/:id", async function(request, response){
   const params = request.params
   const id = parseInt(params.id)

   await prisma.task.delete({where: {id:id}})

   return response.status(204).send()
})

app.patch("/tasks/:id/:completed", async function(request, response){
   const params = request.params
   const id = parseInt(params.id)
   const completed = !(params.completed === "true")

   const updatetask = await prisma.task
                              .update({where: {id:id},data:{completed:completed}})

   return response.status(202).send(updatetask)
})


app.listen({port:3333})
   .then(() => console.log('Servidor rodando 🔥🔥🔥'))
   .catch(() => console.log('Erro ao tentar subir o servidor 😡😡😡'))