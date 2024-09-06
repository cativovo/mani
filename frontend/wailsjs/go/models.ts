export namespace main {
	
	export class JQFlags {
	    compact: boolean;
	    raw: boolean;
	    slurp: boolean;
	
	    static createFrom(source: any = {}) {
	        return new JQFlags(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.compact = source["compact"];
	        this.raw = source["raw"];
	        this.slurp = source["slurp"];
	    }
	}

}

