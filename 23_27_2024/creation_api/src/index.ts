import express from 'express';
import routerfile from './routerFile';

const app = express();

app.use(express.json());

app.use('/api', routerfile);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
