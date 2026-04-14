-- @name: createTable
CREATE TABLE $1:identifier ($2:raw);

-- @name: dropTable
DROP TABLE IF EXISTS $1:identifier;

-- @name: insertData
INSERT INTO $1:identifier ($2:raw) VALUES $3:raw;
