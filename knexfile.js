const { DB_URL } = process.env;
const ENV = process.env.NODE_ENV || 'development';

const baseConfig = {
  client: 'pg',
  migrations: {
    directory: './db/migrations',
  },
  seeds: {
    directory: './db/seeds',
  },
};

const customConfig = {
  production: {
    connection: {
      connectionString:
        'postgres://mwfukvhuhdvvtt:ca502e23db8583a792427f0e87d3b0cd5473f9273f2a32560c2ce9142c3aa470@ec2-52-72-221-20.compute-1.amazonaws.com:5432/d3g8j5hhhoh71v',
      ssl: {
        rejectUnauthorized: false,
      },
    },
  },
  development: {
    connection: {
      database: 'nc_news',
    },
  },
  test: {
    connection: {
      database: 'nc_news_test',
    },
  },
};

module.exports = { ...customConfig[ENV], ...baseConfig };
