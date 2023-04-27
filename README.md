## vyaparik Project Structure Practices

- To add any middleware use the `initializeMiddleware` Function in Server.js
- To add any non API route use the `initializeRoutes` Function in Server.js
- To add an API route use the `index.js` inside routes directory
- Project utlizes the Model - Controller - Service Architecture.

- **Model** : (Schema Layer) Contains All Database Models for the Project.
- **Service**: (Service Layer) Contains all the business logic. These services are imported in Controller. Never pass request or response object in service directly. The Layer do not deal with HTTP operations.
- **Controller** : (HTTP Layer) The Final Middleware which puts the request to its end. Utilize functions from Service to perform operations. It handles all the HTTP operations and validation parsers and request body sanitization.
- **Validators** : (Validation Layer) Contain Validation model for API request.
- **Helpers** : Contains Utility Functions related to Server, Database or Project.
- When passing a controller to route, please wrap the function inside `AsyncHandler` middleware function defined in `helper/utils.js`. Then it will catch the errors and pass it into ErrorHandler Middleware. So no need to use unneccesary try/catch blocks in Controller.
- Use JSDocs Comments where ever required.
- Use Swagger for API Documentation.
