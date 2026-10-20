const express = require('express');
const pool = require('../db');

const router = express.Router();


const FILTERS = {
  city: 'L_City = ?',
  zipcode: 'L_Zip = ?',
  minPrice: 'L_SystemPrice >= ?',
  maxPrice: 'L_SystemPrice <= ?',
  beds: 'L_Keyword2 >= ?',
  baths: 'LM_Dec_3 >= ?',
};
const ALLOWED_PARAMS = ['limit', 'offset', ...Object.keys(FILTERS)];
const MAX_LIMIT = 100;

const INTEGER = /^\d+$/;
const NUMBER = /^\d+(\.\d+)?$/;
const ZIPCODE = /^\d{5}$/;

const COLUMNS = `
  id,
  L_ListingID   AS listingId,
  L_Address     AS address,
  L_City        AS city,
  L_State       AS state,
  L_Zip         AS zipcode,
  L_SystemPrice AS price,
  L_Keyword2    AS beds,
  CAST(LM_Dec_3 AS DOUBLE) AS baths,
  LM_Int2_3     AS sqft,
  L_Type_       AS propertyType,
  YearBuilt     AS yearBuilt`;


function validate(query) {
  for (const [key, value] of Object.entries(query)) {
    if (!ALLOWED_PARAMS.includes(key)) return `Unknown parameter "${key}". Allowed: ${ALLOWED_PARAMS.join(', ')}`;
    if (typeof value !== 'string') return `${key} must be a single value`;
  }

  const { limit, offset, city, zipcode, minPrice, maxPrice, beds, baths } = query;

  if (limit !== undefined && (!INTEGER.test(limit) || Number(limit) < 1 || Number(limit) > MAX_LIMIT)) {
    return `limit must be an integer between 1 and ${MAX_LIMIT}`;
  }
  if (offset !== undefined && !INTEGER.test(offset)) return 'offset must be a non-negative integer';

  if (city !== undefined && (city.trim() === '' || city.length > 100)) return 'city must be a non-empty string';
  if (zipcode !== undefined && !ZIPCODE.test(zipcode.trim())) return 'zipcode must be a 5-digit ZIP code';

  if (minPrice !== undefined && !NUMBER.test(minPrice)) return 'minPrice must be a non-negative number';
  if (maxPrice !== undefined && !NUMBER.test(maxPrice)) return 'maxPrice must be a non-negative number';
  if (minPrice !== undefined && maxPrice !== undefined && Number(minPrice) > Number(maxPrice)) {
    return 'minPrice cannot be greater than maxPrice';
  }

  if (beds !== undefined && !INTEGER.test(beds)) return 'beds must be a non-negative integer';
  if (baths !== undefined && !NUMBER.test(baths)) return 'baths must be a non-negative number';

  return null;
}


router.get('/', async (req, res) => {
  const error = validate(req.query);
  if (error) return res.status(400).json({ error });

  const conditions = [];
  const params = [];
  for (const [name, condition] of Object.entries(FILTERS)) {
    const value = req.query[name];
    if (value === undefined) continue;
    conditions.push(condition);
    params.push(name === 'city' || name === 'zipcode' ? value.trim() : Number(value));
  }
  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const limit = Number(req.query.limit ?? 20);
  const offset = Number(req.query.offset ?? 0);

  try {
    const [rows] = await pool.query(
      `SELECT ${COLUMNS} FROM rets_property ${where} ORDER BY id LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );
    const [[{ total }]] = await pool.query(`SELECT COUNT(*) AS total FROM rets_property ${where}`, params);

    res.json({ total, limit, offset, results: rows });
  } catch (err) {
    console.error('GET /api/properties failed:', err.message);
    res.status(500).json({ error: 'Failed to fetch properties' });
  }
});

module.exports = router;
