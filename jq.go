package main

import (
	"encoding/json"
	"fmt"
	"io"
	"reflect"
	"strings"

	"github.com/itchyny/gojq"
)

type JQFlags struct {
	Compact bool `json:"compact"`
	Raw     bool `json:"raw"`
	Slurp   bool `json:"slurp"`
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

	query, err := gojq.Parse(queryString)
	if err != nil {
		return err.Error()
	}

	var input any

	if flags.Slurp {
		var slurped []any
		dec := json.NewDecoder(strings.NewReader(j))

		for {
			var v any
			if err := dec.Decode(&v); err == io.EOF {
				break
			} else if err != nil {
				return err.Error()
			}

			slurped = append(slurped, v)
		}

		input = slurped
	} else {
		if err := json.Unmarshal([]byte(j), &input); err != nil {
			return err.Error()
		}
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

		reflectValue := reflect.ValueOf(v)

		switch reflectValue.Kind() {
		case reflect.String:
			if flags.Raw {
				result.WriteString(reflectValue.String())
			} else {
				result.WriteString(fmt.Sprintf(`"%s"`, reflectValue.String()))
			}
		default:
			b, err := unmarshalJSON(v, flags.Compact)
			if err != nil {
				return err.Error()
			}

			result.Write(b)
		}

		result.WriteString("\n")
	}

	return strings.TrimSpace(result.String())
}
