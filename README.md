# Angular-DjangoREST JWT Auth app 

A simple, full-stack single page application that implements Json Web Tokens based authentication.

Features:

- sign up
- sign in / sign out
- update user profile data
- change user password
- delete account
- list of registered users

## Demo
Frontend endpoint https://auth-app.horadrim.keenetic.link

Backend endpoint https://auth-app.horadrim.keenetic.link/api

## Install

```
docker compose -f docker-compose.dev.yml up --build
```
Now app is available on  http://localhost:4200

## Stack

Angular, DjangoREST Framework, Docker, Nginx, gunicorn