import oracledb, { Connection, Pool, PoolAttributes } from 'oracledb';

export class DatabaseConnection {
  private static instance: DatabaseConnection;
  private pool: Pool | null = null;

  private constructor() {
    // Configure oracledb
    oracledb.fetchAsString = [oracledb.CLOB];
    oracledb.autoCommit = false;
  }

  static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  async initialize(config: PoolAttributes): Promise<void> {
    if (this.pool) {
      console.log('Database pool already initialized');
      return;
    }

    try {
      this.pool = await oracledb.createPool({
        user: config.user,
        password: config.password,
        connectString: config.connectString,
        poolMin: config.poolMin || 2,
        poolMax: config.poolMax || 10,
        poolIncrement: config.poolIncrement || 1,
        poolTimeout: config.poolTimeout || 60,
        queueTimeout: config.queueTimeout || 60000
      });
      console.log('✅ Database pool initialized successfully');
    } catch (err) {
      console.error('❌ Failed to initialize database pool:', err);
      throw err;
    }
  }

  async getConnection(): Promise<Connection> {
    if (!this.pool) {
      throw new Error('Database pool not initialized. Call initialize() first.');
    }
    return this.pool.getConnection();
  }

  async close(): Promise<void> {
    if (this.pool) {
      await this.pool.close(10);
      this.pool = null;
      console.log('Database pool closed');
    }
  }

  getPool(): Pool | null {
    return this.pool;
  }
}
