# Twelfth Monkey stats

## API
The API is a JSON REST API accessible via a GET request to https://stats-api.twelfth-monkey.com/{id} and returns an array of Strava activities of the form found in the [Strava documention for the activities](https://developers.strava.com/docs/reference/#api-Activities-getActivityById) but with the following differences:
* No location data is present, other than the "timezone" field.
* The "athlete" field (including athlete.id) is removed, and
* A "team" field is added with the team name.

An example of the JSON data returned can be found in [example.json](example.json)

## Installation

1. Clone the repository: `git clone https://github.com/AcrossTheCloud/twelfth-monkey-stats.git`
2. Navigate to the project directory: `cd twelfth-monkey-stats`
3. Install dependencies: `pnpm install`

## Usage

- Run the development server: `npm run dev`
- Build the project for production: `npm run build`

## Configuration

The webpack configuration file can be found at `webpack.config.js`. It includes settings for entry points, output paths, loaders, and plugins. Feel free to modify it according to your project's needs.

## License

This project is licensed under the [GPL-3](LICENSE).

## DC UPDATE
Modified the index.js with additional code to display bar chart and line chart. 
Removed the 'rerun' data, it was too confusing. 
Fixed the 'leg length' of each of the data coming from Strava to be consistent with the legnth of the leg requirement. 