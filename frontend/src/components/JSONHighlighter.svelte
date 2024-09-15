<script lang="ts">
	import hljs from "highlight.js/lib/core";
	import _json from "highlight.js/lib/languages/json";
	import "highlight.js/styles/vs.min.css";
	hljs.registerLanguage("json", _json);

	export let json: string = "";
</script>

<pre class="p-2">
<code>
{@html hljs.highlight(json, { language: "json" }).value}
</code>
</pre>
