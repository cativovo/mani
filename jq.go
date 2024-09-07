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

func RunQuery(j string, queryString string, flags JQFlags) string {
	var result strings.Builder

	query, err := gojq.Parse(queryString)
	if err != nil {
		return err.Error()
	}

	var input any
	input, err = getInput(j, flags.Slurp)
	if err != nil {
		return ""
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
			result.WriteString(formatString(reflectValue.String(), flags.Raw))
		default:
			b, err := marshalJSON(v, flags.Compact)
			if err != nil {
				return err.Error()
			}

			result.Write(b)
		}

		result.WriteString("\n")
	}

	return strings.TrimSpace(result.String())
}

func marshalJSON(data any, compact bool) ([]byte, error) {
	if compact {
		return json.Marshal(data)
	}

	indent := strings.Repeat(" ", 2)
	return json.MarshalIndent(data, "", indent)
}

func formatString(str string, raw bool) string {
	if raw {
		return str
	}
	return fmt.Sprintf(`"%s"`, str)
}

func getInput(j string, slurp bool) (any, error) {
	if slurp {
		var slurpedInput []any
		dec := json.NewDecoder(strings.NewReader(j))

		for {
			var v any
			if err := dec.Decode(&v); err == io.EOF {
				break
			} else if err != nil {
				return nil, err
			}

			slurpedInput = append(slurpedInput, v)
		}

		return slurpedInput, nil
	}

	var input any
	if err := json.Unmarshal([]byte(j), &input); err != nil {
		return nil, err
	}

	return input, nil
}
