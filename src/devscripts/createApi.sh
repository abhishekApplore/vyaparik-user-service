#!/bin/bash

# Create new Controller
cp ../controllers/DemoController.js ../controllers/$1Controller.js
sed -i 's/Demo/'$1'/g' ../controllers/$1Controller.js

# Create new Route
cp ../routes/Demo.js ../routes/$1.js
sed -i 's/Demo/'$1'/g' ../routes/$1.js


# Add Api in Index of route
REPLACE1="//@1"
CODE1='const '${1,,}'Route = require("./'$1'");\n'$REPLACE1;
sed -i "s:$REPLACE1:$CODE1:g" ../routes/crud.js

REPLACE2="//@2"
CODE2='router.use("/'${1,,}'", '${1,,}'Route);\n'$REPLACE2;
sed -i "s:$REPLACE2:$CODE2:g" ../routes/crud.js


