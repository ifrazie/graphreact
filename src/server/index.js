import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compress from 'compression';
import services from './services'

const app = express();

app.use(compress());
app.use(cors());
app.use(helmet());

if(process.env.NODE_ENV === 'development') {
    app.use(helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "*.amazonaws.com"]
        }
    }));
}

app.use(helmet.referrerPolicy({ policy: 'same-origin' }));

const serviceNames = Object.keys(services);

for (let i = 0; i < serviceNames.length; i += 1) {
    const name = serviceNames[i];
    if (name === 'graphql') {
        services[name].applyMiddleware({ app });
    } else {
        app.use(`/${name}`, services[name]);
    }
}

app.get('*', (req, res) => res.send('Hello World!'));
app.listen(8000, () => console.log('Listening on port 8000!'));
