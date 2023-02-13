const express = require('express');
const bodyParser = require('body-parser');
const path = require('path')

const placesRoutes = require('./routes/places-routes');
const usersRoutes = require('./routes/users-routes');
const mongoRoutes = require('./routes/mongo-routes');

const doctorRoutes = require('./routes/doctor-routes');
const pacienteRoutes = require('./routes/paciente-routes');
const agendarCitaRoutes = require('./routes/agendarCita-routes');
const consultasRapidasRoutes = require('./routes/consultasRapidas-routes');
const enviarExamenesRoutes = require('./routes/enviarExamenes-routes');
const specialtyRoutes = require('./routes/specialty-routes');
const rolRoutes = require('./routes/rol-routes');
const httpError = require('./models/http-error');
require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');

const app = express();

app.use(bodyParser.json());

//to show files
app.use('/uploads/images', express.static(path.join('uploads','images')));

//to access
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Headers','Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods','GET, POST, PATCH, DELETE');
    next();
})

//Place quit
app.use('/api/places',placesRoutes);
//user Quit
app.use('/api/users',usersRoutes);
//mongoRoutes Quit
app.use('/api/mongo',mongoRoutes)

//doctor module
app.use('/api/doctor',doctorRoutes);
//paciente module
app.use('/api/paciente',pacienteRoutes);
//agendar cita module
app.use('/api/agendar-cita',agendarCitaRoutes);
//consultas rapidas module
app.use('/api/consultas-rapidas',consultasRapidasRoutes);
//enviar examenes module
app.use('/api/enviar-examenes',enviarExamenesRoutes);
//specialty module
app.use('/api/specialty',specialtyRoutes)
//rol module
app.use('/api/rol',rolRoutes)
//error 404
app.use((req,res,next)=>{
    throw new httpError('Could not find this router',404);
})
//another kind of erros
app.use((error,req,res,next)=>{
    if(req.file) {
        fs.unlink(
            req.file.path,
            err => {
                console.log(err)
            }
        )
    }
    if (res.headerSent){
        return next(error);
    }
    res.status(error.code || 500).json({message: error.message || 'sonething went wrong'})
})
//mongoose connections
mongoose
    .connect(`mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_KEY}@cluster0.rcqta.mongodb.net/${process.env.MONGODB_DBA}?retryWrites=true&w=majority`)
    .then(() => {console.log('Connections works!!!'); app.listen(process.env.PORT || 5000)})
    .catch((error) => console.log('Connections failed!',error));

