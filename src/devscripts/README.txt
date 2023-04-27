# Delete this devscripts folder in Production
# Scripts are used to create automatic APIs and some other work like that

- build.sh -> Use it to build before production. Just Removes devscripts folder
- create.sh -> Used to create a new node js backend project.

- createApi.sh -> Use it to create a working crud API using just mongoose model.

Example:

Pass model name as arguement. Model should be present in model folder with the name <Model>.js

        ./createApi.sh <MODEL-NAME>
    
This will create User CRUD APIs

        ./createApi.sh User 
    
- deleteApi.sh -> WOrks partially, Deletes Controller and route of the model, but have to manually remove the route reference from index.js in routes