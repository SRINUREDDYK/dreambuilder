import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

global.dbFallback = false;

const DATA_DIR = path.resolve('data');

// Setup local folder for fallback storage
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/dreambuilder';
  try {
    // Set low timeout so we don't hang if Mongo isn't running
    mongoose.set('strictQuery', false);
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000
    });
    console.log('🔮 Connected to MongoDB successfully.');
  } catch (error) {
    console.warn('⚠️ MongoDB connection failed. Falling back to local JSON database storage.');
    global.dbFallback = true;
  }
};

// Generic Mock Query Chain helper to support then/catch and chainable Mongoose methods
class MockQueryChain {
  constructor(dataPromise, data) {
    this.dataPromise = dataPromise;
    this.data = data;
  }

  then(onFulfilled, onRejected) {
    return this.dataPromise.then(onFulfilled, onRejected);
  }

  catch(onRejected) {
    return this.dataPromise.catch(onRejected);
  }

  sort(sortObj) {
    // Helper to sort array by fields
    const sortedPromise = this.dataPromise.then(items => {
      if (!Array.isArray(items)) return items;
      const keys = Object.keys(sortObj);
      if (keys.length === 0) return items;

      return [...items].sort((a, b) => {
        for (let key of keys) {
          const dir = sortObj[key]; // 1 or -1
          const valA = a[key];
          const valB = b[key];
          if (valA < valB) return -1 * dir;
          if (valA > valB) return 1 * dir;
        }
        return 0;
      });
    });
    return new MockQueryChain(sortedPromise, this.data);
  }

  select() {
    return this;
  }

  populate() {
    return this;
  }
}

// JSON file-based database controller
class JSONDatabase {
  constructor(collectionName) {
    this.collectionName = collectionName;
    this.filePath = path.join(DATA_DIR, `${collectionName}.json`);
    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, JSON.stringify([], null, 2));
    }
  }

  _read() {
    try {
      if (!fs.existsSync(this.filePath)) {
        return [];
      }
      const data = fs.readFileSync(this.filePath, 'utf8');
      return JSON.parse(data);
    } catch (e) {
      return [];
    }
  }

  _write(data) {
    fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2));
  }

  async find(query = {}) {
    const items = this._read();
    const filtered = items.filter(item => {
      for (let key in query) {
        if (query[key] !== undefined && item[key] !== query[key]) {
          return false;
        }
      }
      return true;
    });
    return filtered;
  }

  async findOne(query = {}) {
    const items = this._read();
    const found = items.find(item => {
      for (let key in query) {
        if (query[key] !== undefined && item[key] !== query[key]) {
          return false;
        }
      }
      return true;
    });
    return found || null;
  }

  async findById(id) {
    const items = this._read();
    return items.find(item => item._id === id) || null;
  }

  async create(data) {
    const items = this._read();
    const newItem = {
      _id: uuidv4(),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    items.push(newItem);
    this._write(items);
    return newItem;
  }

  async findByIdAndUpdate(id, update, options = {}) {
    const items = this._read();
    const index = items.findIndex(item => item._id === id);
    if (index === -1) return null;

    let updatedItem = { ...items[index] };
    const fields = update.$set || update;
    for (let key in fields) {
      updatedItem[key] = fields[key];
    }
    updatedItem.updatedAt = new Date().toISOString();
    items[index] = updatedItem;
    this._write(items);
    return updatedItem;
  }

  async deleteOne(query = {}) {
    const items = this._read();
    const index = items.findIndex(item => {
      for (let key in query) {
        if (item[key] !== query[key]) return false;
      }
      return true;
    });
    if (index === -1) return { deletedCount: 0 };
    items.splice(index, 1);
    this._write(items);
    return { deletedCount: 1 };
  }

  async deleteMany(query = {}) {
    const items = this._read();
    const initialCount = items.length;
    const filtered = items.filter(item => {
      for (let key in query) {
        if (item[key] === query[key]) return false;
      }
      return true;
    });
    this._write(filtered);
    return { deletedCount: initialCount - filtered.length };
  }
}

// Wrapper function to compile a schema/model that supports both Mongoose and local JSON files
export const createModel = (collectionName, mongooseModel) => {
  const jsonDb = new JSONDatabase(collectionName);

  function ModelInstance(data = {}) {
    Object.assign(this, data);
  }

  ModelInstance.prototype.save = async function () {
    if (global.dbFallback) {
      if (this._id) {
        const updated = await jsonDb.findByIdAndUpdate(this._id, this);
        Object.assign(this, updated);
        return this;
      } else {
        const created = await jsonDb.create(this);
        Object.assign(this, created);
        return this;
      }
    } else {
      // Mongoose save
      const doc = new mongooseModel(this);
      const savedDoc = await doc.save();
      Object.assign(this, savedDoc.toObject());
      return this;
    }
  };

  ModelInstance.find = function (query) {
    if (global.dbFallback) {
      const p = jsonDb.find(query);
      return new MockQueryChain(p, null);
    } else {
      return mongooseModel.find(query);
    }
  };

  ModelInstance.findOne = function (query) {
    if (global.dbFallback) {
      const p = jsonDb.findOne(query);
      return new MockQueryChain(p, null);
    } else {
      return mongooseModel.findOne(query);
    }
  };

  ModelInstance.findById = function (id) {
    if (global.dbFallback) {
      const p = jsonDb.findById(id);
      return new MockQueryChain(p, null);
    } else {
      return mongooseModel.findById(id);
    }
  };

  ModelInstance.create = function (data) {
    if (global.dbFallback) {
      return jsonDb.create(data);
    } else {
      return mongooseModel.create(data);
    }
  };

  ModelInstance.findByIdAndUpdate = function (id, update, options) {
    if (global.dbFallback) {
      const p = jsonDb.findByIdAndUpdate(id, update, options);
      return new MockQueryChain(p, null);
    } else {
      return mongooseModel.findByIdAndUpdate(id, update, options);
    }
  };

  ModelInstance.deleteOne = function (query) {
    if (global.dbFallback) {
      return jsonDb.deleteOne(query);
    } else {
      return mongooseModel.deleteOne(query);
    }
  };

  ModelInstance.deleteMany = function (query) {
    if (global.dbFallback) {
      return jsonDb.deleteMany(query);
    } else {
      return mongooseModel.deleteMany(query);
    }
  };

  return ModelInstance;
};
