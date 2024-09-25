import { SelectQueryBuilder } from 'typeorm';

interface RequestParams {
  order?: string;
  size?: string;
  page?: string;
  [key: string]: any;
}

export function requestParamsToQueryBuilder<Entity>(
  params: RequestParams,
  queryBuilder: SelectQueryBuilder<Entity>,
  authorizedKeys: string[] = [],
  aliasMap: Record<string, string> = {},
  customMethod: Record<string, string> = {}
) {
  const _params = { ...params };
  const order = _params.order;
  const size = parseInt(_params.size, 10) || -1;
  const page = Math.abs(parseInt(_params.page, 10)) || 0;

  delete _params.order;
  delete _params.size;
  delete _params.page;

  const _defaultMethod = 'like';

  Object.keys(_params).forEach((key) => {
    const value = _params[key];
    if (authorizedKeys.length && !authorizedKeys.includes(key)) {
      return;
    }

    if (value === '' || value === undefined || value === null) {
      return;
    }

    let method = _defaultMethod;
    let actualValue = value;

    if (value[0] === '^') {
      method = 'like';
      actualValue = `${value.slice(1)}%`;
    } else if (value[0] === '=') {
      method = 'equal';
      actualValue = value.slice(1);
    } else if (value[0] === '$') {
      method = 'regexp';
      actualValue = value.slice(1);
    } else if (value.toLowerCase() === 'null') {
      method = 'isNull';
    } else if (value.toLowerCase() === '~null') {
      method = 'isNotNull';
    } else {
      actualValue = `%${value}%`;
    }

    const keyword = aliasMap[key] || key;
    const queryMethod = customMethod[key] || method;

    if (queryMethod === 'isNull' || queryMethod === 'isNotNull') {
      queryBuilder.andWhere(`${keyword} IS ${queryMethod === 'isNull' ? 'NULL' : 'NOT NULL'}`);
    } else if (queryMethod === 'like') {
      queryBuilder.andWhere(`${keyword} LIKE :${key}`, { [key]: actualValue });
    } else if (queryMethod === 'equal') {
      queryBuilder.andWhere(`${keyword} = :${key}`, { [key]: actualValue });
    } else if (queryMethod === 'regexp') {
      queryBuilder.andWhere(`${keyword} REGEXP :${key}`, { [key]: actualValue });
    }
  });

  if (order) {
    const orderByFields = order.split(',').map((field) => {
      let direction: 'ASC' | 'DESC' = 'ASC';
      let column = field.trim();

      if (column.startsWith('-')) {
        direction = 'DESC';
        column = column.substring(1);
      }

      const fullColumn = aliasMap[column] || column;
      return { column: fullColumn, direction };
    });

    orderByFields.forEach(({ column, direction }) => {
      queryBuilder.addOrderBy(column, direction);
    });
  }

  if (size > 0) {
    queryBuilder.skip(page * size).take(size);
  }

  return queryBuilder;
}
