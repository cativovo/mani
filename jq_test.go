package main

import (
	"fmt"
	"os"
	"testing"

	"github.com/gkampitakis/go-snaps/snaps"
)

func TestRunQuery(t *testing.T) {
	bulbasaur := getJSON(t, "bulbasaur.json")
	gen1Starters := getJSON(t, "gen1-starters.json")

	testCases := []struct {
		name   string
		json   string
		filter string
		flags  JQFlags
	}{
		{
			name:   "valid filter",
			json:   bulbasaur,
			filter: ".name",
		},
		{
			name:   "invalid filter",
			json:   bulbasaur,
			filter: "jkjkjkjkjkjk",
		},
		{
			name:   "indent array input",
			json:   gen1Starters,
			filter: ".",
		},
		{
			name:   "indent key value input",
			json:   bulbasaur,
			filter: ".",
		},
		{
			name:   "unpack array",
			json:   gen1Starters,
			filter: ".[]",
		},
		{
			name:   "compact array input",
			json:   gen1Starters,
			filter: ".",
			flags: JQFlags{
				Compact: true,
			},
		},
		{
			name:   "compact key value input",
			json:   bulbasaur,
			filter: ".",
			flags: JQFlags{
				Compact: true,
			},
		},
		{
			name:   "compact unpack array",
			json:   gen1Starters,
			filter: ".[]",
			flags: JQFlags{
				Compact: true,
			},
		},
		{
			name:   "cooked",
			json:   gen1Starters,
			filter: ".[].name",
			flags: JQFlags{
				Raw: false,
			},
		},
		{
			name:   "it's fucking raw",
			json:   gen1Starters,
			filter: ".[].name",
			flags: JQFlags{
				Raw: true,
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

func getJSON(t *testing.T, filename string) string {
	t.Helper()
	data, err := os.ReadFile(fmt.Sprintf("testdata/%s", filename))
	if err != nil {
		t.Fatal(err)
	}

	return string(data)
}
