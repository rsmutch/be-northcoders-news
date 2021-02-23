# BE Northcoders News

Back end API project for a news aggregator website with an array of endpoints and custom error handling.

This project was created to mimic the back end of a news aggregator website similar to Reddit. The RESTful API features multiple CRUD endpoints allowing interaction with a database of users, topics, articles and comments. The intention of creating this was to later marry the API up with a [front-end project](https://github.com/rsmutch/fe-nc-news), which was completed a couple of weeks afterwards.

## Tech Used

- Database is built with PSQL
- Knex SQL query builder
- Server framework is Express
- Utility functions created to format data correctly
- Tested with Jest & Supertest

## Usage

### <ins>API URL</ins>

```
https://rsm-nc-news.herokuapp.com/

```

<br>

### <ins>Available Endpoints</ins>

<br>

#### TOPICS

GET all topics
POST new topic

```
/api/topics
```

<br>

#### USERS

GET all users - functionality to accept sort by criteria and/or order ascending/descending
POST new user

```

/api/users
/api/users/?sort_by=[CRITERIA]&order=[asc/desc]

```

GET specific user information

```
/api/users/:username
```

<br>

#### ARTICLES

GET all articles - functionality to accept sort by criteria and/or order ascending/descending

```
/api/articles/
/api/articles/?sort_by=[CRITERIA]&order=[asc/desc]
```

GET, PATCH or DELETE specific article

```
/api/articles/:article_id
```

<br>

#### COMMENTS

GET all comments for a specific article - functionality to accept sort by criteria and/or order ascending/descending
POST new comment

```
/api/articles/:article_id/comments
/api/articles/:article_id/comments?sort_by=[CRITERIA]&order=[asc/desc]
```

<br>

PATCH or DELETE specific comment
```
/api/comments/:comment_id
```
