package main

import (
	"context"
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
