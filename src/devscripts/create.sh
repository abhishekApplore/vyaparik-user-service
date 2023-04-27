#!/bin/bash

mv ../../demo-backend ../../$1-backend
mv ../../demo-frontend ../../$1-frontend
mv ../../../demo-project ../../../$1-project


REPLACE1="demo"
WITH1=$1;
sed -i "s:$REPLACE1:$WITH1:g" ../package.json

REPLACE2="demo"
WITH2=$1;
sed -i "s:$REPLACE2:$WITH2:g" ../.env