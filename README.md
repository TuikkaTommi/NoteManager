# NoteManager - Readme will be updated soon...

NoteManager is a work in progress web app for managing notes. Frontend of this application is made purely with vanilla JavaScript and HTML + CSS. The backend consists of a ExpressJS server and a MySQL-database.

## Frontend

Will be updated soon...

## Server

The backend of this application consists of an ExpressJS server, and a MySQL-database. Currently the server provides the followind endpoints:

Notes:
- GET /notes/ - fetch all notes for a specific user. Route is authenticated with JWT, and user whose notes to retrieve is extracted from the token
- GET /notes/:id - fetch a single note with provided id
- POST /notes/ - add a new note for the current user. Authenticated route.
- PUT /notes/:id - update an existing note. Authenticated route, user can only update their own notes
- DELETE /notes/:id - delete a note with given id. Authenticated route, user can only delete their own notes

Users:
- GET /users/ - get information of all users. Only available for users with admin privileges
- GET /users/:username - get information of one user with given username. Only available for users with admin privileges
- POST /users/ - create a new user, if user with given username doesn't already exist
- DELETE /users/:username - delete an user with given username. Authenticated route, regular users can only delete their own user. Admins can delete any user

Login:
- POST /login/ - validate given credentials. Provide user with a JWT-token, if credentials are valid

Captcha: NOTE: this will most likely be refactored into a middleware in the future 
- POST /captcha/ - validate a token generated by the captcha attached to the application
