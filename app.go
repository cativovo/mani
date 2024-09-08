package main

import (
	"context"
	"os"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// App struct
type App struct {
	ctx            context.Context
	initialContent string
}

// NewApp creates a new App application struct
func NewApp(initialContent string) *App {
	return &App{
		initialContent: initialContent,
	}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

func (a *App) Query(j string, queryString string, flags JQFlags) string {
	return RunQuery(j, queryString, flags)
}

func (a *App) GetInitialContent() string {
	return a.initialContent
}

func (a *App) DownloadJQResult(result string) error {
	path, pErr := runtime.SaveFileDialog(a.ctx, runtime.SaveDialogOptions{
		DefaultFilename: "result",
	})
	if pErr != nil {
		return pErr
	}

	file, fErr := os.Create(path)
	if fErr != nil {
		return fErr
	}
	defer file.Close()

	if _, err := file.WriteString(result); err != nil {
		return err
	}

	if err := file.Sync(); err != nil {
		return err
	}

	return nil
}
