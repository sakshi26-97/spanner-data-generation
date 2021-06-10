SELECT 
	Sku.sku_id,
    Sku.title as sku,
    Retailer.title as retailer,
    Store.title as store,
    SkusStore.quantity,
    Sku.tags
FROM 
	skus as Sku
LEFT JOIN 
	retailers as Retailer ON 
    	Sku.retailer_id = Retailer.retailer_id
RIGHT JOIN 
	skus_stores as SkusStore ON 
    	Sku.sku_id = SkusStore.sku_id
RIGHT JOIN 
	stores as Store ON
    	SkusStore.store_id = Store.store_id
RIGHT JOIN (
	SELECT 
        sku_id, LOWER(tag_item) as tag
    FROM 
        skus, skus.tags as tag_item
    ORDER BY sku_id, tag
) as Tag ON Tag.sku_id = Sku.sku_id
WHERE Tag.tag IN ('books', 'sleek')
LIMIT 1000;

-----------------------------------------------------
SELECT sku_id, STRING_AGG(tag) as tags
FROM(
  SELECT 
      sku_id, LOWER(tag_item) as tag
  FROM 
      skus, skus.tags as tag_item
  ORDER BY sku_id, tag
)
GROUP BY sku_id
HAVING tags LIKE '%haptic,sdd%';