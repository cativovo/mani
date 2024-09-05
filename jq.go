package main

import (
	"encoding/json"
	"strings"

	"github.com/itchyny/gojq"
)

func processJSON(j string, filter string) string {
	var result strings.Builder

	var input map[string]any
	if err := json.Unmarshal([]byte(j), &input); err != nil {
		result.WriteString(err.Error())
		return result.String()
	}

	query, err := gojq.Parse(filter)
	if err != nil {
		return err.Error()
	}

	iter := query.Run(input)

	for {
		v, ok := iter.Next()
		if !ok {
			break
		}
		if err, ok := v.(error); ok {
			if err != nil {
				result.Reset()
				result.WriteString(err.Error())
				break
			}
		}
		b, err := json.Marshal(v)
		if err != nil {
			result.Reset()
			result.WriteString(err.Error())
			break
		}

		result.Write(b)
	}

	return result.String()
}
