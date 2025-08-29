import express, { Application, Request, Response } from 'express';
import bookRoutes from './app/controllers/bookController';
import borrowRouter from './app/controllers/borrowController';


const app: Application = express();

app.use(express.json());

app.use("/books", bookRoutes);
app.use("/borrow", borrowRouter);
// app.use("/notFound", notFoundRoutes);
// app.use("/error", errorHandlerRoutes);

app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to the Library LMS');
});

export default app;
