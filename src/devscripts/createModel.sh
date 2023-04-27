#!/bin/bash

cp ../models/Example.js ../models/$1.js   


REPLACE2="Example"
CODE2=$1
sed -i "s:$REPLACE2:$CODE2:g" ../models/$1.js


code ../models/$1.js
echo "Model "$1" Created";
