import { Host } from './model/symbol.js';

export class SymbolSolver {
	constructor() {
		this.sdmHost = new Host;
		this.sdmHost.init();
	}
}