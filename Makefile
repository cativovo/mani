test:
	go test -v ./...

update-snaps:
	UPDATE_SNAPS=true go test ./...
