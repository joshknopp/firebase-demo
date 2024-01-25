# Firebase Demo

This is intended as a reference implementation for a simple Angular + Nitric + Firebase auth app. It will contain just enough code to spin up a simple app that allows user registration and login with at least one example of a protected route and a protected function.

## Getting Started

1. Clone the repository and perform `npm install` from both `api` and `client` folders
2. If running in VS Code, go to the "Run and Debug" view (`Ctrl+Shift+D`) and run the profile called "Server/Client"

This will start the Nitric server and open its API Explorer in your browser, and will also start the Angular app and open in a separate browser.

## Firebase

We will attempt to follow instructions at https://firebase.google.com/docs/auth/web/firebaseui to get Firebase up and running in the Angular app. Next we will pivot to the API side to enable tokens to establish same session on both client and server.
