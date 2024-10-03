import express, { Response, Request } from 'express';
import { Repo } from './repo.entities';
import { AppDataSource } from '../db/data-source';
import { Lang } from '../langs/lang.entities';
import { In } from 'typeorm';
import { Status } from '../status/status.entities';

const repoControllers = express.Router();

repoControllers.get('/', async (req: Request, res: Response) => {
	const { lang } = req.query;

	let query = AppDataSource.getRepository(Repo).createQueryBuilder('repo');

	if (lang) {
		console.log(`Filtrage par langage : ${lang}`);
		query = query.where('langs.label = :lang', { lang });
	} else {
		console.log('Aucun filtre de langage appliqué');
	}

	try {
		const repoRepository = AppDataSource.getRepository(Repo);
		const repos = await repoRepository.find({
			relations: ['status', 'langs'],
		});
		res.json(repos);
	} catch (error) {
		console.error('Erreur lors de la récupération des repos :', error);
		res
			.status(500)
			.json({ message: 'Erreur lors de la récupération des données.' });
	}
});

repoControllers.get('/:id', async (req: Request, res: Response) => {
	try {
		const repoRepository = AppDataSource.getRepository(Repo);
		const repo = await repoRepository.findOne({
			where: { id: req.params.id },
			relations: ['status'],
		});

		if (!repo) {
			return res.status(404).json({ message: 'Repo non trouvé' });
		}

		res.json(repo);
	} catch (error) {
		console.error('Erreur lors de la récupération du repo :', error);
		res
			.status(500)
			.json({ message: 'Erreur lors de la récupération du repo.' });
	}
});

repoControllers.post('/', async (req: Request, res: Response) => {
	try {
		const { name, url, statusId, langIds } = req.body;

		if (!name || !url || !statusId || !Array.isArray(langIds)) {
			return res
				.status(400)
				.json({ message: 'Des informations sont manquantes ou incorrectes.' });
		}

		const repo = new Repo();
		repo.name = name;
		repo.url = url;

		const status = await Status.findOneBy({ id: statusId });
		if (!status) {
			return res.status(400).json({ message: 'Statut invalide.' });
		}
		repo.status = status;

		const langs = await Lang.find({
			where: { id: In(langIds) },
		});

		if (!langs || langs.length === 0) {
			return res
				.status(400)
				.json({ message: 'Langues invalides ou non trouvées.' });
		}

		repo.langs = langs;

		await repo.save();

		res.status(201).json(repo);
	} catch (error) {
		console.error('Erreur lors de la création du repo :', error);
		res.status(500).json({ message: 'Erreur lors de la création du repo.' });
	}
});

repoControllers.put('/:id', async (req: Request, res: Response) => {
	try {
		const { name, url, statusId, langIds } = req.body;

		const repoRepository = AppDataSource.getRepository(Repo);
		const repo = await repoRepository.findOne({
			where: { id: req.params.id },
			relations: ['status', 'langs'],
		});

		if (!repo) {
			return res.status(404).json({ message: 'Repo non trouvé' });
		}

		console.log('Repo avant modification:', repo);

		repo.name = name || repo.name;
		repo.url = url || repo.url;

		if (statusId) {
			console.log('StatusID envoyé:', statusId);
			const status = await Status.findOneBy({ id: statusId });
			if (!status) {
				return res.status(400).json({ message: 'Statut invalide.' });
			}
			repo.status = status;
			console.log('Nouveau statut:', status);
		}

		if (Array.isArray(langIds) && langIds.length > 0) {
			console.log('Langues envoyées:', langIds);
			const langs = await Lang.find({
				where: { id: In(langIds) },
			});
			if (!langs || langs.length === 0) {
				return res
					.status(400)
					.json({ message: 'Langues invalides ou non trouvées.' });
			}
			repo.langs = langs;
			console.log('Nouvelles langues:', langs);
		}

		const updatedRepo = await repoRepository.save(repo);
		console.log('Repo après modification:', updatedRepo);
		res.json(updatedRepo);
	} catch (error) {
		console.error('Erreur lors de la mise à jour du repo :', error);
		res.status(500).json({ message: 'Erreur lors de la mise à jour du repo.' });
	}
});

repoControllers.delete('/:id', async (req: Request, res: Response) => {
	try {
		const repoRepository = AppDataSource.getRepository(Repo);
		const repo = await repoRepository.findOneBy({
			id: req.params.id,
		});

		if (!repo) {
			return res.status(404).json({ message: 'Repo non trouvé' });
		}

		await repoRepository.remove(repo);
		res.status(204).json({ message: 'Repo supprimé avec succès' });
	} catch (error) {
		console.error('Erreur lors de la suppression du repo :', error);
		res.status(500).json({ message: 'Erreur lors de la suppression du repo.' });
	}
});

export default repoControllers;
