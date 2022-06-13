#!/bin/bash

basedir=/home/matthewfinger/website/Portfolio

cd $basedir
git pull origin main

cd $basedir/frontend
npm run build

cd $basedir
pipenv run python $basedir/backend/manage.py makemigrations
pipenv run python $basedir/backend/manage.py migrate

apache2ctl restart