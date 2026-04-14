-- @name: getTables
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- @name: getTableSchema
SELECT
  column_name,
  data_type,
  is_nullable,
  column_default,
  character_maximum_length,
  numeric_precision,
  numeric_scale
FROM information_schema.columns
WHERE table_name = $1 AND table_schema = 'public'
ORDER BY ordinal_position;

-- @name: getTableRowCount
SELECT COUNT(*) as count FROM $1:identifier;
