package main

import (
	"encoding/json"
	"strings"

	"github.com/itchyny/gojq"
)

type JQFlags struct {
	Compact bool `json:"compact"`
}

func unmarshalJSON(data any, compact bool) ([]byte, error) {
	if compact {
		return json.Marshal(data)
	}

	indent := strings.Repeat(" ", 2)
	return json.MarshalIndent(data, "", indent)
}

func RunQuery(j string, queryString string, flags JQFlags) string {
	var result strings.Builder

	var input any
	if err := json.Unmarshal([]byte(j), &input); err != nil {
		return err.Error()
	}

	query, err := gojq.Parse(queryString)
	if err != nil {
		return err.Error()
	}

	iter := query.Run(input)

	for {
		v, ok := iter.Next()
		if !ok {
			break
		}

		if err, ok := v.(error); ok && err != nil {
			return err.Error()
		}

		b, err := unmarshalJSON(v, flags.Compact)
		if err != nil {
			return err.Error()
		}

		result.Write(b)
	}

	return result.String()
}
