package main

import (
	"encoding/json"
	"fmt"
	"os"
	"testing"

	"github.com/gkampitakis/go-snaps/snaps"
)

func TestRunQuery(t *testing.T) {
	bulbasaur := getJSON(t, "bulbasaur.json")
	charmander := getJSON(t, "charmander.json")
	squirtle := getJSON(t, "squirtle.json")
	gen1Starters := getJSON(t, "gen1-starters.json")

	testCases := []struct {
		name         string
		json         string
		filter       string
		flags        JQFlags
		validateJSON bool
	}{
		{
			name:         "valid filter",
			json:         bulbasaur,
			filter:       ".name",
			validateJSON: true,
		},
		{
			name:         "invalid filter",
			json:         bulbasaur,
			filter:       "jkjkjkjkjkjk",
			validateJSON: false,
		},
		{
			name:         "indent array input",
			json:         gen1Starters,
			filter:       ".",
			validateJSON: true,
		},
		{
			name:         "indent key value input",
			json:         bulbasaur,
			filter:       ".",
			validateJSON: true,
		},
		{
			name:         "unpack array",
			json:         gen1Starters,
			filter:       ".[]",
			validateJSON: false,
		},
		{
			name:   "compact array input",
			json:   gen1Starters,
			filter: ".",
			flags: JQFlags{
				Compact: true,
			},
			validateJSON: true,
		},
		{
			name:   "compact key value input",
			json:   bulbasaur,
			filter: ".",
			flags: JQFlags{
				Compact: true,
			},
			validateJSON: true,
		},
		{
			name:   "compact unpack array",
			json:   gen1Starters,
			filter: ".[]",
			flags: JQFlags{
				Compact: true,
			},
			validateJSON: false,
		},
		{
			name:   "cooked",
			json:   gen1Starters,
			filter: ".[].name",
			flags: JQFlags{
				Raw: false,
			},
			validateJSON: false,
		},
		{
			name:   "it's fucking raw",
			json:   gen1Starters,
			filter: ".[].name",
			flags: JQFlags{
				Raw: true,
			},
			validateJSON: false,
		},
		{
			name:   "slurp",
			json:   bulbasaur + charmander + squirtle,
			filter: ".",
			flags: JQFlags{
				Slurp: true,
			},
			validateJSON: true,
		},
		{
			name:   "compact and slurp",
			json:   bulbasaur + charmander + squirtle,
			filter: ".",
			flags: JQFlags{
				Compact: true,
				Slurp:   true,
			},
			validateJSON: true,
		},
		{
			name:   "raw and slurp",
			json:   bulbasaur + charmander + squirtle,
			filter: ".[].name",
			flags: JQFlags{
				Raw:   true,
				Slurp: true,
			},
			validateJSON: false,
		},
		{
			name:   "invalid json",
			json:   `{"yot":}`,
			filter: ".",
		},
		{
			name: "invalid json with slurp",
			json: `{"yot":true}{"foo":}`,
			flags: JQFlags{
				Slurp: true,
			},
			filter: ".",
		},
	}

	for _, testCase := range testCases {
		t.Run(testCase.name, func(t *testing.T) {
			result := RunQuery(testCase.json, testCase.filter, testCase.flags)

			if testCase.validateJSON && !json.Valid([]byte(result)) {
				t.Error("produced an invalid json")
			}

			snaps.MatchSnapshot(t, result)
		})
	}
}

func getJSON(t *testing.T, filename string) string {
	t.Helper()
	data, err := os.ReadFile(fmt.Sprintf("testdata/%s", filename))
	if err != nil {
		t.Fatal(err)
	}

	return string(data)
}
