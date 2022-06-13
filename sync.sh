#!/bin/bash

basedir=/home/matthewfinger/website/Portfolio

cd $basedir
git pull origin main

cd $basedir/frontend
npm run build

cd $basedir
su - matthewfinger -c "cd $basedir;pipenv run python $basedir/backend/manage.py makemigrations"
su - matthewfinger  -c "cd $basedir;pipenv run python $basedir/backend/manage.py migrate"

apache2ctl restart
