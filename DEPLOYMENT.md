## Deployment Overview
### Overview
1. A push to the repository triggers a build in TravisCI.
2. Tests run. If any tests fail, exit the build without deploying.
3. If the build meets the deployment conditions in `travis.yml` (for example, the branch name is `master`), start deployment. If not, exit the build.
4. TravisCI calls a deployment script, passing the appropriate stage (such as "dev" or "prod"). The stage depends on what branch triggered the build; for instance, a push to `master` will deploy to the "prod" stage.
5. The deployment script starts by assigning stage-specific environment variables to their root names.
    * For example, in a deployment to the "dev" stage, we assign the value of the environment variable `DEV_DYNAMODB_ENDPOINT` to an environment variable `DYNAMODB_ENDPOINT`.
    * We do this because TravisCI doesn't currently have a concept of stage-specific environment variables, but we want to use Travis for multiple stage deployments.
    * Environment variable values live in `travis.yml` and are assigned by `scripts/assign-env-vars.js`.
6. The deployment script sets the `SLS_STAGE` env var to the stage name used in Serverless deploy (such as "dev" or prod").
7. The deployment script calls each service's `deploy` NPM script.
    * Services using Serverless deploy with the `stage` set to the value of `$SLS_STAGE`. This is configured in the service's `serverless.yml`.
    
### Environment Variable Management
There are a few places env vars are set:
1. In `travis.yml` (for deployment)
2. In `.env` and `.env.local` files (for development; via [dotenv](https://www.npmjs.com/package/dotenv-extended))
3. At the beginning of NPM scripts

#### Best Practices
* Any env vars that are necessary for production should go in `travis.yml`. Do not rely on `.env` files for deployment.
* If you add an env var to `travis.yml`, add it to the list of env vars in `scripts/assign-env-vars.js`. This script sanity checks that all required env vars are defined and also manages stage-specific env vars during CI.
* Avoid assigning env vars in NPM scripts.
* `.env.local` should not be in source control. These files are specific to the developer.
* Any variables in `.env.local` should have defaults in `.env`. Otherwise, new env vars will break other developers' local apps.
