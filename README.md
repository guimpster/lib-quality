## LibQuality

LibQuality is a platform that collects GitHub issues, parses it, and then saves it into a elasticsearch database for a consolidated analytics. It also includes a frontend that reads that database.

##### Architecture

![LibQuality](.\LibQuality.png)

Basically, we can divide the system into 4 parts:

1. A collector Job which runs from time to time collecting issues by repository(like react, or vue, or angularjs) from GitHub and saving into an index called github-issues in Elasticsearch.
2. A consolidator job grouping those issues into sum issues, average days and standard deviation of those days. 
3. API Controller that allows front end users to see consolidated issues by repository name.
4. A frontend written in ReactJS with a simple dashboard for reading controllers' issue data.

##### Elasticsearch

Elasticsearch has been chosen by its flexibility, speed and maintenance on search. It scales very well by clustering data into shards, and it is also possible to plug Kibana, an awesome dashboard data viewer. There is no need to use some complicated ORM because Elasticsearch already uses JSON as its default serialization method.

Two index mappings were created in order to represent git hub data: `github-issue`, `github-consolidated`. The first contains raw github data. And the second one, contains data consolidated with quantity of issues, average issues days, and standard deviation days. This last index also uses it's id the tuple `org/repo` in order to always update these data when the consolidated job runs. 

##### Running in Development

Follow these steps in order to get the system up in development. But ensure first that you have `node`, `npm`, `docker-compose`, `docker` installed in your machine. `Postman` would be nice to have, but it is not required. All this installation was tested on an `Ubuntu 18.04` machine.

1. Clone this repository into your machine
2. Inside main directory `./`, start the elasticsearch cluster by running `docker-compose up`
   1. It may take a few minutes for the cluster to start, so be patient
   2. Please ensure that you have `max_map_count` increased in your system. For more information, read Sources section of this document.
3. Enter in `backend` folder and run `npm install` and when it ends, run `npm run start:dev`
   1. It would be nice to change all jobs timing interval for a small period. They encounter themselves in `./backend/src/jobs`. 
   2. For small tests, use 10\*1000 (10 secs) for `collector.job.ts` and 40\*1000(40 secs) for `consolidator.job.ts`. But remembers, github allows fetching their API for only 5000/hour.
   3. You may want to generate a GitHub token (GitHub => Click on your Photo => Settings => Developer Settings => Personal Access Token) and places it into `./backend/.env` on `GIT_HUB_TOKEN` variable.
4. Inside `frontend` folder, run `npm install` and `npm run start` to start the frontend. The main dashboard will open automatically in your default browser by react.

Is is possible to test the backend using `postman` collection and environment variables. It is inside `./postman` folder. Just import it into the application and set the environment `LIB QUALITY - LOCAL` to test if Elasticsearch and all indices creation are ok.

##### Sources

The following links were used to construct this system:

- GitHub rate limiting:
  - https://developer.github.com/v3/#rate-limiting
- List of GitHub apis:
  - https://docs.github.com/en/free-pro-team@latest/rest/overview/endpoints-available-for-github-apps
- How to renew GitHub token:
  - https://github.com/settings/tokens/new
- Transversing GitHub api pagination:
  - https://developer.github.com/v3/guides/traversing-with-pagination/
- before starting docker-compose, it is necessary to increase max_map_count
  - https://www.elastic.co/guide/en/elastic-stack-get-started/current/get-started-docker.html
- nestjs + elasticsearch:
  - https://dev.to/kop7/how-to-build-autocomplete-search-with-nestjs-elasticsearch-and-vue-12h8
- Elasticsearch Bulk Example:
  - https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/7.x/bulk_examples.html
- Elasticsearch Sql functions:
  - https://www.elastic.co/guide/en/elasticsearch/reference/current/sql-functions-grouping.html