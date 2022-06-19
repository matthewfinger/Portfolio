#!/bin/bash

basedir=/home/matthewfinger/website/Portfolio
currenttime=`date "+%s"`
permissionfix="chmod -R ugo+rwx $basedir"

cp -R -f $basedir/backend /home/matthewfinger/website/backend-backup

if [ ! -d /home/matthewfinger/website/dbbackups ]
    then
        mkdir /home/matthewfinger/website/dbbackups
fi
if [ ! -d /home/matthewfinger/website/dbbackups/$currenttime ]
    then
        mkdir /home/matthewfinger/website/dbbackups/$currenttime
fi
cp -f $basedir/backend/db.sqlite3 /home/matthewfinger/website/dbbackups/$currenttime/

cd $basedir
git pull origin main

cd $basedir/frontend
$permissionfix
su - matthewfinger -c "cd $basedir/frontend; npm update"
npm run build
$permissionfix

cd $basedir
su - matthewfinger -c "cd $basedir;pipenv run python $basedir/backend/manage.py makemigrations"
su - matthewfinger  -c "cd $basedir;pipenv run python $basedir/backend/manage.py migrate"

apache2ctl restart

#lastly push since we might have migrations chagnes
cd $basedir
$permissionfix

su - matthewfinger -c "cd $basedir && git add ."
su - matthewfinger -c "cd $basedir && git commit -m\"Built on cloud\""
su - matthewfinger -c "cd $basedir && git push origin main"
