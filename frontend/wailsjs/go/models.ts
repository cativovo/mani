export namespace main {
	
	export class JQFlags {
	    compact: boolean;
	
	    static createFrom(source: any = {}) {
	        return new JQFlags(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.compact = source["compact"];
	    }
	}

}

