import { Data, Datum } from '../types/data';

export interface LegacyDatum extends Omit<Datum, 'rels'> {
	rels: {
		parent1?: string;
		parent2?: string;
		spouses?: string[];
		children?: string[];

		parents?: string[];
	};
}

export function formatData(data: any) {
	data.forEach((d: LegacyDatum) => {
		if (!d.rels.parents) d.rels.parents = [];
		if (!d.rels.spouses) d.rels.spouses = [];
		if (!d.rels.children) d.rels.children = [];

		convertFatherMotherToParents(d);
	});
	return data as Data;

	function convertFatherMotherToParents(d: LegacyDatum) {
		if (!d.rels.parents) d.rels.parents = [];
		if (d.rels.parent1) d.rels.parents.push(d.rels.parent1);
		if (d.rels.parent2) d.rels.parents.push(d.rels.parent2);
		delete d.rels.parent1;
		delete d.rels.parent2;
	}
}

export function formatDataForExport(
	data: LegacyDatum[],
	legacy_format: boolean = false,
) {
	data.forEach((d) => {
		if (legacy_format) {
			let parent1: Datum['id'] | undefined;
			let parent2: Datum['id'] | undefined;
			d.rels.parents?.forEach((p) => {
				const parent = data.find((d) => d.id === p);
				if (!parent) throw new Error('Parent not found');
				if (parent.data.gender === 'M') {
					if (!parent1) parent1 = parent.id;
					else parent2 = parent.id; // for same sex parents, we set some parent to father and some to mother
				}
				if (parent.data.gender === 'F') {
					if (!parent2) parent2 = parent.id;
					else parent1 = parent.id; // for same sex parents, we set some parent to father and some to mother
				}
			});
			if (parent1) d.rels.parent1 = parent1;
			if (parent2) d.rels.parent2 = parent2;

			delete d.rels.parents;
		}
		if (d.rels.parents && d.rels.parents.length === 0)
			delete d.rels.parents;
		if (d.rels.spouses && d.rels.spouses.length === 0)
			delete d.rels.spouses;
		if (d.rels.children && d.rels.children.length === 0)
			delete d.rels.children;
	});
	return data;
}
