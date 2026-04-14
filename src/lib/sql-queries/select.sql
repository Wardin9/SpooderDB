-- @name: selectAllFrom
SELECT * FROM $1:identifier LIMIT $2 OFFSET $3;

-- @name: selectTableData
SELECT * FROM $1:identifier;
