package main

import (
	"encoding/json"
	"strings"

	"github.com/itchyny/gojq"
)

func runQuery(j string, queryString string) string {
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

		b, err := json.Marshal(v)
		if err != nil {
			return err.Error()
		}

		result.Write(b)
	}

	return result.String()
}
