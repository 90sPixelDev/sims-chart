export interface Datum {
	id: string;
	data: {
		gender: 'M' | 'F' | 'U';
		[key: string]: any;
	};
	rels: {
		parents: string[];
		spouses: string[];
		exSpouses: string[];
		lovers: string[];
		exLovers: string[];
		children: string[];
	};
	[key: string]: any;
}

export type Data = Datum[];
