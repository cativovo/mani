package main

import (
	"testing"

	"github.com/gkampitakis/go-snaps/snaps"
)

func TestRunQuery(t *testing.T) {
	keyValueInput := `{"id":1,"name":"Bulbasaur","type":["Grass","Poison"],"abilities":[{"name":"Overgrow","description":"Powers up Grass-type moves when the Pokémon's HP is low."},{"name":"Chlorophyll","description":"Boosts the Pokémon's Speed stat in sunny weather.","hidden":true}],"stats":{"hp":45,"attack":49,"defense":49,"special_attack":65,"special_defense":65,"speed":45},"evolution":{"level":16,"evolves_to":{"id":2,"name":"Ivysaur"}},"moves":[{"name":"Tackle","type":"Normal","power":40,"accuracy":100,"pp":35},{"name":"Vine Whip","type":"Grass","power":45,"accuracy":100,"pp":25},{"name":"Leech Seed","type":"Grass","power":null,"accuracy":90,"pp":10},{"name":"Growl","type":"Normal","power":null,"accuracy":100,"pp":40}],"description":"Bulbasaur can be seen napping in bright sunlight. There is a seed on its back. By soaking up the sun's rays, the seed grows progressively larger."}`
	arrayInput := `[{"name":"bulbasaur","url":"https://pokeapi.co/api/v2/pokemon/1/"},{"name":"ivysaur","url":"https://pokeapi.co/api/v2/pokemon/2/"},{"name":"venusaur","url":"https://pokeapi.co/api/v2/pokemon/3/"},{"name":"charmander","url":"https://pokeapi.co/api/v2/pokemon/4/"},{"name":"charmeleon","url":"https://pokeapi.co/api/v2/pokemon/5/"},{"name":"charizard","url":"https://pokeapi.co/api/v2/pokemon/6/"},{"name":"squirtle","url":"https://pokeapi.co/api/v2/pokemon/7/"},{"name":"wartortle","url":"https://pokeapi.co/api/v2/pokemon/8/"},{"name":"blastoise","url":"https://pokeapi.co/api/v2/pokemon/9/"}]`

	testCases := []struct {
		name   string
		json   string
		filter string
		flags  JQFlags
	}{
		{
			name:   "valid filter",
			json:   keyValueInput,
			filter: ".name",
		},
		{
			name:   "invalid filter",
			json:   keyValueInput,
			filter: "jkjkjkjkjkjk",
		},
		{
			name:   "indent array input",
			json:   arrayInput,
			filter: ".",
		},
		{
			name:   "indent key value input",
			json:   keyValueInput,
			filter: ".",
		},
		{
			name:   "unpack array",
			json:   arrayInput,
			filter: ".[]",
		},
		{
			name:   "compact array input",
			json:   arrayInput,
			filter: ".",
			flags: JQFlags{
				Compact: true,
			},
		},
		{
			name:   "compact key value input",
			json:   keyValueInput,
			filter: ".",
			flags: JQFlags{
				Compact: true,
			},
		},
		{
			name:   "compact unpack array",
			json:   arrayInput,
			filter: ".[]",
			flags: JQFlags{
				Compact: true,
			},
		},
	}

	for _, testCase := range testCases {
		t.Run(testCase.name, func(t *testing.T) {
			result := RunQuery(testCase.json, testCase.filter, testCase.flags)
			snaps.MatchSnapshot(t, result)
		})
	}
}
