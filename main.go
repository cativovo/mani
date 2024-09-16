package main

import (
	"bufio"
	"embed"
	"io"
	"os"
	"strings"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
)

//go:embed all:frontend/dist
var assets embed.FS

func main() {
	file, fErr := getFile()
	if fErr != nil {
		panic(fErr)
	}

	var fileContents string
	if file != nil {
		fileContents = readContents(file)
	}

	// Create an instance of the app structure
	app := NewApp(fileContents)

	// Create application with options
	rErr := wails.Run(&options.App{
		Title:  "mani",
		Width:  1024,
		Height: 768,
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		BackgroundColour: &options.RGBA{R: 27, G: 38, B: 54, A: 1},
		OnStartup:        app.startup,
		Bind: []interface{}{
			app,
		},
	})
	if rErr != nil {
		panic(rErr)
	}
}

// fix issue with piping from curl not working
func getFile() (*os.File, error) {
	file := os.Stdin
	stat, err := file.Stat()
	if err != nil {
		return nil, err
	}

	if (stat.Mode() & os.ModeCharDevice) == 0 {
		return file, nil
	}

	if len(os.Args) > 1 {
		file, err := os.Open(os.Args[1])
		if err != nil {
			return nil, err
		}

		return file, nil
	}

	return nil, nil
}

func readContents(r io.Reader) string {
	var result strings.Builder
	scanner := bufio.NewScanner(r)
	for scanner.Scan() {
		b := scanner.Bytes()
		result.Write(b)
	}

	return result.String()
}
