package main

import "testing"

func TestProcessJSON(t *testing.T) {
	input := `{"id":1,"name":"Bulbasaur","type":["Grass","Poison"],"abilities":[{"name":"Overgrow","description":"Powers up Grass-type moves when the Pokémon's HP is low."},{"name":"Chlorophyll","description":"Boosts the Pokémon's Speed stat in sunny weather.","hidden":true}],"stats":{"hp":45,"attack":49,"defense":49,"special_attack":65,"special_defense":65,"speed":45},"evolution":{"level":16,"evolves_to":{"id":2,"name":"Ivysaur"}},"moves":[{"name":"Tackle","type":"Normal","power":40,"accuracy":100,"pp":35},{"name":"Vine Whip","type":"Grass","power":45,"accuracy":100,"pp":25},{"name":"Leech Seed","type":"Grass","power":null,"accuracy":90,"pp":10},{"name":"Growl","type":"Normal","power":null,"accuracy":100,"pp":40}],"description":"Bulbasaur can be seen napping in bright sunlight. There is a seed on its back. By soaking up the sun's rays, the seed grows progressively larger."}`

	testCases := []struct {
		name   string
		filter string
		want   string
	}{
		{
			name:   "valid filter",
			filter: ".name",
			want:   `"Bulbasaur"`,
		},
		{
			name:   "invalid filter",
			filter: "jkjkjkjkjkjk",
			want:   "function not defined: jkjkjkjkjkjk/0",
		},
	}

	for _, testCase := range testCases {
		got := processJSON(input, testCase.filter)
		if got != testCase.want {
			t.Errorf("got %q, want %q", got, testCase.want)
		}
	}
}
