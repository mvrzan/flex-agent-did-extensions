# Agent DID Extensions Plugin

Twilio Flex Plugins allow you to customize the appearance and behavior of [Twilio Flex](https://www.twilio.com/flex). If you want to learn more about the capabilities and how to use the API, check out our [Flex documentation](https://www.twilio.com/docs/flex).

## How it works

The _Agent DID Extensions Plugin_ allows customers to call a Flex agent directly with the help of an extension. It also enables supervisors to create, read, update, and delete agent extensions assigned to agents directly in the Flex UI.

<img width="700px" src="./screenshots/agent-did-extensions-flexui.png"/>

TODO: Features and functionality

#### Example of Sync Map JSON structure

```
{
    "workerFullName":"John Doe",
    "extensionNumber":"7777",
    "workerSid":"WKxxxxxxxxxxxxxxxxxxxx"
}
```

## Architectural diagram

The below architectural diagram is a representation of involved Twilio services when a customer makes a call and enters agent's extension:

<img width="700px" src="./screenshots/Agent-DID-Extensions.png"/>

## TaskRouter Workflow setup

Before using this plugin you must first create a dedicated TaskRouter workflow or just add the following filter to your current workflow. Make sure it is part of your Flex Task Assignment workspace.

- set the "Known router" to Worker SID
- ensure the following matching worker expression: task.workerSID
- set up fallback options as you see fit

<img width="700px" src="./screenshots/task-router.png"/>

## StudioFlow setup

There's a lot of flexibility how the StudioFlow can be configured, but the following steps should be included:

- gather input digits entered by the caller
- pass the input digits to a serverless function
  <img width="700px" src="./screenshots/capture-input.png"/>
- pass the `workerSID` to Flex
  <img width="700px" src="./screenshots/pass-to-flex.png"/>

## Things to think about

#### Default Sync service

This plugin is using the Sync [JavaScript SDK](https://media.twiliocdn.com/sdk/js/sync/releases/3.0.1/docs/index.html) which is using the default Sync service. In order to use a different Sync service, custom functions are recommended.

#### Supported Flex version

This plugin only supports Twilio Flex v1.x. For Twilio Flex v2.x a rewrite of the UI is needed.

## ToDo List

#### Convert to functional components

This version of the plugin is built using React class-based components. In order to follow more modern React development practices, this plugin should be converted to functional components.

#### Implement pagination

Right now, all of the Sync map items are listed on the single page which makes for a poor user experience.

#### Extension validation

Agent extensions should have 1:1 mapping between agents. At the moment, the plugin does not have validation to prevent the user from entering duplicate records into the Sync Map item.

#### Sorting

Implement sorting of the existing records in the UI.

#### Automatically query agent info and map worker SIDs

At the moment, the supervisor would have to manually update every field in the UI that is mapped to the Sync Map JSON. Next step for this plugin is to use Live Query to pull agent info and to programmatically pass worker SID information to Sync Map.

## Development

Run `twilio flex:plugins --help` to see all the commands we currently support. For further details on Flex Plugins refer to our documentation on the [Twilio Docs](https://www.twilio.com/docs/flex/developer/plugins/cli) page.

# Configuration

## Requirements

To deploy this plugin, you will need:

- An active Twilio account with Flex provisioned. Refer to the [Flex Quickstart](https://www.twilio.com/docs/flex/quickstart/flex-basics#sign-up-for-or-sign-in-to-twilio-and-create-a-new-flex-project%22) to create one.
- npm version 5.0.0 or later installed (type `npm -v` in your terminal to check)
- Node.js version 12 or later installed (type `node -v` in your terminal to check). _Even_ versions of Node are. **Note:** In order to install Twilio Flex CLI plugin that is needed for locally running Flex, Node version 16 is the latest supported version (if you are using Node 18., please revert back or use Node Version Manager).
- [Twilio CLI](https://www.twilio.com/docs/twilio-cli/quickstart#install-twilio-cli) along with the [Flex CLI Plugin](https://www.twilio.com/docs/twilio-cli/plugins#available-plugins) and the [Serverless Plugin](https://www.twilio.com/docs/twilio-cli/plugins#available-plugins). Run the following commands to install them:

```
# Install the Twilio CLI
npm install twilio-cli -g
# Install the Serverless and Flex as Plugins
twilio plugins:install @twilio-labs/plugin-serverless
twilio plugins:install @twilio-labs/plugin-flex
```

- Once the Twilio CLI and Twilio Flex CLI plugins are successfully installed, configure your [Twilio CLI profile](https://www.twilio.com/docs/twilio-cli/general-usage). **Note:** This step is required if you are running Twilio CLI for the first time or if you have multiple Twilio CLI profiles configured.

## Setup

Install the dependencies by running `npm install`:

```bash
cd agent-did-extensions
npm install
cd ../agent-did-extensions
npm install
```

From the root directory, rename `public/appConfig.example.js` to `public/appConfig.js`.

```bash
mv public/appConfig.example.js public/appConfig.js
```

## Serverless Functions

### Deployment

Create the Serverless config file by copying `.env.example` to `.env`.

```bash
cd serverless
cp .env.example .env
```

Edit `.env` and set these variables with the Sids from your account.

```bash
# The following values are example references only
FLEX_SYNC_SERVICE_SID=ISxxxxxxxxxxxxxxxxxxxx
FLEX_SYNC_MAP_SID=MPxxxxxxxxxxxxxxxxxxxx
```

Next, deploy the Serverless functions:

```bash
cd serverless
twilio serverless:deploy

```

After successfully deploying your function, you should see at least the following:

```bash
✔ Serverless project successfully deployed


Deployment Details
Domain: xxx-xxx-xxxx-dev.twil.io

Functions:
   https://xxx-xxx-xxxx-dev.twil.io/agentExtensions
(more)
```

Your functions will now be present in the Twilio Functions Console and be part of the "serverless" service. Copy the base URL from the function.

## Flex Plugin

### Development

Create the plugin config file by copying `.env.example` to `.env`.

```bash
cd agent-DID-extensions/plugin
cp .env.example .env
```

Edit `.env` and set the `FLEX_APP_FUNCTIONS_BASE` variable to your Twilio Functions base URL (like https://xxx-serverless-xxxx-dev.twil.io/).

To run the plugin locally, you can use the Twilio Flex CLI plugin. Using your command line, run the following from the root directory of the plugin.

```bash
cd agent-DID-extensions/plugin
twilio flex:plugins:start
```

This will automatically start up the webpack dev server and open the browser for you. Your app will run on `http://localhost:3000`.

When you make changes to your code, the browser window will be automatically refreshed.

### Deploy your Flex Plugin

Once you are happy with your Flex plugin, you have to deploy then release it on your Flex application.

Run the following command to start the deployment:

```bash
twilio flex:plugins:deploy --major --changelog "Releasing Agent DID Extensions plugin" --description "Agent DID Extensions"
```

After running the suggested next step, navigate to the [Plugins Dashboard](https://flex.twilio.com/admin/) to review your recently deployed plugin and confirm that it’s enabled for your contact center.

**Note:** Common packages like `React`, `ReactDOM`, `Redux` and `ReactRedux` are not bundled with the build because they are treated as external dependencies so the plugin will depend on Flex to provide them globally.

You are all set to test this plugin on your Flex application!

## Deployment to QA, Staging and Production environments

### CLI Profiles

Create Twilio CLI Profiles for each environment using

`twilio profiles:create`

This command will prompt your for the Account Sid, Auth Token and and a name/label for the profile. We recommend that the Profile Name matches the Twilio Account name to avoid confusion

To switch between profiles:

`twilio profiles:use "ProfileName"`

To check the configured profiles:

`twilio profiles:list`

### Serverless

Follow the steps in this [guide](https://www.twilio.com/docs/labs/serverless-toolkit/deploying) to deploy Serverless functions to multiple accounts/environment.

Using `.env.example` create `.env.stage` and `.env.prod` files and update each with the correct resource Sids from the respective account.
Note: Make sure your .gitignore contains the names of these files so they will be excluded from any commit to your repo.

After switching the CLI to use a different profile (i.e. Account Sid), you can use these commands to deploy the serverless functions with the correct set of environment variables.

`twilio serverless:deploy --env .env.stage --environment=staging`

`twilio serverless:deploy --env .env.prod --environment=production`

### Plugin

Follow the steps in this [guide](https://www.twilio.com/docs/flex/developer/plugins/environment-variables) to configure your plugin for deployment to multiple environments.

Using `.env.example` create `.env.stage` and `.env.prod` files and update each with the correct resource Sids from the respective account.
Note: Make sure your .gitignore contains the names of these files so they will be excluded from any commit to your repo.

To deploy your plugin to specific accounts/environments use these commands:

`twilio flex:plugins:deploy --profile:StageProfileName`

`twilio flex:plugins:deploy --profile:ProdProfileName`

## License

[MIT](http://www.opensource.org/licenses/mit-license.html)

## Disclaimer

No warranty expressed or implied. Software is as is.
